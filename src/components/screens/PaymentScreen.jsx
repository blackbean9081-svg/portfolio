// 결제 완료 화면 (PaymentComplete 재현) — Payment 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
export default function PaymentScreen() {
	return (
		<div className="pc">
			{/* 성공 헤더 (ResultHeader variant="success") */}
			<div className="pc__head">
				<div className="pc__check">✓</div>
				<div className="pc__title">결제가 완료됐어요</div>
				<div className="pc__desc">
					결제와 동시에 예약이 자동으로 확정됐어요. 체크인 하루 전 리마인드
					알림을 보내드릴게요.
				</div>
			</div>

			{/* 예약·결제 정보 카드 (ReservationInfoCard) */}
			<div className="pc__card">
				<div className="pc__space">
					<span className="pc__emoji">🏠</span>
					<div className="pc__space-meta">
						<span className="pc__space-name">청평 숲속 파인뷰 스테이</span>
						<span className="pc__booking">SW-PAY-000001</span>
					</div>
				</div>
				<div className="pc__rows">
					<div className="pc__row">
						<span>이용 일정</span>
						<strong>2026.06.20 ~ 2026.06.22</strong>
					</div>
					<div className="pc__row">
						<span>결제 수단</span>
						<strong>
							<span className="pc__mchip">💛</span>카카오페이
						</strong>
					</div>
					<div className="pc__row">
						<span>승인 번호</span>
						<strong className="pc__mono">T1a2b3c4d5e6f7g8h9</strong>
					</div>
					<div className="pc__row">
						<span>결제 일시</span>
						<strong>2026.06.14 14:30</strong>
					</div>
					<div className="pc__total">
						<span className="pc__total-label">결제 금액</span>
						<span className="pc__total-num">
							245,000<span>원</span>
						</span>
					</div>
					<div className="pc__earn">
						<span>🌱</span>
						<span>
							이용 완료 후 <strong>2,450P</strong> 적립 예정
						</span>
					</div>
				</div>
			</div>

			{/* 다음 단계 안내 (NextStepsList) */}
			<div className="pc__steps">
				<div className="pc__steps-title">다음 단계</div>
				<ul className="pc__steplist">
					<li>
						<span className="pc__stepno">1</span>예약 목록에서 확정된 예약을
						확인할 수 있어요.
					</li>
					<li>
						<span className="pc__stepno">2</span>체크인 하루 전 리마인드
						알림을 보내드려요.
					</li>
					<li>
						<span className="pc__stepno">3</span>이용 완료 7일 뒤 2,450P가
						적립돼요.
					</li>
				</ul>
			</div>

			{/* 액션 버튼 (Actions) */}
			<div className="pc__actions">
				<button className="pc__btn-ghost">📧 영수증 보기</button>
				<button className="pc__btn-ghost">예약 상세 보기</button>
				<button className="pc__btn-primary">예약 목록으로</button>
			</div>
			<button className="pc__back">← 메인으로 돌아가기</button>
		</div>
	);
}
