import Func from "../components/Func.jsx";
const CODE_CREATE = `// 정산 생성
@Transactional
public SettleResDto createSettle(SettleCreateReqDto reqDto) {
    HostEntity host = hostRepository.findById(reqDto.getHostNo())
            .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
    // 호스트의 승인된 공간 조회
    List<HostPlaceEntity> hostPlaces =
            hostPlaceRepository.findByHostEntityNoAndStatus(host.getNo(), ApprovalStatus.A);
    // 오피스
    List<Long> officeNos = hostPlaces.stream()
            .filter(hp -> hp.getOfficeEntity() != null)
            .map(hp -> hp.getOfficeEntity().getNo())
            .distinct()
            .toList();
    //숙소
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
    // 이용 완료인 공간을  타입별로 계산
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
@Scheduled(cron = "0 0 0 */4 * *")
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
			<header className="page__head">
				<h1 className="page__title">정산</h1>
				<p className="page__desc">
					4일 단위 자동 정산 + carry-over 이월 + 세금계산서 PDF 발행.
				</p>
			</header>

			<div className="pay2">
				{/* ===== 왼쪽: 호스트 정산 대시보드 (SettlementDashboard 재현) ===== */}
				<div className="sd-app">
					<div className="sd-head">
						<div className="sd-head__title">정산 대시보드</div>
						<div className="sd-head__desc">
							이번 회차 정산 현황과 이력을 확인합니다
						</div>
					</div>

					{/* KPI (StatCard 4개) */}
					<div className="sd-kpis">
						<div className="sd-stat">
							<div className="sd-stat__icon">💰</div>
							<div className="sd-stat__label">이번 회차 정산액</div>
							<div className="sd-stat__value">1,040,800원</div>
						</div>
						<div className="sd-stat">
							<div className="sd-stat__icon">📅</div>
							<div className="sd-stat__label">직전 회차</div>
							<div className="sd-stat__value">1,318,400원</div>
						</div>
						<div className="sd-stat">
							<div className="sd-stat__icon">↩️</div>
							<div className="sd-stat__label">환불 차감</div>
							<div className="sd-stat__value">100,000원</div>
						</div>
						<div className="sd-stat">
							<div className="sd-stat__icon">⏳</div>
							<div className="sd-stat__label">이월 대기액</div>
							<div className="sd-stat__value">0원</div>
						</div>
					</div>

					{/* 최근 회차 요약 (Section + SummaryCard) */}
					<div className="sd-section">
						<div className="sd-section__head">
							<span className="sd-section__title">최근 회차 요약</span>
							<span className="sd-section__link">정산 이력 보기 →</span>
						</div>
						<div className="sd-summary">
							<div className="sd-row">
								<span>회차 기간</span>
								<strong>2026.06.05 ~ 2026.06.08</strong>
							</div>
							<div className="sd-row">
								<span>총 매출</span>
								<strong>1,240,000원</strong>
							</div>
							<div className="sd-row">
								<span>수수료</span>
								<strong>- 99,200원</strong>
							</div>
							<div className="sd-row">
								<span>환불 차감</span>
								<strong>- 100,000원</strong>
							</div>
							<div className="sd-row sd-row--hl">
								<span>최종 정산액</span>
								<strong>1,040,800원</strong>
							</div>
							<div className="sd-row">
								<span>상태</span>
								<strong>
									<span className="sd-badge sd-badge--invoice">
										세금계산서 발행
									</span>
								</strong>
							</div>
						</div>
					</div>
				</div>

				{/* ===== 오른쪽: 기능 목록 (아코디언, 비-rich 헤더) ===== */}
				<div className="pay2__right">
					<Func
						rich
						name="정산 생성 (타입별 합산·실지급액 산정)"
						barName="정산 생성"
						desc="이용 완료된 결제를 공간 타입(숙소·워크앤스테이·코워킹오피스)별로 합산해 호스트 정산액을 산정합니다.
						결제액에서 수수료와 환불액을 빼 실지급액을 계산하고, 지급 기준에 미달하면 다음 회차로 이월합니다."
						file="SettleService.java"
						code={CODE_CREATE}
					/>
					<Func
						rich
						name="공간 타입별 수수료 계산"
						barName="수수료 계산"
						desc="공간 타입별 수수료율을 정책 테이블에서 조회해 적용합니다.
						정책 테이블을 참조하므로, 수수료율이 바뀌어도 코드 수정 없이 대응할 수 있습니다."
						file="SettleService.java"
						code={CODE_FEE}
					/>
					<Func
						rich
						name="자동 정산 배치 (4일 주기)"
						barName="자동 정산 배치"
						desc="4일 주기로 이용 완료된 결제를 일괄 정산하고 세금계산서를 발행합니다.
						호스트별로 개별 처리해, 한 건이 실패해도 나머지 정산은 계속 진행됩니다."
						file="SettleScheduler.java"
						code={CODE_BATCH}
					/>
				</div>
			</div>
		</section>
	);
}
