// 성능 개선 — 매출 통계(GROUP BY) 1건 + 어드민 목록 N+1(fetch join) 1건(결제·환불 통합)
// headline = 성과 한 줄(두괄식). 면접관이 성과를 먼저 보도록 카드 최상단에 큰 글씨로 노출.
// items = 한 카드 안에 묶이는 세부 항목(결제·환불처럼 같은 기법이면 한 카드에 위아래로).
const CASES = [
  {
    headline: '8.9배 빨라진 매출 통계 조회',
    title: '호스트 매출 추이 통계',
    tag: 'GROUP BY',
    items: [
      {
        file: 'StatsService.findHostSalesStats',
        problem:
          '6개월 매출 추이를 월·공간 타입마다 쿼리를 따로 날려, 1회 조회에 18개 쿼리가 실행됐다.',
        solve:
          '월별 집계를 to_char + GROUP BY 한 쿼리로 묶어, 1회 조회당 쿼리를 18 → 1개로 축소.',
        before: '2,999 ms / 회 · 18쿼리',
        after: '338 ms / 회 · 1쿼리',
        note: '100회 반복 · 10만 건 기준',
      },
    ],
  },
  {
    headline: 'N+1 문제 해결로 성능 개선',
    title: '어드민 목록 N+1',
    tag: 'fetch join',
    items: [
      {
        subtitle: '결제 목록',
        file: 'PayService.findPayAll',
        problem:
          '결제마다 예약·회원·공간을 LAZY로 따로 조회해, 목록 한 페이지에 N+1 쿼리가 터졌다.',
        solve:
          '예약·회원·공간을 fetch join으로 한 번에 가져와, 목록·count 2쿼리로 축소.',
        before: '32쿼리 · 8.696 ms',
        after: '2쿼리 · 5.408 ms',
        note: '페이지 10건 기준 (100건 시 202→2쿼리)',
      },
      {
        subtitle: '환불 목록',
        file: 'RefundService.findRefundAll',
        problem:
          '환불 목록도 같은 N+1 구조에 서버 페이징조차 없어, 전체를 한 번에 조회했다.',
        solve:
          '결제 목록과 같은 fetch join + 서버 페이징을 추가해, N+1과 전체 로딩을 동시에 해소.',
        before: '약 301쿼리 · 전체 조회',
        after: '2쿼리 · 페이징 적용',
        note: '결제 목록과 동일 fetch join 기법',
      },
    ],
  },
];

export default function Performance({ active }) {
  return (
    <section className="page" id="performance" hidden={!active}>
      <header className="page__head">
        <h1 className="page__title">성능 개선</h1>
        <p className="page__desc">
          쿼리 최적화 — 측정 전/후 (GROUP BY · fetch join).
        </p>
      </header>

      <div className="doc-block doc-block--flush perf">
        {CASES.map((c) => (
          <article className="perf-case" key={c.headline}>
            {/* 두괄식 — 성과를 맨 위에 크게 */}
            <div className="perf-case__headline">{c.headline}</div>
            <div className="perf-case__sub">
              <span className="perf-case__title">{c.title}</span>
              <span className="perf-case__tag">{c.tag}</span>
            </div>

            {c.items.map((it) => (
              <div className="perf-case__item" key={it.file}>
                {it.subtitle && (
                  <div className="perf-case__item-title">{it.subtitle}</div>
                )}
                <code className="perf-case__file">{it.file}</code>

                <div className="perf-case__body">
                  <div className="perf-case__row">
                    <span className="perf-case__label perf-case__label--problem">
                      문제
                    </span>
                    <p>{it.problem}</p>
                  </div>
                  <div className="perf-case__row">
                    <span className="perf-case__label perf-case__label--solve">
                      개선
                    </span>
                    <p>{it.solve}</p>
                  </div>
                </div>

                <div className="perf-metric">
                  <div className="perf-metric__ba">
                    <div className="perf-metric__before">
                      <span>개선 전</span>
                      <strong>{it.before}</strong>
                    </div>
                    <span className="perf-metric__arrow">→</span>
                    <div className="perf-metric__after">
                      <span>개선 후</span>
                      <strong>{it.after}</strong>
                    </div>
                  </div>
                  <div className="perf-metric__note">{it.note}</div>
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
