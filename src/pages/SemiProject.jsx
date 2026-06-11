import Func from "../components/Func.jsx";

// ── 백엔드 원본 코드 (ProjService.java) — 있는 그대로 ──
const CODE_INSERT = `    // 프로젝트 1건 생성
    @Transactional
    public int insert(ProjVo projVo, ProjEmplVo projEmplVo, ProjDeptVo projDeptVo, ProjScheVo projScheVo, HttpSession session) {
        SessionUtil.checkPmRole(session);   // PM 권한 검증
        validateProj(projVo);               // 필수값·날짜 유효성 검사
        // 하나라도 실패하면 IllegalArgumentException 으로 전부 롤백
        int result1 = insertProj(projVo);
        int result2 = insertProjDept(projVo, projDeptVo);
        int result3 = insertProjSche(projDeptVo, projScheVo);
        int result4 = insertProjEmpl(projVo, projEmplVo);
        return result1 + result2 + result3 + result4;
    }`;

const CODE_UPDATE = `// 프로젝트 수정
@Transactional
public int update(ProjVo projVo, ProjEmplVo projEmplVo, ProjDeptVo projDeptVo, ProjScheVo projScheVo) {
    String projNo = String.valueOf(projVo.getNo());
    validateProj(projVo);
    // 프로젝트 기본 정보
    updateProj(projVo);
    // 담당 부서
    updateProjDept(projDeptVo, projNo);
    // 일정
    updateProjSche(projScheVo, projNo);

    // 담당자(PM) : 기존에 있으면 UPDATE, 없으면 INSERT (upsert)
    projEmplVo.setProjNo(projNo);
    ProjEmplVo checkManagerY = projMapper.selectProjEmplVoByNo(projNo);
    if (checkManagerY == null) {
        insertNewManager(projEmplVo);
    } else {
        updateProjEmpl(projEmplVo, projNo);
    }
    return 1;
}`;

const CODE_DELETE = `
    @Transactional
    public int delete(String projNo, HttpSession session) {
        SessionUtil.checkPmRole(session);
        ProjVo projVo = projMapper.selectProjVoByNo(projNo);
        if (projVo == null) {
            throw new IllegalArgumentException("[PROJ-400] 존재하지 않는 프로젝트입니다.");
        }
        int result1 = deleteProj(projNo);
        int result2 = deleteProjDept(projNo);
        int result3 = deleteProjSche(projNo);
        int result4 = deleteProjEmpl(projNo);
        return result1 + result2 + result3 + result4;
    }`;

export default function SemiProject({ active }) {
	return (
		<section className="page" id="semi-project" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">프로젝트 관리</h1>
				<p className="page__desc">
					세미 프로젝트 (TaskFlow) — 프로젝트 생성·수정·삭제를 4개 테이블
					트랜잭션으로 처리.
				</p>
			</header>

			<div className="pay2">
				{/* ===== 왼쪽: 등록 패널 + 수정 패널 (실제 생성 패널 스타일) ===== */}
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

				{/* ===== 오른쪽: 기능 목록 (아코디언) ===== */}
				<div className="pay2__right">
					<Func
						rich
						defaultOpen
						name="프로젝트 생성 (4테이블 트랜잭션)"
						desc="PM 권한과 필수값·날짜를 검증한 뒤, 프로젝트·부서·일정·담당자 4개 테이블 INSERT를 하나의 트랜잭션으로 묶어 하나라도 실패하면 전부 롤백합니다."
						file="ProjService.java"
						code={CODE_INSERT}
					/>
					<Func
						rich
						name="프로젝트 수정 (담당자 upsert)"
						desc="생성과 같은 VO를 재사용해 프로젝트·부서·일정을 수정하고, 담당자(PM)는 기존에 있으면 UPDATE·없으면 INSERT하는 upsert로 처리합니다."
						file="ProjService.java"
						code={CODE_UPDATE}
					/>
					<Func
						rich
						name="프로젝트 삭제 (역순 4테이블)"
						desc="삭제도 연결된 4개 테이블을 한 트랜잭션으로 함께 제거해, 고아 데이터가 남지 않도록 처리합니다."
						file="ProjService.java"
						code={CODE_DELETE}
					/>
				</div>
			</div>
		</section>
	);
}
