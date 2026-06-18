import Func from "../components/Func.jsx";
import PaneHead from "../components/PaneHead.jsx";
import SettlementScreen from "../components/screens/SettlementScreen.jsx";
const CODE_CREATE = `// 정산 생성
@Transactional
public SettleResDto createSettle(SettleCreateReqDto reqDto) {
    HostEntity host = hostRepository.findById(reqDto.getHostNo())
            .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
    // 멱등 처리
    if (settleRepository.existsByHostAndPeriod(host.getNo(), reqDto.getSettleStartDate(), reqDto.getSettleEndDate())) {
        log.info("이미 생성된 정산 — 스킵 hostNo={}, {}~{}",
                host.getNo(), reqDto.getSettleStartDate(), reqDto.getSettleEndDate());
        return null;
    }
    // 호스트의 승인된 공간 조회
    List<HostPlaceEntity> hostPlaces =
            hostPlaceRepository.findByHostEntityNoAndStatus(host.getNo(), ApprovalStatus.A);
    // 오피스
    List<Long> officeNos = hostPlaces.stream()
            .filter(hp -> hp.getOfficeEntity() != null)
            .map(hp -> hp.getOfficeEntity().getNo())
            .distinct()
            .toList();
    // 숙소
    List<Long> stationNos = hostPlaces.stream()
            .filter(hp -> hp.getStationEntity() != null)
            .map(hp -> hp.getStationEntity().getNo())
            .distinct()
            .toList();
    // 워크앤스테이
    List<Long> workStayNos = hostPlaces.stream()
            .filter(hp -> hp.getWorkStayEntity() != null)
            .map(hp -> hp.getWorkStayEntity().getNo())
            .distinct()
            .toList();
    LocalDateTime start = reqDto.getSettleStartDate().atStartOfDay();
    LocalDateTime end = reqDto.getSettleEndDate().atTime(LocalTime.MAX);
    // 이용 완료인 공간을 타입별로 계산
    int officeAmt = payRepository.sumByOfficeIn(officeNos, start, end).intValue();
    int stationAmt = payRepository.sumByStationIn(stationNos, start, end).intValue();
    int workStayAmt = payRepository.sumByWorkStayIn(workStayNos, start, end).intValue();
    int totalAmt = officeAmt + stationAmt + workStayAmt;
    // 공간 타입별 수수료 적용
    int feeAmt = calcFee(officeAmt, PlaceType.office,start)
            + calcFee(stationAmt, PlaceType.station,start)
            + calcFee(workStayAmt, PlaceType.workStay,start);
    // 해당 기간 환불액 합산
    int refundAmt = refundRepository.sumByOfficeIn(officeNos, start, end)
            .add(refundRepository.sumByStationIn(stationNos, start, end))
            .add(refundRepository.sumByWorkStayIn(workStayNos, start, end))
            .intValue();
    // 결제액 - (수수료·환불액) = 실지급액
    int payoutAmt = totalAmt - feeAmt - refundAmt;
    // 직전 회차 이월금 조회 (없으면 0)
    Integer prevCarryOver = settleRepository.findLatestByHostNo(host.getNo())
            .map(SettleEntity::getCarryOver).orElse(0);
    int effectiveAmt = payoutAmt + prevCarryOver;
    // 정산액·이월금 모두 없으면 정산 생략
    if (totalAmt == 0 && prevCarryOver == 0) {
        return null;
    }
    SettleEntity entity = reqDto.toEntity(host);
    entity.applyAmounts(totalAmt, feeAmt, refundAmt, payoutAmt);
    // 지급 기준 미달 시 다음 회차로 이월
    entity.settleWithCarry(effectiveAmt, MIN_PAYOUT);
    return SettleResDto.from(settleRepository.save(entity));
}`;

const CODE_FEE = `
    // 공간 타입별 수수료를 결제액에 적용
    private int calcFee(int amt, PlaceType placeType,LocalDateTime date) {
        if (amt == 0) return 0;
        int rate = feeRepository.findValidFee(placeType, date)
                .orElseThrow(() -> new CustomException(FeeErrorCode.FEE_NOT_FOUND))
                .getRate();
        return amt * rate / 100;
    }
`;

