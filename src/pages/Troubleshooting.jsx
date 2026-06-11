export default function Troubleshooting({ active }) {
  return (
    <section className="page" id="troubleshooting" hidden={!active}>
      <header className="page__head">
        <h1 className="page__title">트러블슈팅</h1>
        <p className="page__desc">개발 중 마주친 문제와 해결 과정.</p>
      </header>
      <div className="doc-block doc-block--flush">
        <article className="ts-card">
          <h2 className="ts-card__title">① 환불 시 포인트가 사라지던 문제</h2>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--symptom">증상</span>
            <p>
              환불 시 사용했던 포인트를 복원했는데, 복원되자마자 다시 사라졌다.
              에러는 발생하지 않아 원인이 보이지 않았다.
            </p>
          </div>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--cause">원인</span>
            <p>
              환불 처리에서 두 작업이 같은 종류의 포인트(EARN/SAVE)를 건드렸다.
              refundUsedPoint는 사용 포인트를 새 적립(EARN)으로 복원하고,
              cancelEarnedPoint는 이 결제의 적립(EARN) 포인트를 전부 취소한다.
              복원을 먼저 하면 뒤이은 적립 취소가 방금 복원한 포인트까지 같이
              지웠다.
            </p>
          </div>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--fix">해결</span>
            <p>
              실행 순서를 "적립 취소 → 사용 복원"으로 고정. 취소가 먼저 끝난 뒤
              복원하므로 복원분이 취소 대상에서 빠진다.
            </p>
          </div>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--learn">배운 점</span>
            <p>
              에러가 없어도 결과가 틀릴 수 있다. 증상이 아니라 전체 흐름을 끝까지
              따라가야 진짜 원인이 잡힌다.
            </p>
          </div>
        </article>

        <article className="ts-card">
          <h2 className="ts-card__title">② 매출 통계 값이 음수로 뒤집히던 문제</h2>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--symptom">증상</span>
            <p>
              대량 더미 데이터로 테스트하던 중 일 매출 합계가 음수로 표시됐다.
            </p>
          </div>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--cause">원인</span>
            <p>
              매출 합계가 int 한계(약 21억)를 초과하면서 값이 음수로 오버플로됐다.
            </p>
          </div>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--fix">해결</span>
            <p>
              금액 필드를 Long으로 변경. 문제가 된 필드만이 아니라 같은 금액을
              다루는 다른 필드까지 일관되게 맞춰 재발을 방지했다.
            </p>
          </div>
          <div className="ts-step">
            <span className="ts-step__label ts-step__label--learn">배운 점</span>
            <p>
              평소 데이터로는 안 보이는 문제가 한계 상황에서 드러난다. 기능 완성
              후 일부러 과부하를 만들어 약점을 미리 찾는 습관이 생겼다.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
