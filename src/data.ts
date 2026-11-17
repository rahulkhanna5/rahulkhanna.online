export type Category = 'de' | 'bi' | 'ml' | 'apps'

export const CATEGORY_LABEL: Record<Category, string> = {
  de: 'Data Engineering',
  bi: 'Analytics & BI',
  ml: 'Machine Learning',
  apps: 'Apps & Products',
}

export interface Project {
  id: string
  index: string
  title: string
  kicker: string
  cats: Category[]
  summary: string
  problem: string
  built: string[]
  outcome: string[]
  stack: string[]
  links: { label: string; href: string }[]
  note?: string
  special?: 'oil-chart' | 'powerbi'
  year: string
}

const GH = 'https://github.com/rahulkhanna5'

export const PROJECTS: Project[] = [
  {
    id: 'oilsense',
    index: '01',
    title: 'OilSense',
    kicker: 'Multi-source market data pipeline + price forecasting',
    cats: ['de', 'ml'],
    year: '2025',
    summary:
      'Four public data sources merged into one validated dataset, feeding a stacked ensemble that forecasts WTI and Brent crude prices.',
    problem:
      'Oil price signals live in separate places: government supply data, macro indicators, market prices and the news. Each has its own schedule, schema and gaps.',
    built: [
      'Ingestion from EIA, FRED, yfinance and NewsAPI with scheduling, retries and rate-limit handling',
      'Schema alignment, missing-value treatment and deduplication into a single daily dataset',
      'News headlines scored with VADER sentiment and added as features',
      'Benchmarked LSTM, XGBoost and LightGBM, then stacked them with a Ridge meta-model',
      'Nine-page interactive dashboard with drill-downs and exportable summary tables',
    ],
    outcome: [
      'Stacked model reached 4.0% MAPE and R² 0.93 on 1-day Brent forecasts',
      'Beat every single model at both the 1-day and 7-day horizons',
    ],
    stack: ['Python', 'REST APIs', 'Pandas', 'XGBoost', 'LightGBM', 'TensorFlow', 'scikit-learn', 'Supabase'],
    links: [{ label: 'Code', href: `${GH}/crude-oil-price-prediction-system` }],
    special: 'oil-chart',
  },
  {
    id: 'fabric-lakehouse',
    index: '02',
    title: 'End-to-End Analytics on Microsoft Fabric',
    kicker: 'Lakehouse · Medallion architecture · Power BI',
    cats: ['de', 'bi'],
    year: '2026',
    summary:
      'An end-to-end analytics project in Microsoft Fabric: Azure pipelines ingest source data into a Lakehouse, a Medallion architecture refines it, and Power BI dashboards sit on top.',
    problem:
      'Take raw source data through governed, layered storage so reports are built on cleaned, standardised tables, and process only new and changed records on each load.',
    built: [
      'Azure pipelines ingesting source data into a Lakehouse in Microsoft Fabric',
      'Medallion architecture (Bronze, Silver, Gold layers) to clean, standardise and organise the data, with catalogs for governed, discoverable data',
      'Incremental loads using watermark and change data capture (CDC) techniques, so only new and changed records are processed',
      'Materialised lake views to optimise performance, a semantic model over the curated data, and interactive Power BI dashboards',
    ],
    outcome: ['A governed Bronze, Silver and Gold lakehouse feeding a semantic model and interactive Power BI dashboards'],
    stack: ['Microsoft Fabric', 'Azure Pipelines', 'Lakehouse', 'Medallion architecture', 'CDC', 'Power BI'],
    links: [{ label: 'See the dashboards', href: '/dashboards/' }],
  },
  {
    id: 'cognicare',
    index: '03',
    title: 'CogniCare',
    kicker: "Parkinson's screening mobile app",
    cats: ['apps'],
    year: '2026',
    summary:
      "A mobile app for early Parkinson's disease screening, built end to end from scratch: a spiral-tracing test scored with polar-coordinate analysis, on a React Native (Expo) front end with a NeonDB (PostgreSQL) backend.",
    problem:
      "The app screens for early Parkinson's disease by assessing a person's motor control through a drawing test.",
    built: [
      "A spiral-tracing test that scores the user's drawing with polar-coordinate analysis to assess motor control",
      'A React Native (Expo) mobile app with a NeonDB (PostgreSQL) backend',
      'The full build, end to end and from scratch, through to publishing on the Google Play Store',
    ],
    outcome: ['Published on the Google Play Store and live in the testing track'],
    stack: ['React Native', 'Expo', 'NeonDB', 'PostgreSQL'],
    links: [{ label: 'Code', href: `${GH}/parkinsons-app` }],
  },
  {
    id: 'hr-attrition',
    index: '04',
    title: 'HR Attrition Intelligence',
    kicker: 'Five-page Power BI report · live',
    cats: ['bi'],
    year: '2026',
    summary:
      'A hand-modelled Power BI report on 1,470 employees showing where attrition concentrates and which levers actually matter.',
    problem:
      'Attrition was 16.1%, but HR could not see which groups were leaving or whether pay raises would help.',
    built: [
      'Semantic model with 34 DAX measures and 11 calculated columns',
      'Banded age, tenure, income, promotion and manager groupings, each with explicit sort orders',
      'Pages for Overview, Demographics, Organization, Career & Tenure, and Compensation & Workload',
      'Every chart cross-filters the rest of the page',
    ],
    outcome: [
      'Lowest income band loses 28.6% of its people, against 5.6% in the highest',
      'Overtime roughly triples risk: 30.5% attrition with overtime vs 10.4% without',
      'Raises are not the lever: hike size is flat at ~15% across every income band',
    ],
    stack: ['Power BI', 'DAX', 'Data modelling', 'TMDL'],
    links: [
      {
        label: 'Open live report',
        href: 'https://app.powerbi.com/view?r=eyJrIjoiMzJkM2E2OTEtYTE3NC00M2UxLWJiNGQtYmE3Y2I1YzMxYzAxIiwidCI6IjcxNzNmZTk4LTdjYWQtNGVmMS1iMjc2LTBhYjI2MTcyOTEyNiJ9',
      },
      { label: 'AI-built comparison (Zoho)', href: './dashboards/dailyrate/index.html' },
    ],
    special: 'powerbi',
  },
  {
    id: 'churn',
    index: '05',
    title: 'Customer Churn Prediction',
    kicker: 'Model comparison for churn risk',
    cats: ['ml'],
    year: '2025',
    summary:
      'Predicts which customers are likely to leave, comparing four classifiers on accuracy, precision, recall, F1 and ROC-AUC.',
    problem: 'Retention teams need to know who is likely to churn before they leave, not after.',
    built: [
      'Preprocessing pipeline with encoding and scaling',
      'Logistic Regression, Random Forest, Gradient Boosting and SVM trained side by side',
      'Evaluation on accuracy, precision, recall, F1 and ROC-AUC',
      'Trained models saved and reloaded with pickle for reuse',
    ],
    outcome: ['A reusable churn-scoring script with saved models'],
    stack: ['Python', 'Pandas', 'NumPy', 'scikit-learn'],
    links: [{ label: 'Code', href: `${GH}/Customer-Churn-Rate-Finder` }],
  },
  {
    id: 'sentiment',
    index: '06',
    title: 'Sentiment × Trading',
    kicker: 'Fear & Greed vs trader performance',
    cats: ['ml', 'bi'],
    year: '2025',
    summary:
      'Tests how market sentiment relates to returns and win rate, then uses clustering to find distinct market regimes.',
    problem: 'Do traders actually perform differently in fearful and greedy markets, and can those regimes be detected?',
    built: [
      'Merged trade history with the Fear & Greed Index and engineered return %, win/loss and account features',
      'Compared P&L, win rate and trade volume across sentiment classes',
      'Random Forest feature importance to rank the drivers',
      'K-Means regime detection visualised with PCA',
    ],
    outcome: ['Three regimes identified: neutral/low volatility, panic/fear, and bullish/greed trend'],
    stack: ['Python', 'Pandas', 'scikit-learn', 'Seaborn', 'Jupyter'],
    links: [{ label: 'Code', href: `${GH}/sentiment-impact-on-trading` }],
  },
  {
    id: 'gymos',
    index: '07',
    title: 'GymOS',
    kicker: 'Gym management SaaS with a finance-grade dashboard',
    cats: ['apps'],
    year: '2026',
    summary:
      'Memberships, renewals, payments, classes and trainers in one system, with separate experiences for members, trainers and owners.',
    problem: 'Gym owners spend their week chasing dues and juggling timetables across spreadsheets and chats.',
    built: [
      '19 routes across three roles: member self-service, trainer and owner',
      'Owner command centre with revenue, MRR, active/expiring/lapsed members and one-tap reminders',
      'Hand-rolled SVG charts, no chart library',
      'Typed seed data shaped like the production schema, so going live is a data-source swap',
    ],
    outcome: ['The full product can be explored end to end in all three roles'],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    links: [{ label: 'Code', href: `${GH}/GYMOS` }],
  },
]

