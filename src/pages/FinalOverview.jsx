export default function FinalOverview({ active }) {
	return (
		<section className="page" id="final-overview" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">프로젝트 개요</h1>
			</header>

			<div className="doc-block">
				{/* ===== 파이널 프로젝트 — Sloway ===== */}
				<article className="proj">
					<div className="proj__head">
						<span className="proj__tag proj__tag--final">파이널 프로젝트</span>
						<h2 className="proj__name">Sloway</h2>
					</div>
					<p className="proj__subtitle">
						5인 팀으로 개발한 워케이션 공간 예약 플랫폼으로, 외부 PG를 연동하고
						클라우드에 배포했습니다.
					</p>

					<dl className="def-list">
						<div className="def-list__row">
							<dt>기획의도</dt>
							<dd>
								숙소, 오피스, 워크앤스테이 공간을 검색하고 예약하며, 결제부터
								환불, 정산까지 한 번에 처리하는 워케이션 예약 플랫폼
							</dd>
						</div>
						<div className="def-list__row">
							<dt>기간</dt>
							<dd>2026.04.27 ~ 2026.06.24 (8주)</dd>
						</div>
						<div className="def-list__row">
							<dt>팀 구성 / 역할</dt>
							<dd>5인 / 조장 / 결제, 환불, 정산, 통계 도메인 단독 개발</dd>
						</div>
						<div className="def-list__row">
							<dt>핵심 경험</dt>
							<dd>
								결제는 서비스의 코어 기능입니다. 그 결제를 중심으로 환불과
								정산까지 단독으로 담당했습니다.
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
								<span className="impl__dom">회원, 인증</span>
								<span className="impl__feat">
									회원/호스트/관리자 인증, 관리
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">공간</span>
								<span className="impl__feat">
									공간 등록, 검수, 찜, 추천, 편의시설
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">예약, 리뷰, 검색</span>
								<span className="impl__feat">
									예약, 리뷰, 블랙아웃, 공간 검색
								</span>
							</div>
							<div className="impl__row impl__row--mine">
								<span className="impl__dom">결제, 환불, 정산, 통계</span>
								<span className="impl__feat">
									결제, 환불, 자동 정산, 통계, 쿠폰, 포인트
								</span>
							</div>
							<div className="impl__row">
								<span className="impl__dom">공지, 문의, 알림, 채팅</span>
								<span className="impl__feat">공지, FAQ, 문의, 실시간 알림</span>
							</div>
						</div>
						<div className="impl__mine">
							<div className="impl__mine-head">본인 담당</div>
							<ul className="impl__mine-list">
								<li>
									<strong>결제</strong> 쿠폰과 포인트를 반영한 결제 처리 (검증,
									승인, 완료)
								</li>
								<li>
									<strong>환불</strong> 정책에 따른 환불 처리
								</li>
								<li>
									<strong>정산</strong> 주기적으로 이뤄지는 자동 정산
								</li>
								<li>
									<strong>통계</strong> 매출과 예약을 매일, 매월 집계
								</li>
							</ul>
						</div>
					</div>
				</article>
			</div>
		</section>
	);
}
