import Func from "../components/Func.jsx";
import PaneHead from "../components/PaneHead.jsx";
import SemiProjectScreen from "../components/screens/SemiProjectScreen.jsx";

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
			<div className="pay2">
				{/* ===== 왼쪽: 실제 서비스 화면 (등록 + 수정 패널 재현) ===== */}
				<div className="pay2__left">
					<PaneHead
						title="프로젝트 관리 화면"
						sub="실제 서비스 화면 (페이지 컴포넌트 재현)"
					/>
					<SemiProjectScreen />
				</div>

				{/* ===== 오른쪽: 구현 코드 (아코디언) ===== */}
				<div className="pay2__right">
					<PaneHead title="구현 코드" sub="기능별 백엔드 코드" />
					<Func
						rich
						name="프로젝트 생성 (4테이블 트랜잭션)"
						desc={
							"PM 권한과 필수값, 날짜를 검증한 뒤,\n프로젝트, 부서, 일정, 담당자 4개 테이블 INSERT를 하나의 트랜잭션으로\n 묶어 하나라도 실패하면 전부 롤백합니다."
						}
						file="ProjService.java"
						code={CODE_INSERT}
						retro={
							"프로젝트, 부서, 일정, 담당자 4개 테이블을 하나의 트랜잭션으로 처리했습니다.\n중간에 하나라도 실패하면 전체가 함께 롤백되도록 해, 데이터가 일부만 저장되는 상황을 막았습니다."
						}
					/>
					<Func
						rich
						name="프로젝트 수정 (담당자 upsert)"
						desc={
							"생성과 같은 VO를 재사용해 프로젝트, 부서, 일정을 수정하고,\n담당자(PM)는 기존에 있으면 UPDATE, 없으면 INSERT하는 upsert로 처리합니다."
						}
						file="ProjService.java"
						code={CODE_UPDATE}
						retro={
							"생성과 동일하게 4개 테이블을 한 트랜잭션으로 수정했습니다.\n담당자는 기존 여부에 따라 수정 또는 추가로 나눠 처리해, 담당자가 바뀌어도 데이터가 어긋나지 않게 했습니다."
						}
					/>
					<Func
						rich
						name="프로젝트 삭제 (역순 4테이블)"
						desc={
							"삭제도 연결된 4개 테이블을 한 트랜잭션으로 함께 제거해,\n데이터가 남지 않도록 처리합니다."
						}
						file="ProjService.java"
						code={CODE_DELETE}
						retro={
							"프로젝트를 삭제할 때 연결된 하위 데이터까지 함께 정리해, 남겨지는 데이터가 생기지 않도록 했습니다."
						}
					/>
				</div>
			</div>
		</section>
	);
}
