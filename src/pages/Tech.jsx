// 기술 스택 — devicon 컬러 로고 + 공식 로고 없는 건 텍스트 칩.
const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
// devicon에 없는 AWS 서비스별 아이콘(EC2/RDS/S3 등)은 gilbarbara/logos에서 가져온다.
const AWS_ICON_BASE = "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos";

const SECTIONS = [
	{
		label: "Language",
		items: [
			{ name: "Java", icon: "java" },
			{ name: "JavaScript", icon: "javascript" },
		],
	},
	{
		label: "Backend",
		items: [
			{ name: "Spring Boot", icon: "spring" },
			{ name: "Spring Data JPA" },
			{ name: "Spring Scheduler" },
			{ name: "QueryDSL" },
			{ name: "JWT" },
		],
	},
	{
		label: "Frontend",
		items: [{ name: "React", icon: "react" }],
	},
	{
		label: "DB",
		items: [{ name: "PostgreSQL", icon: "postgresql" }],
	},
	{
		label: "Build Tool",
		items: [{ name: "Gradle", icon: "gradle" }],
	},
	{
		label: "IDE / Tool",
		items: [{ name: "IntelliJ", icon: "intellij" }],
	},
	{
		label: "외부 연동",
		items: [{ name: "KakaoPay" }, { name: "TossPay" }],
	},
	{
		label: "Cloud",
		items: [
			{ name: "AWS EC2", iconUrl: `${AWS_ICON_BASE}/aws-ec2.svg` },
			{ name: "AWS RDS", iconUrl: `${AWS_ICON_BASE}/aws-rds.svg` },
			{ name: "AWS S3", iconUrl: `${AWS_ICON_BASE}/aws-s3.svg` },
		],
	},
	{
		label: "DevOps",
		items: [{ name: "GitHub Actions" }],
	},
	{
		label: "협업",
		items: [
			{ name: "Git", icon: "git" },
			{ name: "GitHub", icon: "github" },
			{ name: "Sourcetree" },
			{ name: "Notion", icon: "notion" },
			{ name: "Figma", icon: "figma" },
			{ name: "ERDCloud" },
		],
	},
	{
		label: "기타",
		items: [{ name: "KakaoTalk" }],
	},
];

export default function Tech({ active }) {
	return (
		<section className="page" id="final-tech" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">기술 스택</h1>
				<p className="page__desc">백엔드, 프론트엔드, 인프라 사용 기술.</p>
			</header>
			<div className="doc-block">
				{SECTIONS.map((sec) => (
					<div className="tag-section" key={sec.label}>
						<span className="tag-section__label">{sec.label}</span>
						<div className="tag-group">
							{sec.items.map((it) => {
								const src =
									it.iconUrl ||
									(it.icon &&
										`${ICON_BASE}/${it.icon}/${it.icon}-${
											it.variant || "original"
										}.svg`);
								return (
									<span className="tech-item" key={it.name}>
										{src && <img className="tech-icon" alt="" src={src} />}
										<span className="tech-name">{it.name}</span>
									</span>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
