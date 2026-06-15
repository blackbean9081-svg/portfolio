export default function SemiOverview({ active }) {
	return (
		<section className="page" id="semi-overview" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">프로젝트 개요</h1>
			</header>

			<div className="doc-block">
				{/* ===== 세미 프로젝트 — TaskFlow ===== */}
				<article className="proj">
					<div className="proj__head">
						<span className="proj__tag proj__tag--semi">세미 프로젝트</span>
						<h2 className="proj__name">TaskFlow</h2>
					</div>
					<p className="proj__subtitle">
						5계층 일관 구조(Vo/Mapper/Service/REST/View)로 만든 기업 협업
						도구로, 임직원과 고객 2종 인증을 지원합니다.
					</p>

					<dl className="def-list">
						<div className="def-list__row">
							<dt>기획의도</dt>
							<dd>
								프로젝트, 마일스톤, 일정, 인원을 한곳에서 관리하는 기업 협업 도구
							</dd>
						</div>
						<div className="def-list__row">
							<dt>기간</dt>
							<dd>2026.02.09 ~ 2026.03.24 - 7주 </dd>
						</div>
						<div className="def-list__row">
							<dt>팀 구성 / 역할</dt>
							<dd>형상관리자 + 프로젝트 기능 담당</dd>
						</div>
						<div className="def-list__row">
							<dt>핵심 경험</dt>
							<dd>
								여러 테이블이 순서대로 엮인 기능을 맡으며 데이터 흐름을 설계하는
								감각을 익혔고, 형상관리자로서 팀 전체의 협업 흐름을
								설계, 관리했습니다.
							</dd>
						</div>
					</dl>

					{/* 구현 기능 */}
					<div className="impl">
						<div className="impl__title">구현 기능</div>
						<div className="impl__table impl--2">
							<div className="impl__row impl__row--head">
								<span>도메인</span>
								<span>주요 기능</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">회사, 조직</span>
								<span className="impl__feat">
									회사, 부서, 직원, 고객, 회의실 관리, 권한(role) 체계
								</span>
							</div>
							<div className="impl__row impl__row--mine">
								<span className="impl__dom">프로젝트 관리</span>
								<span className="impl__feat">
									프로젝트 생성, 수정, 삭제(4테이블 트랜잭션), 마일스톤,
									체크리스트
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">일정, 캘린더</span>
								<span className="impl__feat">
									개인 일정, 할 일, 회의실 예약, 통합 캘린더(FullCalendar)
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">커뮤니티</span>
								<span className="impl__feat">게시판, 공지, FAQ, Q&A, 알림</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">시스템, 공통</span>
								<span className="impl__feat">
									인증 인터셉터, 비속어 필터, 페이징, 전역 예외 처리
								</span>
							</div>
						</div>
						<div className="impl__mine">
							<div className="impl__mine-head">본인 담당</div>
							<div className="impl__mine-body">
								프로젝트 관리(생성, 수정, 삭제 트랜잭션) + 체크리스트 +
								형상관리자(Git Flow)
							</div>
						</div>
					</div>
				</article>
			</div>
		</section>
	);
}
