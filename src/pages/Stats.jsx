import Func from "../components/Func.jsx";

const CODE_LOAD = `// 하루치 통계를 미리 적재
@Transactional
public void loadDailyStats(LocalDate targetDate) {
    LocalDateTime startTime = targetDate.atStartOfDay();
    LocalDateTime endTime = targetDate.atTime(23, 59, 59);
    // 결제 통계
    List<Tuple> list = payRepository.sumByMethodBetween(startTime, endTime);
    for (Tuple tuple : list) {
        PayMethod payMethod = tuple.get(0, PayMethod.class);
        Long count = tuple.get(1, Long.class);
        Long sum = tuple.get(2, Long.class);
        // 같은 행이 있으면 update, 없으면 insert
        dailyPayStatsRepository
                .findByStatDateAndPayMethod(targetDate,
                        payMethod)
                .ifPresentOrElse(
                        entity ->
                                entity.updateStats(count.intValue(), sum),
                        () -> dailyPayStatsRepository.save(
                                DailyPayStatsEntity.builder()
                                        .statDate(targetDate)
                                        .payMethod(payMethod)
                                        .payCount(count.intValue())
                                        .totalAmt(sum)
                                        .build()
                        )
                );
    }
    // 환불 통계
    Tuple refundTuple = refundRepository.sumBetween(startTime,
            endTime);
    Long refundCount = refundTuple.get(0, Long.class);
    BigDecimal refundAmt = refundTuple.get(1, BigDecimal.class);
    // 결제 통계와 동일하게 적재
    dailyRefundStatsRepository.findByStatDate(targetDate)
            .ifPresentOrElse(
                    entity ->
                            entity.updateStats(refundCount.intValue(), refundAmt),
                    () -> dailyRefundStatsRepository.save(
                            DailyRefundStatsEntity.builder()
                                    .statDate(targetDate)
                                    .refundCount(refundCount.intValue())
                                    .refundAmt(refundAmt)
                                    .build()
                    )
            );
}`;

const CODE_HOST = `public HostSalesStatsResDto findHostSalesStats(Long memberNo, int year, int month, int months) {

    HostEntity hostEntity = hostRepository.findByMemberNo(memberNo)
            .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

    // 호스트의 승인된 공간 조회
    List<HostPlaceEntity> hostPlaces =
            hostPlaceRepository.findByHostEntityNoAndStatus(hostEntity.getNo(), ApprovalStatus.A);

    //오피스
    List<Long> officeNos = hostPlaces.stream()
            .filter(hp -> hp.getOfficeEntity() != null)
            .map(hp -> hp.getOfficeEntity().getNo())
            .distinct()
            .toList();

    //숙소
    List<Long> stationNos = hostPlaces.stream()
            .filter(hp -> hp.getStationEntity() != null)
            .map(hp -> hp.getStationEntity().getNo())
            .distinct()
            .toList();

    // 워크앤스테이
    List<Long> workStayNos = hostPlaces.stream()
            .filter(hp -> hp.getWorkStayEntity() != null)
            .map(hp -> hp.getWorkStayEntity().getNo())
            .distinct()
            .toList();

    // 조회 기간 : 기준 월부터 최근 몇 개월 기준
    YearMonth ym = YearMonth.of(year, month);
    LocalDateTime start = ym.minusMonths(months - 1).atDay(1).atStartOfDay();
    LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

    // 공간 타입별 매출 합산
    long officeAmt = payRepository.sumByOfficeIn(officeNos, start, end);
    long stationAmt = payRepository.sumByStationIn(stationNos, start, end);
    long workStayAmt = payRepository.sumByWorkStayIn(workStayNos, start, end);
    long totalAmt = officeAmt + stationAmt + workStayAmt;

    // 공간 타입별 환불액 합산
    long refundAmt = refundRepository.sumByOfficeIn(officeNos, start, end)
            .add(refundRepository.sumByStationIn(stationNos, start, end))
            .add(refundRepository.sumByWorkStayIn(workStayNos, start, end))
            .longValue();

    // 결제 건수 합산
    Long payCount = payRepository.sumSalesStatsByOfficeIn(officeNos, start, end)
            + payRepository.sumSalesStatsByStationIn(stationNos, start, end)
            + payRepository.sumSalesStatsByWorkStayIn(workStayNos, start, end);

    // 월별 매출을 한 번의 쿼리로 집계 (월마다 조회하지 않음)
    Map<String, Long> monthlySales = payRepository
            .sumByMonthBetween(officeNos, stationNos, workStayNos, start, end)
            .stream()
            .collect(Collectors.toMap(
                    m -> m.getMonth(),
                    m -> {
                        Long v = m.getSum();
                        return v == null ? 0L : v;
                    }));
    // 빈 달은 0으로 채워 월별 추이 생성
    List<MonthlyTrendResDto> trend = buildTrend(ym, months,
            (s, e) -> monthlySales.getOrDefault(YearMonth.from(s).toString(), 0L));

    return HostSalesStatsResDto.of(totalAmt, payCount, refundAmt, trend);
}`;

const CODE_DTO = `    // 금액 필드 Long — 공간별 월 매출이 약 21억를 넘겨 음수 되는 것 방지
    public static HostSalesStatsResDto of(Long totalAmt, Long payCount, Long refundAmt, List<MonthlyTrendResDto> trend) {
   // 결제 0건일 때 0으로 나누는 경우 에러 방지
        long avgAmt = payCount == 0 ? 0 : totalAmt / payCount;
        return HostSalesStatsResDto.builder()
                .totalAmt(totalAmt)
                .payCount(payCount)
                .avgAmt(avgAmt)
                .refundAmt(refundAmt)
                .trend(trend)
                .build();
    }`;

