// 회고 데이터 — 협업, 일정 / 기술 두 영역 + 느낀 점
// 각 항목: { lead: 결론(두괄식), detail: 부연 } — detail 은 선택
const SECTIONS = [
	{
		title: "협업, 일정",
		keep: [
			{
				lead: "작업이 막힘없이 흘러갔습니다.",
				detail:
					"단독으로 할 수 있는 기능은 먼저 하고, 도메인이 엮이는 부분은 담당자끼리 먼저 논의했습니다.",
			},
			{
				lead: "중간발표와 클라우드 배포가 무리 없이 진행됐습니다.",
				detail:
					"전체 일정에 걸린 일을 미리 염두에 두고 작업 순서를 조율했습니다.",
			},
			{
				lead: "문제 해결을 오래 끌지 않았습니다.",
				detail: "이슈가 생길 때마다 팀원들과 바로 회의했습니다.",
			},
			{
				lead: "맡은 기능을 다른 팀원이 연동해 쓸 때 문제가 없었습니다.",
				detail: "환불에서 호스트가 예약을 거절하는 부분을 구현했습니다.",
			},
		],
		problem: [
			{
				lead: "흐름 파악에 시간이 오래 걸렸습니다.",
				detail:
					"정산, 쿠폰, 포인트 복원처럼 난이도 높은 기능에서 특히 그랬습니다.",
			},
			{
				lead: "예약 도메인과 엮이는 순서를 미리 맞추지 못해 작업을 왔다 갔다 했습니다.",
				detail:
					"나중에 엮으면 문제가 된다는 걸 알면서도 팀원의 개발 속도를 고려하지 못한 점이 아쉬웠습니다.",
			},
			{
				lead: "클린 코드와 성능 개선에 제대로 신경 쓰지 못했습니다.",
				detail:
					"실제 서비스를 가정한 테스트에서 버그가 계속 나온 탓이 컸습니다.",
			},
			{
				lead: "주석을 나만 알아볼 수 있게 썼습니다.",
				detail: "누가 봐도 이해되는 주석을 쓰는 연습이 필요하다고 느꼈습니다.",
			},
		],
		try: [
			{ lead: "연동되는 도메인은 개발 전에 인터페이스를 먼저 합의합니다." },
			{
				lead: "처음부터 구조와 가독성을 염두에 두고, 나중에 몰아서 리팩토링하지 않습니다.",
			},
		],
	},
	{
		title: "기술",
		keep: [
			{
				lead: "문제 추적이 쉬웠습니다.",
				detail:
					"외부 PG를 바로 붙이지 않고, 모의 결제로 전체 흐름을 먼저 검증한 뒤 실제 연동에 들어갔습니다.",
			},
			{
				lead: "평소엔 안 보이던 약점을 미리 찾았습니다.",
				detail:
					"대량 더미 데이터로 과부하 상황을 만들어 통계 금액 오버플로를 발견했습니다.",
			},
			{
				lead: "불필요하게 쿼리가 많이 도는 문제를 찾아 해결했습니다.",
				detail: "한 번 해결하고 나니 전체 흐름을 파악하는 데 도움이 됐습니다.",
			},
		],
		problem: [
			{
				lead: "정산은 흐름이 복잡해 여러 번 다시 그려봐야 했습니다.",
				detail: "결제, 환불, 세금계산서가 얽혀 한 번에 이해되지 않았습니다.",
			},
			{
				lead: "규모가 커질 때의 부하를 미리 대비하지 못했습니다.",
				detail:
					"정산이 4일마다 모든 호스트를 동시에 처리해, 대상이 많아지면 부하가 걸릴 수 있습니다.",
			},
			{
				lead: "리팩토링 방향을 잡기가 어려웠습니다.",
				detail: "실제로 반영하는 과정에서 문제를 파악하기도 어려웠습니다.",
			},
		],
		try: [
			{ lead: "복잡한 도메인은 흐름도를 먼저 그려 전체를 잡고 시작합니다." },
			{
				lead: "자동 정산은 호스트를 그룹이나 공간별로 나눠 처리해 부하를 줄입니다.",
			},
		],
	},
];