/** Real evaluation results from the OilSense notebook (test set). */
export const OIL_RESULTS: Record<string, { model: string; mape: number; r2: number; mae: number }[]> = {
  'WTI-1': [
    { model: 'LSTM', mape: 10.24, r2: 0.643, mae: 6.95 },
    { model: 'XGBoost', mape: 6.36, r2: 0.869, mae: 4.04 },
    { model: 'LightGBM', mape: 5.65, r2: 0.891, mae: 3.58 },
    { model: 'Stacked', mape: 4.98, r2: 0.909, mae: 3.18 },
  ],
  'WTI-7': [
    { model: 'LSTM', mape: 10.77, r2: 0.467, mae: 7.89 },
    { model: 'XGBoost', mape: 13.85, r2: 0.544, mae: 8.88 },
    { model: 'LightGBM', mape: 11.67, r2: 0.659, mae: 7.55 },
    { model: 'Stacked', mape: 8.71, r2: 0.738, mae: 5.9 },
  ],
  'Brent-1': [
    { model: 'LSTM', mape: 6.22, r2: 0.818, mae: 4.62 },
    { model: 'XGBoost', mape: 5.34, r2: 0.894, mae: 3.68 },
    { model: 'LightGBM', mape: 4.57, r2: 0.917, mae: 3.18 },
    { model: 'Stacked', mape: 4.04, r2: 0.932, mae: 2.86 },
  ],
  'Brent-7': [
    { model: 'LSTM', mape: 8.41, r2: 0.548, mae: 6.6 },
    { model: 'XGBoost', mape: 12.08, r2: 0.613, mae: 8.39 },
    { model: 'LightGBM', mape: 10.95, r2: 0.655, mae: 7.71 },
    { model: 'Stacked', mape: 7.36, r2: 0.761, mae: 5.52 },
  ],
}

