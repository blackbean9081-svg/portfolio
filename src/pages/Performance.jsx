import { useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';

// ── 측정 테스트 코드 (실제 파일에서 핵심부 발췌 — 워밍업 → 반복 측정 루프 → 결과 출력) ──
// 매출 통계 카드 → HostSalesStatsPerfTest.compareTrendQueryPerformance()
const CODE_STATS = `    @Test
    void compareTrendQueryPerformance() {
        // (생략)

        // 3) 워밍업 — JIT 컴파일·커넥션 풀·DB 버퍼 캐시 예열
        for (int i = 0; i < WARMUP; i++) {
            trendBefore(nos, ym);
            em.clear();
            trendAfter(nos, start, end, ym);
            em.clear();
        }

        // 4) 개선 전(18쿼리/회) ITERATIONS 번 측정 — 매 반복 후 1차 캐시 비움
        long t1 = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) {
            trendBefore(nos, ym);
            em.clear();
        }
        long beforeNanos = System.nanoTime() - t1;

        // 5) 개선 후(1쿼리/회) ITERATIONS 번 측정 — 매 반복 후 1차 캐시 비움
        long t2 = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) {
            trendAfter(nos, start, end, ym);
            em.clear();
        }
        long afterNanos = System.nanoTime() - t2;

        // 6) 결과 출력
        double beforeMs = beforeNanos / 1_000_000.0;
        double afterMs = afterNanos / 1_000_000.0;
        System.out.println();
        System.out.println("========== 호스트 매출 추이 쿼리 성능 비교 ==========");
        System.out.printf("반복 횟수          : %,d 회%n", ITERATIONS);
        System.out.printf("개선 전 (18쿼리/회) : 총 %,.1f ms | 평균 %.3f ms/회 | 누적 쿼리 %,d 개%n",
                beforeMs, beforeMs / ITERATIONS, ITERATIONS * 3L * MONTHS);
        System.out.printf("개선 후 (1쿼리/회)  : 총 %,.1f ms | 평균 %.3f ms/회 | 누적 쿼리 %,d 개%n",
                afterMs, afterMs / ITERATIONS, (long) ITERATIONS);
        System.out.printf("개선 배율          : %.1f 배 빠름 (%.1f%% 단축)%n",
                beforeMs / afterMs, (1 - afterMs / beforeMs) * 100);
        System.out.println("====================================================");
        System.out.println();
    }`;

// N+1 카드 → AdminListFetchJoinPerfTest.run() + countQueries()
const CODE_NPLUS1 = `    // 공통 측정 루틴 — 결과 동일성 검증 → 쿼리 수 측정 → 시간 측정 → 출력
    private void run(String label, Supplier<List<?>> before, Supplier<List<?>> after) {
        // (생략)

        // 2) 쿼리 수 측정 — before/after 각 1회, Statistics 의 PrepareStatementCount 차이
        long beforeQueries = countQueries(before);
        long afterQueries = countQueries(after);

        // 3) 워밍업
        for (int i = 0; i < WARMUP; i++) {
            tx.execute(s -> before.get());
            tx.execute(s -> after.get());
        }

        // 4) 시간 측정 — 매 회차 별도 트랜잭션(1차 캐시 격리)
        long t1 = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) tx.execute(s -> before.get());
        double beforeMs = (System.nanoTime() - t1) / 1_000_000.0;

        long t2 = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) tx.execute(s -> after.get());
        double afterMs = (System.nanoTime() - t2) / 1_000_000.0;

        // 5) 출력
        System.out.printf("페이지 크기        : %d 행%n", PAGE_SIZE);
        System.out.printf("반복 횟수          : %,d 회%n", ITERATIONS);
        System.out.printf("개선 전 (N+1)      : %,d 쿼리/회 | 총 %,.1f ms | 평균 %.3f ms/회%n",
                beforeQueries, beforeMs, beforeMs / ITERATIONS);
        System.out.printf("개선 후 (fetchJoin): %,d 쿼리/회 | 총 %,.1f ms | 평균 %.3f ms/회%n",
                afterQueries, afterMs, afterMs / ITERATIONS);
        System.out.printf("쿼리 수 감소       : %,d → %,d (%.1f배)%n",
                beforeQueries, afterQueries, afterQueries == 0 ? 0 : (double) beforeQueries / afterQueries);
        System.out.printf("시간 개선          : %.1f배 빠름 (%.1f%% 단축)%n",
                afterMs == 0 ? 0 : beforeMs / afterMs, afterMs == 0 ? 0 : (1 - afterMs / beforeMs) * 100);
        System.out.println("================================================================");
    }

    // Statistics 로 한 회차의 실행 쿼리(PreparedStatement) 수를 센다
    private long countQueries(Supplier<List<?>> work) {
        Statistics stats = emf.unwrap(SessionFactory.class).getStatistics();
        stats.setStatisticsEnabled(true);
        stats.clear();
        tx.execute(s -> work.get());
        return stats.getPrepareStatementCount();
    }`;

// 성능 개선 — 매출 통계(GROUP BY) 1건 + 어드민 목록 N+1(fetch join) 1건(결제·환불 통합)
// headline = 성과 한 줄(두괄식). 면접관이 성과를 먼저 보도록 카드 최상단에 큰 글씨로 노출.
// items = 한 카드 안에 묶이는 세부 항목(결제·환불처럼 같은 기법이면 한 카드에 위아래로).
// measure = 측정 방법 한 줄(증빙). code = 측정 테스트 코드(실제 파일 발췌).
const CASES = [
  {
    headline: '8.9배 빨라진 매출 통계 조회',
    title: '호스트 매출 추이 통계',
    tag: 'GROUP BY',
    measure:
      '측정: System.nanoTime 100회 반복 평균. 매 회차 영속성 컨텍스트(1차 캐시) 초기화로 독립 측정.',
    testFile: 'HostSalesStatsPerfTest.java',
    code: CODE_STATS,
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
    measure:
      '측정: Hibernate Statistics로 쿼리 수 집계 + nanoTime 시간 측정. 워밍업 후 100회 반복.',
    testFile: 'AdminListFetchJoinPerfTest.java',
    code: CODE_NPLUS1,
    items: [
      {
        subtitle: '환불 목록',
        file: 'RefundService.findRefundAll',
        problem:
          '환불 목록도 같은 N+1 구조에 서버 페이징조차 없어, 전체를 한 번에 조회했다.',
        solve:
          'fetch join으로 N+1을 없애고, 빠져 있던 서버 페이징까지 더해 전체 로딩 문제도 함께 해소.',
        before: '약 301쿼리 · 전체 조회',
        after: '2쿼리 · 페이징 적용',
        note: '결제 목록과 동일한 fetch join 기법',
      },
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
    ],
  },
];

// 측정 코드 보기 토글 — 누르면 측정 테스트 코드가 펼쳐진다(CodeBlock 재사용, 자체 스크롤).
function PerfCode({ file, code }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="perf-code">
      <button
        className={'perf-code__toggle' + (open ? ' is-open' : '')}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="perf-code__toggle-text">
          {open ? '측정 코드 접기' : '측정 코드 보기'}
        </span>
        <span className="perf-code__arrow">▾</span>
      </button>
      <div className="perf-code__body" hidden={!open}>
        <div className="perf-code__bar">
          <span className="perf-code__bar-name">측정 테스트</span>
          <span className="perf-code__bar-file">{file}</span>
        </div>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}

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

            {/* 측정 방법(증빙) 한 줄 — 측정 박스 아래 작게 */}
            <div className="perf-measure">
              <span className="perf-measure__label">측정 방법</span>
              <p className="perf-measure__text">{c.measure}</p>
            </div>

            {/* 측정 코드 보기 — 실제 테스트 파일 발췌 */}
            <PerfCode file={c.testFile} code={c.code} />
          </article>
        ))}
      </div>
    </section>
  );
}
