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
    id: 'hr-attrition',
    index: '02',
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
    id: 'patent-db',
    index: '03',
    title: 'Indian Patent Database',
    kicker: 'Scraping pipeline + filing-trends dashboard',
    cats: ['de', 'bi'],
    year: '2026',
    summary:
      'An automated pipeline that collects published Indian patent applications into PostgreSQL and turns them into a filing-trends dashboard.',
    problem:
      'Published patent records are spread across web pages with inconsistent dates, applicant names and missing fields, which makes trend analysis slow and error-prone.',
    built: [
      'Extraction with BeautifulSoup and Selenium into a normalised PostgreSQL schema',
      'Duplicate detection, date normalisation, applicant-name standardisation and null-field flagging',
      'SQL views powering a Power BI dashboard: filing trends, top applicants, technology domains, office-wise split',
      'Client-ready Excel summaries with PivotTables, conditional formatting and slicers',
    ],
    outcome: ['A repeatable pipeline from raw web records to a dashboard and Excel pack'],
    stack: ['Python', 'BeautifulSoup', 'Selenium', 'Pandas', 'PostgreSQL', 'Power BI', 'Excel'],
    links: [],
    note: 'Code is private. Walkthrough available on request.',
  },
  {
    id: 'patent-landscape',
    index: '04',
    title: 'Patent Landscape Generator',
    kicker: 'Automated technology-domain reports',
    cats: ['de', 'bi'],
    year: '2026',
    summary:
      'Pulls patent records for a technology domain from public APIs, deduplicates across sources and produces a formatted multi-sheet Excel workbook.',
    problem:
      'Landscape studies were being assembled by hand, one search and one spreadsheet at a time.',
    built: [
      'Keyword- and classification-driven (IPC/CPC) workflow across public patent APIs',
      'Cross-source deduplication and a formatted multi-sheet workbook built with openpyxl',
      'Tableau views for assignee share, jurisdiction spread and filing velocity',
      'A reusable run-book so the extraction can be repeated for any domain',
    ],
    outcome: ['Landscape reports that can be regenerated for a new domain from a keyword list'],
    stack: ['Python', 'REST APIs', 'Pandas', 'openpyxl', 'Tableau'],
    links: [],
    note: 'Code is private. Walkthrough available on request.',
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
  {
    id: 'cognicare',
    index: '08',
    title: 'CogniCare',
    kicker: 'Research platform for cognitive health',
    cats: ['apps'],
    year: '2026',
    summary:
      'A research and clinical platform studying whether app-based games improve cognition in older adults with mild cognitive impairment.',
    problem: 'Researchers need consistent scoring and patient histories, and patients need games that are easy to use.',
    built: [
      'Patient app with a 25-item MCI questionnaire, 7 cognitive games and an accessibility focus system',
      'Clinician app for caseload monitoring and game assignment',
      'Admin web portal with usage and score analytics',
      'Express + Prisma API with a scoring engine, JWT auth and role-based access on PostgreSQL',
    ],
    outcome: ['Three apps on one backend, from patient to clinician to researcher'],
    stack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
    links: [{ label: 'Code', href: `${GH}/parkinsons-app` }],
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

export interface KBEntry {
  title: string
  text: string
  tags: string
  href?: string
}

/** Knowledge base for the in-browser "Ask my portfolio" search. */
export const KB: KBEntry[] = [
  {
    title: 'Who is Rahul?',
    text: 'Rahul Khanna is a data analyst and data engineer from Sri Ganganagar, Rajasthan. He builds end-to-end data pipelines, integrates APIs and public data sources, cleans and validates datasets, and delivers interactive dashboards. He also builds ML models and full-stack apps.',
    tags: 'about intro summary who background profile yourself introduce',
    href: '#about',
  },
  {
    title: 'Education',
    text: 'BCA from Lovely Professional University, Phagwara (2023–2026), with a CGPA of 8.52.',
    tags: 'education degree college university lpu bca cgpa gpa study graduate',
    href: '#journey',
  },
  {
    title: 'Roles he is looking for',
    text: 'Rahul is open to Data Analyst, Data Engineer and AI/ML roles. He is open to on-site, hybrid and remote roles in India.',
    tags: 'hire hiring job role open available looking work opportunity relocate remote hybrid onsite',
    href: '#contact',
  },
  {
    title: 'Contact',
    text: 'Email rahulkhanna6593@gmail.com, or connect on LinkedIn (linkedin.com/in/rahul-khannaa). Code is on GitHub at github.com/rahulkhanna5.',
    tags: 'contact email reach linkedin github message talk connect',
    href: '#contact',
  },
  {
    title: 'Programming & databases',
    text: 'Python and SQL. PostgreSQL, MySQL and Supabase: joins, aggregations, window functions, CTEs, indexing and schema design.',
    tags: 'skills python sql postgres postgresql mysql supabase database cte window functions languages',
    href: '#stack',
  },
  {
    title: 'Data engineering skills',
    text: 'REST API integration, web scraping (BeautifulSoup, Selenium), HTML/XML/JSON parsing, CSV and bulk-file ingestion, pagination and rate-limit handling, scheduling, retries, schema alignment, validation and deduplication.',
    tags: 'data engineering etl pipeline api scraping ingestion etl elt validation dedup deduplication scheduling',
    href: '#stack',
  },
  {
    title: 'BI & visualisation',
    text: 'Power BI (data modelling, DAX, interactive dashboards), Tableau, Excel (PivotTables, slicers), Matplotlib and Seaborn.',
    tags: 'bi power powerbi dax tableau excel dashboard visualization visualisation charts report',
    href: '#stack',
  },
  {
    title: 'Machine learning',
    text: 'Forecasting, classification and clustering with scikit-learn, XGBoost, LightGBM and TensorFlow/Keras, including stacked ensembles and LSTM models.',
    tags: 'machine learning ml models ai forecasting classification clustering xgboost lightgbm tensorflow keras lstm scikit sklearn deep',
    href: '#stack',
  },
  {
    title: 'OilSense: crude oil forecasting',
    text: 'OilSense combines EIA, FRED, yfinance and NewsAPI data into one validated dataset and forecasts WTI and Brent prices. A stacked ensemble (LSTM, XGBoost, LightGBM with a Ridge meta-model) reached 4.0% MAPE and R² 0.93 on 1-day Brent forecasts.',
    tags: 'oil oilsense crude forecast forecasting price prediction wti brent eia fred yfinance newsapi ensemble stacked mape',
    href: '#work',
  },
  {
    title: 'HR Attrition Power BI report',
    text: 'A five-page Power BI report on 1,470 employees with 34 DAX measures. Key findings: the lowest income band loses 28.6% of its people vs 5.6% in the highest; overtime roughly triples attrition risk (30.5% vs 10.4%).',
    tags: 'hr attrition power bi dax employees report dashboard live overtime income',
    href: '#work',
  },
  {
    title: 'Indian Patent Database',
    text: 'An automated pipeline that scrapes published Indian patent applications with BeautifulSoup and Selenium, cleans them into PostgreSQL, and powers a Power BI filing-trends dashboard plus Excel summaries.',
    tags: 'patent database scraping selenium beautifulsoup postgres power bi filing trends pipeline',
    href: '#work',
  },
  {
    title: 'Patent Landscape Generator',
    text: 'Pulls patent records for a technology domain from public patent APIs, deduplicates across sources, and builds a multi-sheet Excel workbook plus Tableau views for assignee share, jurisdictions and filing velocity.',
    tags: 'patent landscape api tableau excel openpyxl report generator',
    href: '#work',
  },
  {
    title: 'Customer churn prediction',
    text: 'Compares Logistic Regression, Random Forest, Gradient Boosting and SVM to predict customer churn, evaluated on accuracy, precision, recall, F1 and ROC-AUC.',
    tags: 'churn customer prediction classification logistic random forest svm roc',
    href: '#work',
  },
  {
    title: 'Sentiment × Trading',
    text: 'Analyses how the Fear & Greed Index relates to trader returns and win rate, with Random Forest feature importance and K-Means regime detection visualised with PCA.',
    tags: 'sentiment trading fear greed kmeans clustering pca regime',
    href: '#work',
  },
  {
    title: 'GymOS',
    text: 'A gym management SaaS built with Next.js, React, TypeScript and Tailwind: 19 routes across member, trainer and owner roles, with revenue and MRR dashboards drawn in hand-rolled SVG.',
    tags: 'gymos gym saas nextjs next react typescript app product web',
    href: '#work',
  },
  {
    title: 'CogniCare',
    text: 'A research platform on whether app-based games improve cognition in older adults with mild cognitive impairment: patient and clinician apps in React Native/Expo, an admin portal, and an Express + Prisma + PostgreSQL API.',
    tags: 'cognicare health healthcare app react native expo mci cognition research parkinson',
    href: '#work',
  },
  {
    title: 'Patents',
    text: 'Co-inventor on three Indian patent applications: Smart-ID Based Campus Presence & Safety Management System (202511104180, published 2025), A Smart Therapeutic Mattress System (202511052262, filed 2025), and A Smart Urinal System for Early Detection of Chronic Kidney Disease (202611071811, filed 2026).',
    tags: 'patent patents inventor invention ip research truepass mattress kidney',
    href: '#research',
  },
  {
    title: 'Publication',
    text: 'Empirical-Study-Based Analysis of True-Pass System, published in IJNRD, Vol. 11, Issue 4, April 2026 (Impact Factor 8.76).',
    tags: 'paper publication research journal ijnrd truepass published',
    href: '#research',
  },
  {
    title: 'Certifications',
    text: 'Google Advanced Data Analytics (Coursera, 2025), SQL for Data Science (Coursera, 2024), Data Analytics with Python (NPTEL, 2025), and The Data Visualization Course (Udemy, 2025).',
    tags: 'certification certificate course coursera google nptel udemy',
    href: '#research',
  },
  {
    title: 'Patent co-inventor role',
    text: 'At Lovely Professional University (2025–2026) Rahul contributed to invention disclosures, prior-art review and specification inputs, coordinated with the university IP cell, and tracked filings and publication through the IP India portal.',
    tags: 'experience work role intern internship job lpu ip cell prior art',
    href: '#journey',
  },
]
