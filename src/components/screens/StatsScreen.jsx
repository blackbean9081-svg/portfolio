// 통계 대시보드 (StatsOverview 재현) — Stats 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
const BARS = [
	["120만", "45%", "1월", false],
	["165만", "62%", "2월", false],
	["101만", "38%", "3월", false],
	["208만", "78%", "4월", false],
	["240만", "90%", "5월", false],
	["266만", "100%", "6월", true],
];

export default function StatsScreen() {
	return (
		<div className="so-app">
			<div className="so-head">
				<div className="so-head__title">통계 대시보드</div>
				<div className="so-head__desc">이번 달 결제·환불 통계 요약</div>
			</div>

			{/* 기간 탭 (StatsRangeTabs) */}
			<div className="so-tabs">
				<span className="so-tab so-tab--on">이번 달</span>
				<span className="so-tab">3개월</span>
				<span className="so-tab">6개월</span>
				<span className="so-tab">1년</span>
			</div>

			{/* KPI (StatCard 4개) */}
			<div className="so-kpis">
				<div className="so-stat">
					<div className="so-stat__icon">👛</div>
					<div className="so-stat__label">총 매출</div>
					<div className="so-stat__value">
						12,400,000<span>원</span>
					</div>
				</div>
				<div className="so-stat">
					<div className="so-stat__icon">🧾</div>
					<div className="so-stat__label">결제 건수</div>
					<div className="so-stat__value">
						48<span>건</span>
					</div>
				</div>
				<div className="so-stat">
					<div className="so-stat__icon">⚖️</div>
					<div className="so-stat__label">평균 결제금</div>
					<div className="so-stat__value">
						258,333<span>원</span>
					</div>
				</div>
				<div className="so-stat so-stat--hl">
					<div className="so-stat__icon">🐷</div>
					<div className="so-stat__label">순매출 (환불 차감)</div>
					<div className="so-stat__value">
						12,060,000<span>원</span>
					</div>
				</div>
			</div>

			{/* 결제수단별 매출 (HorizontalBarChart) */}
			<div className="so-chart-title">결제수단별 매출</div>
			<div className="so-hbars">
				<div className="so-hbar">
					<span className="so-hbar__label">카카오페이</span>
					<div className="so-hbar__track">
						<div
							className="so-hbar__fill"
							style={{ width: "100%", background: "#FEE500" }}
						></div>
					</div>
					<span className="so-hbar__val">8,200,000원</span>
				</div>
				<div className="so-hbar">
					<span className="so-hbar__label">토스페이</span>
					<div className="so-hbar__track">
						<div
							className="so-hbar__fill"
							style={{ width: "51%", background: "#0064FF" }}
						></div>
					</div>
					<span className="so-hbar__val">4,200,000원</span>
				</div>
			</div>

			{/* 매출 추이 (VerticalBarChart) */}
			<div className="so-chart-title">이번 달 매출 추이</div>
			<div className="so-bars">
				{BARS.map(([val, height, label, on]) => (
					<div className="so-bar-col" key={label}>
						<span className="so-bar-val">{val}</span>
						<div
							className={"so-bar" + (on ? " so-bar--on" : "")}
							style={{ height }}
						></div>
						<span className="so-bar-label">{label}</span>
					</div>
				))}
			</div>

			{/* 환불 통계 (RefundCard 3분할) */}
			<div className="so-chart-title">환불 통계</div>
			<div className="so-refund">
				<div className="so-rcol">
					<span className="so-rcol__label">환불 건수</span>
					<span className="so-rcol__value">
						4<span>건</span>
					</span>
				</div>
				<div className="so-rdiv"></div>
				<div className="so-rcol">
					<span className="so-rcol__label">환불 총액</span>
					<span className="so-rcol__value">
						340,000<span>원</span>
					</span>
				</div>
				<div className="so-rdiv"></div>
				<div className="so-rcol">
					<span className="so-rcol__label">환불율</span>
					<span className="so-rcol__value so-rcol__value--accent">
						2.7<span>%</span>
					</span>
				</div>
			</div>
		</div>
	);
}
