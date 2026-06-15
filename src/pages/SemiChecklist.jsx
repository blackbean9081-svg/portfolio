import Func from "../components/Func.jsx";
import PaneHead from "../components/PaneHead.jsx";
import SemiChecklistScreen from "../components/screens/SemiChecklistScreen.jsx";

// ── 백엔드 원본 코드 (CheckService.java) — 있는 그대로 ──
const CODE_INSERT = `    // 단건 등록 — INSERT 후 채번한 PK 를 VO 에 되돌려 담아 프론트 즉시 렌더에 사용
    @Transactional
    public int insert(CheckVo checkVo, HttpSession session) {
        SessionUtil.getLoginEmpl(session);
        int result = checkMapper.insert(checkVo);
        if (result == 1) {
            CheckVo checkNo = checkMapper.selectCheckNo();
            checkVo.setNo(checkNo.getNo());
        }
        return result;
    }

    // 다건 등록 — 마일스톤 생성 시 체크리스트 여러 개를 한 트랜잭션으로 INSERT
    @Transactional
    public int insertList(List<CheckVo> checkList, HttpSession session) {
        SessionUtil.getLoginEmpl(session);
        int result = 0;
        for (CheckVo checkVo : checkList) {
            result += checkMapper.insert(checkVo);
        }
        return result;
    }`;

const CODE_TOGGLE = `    // 완료 여부 즉시 반영 — 체크박스 토글 시 completeYn 만 UPDATE
    @Transactional
    public int updateCompleteYn(CheckVo checkVo, HttpSession session) {
        SessionUtil.getLoginEmpl(session);
        return checkMapper.updateCompleteYn(checkVo);
    }`;

const CODE_DELETE = `    // 수정 / 논리 삭제 — delAt 컬럼을 채워 실제 행은 보존(이력 추적)
    @Transactional
    public int update(CheckVo checkVo, HttpSession session) {
        SessionUtil.getLoginEmpl(session);
        return checkMapper.update(checkVo);
    }

    @Transactional
    public int delete(String no, HttpSession session) {
        SessionUtil.getLoginEmpl(session);
        return checkMapper.delete(no);
    }`;

export default function SemiChecklist({ active }) {
	return (
		<section className="page" id="semi-checklist" hidden={!active}>
			<div className="pay2">
				{/* ===== 왼쪽: 실제 서비스 화면 (마일스톤 + 체크리스트 재현) ===== */}
				<div className="pay2__left">
					<PaneHead
						title="체크리스트 화면"
						sub="실제 서비스 화면 (페이지 컴포넌트 재현)"
					/>
					<SemiChecklistScreen />
				</div>

				{/* ===== 오른쪽: 구현 코드 (아코디언) ===== */}
				<div className="pay2__right">
					<PaneHead title="구현 코드" sub="기능별 백엔드 코드" />
					<Func
						rich
						name="단건, 다건 등록"
						desc={"항목 1개는 단건 INSERT 후 채번한 PK를 VO에 되돌려 즉시 렌더에 쓰고,\n마일스톤 생성 시에는 여러 항목을 한 트랜잭션으로 일괄 INSERT합니다."}
						file="CheckService.java"
						code={CODE_INSERT}
						retro={"체크리스트를 하나씩도, 여러 개도 한 번에 등록할 수 있도록 구현했습니다."}
					/>
					<Func
						rich
						name="완료 여부 즉시 반영"
						desc={"체크박스를 토글하면 completeYn 컬럼만 UPDATE해,\n전체 항목을 다시 저장하지 않고 상태를 즉시 반영합니다."}
						file="CheckService.java"
						code={CODE_TOGGLE}
						retro={"체크 상태를 바로 반영해, 사용자가 체크하면 즉시 화면에 보이도록 했습니다."}
					/>
					<Func
						rich
						name="수정 / 논리 삭제"
						desc={"삭제는 실제 행을 지우지 않고 delAt 컬럼을 채우는 논리 삭제로 처리해,\n데이터를 보존하면서 이력을 추적할 수 있게 했습니다."}
						file="CheckService.java"
						code={CODE_DELETE}
					/>
				</div>
			</div>
		</section>
	);
}
