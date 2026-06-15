// 환불 완료 화면 (RefundComplete 재현) — Refund 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
export default function RefundScreen() {
	return (
		<div className="rc-app">
			{/* 성공 헤더 (ResultHeader variant="success") */}
			<div className="rc-head">
				<div className="rc-check">✓</div>
				<div className="rc-title">환불 신청이 접수됐어요</div>
				<div className="rc-desc">
					영업일 3~7일 내 카카오페이로 입금됩니다. 입금 완료되면 알림으로
					안내드릴게요.
				</div>
			</div>

			{/* 예약·결제 카드 (SpaceCard) */}
			<div className="rc-space">
				<span className="rc-emoji">🏠</span>
				<div className="rc-space-meta">
					<span className="rc-space-name">예약 #2</span>
					<span className="rc-space-sub">결제번호: PAY-000001</span>
				</div>
			</div>

			{/* 환불 정보 카드 (RefundInfoCard) */}
			<div className="rc-card">
				<div className="rc-row">
					<span>환불 번호</span>
					<strong className="rc-mono">RFD-000001</strong>
				</div>
				<div className="rc-row">
					<span>예약 번호</span>
					<strong className="rc-mono">RSVN-000002</strong>
				</div>
				<div className="rc-row">
					<span>환불율</span>
					<strong>70%</strong>
				</div>
				<div className="rc-row">
					<span>환불 수단</span>
					<strong>
						<span className="rc-mchip">💬</span>카카오페이
					</strong>
				</div>
				<div className="rc-row">
					<span>신청 일시</span>
					<strong>2026.06.14 14:30</strong>
				</div>
				<div className="rc-row">
					<span>입금 예정일</span>
					<strong>6월 21일 (영업일 기준)</strong>
				</div>
				<div className="rc-total">
					<span className="rc-total-label">환불 금액</span>
					<span className="rc-total-num">
						171,500<span>원</span>
					</span>
				</div>
			</div>

			{/* 환불 사유 (Section + ReasonCard) */}
			<div className="rc-reason">
				<div className="rc-reason-label">고객님이 작성하신 사유</div>
				<div className="rc-reason-text">"개인 사정 / 긴급 상황"</div>
			</div>

			{/* 안내 (NoticeBox) */}
			<div className="rc-notice">
				<span className="rc-notice-icon">💡</span>
				<div className="rc-notice-body">
					<div className="rc-notice-title">환불 처리에 대해 알려드려요</div>
					<ul className="rc-notice-list">
						<li>
							카드사 정책에 따라 입금까지 영업일 기준 3~7일이 소요돼요
						</li>
						<li>주말, 공휴일은 영업일에 포함되지 않아요</li>
						<li>관리자 승인 후 자동 처리됩니다</li>
						<li>긴급 문의는 고객센터로 연락해주세요</li>
					</ul>
				</div>
			</div>

			{/* 액션 (Actions) */}
			<div className="rc-actions">
				<button className="rc-btn-ghost">결제 내역으로</button>
				<button className="rc-btn-primary">💬 고객센터 문의</button>
			</div>
		</div>
	);
}
