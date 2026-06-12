// 호스트 정산 대시보드 (SettlementDashboard 재현) — Settlement 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
export default function SettlementScreen() {
	return (
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
	);
}
