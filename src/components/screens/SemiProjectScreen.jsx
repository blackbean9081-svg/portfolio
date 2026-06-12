// 등록 패널 + 수정 패널 (실제 생성 패널 스타일) — SemiProject 페이지 왼쪽 목업.
// 정적 화면 재현이라 props 없음. 마크업·className 은 기존 그대로(screens.css 선택자 유지).
export default function SemiProjectScreen() {
	return (
		<div className="spj-stack">
			{/* 등록 패널 */}
			<div className="spj">
				<div className="spj__head">
					<span className="spj__badge">등록</span>
					<input
						className="spj__panel-title"
						value="2026 사내 협업툴 구축"
						readOnly
					/>
				</div>

				<div className="spj__form">
					<div className="spj__field">
						<label>
							프로젝트명 <span className="spj__req">*</span>
						</label>
						<div className="spj__input">2026 사내 협업툴 구축</div>
					</div>
					<div className="spj__field">
						<label>📅 일정</label>
						<div className="spj__input">2026.02.09 ~ 2026.03.24</div>
					</div>
					<div className="spj__field">
						<label>
							계약 <span className="spj__req">*</span>
						</label>
						<div className="spj__input">㈜TaskFlow — 협업툴 구축 계약</div>
					</div>
					<div className="spj__field">
						<label>🏢 담당 부서</label>
						<div className="spj__input">개발팀</div>
					</div>
					<div className="spj__field">
						<label>👤 PM</label>
						<div className="spj__input">김우영</div>
					</div>
				</div>

				{/* 한 번의 생성으로 묶이는 테이블 */}
				<div className="spj__tables">
					<div className="spj__tables-label">
						한 번의 생성으로 묶이는 테이블
					</div>
					<div className="spj__chips">
						<span className="spj__chip">PROJECT</span>
						<span className="spj__chip">PROJ_DEPT</span>
						<span className="spj__chip">PROJ_SCHE</span>
						<span className="spj__chip">PROJ_EMPL</span>
					</div>
				</div>

				<button className="spj__submit">작성하기</button>
			</div>

			{/* 수정 패널 */}
			<div className="spj">
				<div className="spj__head">
					<span className="spj__badge spj__badge--edit">수정</span>
					<input
						className="spj__panel-title"
						value="2026 사내 협업툴 구축 v2"
						readOnly
					/>
					<span className="spj__trash" title="삭제">🗑️</span>
				</div>

				<div className="spj__form">
					<div className="spj__field">
						<label>
							프로젝트명 <span className="spj__req">*</span>
						</label>
						<div className="spj__input">2026 사내 협업툴 구축 v2</div>
					</div>
					<div className="spj__field">
						<label>📅 일정</label>
						<div className="spj__input">2026.02.09 ~ 2026.04.10</div>
					</div>
					<div className="spj__field">
						<label>🏢 담당 부서</label>
						<div className="spj__input">개발팀</div>
					</div>
					<div className="spj__field">
						<label>👤 PM</label>
						<div className="spj__input">김우영</div>
					</div>
				</div>

				<div className="spj__actions">
					<button className="spj__delete">프로젝트 삭제</button>
					<button className="spj__submit">수정 완료</button>
				</div>
			</div>
		</div>
	);
}
