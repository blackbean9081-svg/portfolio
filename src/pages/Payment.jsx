import Func from "../components/Func.jsx";

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
				<div className="pc">
					{/* 성공 헤더 (ResultHeader variant="success") */}
					<div className="pc__head">
						<div className="pc__check">✓</div>
						<div className="pc__title">결제가 완료됐어요</div>
						<div className="pc__desc">
							결제와 동시에 예약이 자동으로 확정됐어요. 체크인 하루 전 리마인드
							알림을 보내드릴게요.
						</div>
					</div>

					{/* 예약·결제 정보 카드 (ReservationInfoCard) */}
					<div className="pc__card">
						<div className="pc__space">
							<span className="pc__emoji">🏠</span>
							<div className="pc__space-meta">
								<span className="pc__space-name">청평 숲속 파인뷰 스테이</span>
								<span className="pc__booking">SW-PAY-000001</span>
							</div>
						</div>
						<div className="pc__rows">
							<div className="pc__row">
								<span>이용 일정</span>
								<strong>2026.06.20 ~ 2026.06.22</strong>
							</div>
							<div className="pc__row">
								<span>결제 수단</span>
								<strong>
									<span className="pc__mchip">💛</span>카카오페이
								</strong>
							</div>
							<div className="pc__row">
								<span>승인 번호</span>
								<strong className="pc__mono">T1a2b3c4d5e6f7g8h9</strong>
							</div>
							<div className="pc__row">
								<span>결제 일시</span>
								<strong>2026.06.14 14:30</strong>
							</div>
							<div className="pc__total">
								<span className="pc__total-label">결제 금액</span>
								<span className="pc__total-num">
									245,000<span>원</span>
								</span>
							</div>
							<div className="pc__earn">
								<span>🌱</span>
								<span>
									이용 완료 후 <strong>2,450P</strong> 적립 예정
								</span>
							</div>
						</div>
					</div>

					{/* 다음 단계 안내 (NextStepsList) */}
					<div className="pc__steps">
						<div className="pc__steps-title">다음 단계</div>
						<ul className="pc__steplist">
							<li>
								<span className="pc__stepno">1</span>예약 목록에서 확정된 예약을
								확인할 수 있어요.
							</li>
							<li>
								<span className="pc__stepno">2</span>체크인 하루 전 리마인드
								알림을 보내드려요.
							</li>
							<li>
								<span className="pc__stepno">3</span>이용 완료 7일 뒤 2,450P가
								적립돼요.
							</li>
						</ul>
					</div>

					{/* 액션 버튼 (Actions) */}
					<div className="pc__actions">
						<button className="pc__btn-ghost">📧 영수증 보기</button>
						<button className="pc__btn-ghost">예약 상세 보기</button>
						<button className="pc__btn-primary">예약 목록으로</button>
					</div>
					<button className="pc__back">← 메인으로 돌아가기</button>
				</div>

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
