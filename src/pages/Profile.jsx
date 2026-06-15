export default function Profile({ active }) {
	return (
		<section className="page" id="profile" hidden={!active}>
			<div className="doc-block">
				{/* 이름 + 한 줄 소개 (상단 강조) */}
				<header className="profile-hero">
					<h1 className="profile-name">김우영</h1>
					<p className="profile-tagline">안정형 개발자</p>
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
							KH정보교육원 AWS 클라우드 DevOps 과정
						</dd>
					</div>
					{/* <div className="def-list__row">
						<dt>경력</dt>
						<dd>퍼포먼스 마케팅 (2021 ~ 2025)</dd>
					</div> */}
				</dl>
			</div>
		</section>
	);
}
