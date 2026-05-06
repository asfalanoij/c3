import type { RiskProfile, RiskDomain } from '../types';

const STRATEGIC_RISKS: RiskProfile[] = [
  {
    id: 'STRAT-001',
    riskEvent: 'Market Expansion Failure due to Product Misalignment and Regulatory Hurdles',
    description: 'Failure to both rapidly integrate locally dominant Alternative Payment Methods (APMs) and navigate unique regulatory "deltas" (e.g., data residency, reporting timelines) in key APAC markets. This dual challenge can stall market entry, allowing more agile competitors to capture market share, leading to merchant churn and significant revenue loss.',
    domain: 'Strategic',
    businessProcess: 'Market Expansion & Product Localization',
    kpi: 'Market Share in Key APAC Markets',
    kri: 'Time-to-market for new APM integrations; Number of open high-risk regulatory gaps per country',
    owner: 'Head of Product, APAC',
    inherentRisk: { likelihood: 4, impact: 5 },
    rcsa: [
      { controlId: 'CTRL-ORG-05', effectiveness: 'Partially Effective', description: 'Market and regulatory intelligence informs strategy, but the process is not yet fully proactive.' },
      { controlId: 'CTRL-ORG-04', effectiveness: 'Partially Effective', description: '3PRM process for onboarding new APM partners is robust but can be lengthy, impacting speed to market.' },
      { controlId: 'CTRL-COMP-01', effectiveness: 'Partially Effective', description: 'Regulatory change is tracked, but translating "deltas" into engineering requirements lacks a formal, rapid process. (Hypothetical Control)' },
    ],
    residualRisk: { likelihood: 3, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: "Establish a cross-functional 'APAC Go-to-Market' pod (Product, Eng, Legal, GRC) to create a streamlined playbook for entering new markets. This includes a rapid APM integration framework and a proactive 'Regulatory Delta' compliance map for each target country.",
      owner: 'CTO & Head of BD, APAC',
      dueDate: '2026-06-30',
    },
    lastReviewed: '2025-08-01',
    pciImplications: `Adopting a new APM in an emerging market triggers several critical PCI DSS considerations. The immediate priority is a **scope analysis** to map how the new payment flow interacts with our Cardholder Data Environment (CDE). This directly impacts our **SAQ eligibility**—a streamlined integration could keep us on a simpler SAQ A-EP, whereas a more complex data flow might require a full SAQ D. Furthermore, the APM vendor is automatically classified as a **critical third-party service provider** under Requirement 12.8, mandating rigorous due diligence. Local APAC regulations, particularly data localization rules, may also influence the architecture of our logging (**Req. 10**) and data storage (**Req. 3, 9**) controls, requiring jurisdictional-specific implementations.`,
    links: [
      { targetId: 'STRAT-003', type: 'Severes', description: 'Intense local competition makes any delay in market entry caused by this risk significantly more damaging.' },
      { targetId: 'COMP-001', type: 'Correlates With', description: 'Difficulties navigating regulatory "deltas" correlate with a higher chance of compliance reporting failures.' },
    ]
  },
  {
    id: 'STRAT-007',
    riskEvent: 'Failure to Capitalize on Biometric Payment Innovation',
    description: 'The risk of inaction or slow execution in developing and deploying next-generation biometric payment solutions (e.g., palm vein) in key APAC markets. This allows agile competitors to establish first-mover advantage, define the market standard, and capture high-value merchants seeking innovative, frictionless payment experiences. The financial impact includes missed revenue opportunities, loss of brand prestige as an innovator, and potential long-term margin erosion.',
    domain: 'Strategic',
    businessProcess: 'Product Innovation & R&D',
    kpi: 'Revenue from Value-Added Services (VAS)',
    kri: 'Competitor Biometric Deployments in Top 5 APAC Markets',
    owner: 'Chief Innovation Officer',
    inherentRisk: { likelihood: 4, impact: 4 },
    rcsa: [
      { controlId: 'CTRL-TEC-16', effectiveness: 'Partially Effective', description: 'The foundational control for managing biometric data exists, but is not yet proven at scale.' },
      { controlId: 'CTRL-TEC-06', effectiveness: 'Partially Effective', description: 'Secure SDLC is in place but needs enhancement for the unique threats against biometric systems (e.g., presentation attacks).' },
    ],
    residualRisk: { likelihood: 3, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: "Launch a phased pilot of the AXIUM PV-9000 terminal in Singapore to gather real-world data on user adoption, transaction speed, and fraud reduction. Concurrently, establish a dedicated regulatory outreach program with MAS and RBI to proactively address compliance concerns around biometric data.",
      owner: 'Head of Product, APAC',
      dueDate: '2026-03-31',
    },
    lastReviewed: '2025-08-05',
    pciImplications: `Introducing palm vein biometrics is a paradigm shift for PCI DSS compliance, moving beyond traditional card-based validation and demanding a **Customized Approach** under v4.0. A QSA assessing this would forego a simple checklist for a deep-dive, risk-based analysis documented in the **Report on Compliance (ROC)**. 

**Key Areas of Scrutiny:**
*   **Req 8 (Authentication):** The core of the innovation. The palm vein scan acts as a 'something you are' biometric factor. We must prove its resistance to spoofing and that the False Acceptance Rate (FAR) is acceptably low. This would be used to meet the objective of MFA, likely in combination with a PIN ('something you know').
*   **Req 3 (Protect Stored Data):** This is paramount. We must demonstrate that the captured palm vein data is **not stored as a raw image**. Instead, it's converted into an **irreversible, encrypted mathematical template**. Evidence like **ART-068** (Secure Enclave Design) would be critical to show that this template is protected with the same rigor as cardholder data.
*   **Req 9.5 (POI Devices):** The physical scanner on the terminal becomes a critical asset. We must demonstrate how we protect the sensor from tampering and substitution, going beyond standard terminal security.
*   **Privacy & Data Usage:** While not a direct PCI control, a QSA will scrutinize our data handling policies (**ART-067**) to ensure biometric data is not used for purposes other than authentication, as this could create additional risk and scope.

**Financial Model Considerations:** The business case hinges on a model where higher security justifies a different fee structure.
*   **Reduced Costs:** Model a **30-50% reduction in chargeback costs** for biometric-verified transactions due to non-repudiation.
*   **Interchange Savings:** Argue for lower Interchange++ fees from card schemes (Visa, Mastercard) as biometric transactions represent a significantly lower risk profile.
*   **New Revenue:** Introduce a 'Biometric Security' fee for merchants, a new Value-Added Service. Or, in the long-term, pivot to an 'Identity-as-a-Service' model where we verify identity for other purposes.
*   **Higher Hardware Cost:** The AXIUM PV-9000 will have a higher upfront cost, impacting the hardware P&L. The model must show a clear ROI path through the above revenue and cost-saving measures.`,
    links: [
      { targetId: 'STRAT-006', type: 'Correlates With', description: 'Competitors leveraging AI could accelerate their own biometric solutions, increasing the urgency of this risk.' },
      { targetId: 'STRAT-004', type: 'Severes', description: 'A lack of specialized security and engineering talent would make it impossible to securely develop and scale this technology.' },
    ]
  },
  {
    id: 'STRAT-008',
    riskEvent: 'Failure to Securely Capitalize on SoftPOS Market Shift',
    description: 'The rapid emergence of Tap-to-Pay solutions (SoftPOS) on consumer devices (COTS) creates a risk of being out-maneuvered by competitors if we cannot offer a secure, compliant solution. Failure to adapt could result in losing the high-volume, low-cost merchant segment and being perceived as a legacy hardware provider.',
    domain: 'Strategic',
    businessProcess: 'Product Innovation & Digital Onboarding',
    kpi: 'Small-Medium Business (SMB) Merchant Acquisition Rate',
    kri: 'Number of SoftPOS solutions launched by competitors in APAC',
    owner: 'Head of Digital Strategy',
    inherentRisk: { likelihood: 5, impact: 4 },
    rcsa: [
      { controlId: 'CTRL-SW-05', effectiveness: 'Partially Effective', description: 'Secure SDLC for mobile applications is defined but not yet hardened against MPoC-specific threats.' },
      { controlId: 'CTRL-SW-06', effectiveness: 'Partially Effective', description: 'Back-end attestation monitoring is architected but not yet deployed at scale.' },
    ],
    residualRisk: { likelihood: 4, impact: 3 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Launch an internal pilot for a "Tap-to-Pay on APAC Device" solution in the Singapore sandbox. Engage a PCI MPoC-certified lab for pre-assessment and gap analysis. Develop a go-to-market strategy focused on micro-merchants.',
      owner: 'Head of Product, APAC',
      dueDate: '2026-04-30',
    },
    lastReviewed: '2025-08-10',
    pciImplications: `SoftPOS solutions completely change the compliance paradigm, shifting focus from hardware (PTS) to software and back-end monitoring under the new **PCI MPoC (Mobile Payments on COTS) standard**.

**Key Areas of Scrutiny for an MPoC solution:**
*   **Application Security:** The payment application itself is the primary security boundary. Evidence like **ART-071** (Penetration Test Report) is critical. The app must demonstrate robust software protection mechanisms (anti-tampering, obfuscation) to protect cryptographic keys in an untrusted environment (the phone's OS).
*   **Back-end Attestation & Monitoring:** This is the core of MPoC. Our servers must continuously receive and validate security attestations from the COTS device. This proves the device's integrity (e.g., not jailbroken, OS is up-to-date, our app hasn't been tampered with). Evidence like **ART-072** (Attestation Service Logs) is essential. The system must be able to remotely deactivate a compromised app in real-time.
*   **No Sensitive Data on COTS:** Unlike traditional terminals, the MPoC standard is extremely strict that no sensitive account data is ever stored on the COTS device, even temporarily. All data must be encrypted by the app and passed directly to the back end.
*   **Vendor Requirements:** The MPoC standard requires us to use a certified Software Development Kit (SDK) and to have our solution validated by a PCI-recognized lab. This introduces new third-party dependencies and risks.`,
    links: [
      { targetId: 'STRAT-003', type: 'Severes', description: 'Local fintech competitors are best positioned to leverage SoftPOS, making this a severe competitive threat.' },
      { targetId: 'CYBER-001', type: 'Correlates With', description: 'A widespread vulnerability in a mobile OS (iOS/Android) would directly impact the security of a large portion of our SoftPOS fleet.' },
    ]
  },
  {
    id: 'CYBER-001',
    riskEvent: 'Cloud Data Breach of Cardholder Data',
    description: 'An external attacker exploits a vulnerability in a public-facing cloud service (e.g., S3 misconfiguration, RCE in an API) to gain unauthorized access to the Cardholder Data Environment (CDE) and exfiltrate sensitive payment data.',
    domain: 'Cybersecurity',
    businessProcess: 'Payment Processing & Data Storage',
    kpi: 'Customer Churn Rate',
    kri: 'Number of high-severity cloud security findings',
    owner: 'CISO',
    frameworkMapping: {
      pci: ['Req 1', 'Req 3', 'Req 6', 'Req 8', 'Req 10', 'Req 11'],
      iso: ['A.5.15', 'A.8.9', 'A.8.20', 'A.8.24', 'A.8.28'],
    },
    inherentRisk: { likelihood: 4, impact: 5 },
    rcsa: [
      { controlId: 'CTRL-TEC-01', effectiveness: 'Effective', description: 'Network segmentation via IaC restricts access to the CDE.' },
      { controlId: 'CTRL-TEC-04', effectiveness: 'Effective', description: 'HSM-based encryption protects data at rest, rendering exfiltrated data unreadable.' },
      { controlId: 'CTRL-TEC-07', effectiveness: 'Partially Effective', description: 'Quarterly vulnerability scans identify known issues, but may miss zero-days.' },
      { controlId: 'CTRL-TEC-09', effectiveness: 'Effective', description: 'SIEM/FIM provides real-time detection of anomalous activity.' },
    ],
    residualRisk: { likelihood: 2, impact: 4 }, // Residual impact remains high
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Continue quarterly penetration testing and expand threat intelligence program to better anticipate emerging threats. Implement additional data leakage prevention (DLP) controls at egress points.',
      owner: 'Head of Security Operations',
      dueDate: '2025-12-31',
    },
    lastReviewed: '2025-07-15',
    links: [
        { targetId: 'COMP-001', type: 'Severes', description: 'A data breach directly triggers and intensifies the consequences of failing to meet regulatory reporting deadlines.'},
        { targetId: '3PRM-001', type: 'Correlates With', description: 'A failure at a key SaaS provider could be an entry point for a data breach, linking third-party risk to direct cyber impact.'}
    ]
  },
  {
    id: 'OPS-001',
    riskEvent: 'Widespread Payment Terminal Firmware Vulnerability',
    description: 'A critical remote code execution (RCE) vulnerability is discovered in the firmware of a major terminal product line (e.g., AXIUM series), affecting thousands of deployed devices across APAC. This could allow attackers to install skimming malware or cause widespread service disruption.',
    domain: 'Operational',
    businessProcess: 'Merchant Point-of-Sale Transactions',
    kpi: 'Terminal Uptime / Availability',
    kri: 'Time-to-patch for critical firmware vulnerabilities',
    owner: 'Head of Terminal Engineering',
    frameworkMapping: {
      pci: ['Req 2', 'Req 6', 'Req 9.5'],
      iso: ['A.8.8', 'A.8.9'],
    },
    inherentRisk: { likelihood: 3, impact: 5 },
    rcsa: [
      { controlId: 'CTRL-TEC-11', effectiveness: 'Effective', description: 'Remote Key Injection (RKI) infrastructure allows for secure, large-scale remote firmware updates.' },
      { controlId: 'CTRL-ORG-01', effectiveness: 'Effective', description: 'Terminal Management System provides a real-time inventory of deployed devices and firmware versions.' },
      { controlId: 'CTRL-TEC-06', effectiveness: 'Partially Effective', description: 'Secure coding practices are in place, but complex embedded systems can still have flaws.' },
    ],
    residualRisk: { likelihood: 2, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Invest in a dedicated hardware security research team to perform proactive fuzzing and code analysis on terminal firmware. Reduce patch deployment SLA for critical vulnerabilities from 30 to 14 days.',
      owner: 'Head of Product Security',
      dueDate: '2026-03-31',
    },
    lastReviewed: '2025-07-10',
    links: [
        { targetId: 'CYBER-001', type: 'Causal Inference', description: 'A compromised terminal fleet could be used as a pivot point to gain access to the central cloud environment.'},
        { targetId: 'STRAT-002', type: 'Severes', description: 'A firmware vulnerability during a supply chain crisis would be catastrophic, as replacing hardware would be impossible.'}
    ]
  },
  {
    id: '3PRM-001',
    riskEvent: 'Critical SaaS Provider Outage',
    description: 'A major outage at a critical, sole-sourced SaaS provider (e.g., our central identity provider, Okta) prevents all internal employees and external merchants from authenticating, effectively halting all business operations and support functions for an extended period.',
    domain: 'Third-Party',
    businessProcess: 'Identity & Access Management',
    kpi: 'System Availability (Internal & External)',
    kri: 'Number of critical single-points-of-failure in the vendor ecosystem',
    owner: 'Head of IT Infrastructure',
    inherentRisk: { likelihood: 2, impact: 5 },
    rcsa: [
      { controlId: 'CTRL-ORG-04', effectiveness: 'Effective', description: 'Annual risk assessment of Okta includes review of their SOC 2 report and DR plans.' },
      { controlId: 'CTRL-TEC-15', effectiveness: 'Partially Effective', description: 'Break-glass procedures for emergency local access exist but are not regularly tested.' },
      { controlId: 'N/A', effectiveness: 'Ineffective', description: 'No technical failover or secondary identity provider is in place.' },
    ],
    residualRisk: { likelihood: 2, impact: 5 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Initiate a project to establish a secondary, emergency identity provider for critical systems. Conduct quarterly, documented tests of the "break-glass" emergency access procedures.',
      owner: 'Head of IT Infrastructure',
      dueDate: '2026-06-30',
    },
    lastReviewed: '2025-07-01',
    links: [
        { targetId: 'CYBER-001', type: 'Correlates With', description: 'A breach at this provider could directly lead to a breach of our environment if credentials or session tokens are compromised.'}
    ]
  },
  {
    id: 'COMP-001',
    riskEvent: 'Failure to Meet APAC Regulatory Reporting Timelines',
    description: 'A significant security incident occurs, but due to process failures or lack of awareness, the company fails to notify the relevant APAC regulator (e.g., MAS 1-hour, CERT-IN 6-hour) within the mandated timeframe, leading to fines, reputational damage, and potential license review.',
    domain: 'Compliance',
    businessProcess: 'Incident Management & Regulatory Reporting',
    kpi: 'Value of Regulatory Fines',
    kri: 'Mean Time to Report Compliance (MTRC)',
    owner: 'Compliance Officer, APAC',
    inherentRisk: { likelihood: 4, impact: 4 },
    rcsa: [
      { controlId: 'CTRL-ORG-06', effectiveness: 'Effective', description: 'APAC-specific Incident Response Plan exists with defined timelines.' },
      { controlId: 'CTRL-ORG-07', effectiveness: 'Partially Effective', description: 'Quarterly tabletop exercises are conducted, but may not cover all APAC jurisdictions in a single year.' },
      { controlId: 'CTRL-TEC-10', effectiveness: 'Partially Effective', description: 'SOAR playbook automates initial triage but manual intervention is required for formal reporting decisions.' },
    ],
    residualRisk: { likelihood: 2, impact: 3 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Enhance SOAR playbook to automatically generate draft regulatory notifications for the compliance team. Increase frequency of tabletop exercises to cover each key APAC jurisdiction annually.',
      owner: 'Head of GRC',
      dueDate: '2026-01-31',
    },
    lastReviewed: '2025-07-20',
    links: [
        { targetId: 'CYBER-001', type: 'Causal Inference', description: 'A major data breach is the most likely trigger for this compliance risk.'}
    ]
  },
  {
    id: 'STRAT-002',
    riskEvent: 'Terminal Supply Chain Disruption',
    description: 'Geopolitical tensions, natural disasters, or a major component shortage (e.g., semiconductors) disrupts the manufacturing and shipping of payment terminals from key factories in China and Vietnam. This prevents fulfillment of new merchant orders and replacement of aging/faulty devices, directly impacting revenue and market share growth.',
    domain: 'Strategic',
    businessProcess: 'Hardware Manufacturing & Logistics',
    kpi: 'Time to Fulfill New Merchant Orders',
    kri: 'Inventory Levels of Critical Terminal Models',
    owner: 'Chief Operating Officer',
    inherentRisk: { likelihood: 3, impact: 5 },
    rcsa: [
      { controlId: 'CTRL-ORG-04', effectiveness: 'Partially Effective', description: 'Dual-sourcing policy for critical components exists but has not been fully implemented for all terminal models.' },
      { controlId: 'CTRL-ORG-01', effectiveness: 'Effective', description: 'Inventory management system provides real-time visibility into stock levels.' },
    ],
    residualRisk: { likelihood: 3, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Accelerate the qualification of a secondary manufacturing partner outside of the primary region (e.g., in Malaysia or Mexico). Increase buffer stock levels for the top 5 terminal models by 20%.',
      owner: 'Head of Supply Chain',
      dueDate: '2026-09-30',
    },
    lastReviewed: '2025-07-28',
    links: [
      { targetId: 'STRAT-005', type: 'Correlates With', description: 'Geopolitical instability is a primary driver of supply chain risk.' },
    ]
  },
  {
    id: 'STRAT-003',
    riskEvent: 'Margin Erosion from Local Fintech Competition',
    description: 'Aggressive, well-funded local fintech competitors in markets like Indonesia and India offer bundled payment and business software solutions at significantly lower price points, forcing Ingenico into a price war that erodes profit margins and devalues our technology-focused value proposition.',
    domain: 'Strategic',
    businessProcess: 'Sales & Marketing',
    kpi: 'Gross Profit Margin per Region',
    kri: 'Competitor Pricing Index',
    owner: 'Head of Sales, APAC',
    inherentRisk: { likelihood: 5, impact: 4 },
    rcsa: [],
    residualRisk: { likelihood: 4, impact: 4 },
    treatmentPlan: {
      strategy: 'Accept',
      details: 'Focus on value-added services (VAS) and superior reliability as key differentiators rather than competing solely on price. Develop targeted marketing campaigns highlighting security, compliance, and enterprise-grade support.',
      owner: 'Chief Marketing Officer',
      dueDate: '2025-12-31',
    },
    lastReviewed: '2025-07-25',
    links: []
  },
  {
    id: 'STRAT-004',
    riskEvent: 'Failure to Attract/Retain GRC & Security Talent',
    description: 'Inability to compete with major tech companies and financial institutions for a limited pool of skilled GRC, cybersecurity, and cloud engineering talent in key APAC hubs like Singapore. This leads to understaffed teams, project delays, burnout, and an inability to maintain operational excellence and innovate.',
    domain: 'Strategic',
    businessProcess: 'Human Resources & Team Management',
    kpi: 'Employee Attrition Rate (Security/GRC)',
    kri: 'Average Time to Fill Critical Security Roles',
    owner: 'Chief Human Resources Officer',
    inherentRisk: { likelihood: 4, impact: 4 },
    rcsa: [],
    residualRisk: { likelihood: 3, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Implement a competitive retention program including professional development budgets, clear career pathing, and remote work flexibility. Partner with regional universities to build a talent pipeline.',
      owner: 'CHRO',
      dueDate: '2026-01-31',
    },
    lastReviewed: '2025-07-22',
    links: [
      { targetId: 'STRAT-001', type: 'Severes', description: 'A lack of skilled talent directly worsens our ability to navigate complex regulatory deltas and execute market expansion.' },
    ]
  },
  {
    id: 'FIN-001',
    riskEvent: 'Adverse Impact from Extreme Currency Volatility',
    description: 'Significant, unforeseen fluctuations in APAC currencies (e.g., IDR, INR vs USD/EUR) negatively impact revenue recognition, profitability of hardware sales, and the cost of cross-border transaction settlements for merchants, making our pricing less predictable and competitive.',
    domain: 'Financial',
    businessProcess: 'Treasury & Financial Planning',
    kpi: 'EBITDA Margin',
    kri: 'Realized Foreign Exchange Gain/Loss',
    owner: 'Chief Financial Officer',
    inherentRisk: { likelihood: 4, impact: 4 },
    rcsa: [],
    residualRisk: { likelihood: 3, impact: 3 },
    treatmentPlan: {
      strategy: 'Transfer',
      details: 'Implement a more aggressive currency hedging strategy for major APAC revenue streams. Explore offering dynamic currency conversion (DCC) services as a new revenue line and merchant benefit.',
      owner: 'Head of Treasury',
      dueDate: '2025-11-30',
    },
    lastReviewed: '2025-07-18',
    links: []
  },
  {
    id: 'STRAT-005',
    riskEvent: 'Market Access Restriction due to Geopolitical Instability',
    description: 'A sudden escalation in geopolitical tensions or changes in trade policy (e.g., between China and Western allies) leads to new tariffs on hardware, restrictions on technology transfer, or outright market access limitations, jeopardizing our operations and investments in a key country.',
    domain: 'Strategic',
    businessProcess: 'International Trade & Government Relations',
    kpi: 'Revenue from Affected Country',
    kri: 'Geopolitical Risk Index (by country)',
    owner: 'General Counsel',
    inherentRisk: { likelihood: 2, impact: 5 },
    rcsa: [],
    residualRisk: { likelihood: 2, impact: 5 },
    treatmentPlan: {
      strategy: 'Accept',
      details: 'This is largely a macroeconomic risk. Mitigation focuses on continuous monitoring of geopolitical events and maintaining a diversified market portfolio to reduce dependency on any single country.',
      owner: 'Head of Strategy',
      dueDate: '2025-12-31',
    },
    lastReviewed: '2025-07-29',
    links: [
      { targetId: 'STRAT-002', type: 'Causal Inference', description: 'Geopolitical events are a direct cause of supply chain disruptions.' },
    ]
  },
  {
    id: '3PRM-002',
    riskEvent: 'Critical Acquiring Bank Partner Failure',
    description: 'A key local acquiring bank partner in a major market (e.g., India) suffers a major operational failure, regulatory sanction, or insolvency. This halts all transaction processing for our merchants using that acquirer, causing immediate revenue loss and requiring a frantic, complex migration to an alternative partner.',
    domain: 'Third-Party',
    businessProcess: 'Transaction Processing & Partner Management',
    kpi: 'Transaction Success Rate',
    kri: 'Percentage of Transaction Volume with a Single Acquirer',
    owner: 'Head of APAC Operations',
    inherentRisk: { likelihood: 2, impact: 5 },
    rcsa: [
      { controlId: 'CTRL-ORG-04', effectiveness: 'Partially Effective', description: 'Due diligence is performed, but concentration risk with single acquirers in some markets is high.' },
    ],
    residualRisk: { likelihood: 2, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'In each key market, identify and complete technical integration with a secondary acquiring bank partner to enable faster failover. Implement dynamic routing capabilities to shift volume away from a failing partner in real-time.',
      owner: 'Head of Engineering, APAC',
      dueDate: '2026-12-31',
    },
    lastReviewed: '2025-07-11',
    links: []
  },
  {
    id: 'STRAT-006',
    riskEvent: 'Disruption from AI in Payment Services',
    description: 'Agile competitors leverage Generative AI and advanced machine learning to offer hyper-personalized merchant analytics, superior fraud detection, or automated support services that are significantly more efficient and effective than our current offerings. This makes our solutions appear outdated, leading to a loss of competitive edge and customer churn.',
    domain: 'Strategic',
    businessProcess: 'Product Development & Innovation',
    kpi: 'Customer Satisfaction (CSAT) Score',
    kri: 'R&D Investment in AI/ML as % of Revenue',
    owner: 'Chief Technology Officer',
    inherentRisk: { likelihood: 4, impact: 4 },
    rcsa: [],
    residualRisk: { likelihood: 3, impact: 4 },
    treatmentPlan: {
      strategy: 'Mitigate',
      details: 'Establish a dedicated AI R&D team focused on payment industry use cases. Launch a pilot program to integrate a GenAI-powered assistant into the merchant support portal. Acquire a small AI startup to accelerate capabilities.',
      owner: 'Head of Innovation',
      dueDate: '2026-06-30',
    },
    lastReviewed: '2025-07-24',
    links: [
       { targetId: 'STRAT-003', type: 'Severes', description: 'Local fintechs are often the first to adopt disruptive tech like AI, worsening their competitive threat.' },
    ]
  }
];

