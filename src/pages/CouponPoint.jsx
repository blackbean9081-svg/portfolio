import Func from "../components/Func.jsx";

const CODE_RETURN = `    // 환불 시 사용한 쿠폰을 회수
    public void returnCoupon() {
        if (this.status != CouponStatus.USED) {
            throw new CustomException(CouponErrorCode.COUPON_NOT_USED);
        }
        this.payNo = null;
        this.usedAt = null;
        // 환불 시점에 만료된 쿠폰이 부활하는 것 방지
        if (this.expiredAt != null && this.expiredAt.isBefore(LocalDateTime.now())) {
            this.status = CouponStatus.EXPIRED;
        } else {
            this.status = CouponStatus.AVAILABLE;
        }
    }`;

const CODE_BALANCE = `    // 포인트 잔액 = 적립 + 사용 합산
    private int calcBalance(Long memberNo) {
        int saveSum = pointRepository.sumByMemberAndStatus(memberNo, PointStatus.SAVE);
        int usedSum = pointRepository.sumByMemberAndStatus(memberNo, PointStatus.USED);
        return saveSum + usedSum;
    }`;

const CODE_POINT = `    // 환불 시 사용했던 포인트 복원
    @Transactional
    public void refundUsedPoint(PayEntity payEntity) {
        MemberEntity member = findMember(payEntity.getRsvnNo().getMemberNo().getNo());
        List<PointEntity> pointList = pointRepository.findByPayAndDealType(payEntity.getNo(), PointDealType.USE);
        int sumPoint = pointList.stream().mapToInt(PointEntity::getAmount).sum();
        int returnPoint = Math.abs(sumPoint);
        if (returnPoint == 0) return;
        PointEntity entity = PointEntity.builder()
                .memberNo(member)
                .payNo(payEntity)
                .amount(returnPoint)
                .dealType(PointDealType.EARN)
                .status(PointStatus.SAVE)
                .expiredAt(LocalDateTime.now().plusYears(1))
                .build();
        pointRepository.save(entity);
    }

    // 환불 시 적립됐던 포인트 회수
    @Transactional
    public void cancelEarnedPoint(PayEntity payEntity) {
        List<PointEntity> pointList = pointRepository.findByPayAndDealType(payEntity.getNo(), PointDealType.EARN);
        pointList.stream()
                .filter(p -> p.getStatus() == PointStatus.WAIT || p.getStatus() == PointStatus.SAVE)
                .forEach(PointEntity::cancel);
    }`;

export default function CouponPoint({ active }) {
	return (
		<section className="page" id="coupon-point" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">쿠폰·포인트</h1>
				<p className="page__desc">
					쿠폰 이벤트 발급/다운로드 + 결제액 1% 적립 + 7일 후 확정.
				</p>
			</header>

			<div className="pay2">
				<div className="cp-app">
					{/* 탭 */}
					<div className="cp-tabs">
						<span className="cp-tab cp-tab--on">쿠폰함</span>
						<span className="cp-tab">포인트</span>
					</div>

					<div className="cp-subtabs">
						<span className="cp-subtab cp-subtab--on">사용 가능 2</span>
						<span className="cp-subtab">사용 완료 1</span>
						<span className="cp-subtab">만료 0</span>
					</div>
					<div className="cp-grid">
						<div className="cp-card">
							<div className="cp-card__head">
								<span className="cp-card__title">여름맞이 15% 할인</span>
								<span className="cp-badge cp-badge--on">사용 가능</span>
							</div>
							<div className="cp-dc">15%</div>
							<div className="cp-dc-label">할인</div>
							<div className="cp-card__body">
								<span>유효기간</span>
								<span>2026.06.28까지</span>
							</div>
							<span className="cp-dday">⏰ D-7 만료 임박</span>
						</div>
						<div className="cp-card">
							<div className="cp-card__head">
								<span className="cp-card__title">첫 결제 감사 쿠폰</span>
								<span className="cp-badge cp-badge--on">사용 가능</span>
							</div>
							<div className="cp-dc">5,000원</div>
							<div className="cp-dc-label">즉시 할인</div>
							<div className="cp-card__body">
								<span>유효기간</span>
								<span>2026.07.15까지</span>
							</div>
						</div>
					</div>

					{/* 포인트 잔액 */}
					<div className="cp-balance">
						<div className="cp-balance__label">보유 포인트</div>
						<div className="cp-balance__amount">5,000P</div>
						<div className="cp-balance__hint">
							1P = 1원으로 결제 시 사용할 수 있어요
						</div>
					</div>

					{/* 적립·사용 내역 */}
					<div className="cp-subhead">적립·사용 내역</div>
					<div className="cp-hist">
						<div className="cp-hrow">
							<div className="cp-hleft">
								<span className="cp-hbadge cp-hbadge--earn">적립</span>
								<div className="cp-hmeta">
									<span className="cp-hstatus">적립 예정</span>
									<span className="cp-hdate">2026.06.14</span>
								</div>
							</div>
							<span className="cp-hamt cp-hamt--plus">+2,450P</span>
						</div>
						<div className="cp-hrow">
							<div className="cp-hleft">
								<span className="cp-hbadge cp-hbadge--use">사용</span>
								<div className="cp-hmeta">
									<span className="cp-hstatus">사용 완료</span>
									<span className="cp-hdate">2026.06.14</span>
								</div>
							</div>
							<span className="cp-hamt cp-hamt--minus">-5,000P</span>
						</div>
						<div className="cp-hrow">
							<div className="cp-hleft">
								<span className="cp-hbadge cp-hbadge--earn">적립</span>
								<div className="cp-hmeta">
									<span className="cp-hstatus">적립 완료</span>
									<span className="cp-hdate">2026.05.30</span>
								</div>
							</div>
							<span className="cp-hamt cp-hamt--plus">+5,000P</span>
						</div>
					</div>
				</div>

				{/* ===== 오른쪽: 기능 목록 (아코디언) ===== */}
				<div className="pay2__right">
					<Func
						rich
						name="환불 시 쿠폰 회수 (만료 분기)"
						desc="환불 시 사용된 쿠폰의 결제 연결을 끊고 상태를 되돌립니다. 회수 시점에 이미 유효기간이 지났으면 되살리지 않고 EXPIRED로 두어 만료 쿠폰의 부활을 막습니다."
						file="CouponEntity.java"
						code={CODE_RETURN}
					/>
					<Func
						rich
						name="포인트 잔액 계산"
						desc="사용 내역(USED)을 음수로 저장해 두어, 적립(SAVE)과 단순히 더하기만 하면 차감 효과가 나도록 설계했습니다."
						file="PointService.java"
						code={CODE_BALANCE}
					/>
					<Func
						rich
						name="환불 시 포인트 복원·취소"
						desc="환불 시 사용한 포인트는 새 SAVE row로 복원하고, 이 결제로 적립됐던 포인트는 취소합니다. 둘은 같은 EARN을 건드려 호출 순서에 의존합니다."
						file="PointService.java"
						code={CODE_POINT}
					/>
				</div>
			</div>
		</section>
	);
}
