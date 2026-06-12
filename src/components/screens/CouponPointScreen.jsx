// 쿠폰함·포인트 화면 (쿠폰·포인트 재현) — CouponPoint 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
export default function CouponPointScreen() {
	return (
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
	);
}