/* ---------------------------------------------------------------------------
   Page content for the INFO beats. Text is carried over from the previous
   site as is; nothing here is new or estimated.
--------------------------------------------------------------------------- */

export interface Stat { value: number; decimals?: number; suffix?: string; label: string }
export const STATS: Stat[] = [
  { value: 3, label: 'patent applications as co-inventor' },
  { value: 4, label: 'live data sources in one pipeline' },
  { value: 4.0, decimals: 1, suffix: '%', label: 'MAPE on 1-day Brent forecasts' },
  { value: 8.55, decimals: 2, label: 'CGPA, BCA at LPU' },
]

export const ABOUT = {
  /** From Rahul's own description of himself; keep it to what he has said. */
  offClock: "Away from the screen I play sport and I like anything competitive. I also keep up with what's new in tech; these days that means agentic AI workflows with Claude and Codex.",
  lead: "I'm a data analyst and data engineer who likes the unglamorous part: getting messy, multi-source data into a shape people can trust.",
  paragraphs: [
    'I build pipelines that pull from APIs and the web, validate and deduplicate the data, and land clean tables in PostgreSQL or a Microsoft Fabric lakehouse, with Bronze, Silver and Gold layers and incremental loads. On top of that I build Power BI and Tableau dashboards, and forecasting and classification models when the question needs one.',
    "I'm an Operations Analyst Intern at AskIITians, where I own the operations MIS: I consolidate messy data from several sources into daily reports, build recurring MIS reports in Excel and SQL, and flag anomalies and process bottlenecks. Alongside my BCA at Lovely Professional University I'm co-inventor on three Indian patent applications, published a paper in IJNRD, and earned Microsoft's Fabric Analyst in a Day certification.",
  ],
  cards: [
    { key: 'A', title: 'Data engineering', text: 'Microsoft Fabric lakehouses with Medallion layers and incremental loads (watermark, CDC), plus API ingestion, scraping, validation and deduplication.' },
    { key: 'B', title: 'Analytics & BI', text: 'Power BI semantic models and dashboards, Tableau views, and Excel MIS packs with PivotTables and slicers.' },
    { key: 'C', title: 'Machine learning', text: 'Forecasting, classification and clustering, benchmarked honestly against baselines.' },
    { key: 'D', title: 'Apps & products', text: 'React Native (Expo) and Next.js front ends so the data reaches the people who use it.' },
  ],
}

