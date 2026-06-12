import { useEffect, useState } from "react";
import { NAV, groupOf } from "../nav.js";

export default function Sidebar({ page, onNavigate }) {
	const [openGroups, setOpenGroups] = useState(() => {
		const g = groupOf(page);
		return g ? { [g]: true } : {};
	});

	useEffect(() => {
		const g = groupOf(page);
		if (g) setOpenGroups((prev) => ({ ...prev, [g]: true }));
	}, [page]);

	const toggleGroup = (id) =>
		setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

	return (
		<aside className="sidebar">
			<div className="sidebar__logo">
				<span className="sidebar__logo-title">전포트폴리오</span>
				<span className="sidebar__logo-name">김우영</span>
			</div>

			<nav className="nav" id="nav">
				{NAV.map((node, i) => {
					if (node.type === "divider") {
						return <hr className="nav__divider" key={`div-${i}`} />;
					}
					if (node.type === "item") {
						return (
							<button
								key={node.id}
								className={"nav__item" + (page === node.id ? " is-active" : "")}
								onClick={() => onNavigate(node.id)}
							>
								{node.label}
							</button>
						);
					}
					// group (아코디언)
					const isOpen = !!openGroups[node.id];
					return (
						<div className="nav__accordion" key={node.id}>
							<button
								className={"nav__group" + (isOpen ? " is-open" : "")}
								onClick={() => toggleGroup(node.id)}
							>
								<span>{node.label}</span>
								<span className="nav__arrow">▾</span>
							</button>
							<div className={"nav__sub" + (isOpen ? " is-open" : "")}>
								{node.children.map((child) => (
									<button
										key={child.id}
										className={
											"nav__item nav__item--sub" +
											(page === child.id ? " is-active" : "")
										}
										onClick={() => onNavigate(child.id)}
									>
										{child.label}
									</button>
								))}
							</div>
						</div>
					);
				})}
			</nav>
		</aside>
	);
}
