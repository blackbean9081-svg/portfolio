import Func from "../components/Func.jsx";

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
			<header className="page__head">
				<h1 className="page__title">체크리스트</h1>
				<p className="page__desc">
					세미 프로젝트 (TaskFlow) — 단건·다건 등록 + 완료 여부 즉시 반영 + 논리
					삭제.
				</p>
			</header>

			<div className="pay2">
				{/* ===== 왼쪽: 마일스톤 패널 + 체크리스트 재현 (mile/list.jsp 내장) ===== */}
				<div className="sck">
					{/* 마일스톤 헤더 — 체크리스트는 마일스톤에 종속 */}
					<div className="sck__mile">
						<span className="sck__mile-bar"></span>
						<div className="sck__mile-info">
							<span className="sck__mile-title">
								프로젝트 · 체크리스트 기능
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
							<span className="sck__text">PM 권한 체크 · 유효성 검사</span>
							<span className="sck__x">✕</span>
						</div>
						<div className="sck__item sck__item--done">
							<span className="sck__box">✓</span>
							<span className="sck__text">
								체크리스트 CRUD (단건·다건 등록)
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

				{/* ===== 오른쪽: 기능 목록 (아코디언) ===== */}
				<div className="pay2__right">
					<Func
						rich
						defaultOpen
						name="단건 · 다건 등록"
						desc="항목 1개는 단건 INSERT 후 채번한 PK를 VO에 되돌려 즉시 렌더에 쓰고, 마일스톤 생성 시에는 여러 항목을 한 트랜잭션으로 일괄 INSERT합니다."
						file="CheckService.java"
						code={CODE_INSERT}
					/>
					<Func
						rich
						name="완료 여부 즉시 반영"
						desc="체크박스를 토글하면 completeYn 컬럼만 UPDATE해, 전체 항목을 다시 저장하지 않고 상태를 즉시 반영합니다."
						file="CheckService.java"
						code={CODE_TOGGLE}
					/>
					<Func
						rich
						name="수정 / 논리 삭제"
						desc="삭제는 실제 행을 지우지 않고 delAt 컬럼을 채우는 논리 삭제로 처리해, 데이터를 보존하면서 이력을 추적할 수 있게 했습니다."
						file="CheckService.java"
						code={CODE_DELETE}
					/>
				</div>
			</div>
		</section>
	);
}