const FEELINGS = [
	{
		title: "흐름을 먼저 잡고 시작해야 한다",
		body: "이번 프로젝트에서 가장 크게 배운 건, 복잡한 기능일수록 코드부터 짜면 안 된다는 것이었습니다. \n 정산이나 쿠폰, 포인트 복원처럼 여러 도메인이 얽힌 기능을 맡았을 때, 흐름을 다 파악하지 못한 채 손대다 보니 \n  중간에 막혀 다시 처음으로 돌아가는 일이 많았습니다.  \n  결제도 마찬가지로, 예약 도메인과 엮이는 순서를 미리 고려하지 못해 작업을 왔다 갔다 하며 진행했습니다.  \n 다음 프로젝트에서는 코드를 짜기 전에 전체 흐름을 먼저 그려두고, 연동되는 부분은 팀원과 미리 맞춰두려 합니다.",
	},
	{
		title: "규모가 커질 때를 생각하기",
		body: '자동 정산 기능을 만들 때, 호스트나 정산 건이 많아지는 상황을 충분히 대비하지 못했습니다. \n  기능이 동작하는 것에 집중하다 보니, 규모가 커졌을 때 생길 부하를 미리 고려하지 못한 것입니다. \n  돌이켜보면 "지금은 괜찮지만 데이터가 늘면 어떻게 될까"를 한 번 더 짚었어야 했습니다.  \n 앞으로는 기능을 만들 때 당장의 동작뿐 아니라, 예상되는 문제를 미리 그려보고 대비하는 습관을 들이려 합니다.',
	},
	{
		title: "동작만큼 검증이 중요하다",
		body: "처음엔 기능을 동작시키는 데만 집중했는데, 결제·환불·정산처럼 금액을 다루다 보니 검증과 예외 처리의 중요성을 크게 느꼈습니다. \n  잘못된 입력이나 예상 못 한 상황이 그대로 결과에 남기 때문입니다. \n  앞으로는 정상적으로 동작하는 흐름뿐 아니라, 잘못된 입력이나 예외 상황까지 먼저 그려보고 구현하려 합니다.",
	},
];

export default function Retrospective({ active }) {
	return (
		<section className="page" id="retrospective" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">회고</h1>
				<p className="page__desc">프로젝트를 돌아보며 정리한 회고.</p>
			</header>

			<div className="doc-block doc-block--flush retro">
				{SECTIONS.map((sec) => (
					<div className="retro-block" key={sec.title}>
						<h2 className="retro-block__title">{sec.title}</h2>

						<div className="retro-group">
							<h3 className="retro-sub retro-sub--keep">좋았던 점</h3>
							<ul className="retro-list">
								{sec.keep.map((t, i) => (
									<li key={i}>
										<strong className="retro-list__lead">{t.lead}</strong>
										{t.detail && (
											<span className="retro-list__detail">{t.detail}</span>
										)}
									</li>
								))}
							</ul>
						</div>
						<div className="retro-group">
							<h3 className="retro-sub retro-sub--problem">아쉬운 점</h3>
							<ul className="retro-list">
								{sec.problem.map((t, i) => (
									<li key={i}>
										<strong className="retro-list__lead">{t.lead}</strong>
										{t.detail && (
											<span className="retro-list__detail">{t.detail}</span>
										)}
									</li>
								))}
							</ul>
						</div>
						<div className="retro-group">
							<h3 className="retro-sub retro-sub--try">
								프로젝트를 통해 알게 된 내용
							</h3>
							<ul className="retro-list">
								{sec.try.map((t, i) => (
									<li key={i}>
										<strong className="retro-list__lead">{t.lead}</strong>
										{t.detail && (
											<span className="retro-list__detail">{t.detail}</span>
										)}
									</li>
								))}
							</ul>
						</div>
					</div>
				))}

				{/* 느낀 점 */}
				<div className="retro-block">
					<h2 className="retro-block__title">느낀 점</h2>
					{FEELINGS.map((f) => (
						<div className="retro-feel" key={f.title}>
							<h3 className="retro-feel__title">{f.title}</h3>
							<p className="retro-feel__body">{f.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
