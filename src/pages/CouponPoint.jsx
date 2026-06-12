import Func from "../components/Func.jsx";
import CouponPointScreen from "../components/screens/CouponPointScreen.jsx";

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
				<CouponPointScreen />

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
