// 세미(TaskFlow) 기술 스택 — Tech.jsx 와 동일한 뱃지/태그 구조.
const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

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
		items: [{ name: "Spring Boot", icon: "spring" }, { name: "MyBatis" }],
	},
	{
		label: "Frontend",
		items: [
			{ name: "JSP" },
			{ name: "HTML", icon: "html5" },
			{ name: "CSS", icon: "css3" },
		],
	},
	{
		label: "DB",
		items: [{ name: "Oracle", icon: "oracle" }],
	},
	{
		label: "Build Tool",
		items: [{ name: "Gradle" }],
	},
	{
		label: "IDE / Tool",
		items: [{ name: "IntelliJ", icon: "intellij" }],
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

export default function SemiTech({ active }) {
	return (
		<section className="page" id="semi-tech" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">기술 스택</h1>
				<p className="page__desc">세미 프로젝트(TaskFlow) 사용 기술.</p>
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
