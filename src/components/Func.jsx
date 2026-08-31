import { useState } from "react";
import CodeBlock from "./CodeBlock.jsx";

export default function Func({
	name,
	head,
	desc,
	file,
	code,
	lang = "java",
	barName,
	retro,
	rich = true,
	defaultOpen = false,
}) {
	const [open, setOpen] = useState(defaultOpen);
	const bar = barName ?? name;

	// 코드 보기 토글 — retro 있으면 구현 포인트 줄, 없으면 헤더 줄에 배치
	const codeToggle = (
		<button
			className={"func__toggle" + (open ? " is-open" : "")}
			onClick={() => setOpen((o) => !o)}
		>
			<span className="func__toggle-text">
				{open ? "코드 접기" : "코드 보기"}
			</span>
			<span className="func__arrow">▾</span>
		</button>
	);

	return (
		<div className="func">
			{/* 기능명 + 설명 — retro 없을 때만 코드 토글도 여기 */}
			<div className={"func__head" + (rich ? " func__head--rich" : "")}>
				{rich ? (
					<span className="func__head-main">
						<span className="func__name">{name}</span>
						<span className="func__desc">{desc}</span>
					</span>
				) : (
					(head ?? name)
				)}
				{!retro && codeToggle}
			</div>

			{/* 구현 포인트 — 항상 표시. 코드 토글을 이 줄 오른쪽에 배치 */}
			{retro && (
				<div className="func__retro">
					<div className="func__retro-head">
						<span className="func__retro-label">구현 포인트</span>
						{codeToggle}
					</div>
					<div className="func__retro-body">
						<p className="func__retro-text">{retro}</p>
					</div>
				</div>
			)}

			{/* 코드 — 토글로 펼침 */}
			<div className="func__body" hidden={!open}>
				<div className="func__bar">
					<span className="func__bar-name">{bar}</span>
					<span className="func__bar-file">{file}</span>
				</div>
				<CodeBlock code={code} lang={lang} />
			</div>
		</div>
	);
}
