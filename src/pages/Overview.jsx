export default function Overview({ active }) {
	return (
		<section className="page" id="overview" hidden={!active}>
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
						기업 협업 도구 · 5계층 일관 구조(Vo/Mapper/Service/REST/View) ·
						임직원·고객 2종 인증
					</p>

					<dl className="def-list">
						<div className="def-list__row">
							<dt>기획의도</dt>
							<dd>
								프로젝트·마일스톤·일정·인원을 한곳에서 관리하는 기업 협업 도구
							</dd>
						</div>
						<div className="def-list__row">
							<dt>기간</dt>
							<dd>2026.02.09 ~ 2026.03.24</dd>
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
								설계·관리했다.
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
								<span className="impl__dom">회사·조직</span>
								<span className="impl__feat">
									회사·부서·직원·고객·회의실 관리, 권한(role) 체계
								</span>
							</div>
							<div className="impl__row impl__row--mine">
								<span className="impl__dom">프로젝트 관리 👤</span>
								<span className="impl__feat">
									프로젝트 생성·수정·삭제(4테이블 트랜잭션), 마일스톤,
									체크리스트
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">일정·캘린더</span>
								<span className="impl__feat">
									개인 일정, 할 일, 회의실 예약, 통합 캘린더(FullCalendar)
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">커뮤니티</span>
								<span className="impl__feat">게시판, 공지, FAQ, Q&A, 알림</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">시스템·공통</span>
								<span className="impl__feat">
									인증 인터셉터, 비속어 필터, 페이징, 전역 예외 처리
								</span>
							</div>
						</div>
						<div className="impl__mine">
							<div className="impl__mine-head">👤 본인 담당</div>
							<div className="impl__mine-body">
								프로젝트 관리(생성·수정·삭제 트랜잭션) + 체크리스트 +
								형상관리자(Git Flow)
							</div>
						</div>
					</div>
				</article>

				{/* ===== 파이널 프로젝트 — Sloway ===== */}
				<article className="proj">
					<div className="proj__head">
						<span className="proj__tag proj__tag--final">파이널 프로젝트</span>
						<h2 className="proj__name">Sloway</h2>
					</div>
					<p className="proj__subtitle">
						워케이션 공간 예약 플랫폼 · 5인 팀 · 외부 PG 연동 · 클라우드 배포
					</p>

					<dl className="def-list">
						<div className="def-list__row">
							<dt>기획의도</dt>
							<dd>
								숙소·코워킹오피스·워크앤스테이 공간을 검색·예약하고, 결제부터
								환불·정산까지 한 번에 처리하는 워케이션 예약 플랫폼
							</dd>
						</div>
						<div className="def-list__row">
							<dt>기간</dt>
							<dd>2026.04.27 ~ 2026.06.24</dd>
						</div>
						<div className="def-list__row">
							<dt>팀 구성 / 역할</dt>
							<dd>5인 / 조장 / 결제·환불·정산·통계 도메인 단독 개발</dd>
						</div>
						<div className="def-list__row">
							<dt>핵심 경험</dt>
							<dd>
								결제부터 환불·정산까지 이어지는 거래 흐름 전체를 단독으로
								구현하며, 시스템이 어떻게 맞물려 도는지 보는 눈을 길렀다. 외부
								PG는 모의 결제로 흐름을 먼저 검증한 뒤 실제 연동에 들어가, 문제
								추적을 쉽게 했다.
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
								<span className="impl__dom">회원·인증·호스트·관리자</span>
								<span className="impl__feat">회원/호스트/관리자 인증·관리</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">공간</span>
								<span className="impl__feat">
									공간 등록·검수, 찜·추천, 편의시설
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">예약·리뷰·검색</span>
								<span className="impl__feat">
									예약, 리뷰, 블랙아웃, 공간 검색
								</span>
							</div>
							<div className="impl__row impl__row--mine">
								<span className="impl__dom">결제·환불·정산·통계</span>
								<span className="impl__feat">
									PG 결제, 환불, 자동 정산, 통계, 쿠폰·포인트
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">공지·문의·알림·채팅</span>
								<span className="impl__feat">공지, FAQ, 문의, 실시간 알림</span>
							</div>
						</div>
						<div className="impl__mine">
							<div className="impl__mine-head">👤 본인 담당</div>
							<ul className="impl__mine-list">
								<li>
									<strong>결제</strong> 카카오·토스 PG 연동, 쿠폰·포인트 통합
									결제, 중복결제 방어
								</li>
								<li>
									<strong>환불</strong> 정책표 기반 환불율, 8단계 통합
									처리(쿠폰· 포인트·PG)
								</li>
								<li>
									<strong>정산</strong> 4일 주기 자동 정산 배치, 수수료 정책,
									carry-over 이월
								</li>
								<li>
									<strong>통계</strong> 일별 사전집계, 매출·예약 통계, 성능 개선
								</li>
							</ul>
						</div>
					</div>
				</article>
			</div>
		</section>
	);
}