export interface JourneyItem { when: string; title: string; where?: string; text?: string; now?: boolean }
export const JOURNEY: JourneyItem[] = [
  { when: '2023', title: 'Started BCA', where: 'Lovely Professional University, Phagwara', text: 'Foundations in programming, statistics and databases.' },
  { when: 'Jan–Apr 2025', title: 'Multi-source market data pipeline', where: 'OilSense', text: 'Four public APIs merged into one validated dataset, a nine-page dashboard and a forecasting model.' },
  { when: '2025 – 2026', title: 'Patent co-inventor', where: 'Lovely Professional University, Phagwara', text: 'Invention disclosures, prior-art review and specification inputs for three Indian patent applications, and tracking filing numbers, publication dates and office correspondence on the IP India portal.' },
  { when: '2025', title: 'Google Advanced Data Analytics', where: 'Coursera, plus Data Analytics with Python on NPTEL', text: 'Statistics, regression and the full analytics workflow.' },
  { when: 'Apr 2026', title: 'Paper published in IJNRD', where: 'Impact factor 8.76', text: 'An empirical study of the TruePass campus safety system.' },
  { when: '2026', title: 'Fabric Analyst in a Day', where: 'Microsoft and MAQ Software', text: 'Certified on Microsoft Fabric, alongside courses on managing data in Fabric and Databricks for data analysts.' },
  { when: '2026', title: 'BCA graduate, CGPA 8.55', where: 'Lovely Professional University, Phagwara' },
  { when: '2026 – Present', title: 'Operations Analyst Intern', where: 'AskIITians', text: 'Tracking live online-batch sessions, faculty schedules and session status across grades; owning the operations MIS; and building recurring Excel and SQL reports that flag anomalies and bottlenecks.' },
  { when: 'Now', title: 'Looking for my first data role', text: 'Data Analyst, Data Engineer or ML. On-site, hybrid or remote in India.', now: true },
]

export interface ResearchItem { status: string; kind: 'published' | 'filed' | 'paper'; title: string; meta: string }
export const RESEARCH: ResearchItem[] = [
  { status: 'Published 2025', kind: 'published', title: 'Smart-ID Based Campus Presence & Safety Management System', meta: 'App No. 202511104180' },
  { status: 'Filed 2025', kind: 'filed', title: 'A Smart Therapeutic Mattress System', meta: 'App No. 202511052262' },
  { status: 'Filed 2026', kind: 'filed', title: 'A Smart Urinal System for Early Detection of Chronic Kidney Disease', meta: 'App No. 202611071811' },
  { status: 'Paper, IJNRD', kind: 'paper', title: 'Empirical-Study-Based Analysis of True-Pass System', meta: 'Vol. 11, Issue 4, Apr 2026. Impact factor 8.76. Paper ID IJNRD2604711' },
]
/** Patent research tools, from the résumé. */
export const PATENT_TOOLS = ['IPC/CPC classification', 'InPASS', 'Espacenet', 'Google Patents', 'WIPO']

export const CERTS: { title: string; by: string }[] = [
  { title: 'Fabric Analyst in a Day', by: 'Microsoft and MAQ Software, 2026' },
  { title: 'Complete Guide to Managing Data with Microsoft Fabric: From Beginner to Advanced', by: 'LinkedIn Learning, 2026' },
  { title: 'Databricks for Data Analysts', by: 'LinkedIn Learning, 2026' },
  { title: 'Google Advanced Data Analytics', by: 'Coursera, 2025' },
  { title: 'Data Analytics with Python', by: 'NPTEL, 2025' },
]

