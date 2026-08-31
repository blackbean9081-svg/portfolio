import Func from "../components/Func.jsx";
import PaneHead from "../components/PaneHead.jsx";

// ── 원본 코드 (hospital-price-monitor: prices/views.py · prices/models.py) — 있는 그대로 ──
const CODE_MONITOR = `@api_view(['GET'])
def monitor_prices(request):
    violations = (
        TreatmentPrice.objects.select_related('hospital')
        .filter(listed_price__gt=F('guaranteed_price'))
        .order_by('-listed_price')
    )

    results = [
        {
            'hospital': p.hospital.name,
            'treatment_name': p.treatment_name,
            'listed_price': p.listed_price,
            'guaranteed_price': p.guaranteed_price,
            'excess': p.listed_price - p.guaranteed_price,
        }
        for p in violations
    ]
    return Response({'count': len(results), 'results': results})`;

const CODE_COMPARE = `@api_view(['GET'])
def compare_prices(request):
    treatment = request.query_params.get('treatment', '').strip()
    if not treatment:
        return Response(
            {'error': 'treatment 쿼리 파라미터가 필요합니다. 예: /api/compare/?treatment=라식'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    prices = (
        TreatmentPrice.objects.select_related('hospital')
        .filter(treatment_name=treatment)
        .order_by('listed_price')
    )

    if not prices:
        return Response({'treatment': treatment, 'count': 0, 'lowest_price': None, 'results': []})

    lowest_price = prices[0].listed_price
    results = [
        {
            'hospital': p.hospital.name,
            'region': p.hospital.region,
            'treatment_name': p.treatment_name,
            'listed_price': p.listed_price,
            'guaranteed_price': p.guaranteed_price,
            'is_lowest': p.listed_price == lowest_price,
        }
        for p in prices
    ]
    return Response({
        'treatment': treatment,
        'count': len(results),
        'lowest_price': lowest_price,
        'results': results,
    })`;

const CODE_VIEWSET = `class TreatmentPriceViewSet(viewsets.ModelViewSet):
    queryset = TreatmentPrice.objects.select_related('hospital').all()
    serializer_class = TreatmentPriceSerializer`;

const CODE_MODELS = `from django.db import models


class Hospital(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class TreatmentPrice(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='treatment_prices')
    treatment_name = models.CharField(max_length=100)
    listed_price = models.IntegerField()
    guaranteed_price = models.IntegerField()

    def __str__(self):
        return f'{self.hospital.name} - {self.treatment_name}'`;

// 기술 스택 칩 — SemiTech.jsx 와 동일한 devicon 뱃지 구조
const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const STACK = [
	{ name: "Python", icon: "python", variant: "original" },
	{ name: "Django", icon: "django", variant: "plain" },
	{ name: "Django REST Framework", icon: "djangorest", variant: "original" },
	{ name: "SQLite", icon: "sqlite", variant: "original" },
];

