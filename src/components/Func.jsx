import { useState } from "react";
import CodeBlock from "./CodeBlock.jsx";

export default function Func({
	name,
	head,
	desc,
	file,
	code,
	barName,
	rich = true,
	defaultOpen = false,
}) {
	const [open, setOpen] = useState(defaultOpen);
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
