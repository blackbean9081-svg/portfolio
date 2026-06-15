import Func from "../components/Func.jsx";
import PaneHead from "../components/PaneHead.jsx";
import RefundScreen from "../components/screens/RefundScreen.jsx";

const CODE_CREATE = `
// 환불 생성
@Transactional
public RefundResDto createRefund(RefundCreateReqDto refundCreateReqDto, Long loginMemberNo) {
    // 환불 가능 여부 검증 : 상태, 금액
    PayEntity payEntity = validRefundablePay(refundCreateReqDto.getPayNo());
    // 본인 확인
    validRefundOwner(payEntity, loginMemberNo);
    RsvnEntity rsvn = rsvnRepository.findById(refundCreateReqDto.getRsvnNo())
            .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
    RefundEntity refundEntity = refundCreateReqDto.toEntity(payEntity, rsvn);
    RefundRate rate = refundRate(refundEntity);
    // 중복 환불 차단
    validDuplicate(payEntity);
    if (RefundRate.DDAY == rate) {
        log.warn("환불 기간 만료 : payNo:{},rsvnNo:{}", refundCreateReqDto.getPayNo(), refundCreateReqDto.getRsvnNo());
        throw new CustomException(RefundErrorCode.REFUND_PERIOD_EXPIRED);
    }
    // 남은 기간 기준 환불 정책에 따라 환불액 결정
    BigDecimal finalAmt = BigDecimal.valueOf(payEntity.getFinalAmt());
    BigDecimal rateBd = BigDecimal.valueOf(rate.getRate());
    BigDecimal divisor = BigDecimal.valueOf(100);
    BigDecimal refundAmt = finalAmt.multiply(rateBd).divide(divisor, 0, RoundingMode.DOWN);
    refundEntity.applyRefund(rate, refundAmt);
    RefundEntity entity = refundRepository.save(refundEntity);
    doRefundProcess(entity);
    return RefundResDto.from(entity);
}
`;

const CODE_PROCESS = `
// 환불 실제 처리
private void doRefundProcess(RefundEntity refundEntity) {
    refundEntity.approveRefund();
    PayEntity payEntity = refundEntity.getPayNo();
    // 사용한 쿠폰 회수
    if (payEntity.getUcNo() != null) {
        payEntity.getUcNo().returnCoupon();
    }
    // 적립 취소 → 사용 복원 순서
    pointService.cancelEarnedPoint(payEntity);
    pointService.refundUsedPoint(payEntity);
    // 카카오/토스 결제 취소 호출
    PayMethod method = payEntity.getMethod();
    if (method == PayMethod.KAKAOPAY) {
        KakaoCancelReqDto cancelReqDto = KakaoCancelReqDto.builder()
                .tid(payEntity.getTid())
                .cancelAmount(payEntity.getFinalAmt())
                .cancelTaxFreeAmount(0)
                .build();
        kakaoPayClient.cancel(cancelReqDto);
    } else if (method == PayMethod.TOSSPAY) {
        tossPayClient.cancel(payEntity.getTid(), "고객 환불 요청");
    }
    payEntity.cancelPay();
    refundEntity.completeRefund();
    // 환불 완료 : 예약 취소 상태로 변경
    refundEntity.getRsvnNo().cancel();
}
`;

const CODE_RATE = ` 
   // 이용 예정일까지 남은 일수 확인 후 환불율을 차등 반환
    private RefundRate refundRate(RefundEntity entity) {
        LocalDateTime checkIn = entity.getRsvnNo().getCheckIn();
        LocalDateTime requestedAt = entity.getRequestedAt();
        long between = ChronoUnit.DAYS.between(requestedAt.toLocalDate(), checkIn.toLocalDate());
        if (between >= RefundRate.WEEK.getMinday()) {
            return RefundRate.WEEK;
        } else if (between >= RefundRate.FOURTOSIX.getMinday()) {
            return RefundRate.FOURTOSIX;
        } else if (between >= RefundRate.TWOTOTHREE.getMinday()) {
            return RefundRate.TWOTOTHREE;
        } else if (between >= RefundRate.ONEDAY.getMinday()) {
            return RefundRate.ONEDAY;
        } else {
            return RefundRate.DDAY;
        }
    }
`;

export default function Refund({ active }) {
	return (
		<section className="page" id="refund" hidden={!active}>
			<div className="pay2">
				{/* ===== 왼쪽: 실제 서비스 화면 (RefundComplete 재현) ===== */}
				<div className="pay2__left">
					<PaneHead
						title="환불 화면"
						sub="실제 서비스 화면 (페이지 컴포넌트 재현)"
					/>
					<RefundScreen />
				</div>

				{/* ===== 오른쪽: 구현 코드 (아코디언) ===== */}
				<div className="pay2__right">
					<PaneHead title="구현 코드" sub="기능별 백엔드 코드" />
					<Func
						rich
						name="환불 요청, 환불율 적용"
						desc={
							"환불 가능 여부와 본인 결제인지 검증한 뒤,\n이용 예정일까지 남은 기간을 기준으로 환불율을 적용해 환불액을 산정합니다."
						}
						file="RefundService.java"
						code={CODE_CREATE}
						retro={
							"이용일까지 남은 기간에 따라 환불율이 달라지기 때문에, 환불 시점을 기준으로 정책을 적용해 금액을 계산했습니다."
						}
					/>
					<Func
						rich
						name="환불 처리"
						desc={
							"적립 포인트를 먼저 취소하고 사용 포인트를 복원한 뒤,\n쿠폰 회수와 카카오, 토스 결제 취소까지 정해진 순서로 처리합니다."
						}
						file="RefundService.java"
						code={CODE_PROCESS}
						retro={
							"환불은 환불 승인, 쿠폰 회수, 포인트 복원, 적립 취소, PG 취소, 예약 취소까지 여러 단계를 거칩니다. 단계의 순서가 바뀌면 결과가 달라지기 때문에, 정해진 순서대로 처리되도록 구현했습니다."
						}
					/>
					<Func
						rich
						name="환불율 산정"
						desc={
							"이용 예정일까지 남은 일수를 구간별로 나눠 환불율을 차등 적용합니다.\n(7일 전 100% ~ 당일 0%)"
						}
						file="RefundService.java"
						code={CODE_RATE}
						retro={
							"환불율을 숫자로 직접 다루면 엉뚱한 값이 들어가도 걸러지지 않습니다. 환불율 구간을 enum으로 정의해, 정해진 값만 쓰이도록 하여 실수를 줄였습니다."
						}
					/>
				</div>
			</div>
		</section>
	);
}