const CASCADING_RISKS: RiskProfile[] = Array(60).fill(null).map((_, i) => {
    const parentRisks = ['CYBER-001', 'OPS-001', 'STRAT-001', '3PRM-001', 'COMP-001'];
    const parentId = parentRisks[i % parentRisks.length];
    
    const owners = ['Head of Finance', 'Marketing Director', 'COO', 'Head of IT', 'General Counsel'];
    const owner = owners[i % owners.length];
    
    const businessProcesses = ['Financial Reporting', 'Brand Management', 'Merchant Support', 'System Maintenance', 'Contract Management'];
    const businessProcess = businessProcesses[i % businessProcesses.length];

    const riskTemplates = {
      'CYBER-001': [
        { d: 'Financial', e: 'Increased costs from fraudulent transactions post-breach' },
        { d: 'Reputational', e: 'Loss of customer trust and brand damage' },
        { d: 'Operational', e: 'Service disruption during incident response and remediation' },
        { d: 'IT', e: 'High cost of forensic investigation and system rebuild' },
        { d: 'Legal', e: 'Litigation costs from affected customers and partners' },
      ],
      'OPS-001': [
        { d: 'Financial', e: 'Cost of mass terminal recall and replacement program' },
        { d: 'Reputational', e: 'Damage to reputation as a secure hardware provider' },
        { d: 'Operational', e: 'Overload of merchant support and logistics channels' },
        { d: 'IT', e: 'Diversion of engineering resources from innovation to patching' },
        { d: 'Legal', e: 'Breach of contract claims from merchants for SLA failures' },
      ],
      'STRAT-001': [
        { d: 'Financial', e: 'Revenue loss from merchant churn to competitors' },
        { d: 'Reputational', e: 'Perception of being technologically behind in key markets' },
        { d: 'Operational', e: 'Sales team struggles to sign new merchants without key features' },
        { d: 'IT', e: 'Scramble to allocate resources for rushed integration project' },
        { d: 'Strategic', e: 'Loss of first-mover advantage in a high-growth region' },
      ],
      '3PRM-001': [
        { d: 'Financial', e: 'Direct revenue loss from inability to process transactions or onboard merchants' },
        { d: 'Reputational', e: 'Damage to credibility from relying on a single vendor' },
        { d: 'Operational', e: 'Complete halt of internal operations and merchant support' },
        { d: 'IT', e: 'Inability for administrators to access and manage systems' },
        { d: 'Legal', e: 'Failure to meet contractual SLAs with our own customers' },
      ],
      'COMP-001': [
        { d: 'Financial', e: 'Direct financial loss from regulatory fines and penalties' },
        { d: 'Reputational', e: 'Damage to reputation as a trusted, compliant partner' },
        { d: 'Operational', e: 'Increased scrutiny and mandatory audits from regulators' },
        { d: 'IT', e: 'Forced implementation of costly, regulator-mandated controls' },
        { d: 'Legal', e: 'Potential for operating license to be reviewed or revoked' },
      ],
    };
    
    const template = riskTemplates[parentId as keyof typeof riskTemplates][i % riskTemplates[parentId as keyof typeof riskTemplates].length];

    return {
      id: `${template.d.substring(0,4).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      riskEvent: template.e,
      description: `This operational risk is a direct consequence of the parent risk ${parentId}.`,
      domain: template.d as RiskDomain,
      businessProcess: businessProcess,
      owner: owner,
      inherentRisk: { likelihood: 4, impact: 3 },
      rcsa: [{ controlId: 'N/A', effectiveness: 'Partially Effective', description: 'Local departmental procedures provide some mitigation.' }],
      residualRisk: { 
          likelihood: (2 + Math.floor(Math.random() * 2)) as 2 | 3,
          impact: (2 + Math.floor(Math.random() * 2)) as 2 | 3
      },
      lastReviewed: `2025-0${1+ (i%7)}-${1+ (i%28)}`,
      cascadesFrom: parentId,
    };
});


export const RISK_UNIVERSE_DATA: RiskProfile[] = [...STRATEGIC_RISKS, ...CASCADING_RISKS];