const BARS = [
	["120만", "45%", "1월", false],
	["165만", "62%", "2월", false],
	["101만", "38%", "3월", false],
	["208만", "78%", "4월", false],
	["240만", "90%", "5월", false],
	["266만", "100%", "6월", true],
];

export default function Stats({ active }) {
	return (
		<section className="page" id="stats" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">통계</h1>
				<p className="page__desc">
					사전집계 파이프라인 + 매출·예약·회원·공간 통계 조회 API.
				</p>
			</header>

			<div className="pay2">
				{/* ===== 왼쪽: 통계 대시보드 (StatsOverview 재현) ===== */}
				<div className="so-app">
					<div className="so-head">
						<div className="so-head__title">통계 대시보드</div>
						<div className="so-head__desc">이번 달 결제·환불 통계 요약</div>
					</div>

					{/* 기간 탭 (StatsRangeTabs) */}
					<div className="so-tabs">
						<span className="so-tab so-tab--on">이번 달</span>
						<span className="so-tab">3개월</span>
						<span className="so-tab">6개월</span>
						<span className="so-tab">1년</span>
					</div>

					{/* KPI (StatCard 4개) */}
					<div className="so-kpis">
						<div className="so-stat">
							<div className="so-stat__icon">👛</div>
							<div className="so-stat__label">총 매출</div>
							<div className="so-stat__value">
								12,400,000<span>원</span>
							</div>
						</div>
						<div className="so-stat">
							<div className="so-stat__icon">🧾</div>
							<div className="so-stat__label">결제 건수</div>
							<div className="so-stat__value">
								48<span>건</span>
							</div>
						</div>
						<div className="so-stat">
							<div className="so-stat__icon">⚖️</div>
							<div className="so-stat__label">평균 결제금</div>
							<div className="so-stat__value">
								258,333<span>원</span>
							</div>
						</div>
						<div className="so-stat so-stat--hl">
							<div className="so-stat__icon">🐷</div>
							<div className="so-stat__label">순매출 (환불 차감)</div>
							<div className="so-stat__value">
								12,060,000<span>원</span>
							</div>
						</div>
					</div>

					{/* 결제수단별 매출 (HorizontalBarChart) */}
					<div className="so-chart-title">결제수단별 매출</div>
					<div className="so-hbars">
						<div className="so-hbar">
							<span className="so-hbar__label">카카오페이</span>
							<div className="so-hbar__track">
								<div
									className="so-hbar__fill"
									style={{ width: "100%", background: "#FEE500" }}
								></div>
							</div>
							<span className="so-hbar__val">8,200,000원</span>
						</div>
						<div className="so-hbar">
							<span className="so-hbar__label">토스페이</span>
							<div className="so-hbar__track">
								<div
									className="so-hbar__fill"
									style={{ width: "51%", background: "#0064FF" }}
								></div>
							</div>
							<span className="so-hbar__val">4,200,000원</span>
						</div>
					</div>

					{/* 매출 추이 (VerticalBarChart) */}
					<div className="so-chart-title">이번 달 매출 추이</div>
					<div className="so-bars">
						{BARS.map(([val, height, label, on]) => (
							<div className="so-bar-col" key={label}>
								<span className="so-bar-val">{val}</span>
								<div
									className={"so-bar" + (on ? " so-bar--on" : "")}
									style={{ height }}
								></div>
								<span className="so-bar-label">{label}</span>
							</div>
						))}
					</div>

					{/* 환불 통계 (RefundCard 3분할) */}
					<div className="so-chart-title">환불 통계</div>
					<div className="so-refund">
						<div className="so-rcol">
							<span className="so-rcol__label">환불 건수</span>
							<span className="so-rcol__value">
								4<span>건</span>
							</span>
						</div>
						<div className="so-rdiv"></div>
						<div className="so-rcol">
							<span className="so-rcol__label">환불 총액</span>
							<span className="so-rcol__value">
								340,000<span>원</span>
							</span>
						</div>
						<div className="so-rdiv"></div>
						<div className="so-rcol">
							<span className="so-rcol__label">환불율</span>
							<span className="so-rcol__value so-rcol__value--accent">
								2.7<span>%</span>
							</span>
						</div>
					</div>
				</div>

				{/* ===== 오른쪽: 기능 목록 (아코디언) ===== */}
				<div className="pay2__right">
					<Func
						rich
						name="일자별 통계 적재"
						desc="조회마다 결제 원장을 집계하면 비싸서, 하루치 결제·환불 통계를 미리 적재합니다. 같은 행이 있으면 update·없으면 insert라 재적재돼도 멱등합니다."
						file="StatsService.java"
						code={CODE_LOAD}
					/>
					<Func
						rich
						name="호스트 매출 통계  "
						desc="호스트의 승인 공간을 타입별로 분류해 기간 매출·환불·건수를 합산하고, 월별 추이는 GROUP BY 한 쿼리로 한 번에 집계합니다."
						file="StatsService.java"
						code={CODE_HOST}
					/>
					<Func
						rich
						name="응답 DTO 변환"
						desc="매출 금액을 Long으로 다뤄 int 오버플로(약 21억)를 막고, 결제 0건일 때 평균 계산의 0 나누기를 가드합니다."
						file="HostSalesStatsResDto.java"
						code={CODE_DTO}
					/>
				</div>
			</div>
		</section>
	);
}
