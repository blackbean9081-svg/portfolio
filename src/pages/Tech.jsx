// 기술 스택 — devicon 컬러 로고(icon 슬러그) + 공식 로고 없는 건 텍스트 칩.
// icon 이 있으면 devicon SVG, 없으면 이름 칩으로 렌더.
const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const SECTIONS = [
	{
		label: "Backend",
		items: [
			{ name: "Java 21", icon: "java" },
			{ name: "Spring Boot", icon: "spring" },
			{ name: "Spring Data JPA" }, // 스프링 아이콘 중복 방지 → 이름만
			{ name: "QueryDSL" },
			{ name: "Spring Scheduler" },
			{ name: "JWT" }, // 칩
		],
	},
	{
		label: "Frontend",
		items: [{ name: "React", icon: "react" }],
	},
	{
		label: "Build Tool",
		items: [{ name: "Gradle" }], // devicon original 변형 불확실 → 칩
	},
	{
		label: "DB",
		items: [{ name: "PostgreSQL", icon: "postgresql" }],
	},
	{
		label: "외부 연동",
		items: [
			{ name: "KakaoPay" }, // 공식 로고 없음 → 칩
			{ name: "TossPay" }, // 공식 로고 없음 → 칩
		],
	},
	{
		label: "Cloud",
		items: [
			{ name: "AWS EC2" }, // 개별 서비스 devicon 없음 → 칩
			{ name: "AWS RDS" }, // 개별 서비스 devicon 없음 → 칩
			{ name: "AWS S3" }, // 개별 서비스 devicon 없음 → 칩
		],
	},
	{
		label: "DevOps",
		items: [{ name: "GitHub Actions" }], // devicon original 변형 불확실 → 칩
	},
	{
		label: "협업",
		items: [
			{ name: "GitHub", icon: "github" },
			{ name: "Sourcetree" }, // devicon 미보유 → 칩
			{ name: "Notion", icon: "notion" },
			{ name: "Figma", icon: "figma" },
			{ name: "ERDCloud" }, // 공식 로고 없음 → 칩
		],
	},
	{
		label: "기타",
		items: [
			{ name: "KakaoTalk" }, // devicon 미보유 → 칩
		],
	},
];

export default function Tech({ active }) {
	return (
		<section className="page" id="tech" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">기술 스택</h1>
				<p className="page__desc">백엔드·프론트엔드·인프라 사용 기술.</p>
			</header>
			<div className="doc-block">
				{SECTIONS.map((sec) => (
					<div className="tag-section" key={sec.label}>
						<span className="tag-section__label">{sec.label}</span>
						<div className="tag-group">
							{sec.items.map((it) => (
								<span className="tech-item" key={it.name}>
									{it.icon && (
										<img
											className="tech-icon"
											alt=""
											src={`${ICON_BASE}/${it.icon}/${it.icon}-original.svg`}
										/>
									)}
									<span className="tech-name">{it.name}</span>
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
