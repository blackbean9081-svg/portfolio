// 마일스톤 패널 + 체크리스트 재현 (mile/list.jsp 내장) — SemiChecklist 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
export default function SemiChecklistScreen() {
	return (
		<div className="sck">
			{/* 마일스톤 헤더 — 체크리스트는 마일스톤에 종속 */}
			<div className="sck__mile">
				<span className="sck__mile-bar"></span>
				<div className="sck__mile-info">
					<span className="sck__mile-title">
						프로젝트, 체크리스트 기능
					</span>
					<span className="sck__mile-date">2026.02.10 ~ 2026.02.14</span>
				</div>
			</div>

			{/* 체크리스트 */}
			<div className="sck__head">
				<span className="sck__head-label">체크리스트</span>
				<span className="sck__add-btn">+</span>
			</div>
			<div className="sck__list">
				<div className="sck__item sck__item--done">
					<span className="sck__box">✓</span>
					<span className="sck__text">
						프로젝트 생성 4테이블 트랜잭션 처리
					</span>
					<span className="sck__x">✕</span>
				</div>
				<div className="sck__item sck__item--done">
					<span className="sck__box">✓</span>
					<span className="sck__text">단계별 INSERT 후 외래키 연결</span>
					<span className="sck__x">✕</span>
				</div>
				<div className="sck__item sck__item--done">
					<span className="sck__box">✓</span>
					<span className="sck__text">실패 시 전체 롤백</span>
					<span className="sck__x">✕</span>
				</div>
				<div className="sck__item sck__item--done">
					<span className="sck__box">✓</span>
					<span className="sck__text">PM 권한 체크, 유효성 검사</span>
					<span className="sck__x">✕</span>
				</div>
				<div className="sck__item sck__item--done">
					<span className="sck__box">✓</span>
					<span className="sck__text">
						체크리스트 CRUD (단건, 다건 등록)
					</span>
					<span className="sck__x">✕</span>
				</div>
				<div className="sck__item sck__item--done">
					<span className="sck__box">✓</span>
					<span className="sck__text">완료 여부 즉시 반영</span>
					<span className="sck__x">✕</span>
				</div>
			</div>
		</div>
	);
}
