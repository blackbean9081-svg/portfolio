import Func from "../components/Func.jsx";

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
        if (between >= 7) {
            return RefundRate.WEEK;
        } else if (between >= 4) {
            return RefundRate.FOURTOSIX;
        } else if (between >= 2) {
            return RefundRate.TWOTOTHREE;
        } else if (between >= 1) {
            return RefundRate.ONEDAY;
        } else {
            return RefundRate.DDAY;
        }
    }
`;

export default function Refund({ active }) {
	return (
		<section className="page" id="refund" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">환불</h1>
				<p className="page__desc">
					환불 정책표 기반 8단계 통합 처리 (쿠폰 복원 · 포인트 환원 · PG 취소).
				</p>
			</header>

			<div className="pay2">
				{/* ===== 왼쪽: 환불 완료 화면 (RefundComplete 재현) ===== */}
				<div className="rc-app">
					{/* 성공 헤더 (ResultHeader variant="success") */}
					<div className="rc-head">
						<div className="rc-check">✓</div>
						<div className="rc-title">환불 신청이 접수됐어요</div>
						<div className="rc-desc">
							영업일 3~7일 내 카카오페이로 입금됩니다. 입금 완료되면 알림으로
							안내드릴게요.
						</div>
					</div>

					{/* 예약·결제 카드 (SpaceCard) */}
					<div className="rc-space">
						<span className="rc-emoji">🏠</span>
						<div className="rc-space-meta">
							<span className="rc-space-name">예약 #2</span>
							<span className="rc-space-sub">결제번호: PAY-000001</span>
						</div>
					</div>

					{/* 환불 정보 카드 (RefundInfoCard) */}
					<div className="rc-card">
						<div className="rc-row">
							<span>환불 번호</span>
							<strong className="rc-mono">RFD-000001</strong>
						</div>
						<div className="rc-row">
							<span>예약 번호</span>
							<strong className="rc-mono">RSVN-000002</strong>
						</div>
						<div className="rc-row">
							<span>환불율</span>
							<strong>70%</strong>
						</div>
						<div className="rc-row">
							<span>환불 수단</span>
							<strong>
								<span className="rc-mchip">💬</span>카카오페이
							</strong>
						</div>
						<div className="rc-row">
							<span>신청 일시</span>
							<strong>2026.06.14 14:30</strong>
						</div>
						<div className="rc-row">
							<span>입금 예정일</span>
							<strong>6월 21일 (영업일 기준)</strong>
						</div>
						<div className="rc-total">
							<span className="rc-total-label">환불 금액</span>
							<span className="rc-total-num">
								171,500<span>원</span>
							</span>
						</div>
					</div>

					{/* 환불 사유 (Section + ReasonCard) */}
					<div className="rc-reason">
						<div className="rc-reason-label">고객님이 작성하신 사유</div>
						<div className="rc-reason-text">"개인 사정 / 긴급 상황"</div>
					</div>

					{/* 안내 (NoticeBox) */}
					<div className="rc-notice">
						<span className="rc-notice-icon">💡</span>
						<div className="rc-notice-body">
							<div className="rc-notice-title">환불 처리에 대해 알려드려요</div>
							<ul className="rc-notice-list">
								<li>
									카드사 정책에 따라 입금까지 영업일 기준 3~7일이 소요돼요
								</li>
								<li>주말·공휴일은 영업일에 포함되지 않아요</li>
								<li>관리자 승인 후 자동 처리됩니다</li>
								<li>긴급 문의는 고객센터로 연락해주세요</li>
							</ul>
						</div>
					</div>

					{/* 액션 (Actions) */}
					<div className="rc-actions">
						<button className="rc-btn-ghost">결제 내역으로</button>
						<button className="rc-btn-primary">💬 고객센터 문의</button>
					</div>
				</div>

				{/* ===== 오른쪽: 기능 목록 (아코디언) ===== */}
				<div className="pay2__right">
					<Func
						rich
						name="환불 요청 · 환불율 적용"
						desc="환불 가능 여부와 본인 결제인지 검증한 뒤, 이용 예정일까지 남은 기간을 기준으로 환불율을 적용해 환불액을 산정합니다."
						file="RefundService.java"
						code={CODE_CREATE}
					/>
					<Func
						rich
						name="환불 처리"
						desc="적립 포인트를 먼저 취소하고 사용 포인트를 복원한 뒤, 쿠폰 회수와 카카오·토스 결제 취소까지 정해진 순서로 처리합니다."
						file="RefundService.java"
						code={CODE_PROCESS}
					/>
					<Func
						rich
						name="환불율 산정"
						desc="이용 예정일까지 남은 일수를 구간별로 나눠 환불율을 차등 적용합니다 (7일 전 100% ~ 당일 0%)."
						file="RefundService.java"
						code={CODE_RATE}
					/>
				</div>
			</div>
		</section>
	);
}