/** The toolkit, as listed on the résumé. Each group is drawn in its discipline's line colour. */
export const TOOLS: { name: string; line: Category; items: string[] }[] = [
  { name: 'Data engineering', line: 'de', items: ['Python', 'SQL', 'PostgreSQL', 'MySQL', 'NeonDB', 'Microsoft Fabric', 'Azure Databricks', 'REST APIs', 'Web scraping', 'Git'] },
  { name: 'Analytics & BI', line: 'bi', items: ['Power BI', 'DAX', 'Tableau', 'Excel', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter'] },
  { name: 'Apps & AI tools', line: 'apps', items: ['React Native (Expo)', 'VS Code', 'Claude', 'Codex'] },
]

export const CONTACT = {
  email: 'rahulkhanna6593@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahul-khannaa/' },
    { label: 'GitHub', href: 'https://github.com/rahulkhanna5' },
    { label: 'Résumé', href: '/resume.pdf' },
  ],
}

/** On a sports hall floor every game has its own line colour. Here every discipline does. */
export const LINE: Record<Category, { colour: string; name: string }> = {
  de: { colour: 'var(--white)', name: 'white' },
  bi: { colour: 'var(--yellow)', name: 'yellow' },
  ml: { colour: 'var(--red-line)', name: 'red' },
  apps: { colour: 'var(--green)', name: 'green' },
}
/** Which about-card belongs to which discipline. */
export const ABOUT_CARD_CAT: Category[] = ['de', 'bi', 'ml', 'apps']

/* ---------------------------------------------------------------------------
   The dashboards page (/dashboards/). Images are page exports of the Power BI
   reports, in public/dashboards/shots/<id>-<n>.jpg (2400px) and -sm.jpg
   (1200px). Findings are taken from the reports' own chart titles and cards.
   Where a report runs on synthetic data, say so: `data` is shown on the page.
--------------------------------------------------------------------------- */

export interface Dashboard {
  id: string
  title: string
  kicker: string
  cats: Category[]
  summary: string
  /** Where the numbers come from. Shown on the page next to the report. */
  data: string
  synthetic: boolean
  /** Report pages, in order. With `shots`, each has an image. */
  pages: string[]
  shots: boolean
  /** A public Publish-to-web link, loaded into the page on request. */
  live?: string
  findings: string[]
  built: string[]
  stack: string[]
  related?: { label: string; href: string }
}

export const DASHBOARDS: Dashboard[] = [
  {
    id: 'retail',
    title: 'Binaryville Retail Performance',
    kicker: 'Sales and customer analytics on a Gold-layer star schema',
    cats: ['bi'],
    summary:
      'Sales, margin and customer behaviour for Binaryville, a retailer of robots, drones and gadgets that sells in stores, on the web, in an app and on marketplaces. Built on a star schema of sales, dates, products and customers: Jan 2025 to Oct 2026, 130 products, 4.5K customers, 24K order lines.',
    data: 'Synthetic data, generated in the shape of the Binaryville lakehouse. The numbers show the analysis, not a real business.',
    synthetic: true,
    pages: ['Sales Performance', 'Customer Analytics'],
    shots: true,
    findings: [
      'Diwali season (Oct–Nov) drives the annual revenue peak',
      'Drones are the second-biggest seller but earn only 9.7% margin',
      'Discounts above 30% turn margin negative (−10.1%)',
      'Only about 25% of new customers return in month 1, and the top 20% of customers bring in 60.5% of revenue',
    ],
    built: [
      'KPI cards for revenue, gross margin, orders, average order value and YTD growth',
      'Monthly cohort retention matrix by first-order month',
      'RFM segmentation, from Champions to Can’t Lose',
      'Revenue concentration by customer decile, and a weekday × quarter order heatmap',
    ],
    stack: ['Power BI', 'DAX', 'Star schema', 'Cohort analysis', 'RFM'],
    related: { label: 'Part of: End-to-End Analytics on Microsoft Fabric', href: '/#project-fabric-lakehouse' },
  },
]
