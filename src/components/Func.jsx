import { useState } from "react";
import CodeBlock from "./CodeBlock.jsx";

export default function Func({
	name,
	head,
	desc,
	file,
	code,
	barName,
	retro,
	rich = true,
	defaultOpen = false,
}) {
	const [open, setOpen] = useState(defaultOpen);
	const [retroOpen, setRetroOpen] = useState(true); // 회고는 기본 펼침
	const bar = barName ?? name;

	return (
		<div className="func">
			<button
				className={
					"func__head" +
					(rich ? " func__head--rich" : "") +
					(open ? " is-open" : "")
				}
				onClick={() => setOpen((o) => !o)}
			>
				{rich ? (
					<span className="func__head-main">
						<span className="func__name">{name}</span>
						<span className="func__desc">{desc}</span>
					</span>
				) : (
					(head ?? name)
				)}
				<span className="func__toggle">
					<span className="func__toggle-text">
						{open ? "코드 접기" : "코드 보기"}
					</span>
					<span className="func__arrow">▾</span>
				</span>
			</button>
			{/* 회고(느낀 점) — 설명 아래, 코드 토글과 독립(기본 펼침) */}
			{retro && (
				<div className="func__retro">
					<button
						className={"func__retro-head" + (retroOpen ? " is-open" : "")}
						onClick={() => setRetroOpen((o) => !o)}
					>
						<span className="func__retro-label">구현 포인트</span>
						<span className="func__toggle">
							<span className="func__toggle-text">
								{retroOpen ? "접기" : "펼치기"}
							</span>
							<span className="func__arrow">▾</span>
						</span>
					</button>
					<div className="func__retro-body" hidden={!retroOpen}>
						<p className="func__retro-text">{retro}</p>
					</div>
				</div>
			)}

			{/* 코드 — 회고 아래, "코드 보기" 토글로 별개 제어 */}
			<div className="func__body" hidden={!open}>
				<div className="func__bar">
					<span className="func__bar-name">{bar}</span>
					<span className="func__bar-file">{file}</span>
				</div>
				<CodeBlock code={code} />
			</div>
		</div>
	);
}