const CODE_BATCH = `
// 4일에 한 번씩 정산 시작
@Scheduled(cron = "0 0 0 */4 * *", zone = "Asia/Seoul")
public void settleBatch() {
    // 정산 대상 기간 : 어제까지 최근 4일
    LocalDate end = LocalDate.now().minusDays(1);
    LocalDate start = end.minusDays(3);
    // 호스트별로 개별 정산 (한 건 실패해도 나머지 진행)
    for (HostEntity host : hostRepository.findAll()) {
        try {
            SettleCreateReqDto reqDto = SettleCreateReqDto.builder()
                    .hostNo(host.getNo())
                    .settleStartDate(start)
                    .settleEndDate(end)
                    .build();
            SettleResDto result = settleService.createSettle(reqDto);
            // 지급 대상이면 정산 확정 + 세금계산서 발행
            if(result != null && result.getStatus() == SettleStatus.WAITING){
                settleService.completeSettle(result.getNo());
                settleService.issueTaxInvoice(result.getNo());
            }
        } catch (Exception e) {
            log.error("정산 배치 실패 hostNo={}", host.getNo(), e);
        }
    }
}
`;

export default function Settlement({ active }) {
	return (
		<section className="page" id="settlement" hidden={!active}>
			<div className="pay2">
				{/* ===== 왼쪽: 실제 서비스 화면 (SettlementDashboard 재현) ===== */}
				<div className="pay2__left">
					<PaneHead
						title="정산 화면"
						sub="실제 서비스 화면 (페이지 컴포넌트 재현)"
					/>
					<SettlementScreen />
				</div>

				{/* ===== 오른쪽: 구현 코드 (아코디언, 비-rich 헤더) ===== */}
				<div className="pay2__right">
					<PaneHead title="구현 코드" sub="기능별 백엔드 코드" />
					<Func
						rich
						name="정산 생성 (타입별 합산, 실지급액 산정)"
						barName="정산 생성"
						desc={
							"이용 완료된 결제를 공간 타입별로 합산해 호스트 정산액을 산정합니다.\n결제액에서 수수료와 환불액을 빼 실지급액을 계산하고, 지급 기준에 미달하면 다음 회차로 이월하며,\n 같은 호스트·기간 정산이 이미 있으면 재생성하지 않습니다."
						}
						file="SettleService.java"
						code={CODE_CREATE}
						retro={
							"공간 타입마다 수수료율이 다르고 환불 건도 반영해야 하기 때문에, \n 타입별로 매출을 합산한 뒤 수수료와 환불을 차감해 지급액을 계산했습니다. \n 배치가 다시 돌아도 같은 기간이 중복 정산되지 않도록 멱등 처리했습니다."
						}
					/>
					<Func
						rich
						name="자동 정산 배치 (4일 주기)"
						barName="자동 정산 배치"
						desc={
							"4일 주기로 이용 완료된 결제를 일괄 정산하고 세금계산서를 발행합니다.\n호스트별로 개별 처리해, 한 건이 실패해도 나머지 정산은 계속 진행됩니다."
						}
						file="SettleScheduler.java"
						code={CODE_BATCH}
						retro={
							"일정 주기로 모든 호스트의 정산을 자동으로 처리합니다.\n 호스트별로 나눠 처리해 한 건이 실패해도 나머지 정산은 멈추지 않도록 했고, \n 정산 생성에 멱등 가드가 있어 배치가 다시 실행돼도 중복 정산되지 않습니다."
						}
					/>
					<Func
						rich
						name="공간 타입별 수수료 계산"
						barName="수수료 계산"
						desc={
							"공간 타입별 수수료율을 정책 테이블에서 조회해 적용합니다.\n정책 테이블을 참조하므로, 수수료율이 바뀌어도 코드 수정 없이 대응할 수 있습니다."
						}
						file="SettleService.java"
						code={CODE_FEE}
					/>
				</div>
			</div>
		</section>
	);
}
