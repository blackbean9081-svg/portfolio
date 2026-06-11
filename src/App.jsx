import { useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import { useHashRoute } from "./router.js";
import { PAGE_IDS, DEFAULT_PAGE } from "./nav.js";

import Overview from "./pages/Overview.jsx";
import Tech from "./pages/Tech.jsx";
import SemiProject from "./pages/SemiProject.jsx";
import SemiChecklist from "./pages/SemiChecklist.jsx";
import Payment from "./pages/Payment.jsx";
import Refund from "./pages/Refund.jsx";
import Settlement from "./pages/Settlement.jsx";
import Stats from "./pages/Stats.jsx";
import CouponPoint from "./pages/CouponPoint.jsx";
import Troubleshooting from "./pages/Troubleshooting.jsx";
import Performance from "./pages/Performance.jsx";
import Retrospective from "./pages/Retrospective.jsx";

const PAGES = [
	{ id: "overview", Comp: Overview },
	{ id: "tech", Comp: Tech },
	{ id: "semi-project", Comp: SemiProject },
	{ id: "semi-checklist", Comp: SemiChecklist },
	{ id: "payment", Comp: Payment },
	{ id: "refund", Comp: Refund },
	{ id: "settlement", Comp: Settlement },
	{ id: "stats", Comp: Stats },
	{ id: "coupon-point", Comp: CouponPoint },
	{ id: "troubleshooting", Comp: Troubleshooting },
	{ id: "performance", Comp: Performance },
	{ id: "retrospective", Comp: Retrospective },
];

export default function App() {
	const [page, navigate] = useHashRoute(DEFAULT_PAGE);
	const active = PAGE_IDS.includes(page) ? page : DEFAULT_PAGE;

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "auto" });
	}, [active]);

	return (
		<div className="layout">
			<Sidebar page={active} onNavigate={navigate} />
			<main className="main" id="main">
				{PAGES.map(({ id, Comp }) => (
					<Comp key={id} active={active === id} />
				))}
			</main>
		</div>
	);
}
