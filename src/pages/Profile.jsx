export default function Profile({ active }) {
	return (
		<section className="page" id="profile" hidden={!active}>
			<div className="doc-block">
				{/* 이름 + 한 줄 소개 (상단 강조) */}
				<header className="profile-hero">
					<h1 className="profile-name">김우영</h1>
					<p className="profile-tagline">GTM 태그 너머가 궁금했던 마케터, 백엔드에서 그 코드를 직접 만듭니다</p>
				</header>

				<dl className="def-list">
					<div className="def-list__row">
						<dt>이메일</dt>
						<dd>black9081@kakao.com</dd>
					</div>
					<div className="def-list__row">
						<dt>연락처</dt>
						<dd>010-5041-9633</dd>
					</div>
					<div className="def-list__row">
						<dt>소개</dt>
						<dd>
							마케팅에서 개발로 전환해, 안정적인 코드를 고민하는 백엔드
							개발자입니다.
						</dd>
					</div>
					<div className="def-list__row">
						<dt>학력</dt>
						<dd>
							고려사이버대학교 소프트웨어공학과 (졸업예정)
							<br />
							인천고등학교 졸업
						</dd>
					</div>
					<div className="def-list__row">
						<dt>교육 / 수료</dt>
						<dd>KH정보교육원 AWS 클라우드 DevOps 과정 (수료)</dd>
					</div>
					<div className="def-list__row">
						<dt>사회경험</dt>
						<dd>
							2025.05 ~ 2025.09 가연결혼정보회사 / 퍼포먼스 마케팅 / 대리
							<br />
							2024.10 ~ 2025.05 주식회사 온리프앤파트너스 / 퍼포먼스 마케팅 /
							대리
							<br />
							2021.08 ~ 2024.10 (주)탑코 / 퍼포먼스 마케팅 / 사원
						</dd>
					</div>
					<div className="def-list__row">
						<dt>GitHub</dt>
						<dd className="def-list__links">
							<a
								className="def-list__link"
								href="https://github.com/blackbean9081-svg/TaskFlow.git"
								target="_blank"
								rel="noopener noreferrer"
							>
								세미 프로젝트 (TaskFlow)
							</a>
							<span className="def-list__sep">/</span>
							<a
								className="def-list__link"
								href="https://github.com/bobohyeon/Sloway_Project.git"
								target="_blank"
								rel="noopener noreferrer"
							>
								파이널 프로젝트 (Sloway)
							</a>
						</dd>
					</div>
				</dl>
			</div>
		</section>
	);
}
