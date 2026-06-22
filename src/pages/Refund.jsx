import Func from "../components/Func.jsx";
import PaneHead from "../components/PaneHead.jsx";
import RefundScreen from "../components/screens/RefundScreen.jsx";

const CODE_CREATE = `
    // 환불 생성 진입점 — 환불 가능 여부를 검증한 뒤, 이용 예정일까지 남은 기간 기준으로 환불액 산정
    @Transactional
    public RefundResDto createRefund(RefundCreateReqDto refundCreateReqDto, Long loginMemberNo) {
        PayEntity payEntity = validRefundablePay(refundCreateReqDto.getPayNo());   // 환불 가능한 결제인지 검증(완료 상태·금액)
        validRefundOwner(payEntity, loginMemberNo);   // 본인 결제만 환불
        RsvnEntity rsvn = rsvnRepository.findById(refundCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
        RefundEntity refundEntity = refundCreateReqDto.toEntity(payEntity, rsvn);
        RefundRate rate = refundRate(refundEntity);
        validDuplicate(payEntity);   // 이미 환불된 건은 중복 환불 차단
        // 당일(DDAY)은 취소·환불 불가 — 0원 환불 처리하지 않고 거부 (정책 변경: 당일 취소 차단)
        // ※ 호스트 거절(createRefundByHost)은 RefundRate.FULL 이라 이 가드에 안 걸림
        if (rate == RefundRate.DDAY) {
            throw new CustomException(RefundErrorCode.REFUND_DDAY_NOT_ALLOWED);
        }
        // 남은 기간별 환불율(rate)을 결제액(finalAmt)에 적용해 환불액 산정
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
        // 사용한 쿠폰 회수 처리
        if (payEntity.getUcNo() != null) {
            payEntity.getUcNo().returnCoupon();
        }
        // 적립 포인트 선 취소 후 복원
        pointService.cancelEarnedPoint(payEntity);
        pointService.refundUsedPoint(payEntity);
        // 카카오/토스 결제 취소 호출 — 환불율 적용된 실제 환불액으로 부분취소(전액 아님)
        // 당일 환불(0원)은 PG 취소 스킵 — 카카오/토스는 0원 취소 요청 시 에러를 반환함
        int cancelAmount = refundEntity.getRefundAmt().intValue();
        if (cancelAmount > 0) {
            PayMethod method = payEntity.getMethod();
            if (method == PayMethod.KAKAOPAY) {
                KakaoCancelReqDto cancelReqDto = KakaoCancelReqDto.builder()
                        .tid(payEntity.getTid())
                        .cancelAmount(cancelAmount)
                        .cancelTaxFreeAmount(0)
                        .build();
                kakaoPayClient.cancel(cancelReqDto);
            } else if (method == PayMethod.TOSSPAY) {
                tossPayClient.cancel(payEntity.getTid(), "고객 환불 요청", cancelAmount);
            }
        }
        payEntity.cancelPay();
        refundEntity.completeRefund();
        refundEntity.getRsvnNo().cancel();  // confirm()과 동일한 패턴 — 환불 완료 시 예약 상태 C로 전이
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
							"적립 포인트를 먼저 취소하고 사용 포인트를 복원한 뒤,\n쿠폰 회수와 외부 API 결제 취소까지 정해진 순서로 처리하며,\n결제 취소는 환불율을 적용한 실제 환불액으로 취소합니다."
						}
						file="RefundService.java"
						code={CODE_PROCESS}
						retro={
							"환불은 환불 승인, 쿠폰 회수, 포인트 복원, 적립 취소, 결제 취소, 예약 취소까지 여러 단계를 거칩니다.\n 단계의 순서가 바뀌면 결과가 달라지기 때문에 정해진 순서대로 처리했고, \n PG 취소도 전액이 아니라 환불율을 적용한 금액만 취소해 정책과 실제 환불 금액이 어긋나지 않게 했습니다."
						}
					/>
					<Func
						rich
						name="환불율 산정"
						desc={
							"이용 예정일까지 남은 일수를 구간별로 나눠 환불율을 차등 적용합니다."
						}
						file="RefundService.java"
						code={CODE_RATE}
						retro={
							"환불율을 숫자로 직접 다루면 잘못된 값이 들어가도 걸러지지 않습니다.\n 환불율 구간을 enum으로 정의해, 정해진 값만 쓰이도록 하여 실수를 줄였습니다."
						}
					/>
				</div>
			</div>
		</section>
	);
}
