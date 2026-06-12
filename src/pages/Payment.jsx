import Func from "../components/Func.jsx";
import PaymentScreen from "../components/screens/PaymentScreen.jsx";

// ── 백엔드 원본 코드 (PayService.java) — 있는 그대로 ──
const CODE_BUILD_READY = `
// 카카오·토스 공통 : API 호출 전 검증 및 최종 금액 계산
private PayEntity buildReadyPay(PayCreateReqDto payCreateReqDto, Long loginMemberNo){
    validAmt(payCreateReqDto);
    RsvnEntity rsvn = validRsvn(payCreateReqDto);
    // 본인 예약만 결제
    validRsvnOwner(rsvn, loginMemberNo);
    // 금액 위변조 방어
    validAmtMatchesRsvn(payCreateReqDto, rsvn);
    // 결제 완료 예약 재결제 차단
    validDuplicate(rsvn.getNo());
    CouponEntity coupon = null;
    if (payCreateReqDto.getUcNo() != null) {
        coupon = couponRepository.findById(payCreateReqDto.getUcNo())
                .orElseThrow(() -> new CustomException(CouponErrorCode.COUPON_NOT_FOUND));
        // 본인 쿠폰만 사용
        validCoupon(coupon, loginMemberNo);
    }
    int dcAmt = calculateDcAmt(coupon, payCreateReqDto.getBaseAmt());
    int usedPoint = payCreateReqDto.getUsedPoint() == null
            ? 0 : payCreateReqDto.getUsedPoint();
    // 포인트 음수 방어
    validUsedPoint(usedPoint);
    // 쿠폰·포인트 차감 후 최종 결제 금액
    int finalAmt = payCreateReqDto.getBaseAmt() + payCreateReqDto.getAddAmt()
            - dcAmt - usedPoint;
    validFinalAmt(payCreateReqDto, finalAmt, dcAmt, usedPoint);
    PayEntity payEntity = payCreateReqDto.toEntity(rsvn, coupon, dcAmt, finalAmt);
    // PG 미호출 : READY 상태로 선저장
    return payRepository.save(payEntity);
}
        `;

const CODE_APPROVE = `
// 결제 요청 이후 최종 승인
@Transactional
public PayEntity approvePay(Long payNo, String pgToken) {
    PayEntity payEntity = payRepository.findById(payNo)
            .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
    // 멱등 처리 : 이미 완료된 결제면 재처리 없이 반환
    if (payEntity.getStatus() == PayStatus.COMPLETED) {
        return payEntity;
    }
    Long memberNo = payEntity.getRsvnNo().getMemberNo().getNo();
    KakaoApproveReqDto kakaoApproveReqDto = KakaoApproveReqDto.builder()
            .tid(payEntity.getTid())
            .partnerOrderId(payNo.toString())
            .partnerUserId(memberNo.toString())
            .pgToken(pgToken)
            .build();
    // 승인 성공 후에만 예약 확정·쿠폰·포인트 처리
    kakaoPayClient.approve(kakaoApproveReqDto);
    completePayAfterApprove(payEntity, memberNo);
    return payEntity;
}
    `;

const CODE_COMPLETE = `
// 카카오·토스 공통 처리
private void completePayAfterApprove(PayEntity payEntity, Long memberNo) {
    // 결제 승인 확인 후 예약 상태 확정으로 변경
    payEntity.getRsvnNo().confirm();
    payEntity.approvePay();
    // 쿠폰을 쓴 결제만 사용 처리
    if (payEntity.getUcNo() != null) {
        payEntity.getUcNo().useCoupon(payEntity);
    }
    // 포인트를 쓴 결제만 사용 차감
    Integer usedPoint = payEntity.getUsedPoint();
    if (usedPoint != null && usedPoint > 0) {
        pointService.usePointInternal(memberNo, payEntity.getUsedPoint(), payEntity);
    }
    // 결제액 기준 포인트 적립
    pointService.earnPointInternal(memberNo, payEntity);
}
`;

export default function Payment({ active }) {
	return (
		<section className="page" id="payment" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">결제</h1>
				<p className="page__desc">
					카카오페이 / 토스페이 외부 PG 연동 + 쿠폰·포인트 통합 결제.
				</p>
			</header>

			<div className="pay2">
				{/* ===== 왼쪽: 결제 완료 화면 (PaymentComplete 재현) ===== */}
				<PaymentScreen />

				{/* ===== 오른쪽: 기능 목록 (아코디언) ===== */}
				<div className="pay2__right">
					<Func
						rich
						defaultOpen
						name="결제 준비 · 검증"
						desc="PG 호출 전 단계에서 금액·중복 결제·쿠폰 유효성을 모두 검증해, 외부 결제와 DB 상태가 어긋나는 것을 방지합니다."
						file="PayService.java"
						code={CODE_BUILD_READY}
					/>
					<Func
						rich
						name="결제 승인 (카카오페이)"
						desc="카카오페이 최종 승인을 멱등 처리해, 콜백이 중복 호출돼도 결제가 한 번만 반영되게 합니다."
						file="PayService.java"
						code={CODE_APPROVE}
					/>
					<Func
						rich
						name="결제 완료 후처리"
						desc="승인이 끝나면 예약 확정·쿠폰 사용·포인트 차감/적립을 하나의 흐름으로 묶어 처리하며, 카카오·토스가 공통으로 사용합니다."
						file="PayService.java"
						code={CODE_COMPLETE}
					/>
				</div>
			</div>
		</section>
	);
}
