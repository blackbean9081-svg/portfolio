export const NAV = [
	{
		type: "group",
		id: "final",
		label: "파이널 프로젝트 (Sloway)",
		children: [
			{ id: "final-overview", label: "개요" },
			{ id: "final-tech", label: "기술 스택" },
			{ id: "payment", label: "결제" },
			{ id: "refund", label: "환불" },
			{ id: "settlement", label: "정산" },
			{ id: "stats", label: "통계" },
			{ id: "coupon-point", label: "쿠폰, 포인트" },
		],
	},
	{
		type: "group",
		id: "semi",
		label: "세미 프로젝트 (TaskFlow)",
		children: [
			{ id: "semi-overview", label: "개요" },
			{ id: "semi-tech", label: "기술 스택" },
			{ id: "semi-project", label: "프로젝트 관리" },
			{ id: "semi-checklist", label: "체크리스트" },
		],
	},
	{
		type: "group",
		id: "solo",
		label: "개인 프로젝트 (Python)",
		children: [{ id: "price-monitor", label: "hospital-price-monitor" }],
	},
	{ type: "divider" },
	{ type: "item", id: "troubleshooting", label: "트러블슈팅" },
	{ type: "item", id: "performance", label: "성능 개선" },
	{ type: "item", id: "retrospective", label: "회고" },
];

export const PAGE_IDS = [
	"final-overview",
	"profile",
	"final-tech",
	"payment",
	"refund",
	"settlement",
	"stats",
	"coupon-point",
	"semi-overview",
	"semi-tech",
	"semi-project",
	"semi-checklist",
	"price-monitor",
	"troubleshooting",
	"performance",
	"retrospective",
];

export const DEFAULT_PAGE = PAGE_IDS[0];

export function groupOf(pageId) {
	for (const node of NAV) {
		if (node.type === "group" && node.children.some((c) => c.id === pageId)) {
			return node.id;
		}
	}
	return null;
}
