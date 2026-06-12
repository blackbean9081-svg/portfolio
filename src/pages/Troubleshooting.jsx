export default function Troubleshooting({ active }) {
	return (
		<section className="page" id="troubleshooting" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">트러블슈팅</h1>
				<p className="page__desc">개발 중 마주친 문제와 해결 과정입니다.</p>
			</header>
			<div className="doc-block doc-block--flush">
				<article className="ts-card">
					<h2 className="ts-card__title">① 환불 시 포인트가 사라지던 문제</h2>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--symptom">증상</span>
						<p>
							환불 시 사용했던 포인트를 복원했는데, 복원되자마자 다시
							사라졌습니다. 에러는 발생하지 않아 원인이 보이지 않았습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--cause">원인</span>
						<p>
							환불 처리에서 두 작업이 같은 종류의 포인트를 건드리고 있었습니다.
							사용 포인트 복원은 쓴 포인트를 새 적립으로 되살리고, 적립 취소는
							이 결제로 적립된 포인트를 전부 취소합니다. 복원을 먼저 하면 뒤이은
							적립 취소가 방금 복원한 포인트까지 같이 지웠습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--fix">해결</span>
						<p>
							실행 순서를 "적립 취소 → 사용 복원"으로 바로잡았습니다. 취소가
							먼저 끝난 뒤 복원하므로, 복원한 포인트가 취소 대상에서 빠집니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--learn">
							배운 점
						</span>
						<p>
							에러가 없어도 결과가 틀릴 수 있습니다. 증상이 아니라 전체 흐름을
							끝까지 따라가야 진짜 원인이 잡힌다는 것을 배웠습니다.
						</p>
					</div>
				</article>

				<article className="ts-card">
					<h2 className="ts-card__title">
						② 환불 시 만료된 쿠폰이 되살아나던 문제
					</h2>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--symptom">증상</span>
						<p>
							환불할 때 사용했던 쿠폰을 되돌려주는데, 이미 유효기간이 지난
							쿠폰까지 "사용 가능" 상태로 복원되어, 만료된 쿠폰을 다시 쓸 수
							있는 상황이 생겼습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--cause">원인</span>
						<p>
							환불 시 쿠폰을 무조건 "사용 가능" 상태로 되돌리고 있었습니다. 결제
							직후 바로 환불하면 문제없지만, 환불이 한참 뒤에 일어나면 그 사이
							만료된 쿠폰까지 되살아났습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--fix">해결</span>
						<p>
							쿠폰을 되돌릴 때 환불 시점의 유효기간을 확인해, 만료됐으면 만료
							상태로, 아직 유효하면 사용 가능 상태로 분기 처리했습니다. 만료된
							쿠폰은 부활하지 않도록 막았습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--learn">
							배운 점
						</span>
						<p>
							"지금 당장은 괜찮은" 처리가 시간이 지나면 문제가 될 수 있다는 것을
							배웠습니다. 기능을 만들 때 "환불이 늦게 일어나면?" 같은 시간차
							상황까지 고려해야 한다는 것을 알게 됐습니다.
						</p>
					</div>
				</article>

				<article className="ts-card">
					<h2 className="ts-card__title">
						③ 매출 통계 값이 음수로 뒤집히던 문제
					</h2>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--symptom">증상</span>
						<p>
							대량 더미 데이터로 테스트하던 중 일 매출 합계가 음수로
							표시됐습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--cause">원인</span>
						<p>
							매출 합계가 int 한계(약 21억)를 초과하면서 값이 음수로
							오버플로됐습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--fix">해결</span>
						<p>
							금액 필드를 Long으로 변경했습니다. 문제가 된 필드만이 아니라 같은
							금액을 다루는 다른 필드까지 일관되게 맞춰 재발을 방지했습니다.
						</p>
					</div>
					<div className="ts-step">
						<span className="ts-step__label ts-step__label--learn">
							배운 점
						</span>
						<p>
							평소 데이터로는 안 보이는 문제가 한계 상황에서 드러납니다. 기능
							완성 후 일부러 과부하를 만들어 약점을 미리 찾는 습관이 생겼습니다.
						</p>
					</div>
				</article>
			</div>
		</section>
	);
}
