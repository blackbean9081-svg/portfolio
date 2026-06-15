// 화면/코드 영역 구분 헤더 — 좌(실제 서비스 화면) / 우(구현 코드) 상단 라벨.
export default function PaneHead({ title, sub }) {
	return (
		<div className="pane-head">
			<span className="pane-head__title">{title}</span>
			<span className="pane-head__sub">{sub}</span>
		</div>
	);
}