export default function PriceMonitor({ active }) {
	return (
		<section className="page" id="price-monitor" hidden={!active}>
			<header className="page__head">
				<h1 className="page__title">hospital-price-monitor</h1>
				<p className="page__desc">
					병원 가격 투명성 프로토타입 — Python / Django REST Framework
				</p>
			</header>

			<div className="doc-block">
				{/* ===== 개인 프로젝트 — hospital-price-monitor ===== */}
				<article className="proj">
					<div className="proj__head">
						<span className="proj__tag proj__tag--solo">개인 프로젝트</span>
						<h2 className="proj__name">hospital-price-monitor</h2>
					</div>
					<p className="proj__subtitle">
						병원이 게시하는 가격(listed_price)과 플랫폼이 보장하는
						가격(guaranteed_price)을 데이터로 쌓아 두고, 치료항목별 가격 비교와
						보장가 위반 감시를 API로 제공하는 Django REST Framework
						프로토타입입니다.
					</p>

					<dl className="def-list">
						<div className="def-list__row">
							<dt>기간</dt>
							<dd>2026.07.27 (1인, 약 3시간)</dd>
						</div>
						<div className="def-list__row">
							<dt>만든 이유</dt>
							<dd>
								‘병원 가격 모니터링은 결국 백엔드·자동화 문제’라는 가설을 말로만
								하지 않고 직접 확인해 보려고 만들었습니다. 가격을 데이터로 쌓아
								두면 소비자에게는 최저가를 포함한 가격 비교를, 운영자에게는
								게시가가 보장가를 넘은 병원 목록을 API 한 번으로 줄 수 있습니다.
							</dd>
						</div>
						<div className="def-list__row">
							<dt>구현 API</dt>
							<dd>
								병원 CRUD — /api/hospitals/
								<br />
								치료 가격 CRUD — /api/prices/
								<br />
								가격 비교 — GET /api/compare/?treatment=라식 (게시가 오름차순,
								최저가 표시)
								<br />
								가격 감시 — GET /api/monitor/ (게시가가 보장가를 넘은 항목과
								초과액)
							</dd>
						</div>
						<div className="def-list__row">
							<dt>Spring ↔ Django</dt>
							<dd>
								Entity → Model
								<br />
								Repository → ORM QuerySet
								<br />
								Controller → ViewSet · @api_view
								<br />
								DTO → Serializer
								<br />
								fetch join → select_related
							</dd>
						</div>
						<div className="def-list__row">
							<dt>도구</dt>
							<dd>
								Java / Spring 경험을 바탕으로, Django를 처음 접한 상태에서 Claude
								Code를 활용해 진행했습니다. Spring의
								Entity–Repository–Controller 구조가 Django의
								Model–ORM–ViewSet에 대응되는지 확인하며 만들었습니다.
							</dd>
						</div>
						<div className="def-list__row">
							<dt>GitHub</dt>
							<dd className="def-list__links">
								<a
									className="def-list__link"
									href="https://github.com/blackbean9081-svg/hospital-price-monitor"
									target="_blank"
									rel="noopener noreferrer"
								>
									blackbean9081-svg/hospital-price-monitor
								</a>
							</dd>
						</div>
					</dl>

					{/* 기술 스택 칩 */}
					<div className="impl">
						<div className="tag-section">
							<span className="tag-section__label">기술 스택</span>
							<div className="tag-group">
								{STACK.map((it) => (
									<span className="tech-item" key={it.name}>
										<img
											className="tech-icon"
											alt=""
											src={`${ICON_BASE}/${it.icon}/${it.icon}-${it.variant}.svg`}
										/>
										<span className="tech-name">{it.name}</span>
									</span>
								))}
							</div>
						</div>
					</div>

					{/* 구현 코드 — 기능 아코디언 4개 (기본 전부 닫힘) */}
					<div className="impl">
						<PaneHead
							title="구현 코드"
							sub="prices/views.py · prices/models.py — 원본 그대로"
						/>
						<Func
							rich
							name="가격 감시"
							desc={"게시가(listed_price)가 보장가(guaranteed_price)를 넘은 항목만 골라 초과액과 함께 돌려줍니다.\n운영자가 병원마다 확인하지 않아도 GET /api/monitor/ 한 번으로 위반 목록을 받습니다."}
							file="prices/views.py"
							barName="monitor_prices"
							code={CODE_MONITOR}
							lang="python"
							retro={"두 컬럼을 파이썬으로 전부 불러와 비교하는 대신 F('guaranteed_price')로 조건을 DB 쿼리(WHERE listed_price > guaranteed_price)에 넣어 DB가 걸러내게 했습니다. select_related('hospital')로 병원을 조인 한 번에 가져와, 결과 건수만큼 병원을 다시 조회하는 N+1을 막았습니다."}
						/>
						<Func
							rich
							name="가격 비교"
							desc={"treatment 파라미터로 받은 치료항목의 가격을 게시가 오름차순으로 돌려주고, 최저가 항목에 is_lowest를 표시합니다.\n파라미터가 없으면 400을 반환합니다."}
							file="prices/views.py"
							barName="compare_prices"
							code={CODE_COMPARE}
							lang="python"
							retro={"정렬은 order_by로 DB에 맡기고 첫 행을 최저가로 써서, 파이썬에서 다시 min()을 돌리지 않았습니다. Spring에서 fetch join으로 N+1을 잡아 본 경험을 살려 여기서도 select_related로 병원 정보를 한 번에 가져옵니다."}
						/>
						<Func
							rich
							name="가격 CRUD"
							desc={"ModelViewSet 하나로 /api/prices/ 의 목록·등록·상세·수정·삭제를 모두 제공합니다.\nSpring에서 Controller·Service·Repository로 나눠 쓰던 CRUD가 DRF에서는 queryset과 serializer_class 두 줄로 끝납니다."}
							file="prices/views.py"
							barName="TreatmentPriceViewSet"
							code={CODE_VIEWSET}
							lang="python"
							retro={"queryset 단계에서 select_related('hospital')를 걸어 두어, 목록 응답의 hospital_name(Serializer의 source='hospital.name')이 행마다 추가 쿼리를 내지 않게 했습니다."}
						/>
						<Func
							rich
							name="모델"
							desc={"병원(Hospital)과 치료 가격(TreatmentPrice)을 1:N으로 잇는 두 모델입니다. 게시가와 보장가를 따로 저장해 비교·감시 API의 기준이 됩니다.\nSpring의 @Entity + @ManyToOne이 Django에서는 models.Model + ForeignKey에 대응됩니다."}
							file="prices/models.py"
							barName="Hospital / TreatmentPrice"
							code={CODE_MODELS}
							lang="python"
							retro={"related_name='treatment_prices'로 병원에서 가격 목록으로 가는 역참조 이름을 명시하고, on_delete=CASCADE로 병원이 지워지면 가격도 함께 정리되게 했습니다."}
						/>
					</div>
				</article>
			</div>
		</section>
	);
}
