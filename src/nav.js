export const NAV = [
	{ type: "item", id: "overview", label: "프로젝트 개요" },
	{ type: "item", id: "tech", label: "기술 스택" },
	{ type: "divider" },
	{
		type: "group",
		id: "semi",
		label: "세미 프로젝트 (TaskFlow)",
		children: [
			{ id: "semi-project", label: "프로젝트 관리" },
			{ id: "semi-checklist", label: "체크리스트" },
		],
	},
	{
		type: "group",
		id: "final",
		label: "파이널 프로젝트 (Sloway)",
		children: [
			{ id: "payment", label: "결제" },
			{ id: "refund", label: "환불" },
			{ id: "settlement", label: "정산" },
			{ id: "stats", label: "통계" },
			{ id: "coupon-point", label: "쿠폰·포인트" },
		],
	},
	{ type: "divider" },
	{ type: "item", id: "troubleshooting", label: "트러블슈팅" },
	{ type: "item", id: "performance", label: "성능 개선" },
	{ type: "item", id: "retrospective", label: "회고" },
];

export const PAGE_IDS = [
	"overview",
	"tech",
	"semi-project",
	"semi-checklist",
	"payment",
	"refund",
	"settlement",
	"stats",
	"coupon-point",
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
