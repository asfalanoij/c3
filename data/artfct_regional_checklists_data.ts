import type { RegionalChecklist, RegionKey } from '../types';
import { Bell, Database, Shield, Users, Server, AlertTriangle } from 'lucide-react';

export const REGIONAL_CHECKLISTS_DATA: Record<Exclude<RegionKey, 'overview'>, RegionalChecklist> = {
  sgp: {
    framework: "MAS Technology Risk Management (TRM) Guidelines",
    regulator: "Monetary Authority of Singapore (MAS)",
    keyMetrics: [
      { label: "Breach Notification", value: "1 Hour", icon: Bell },
      { label: "Data Centre Location", value: "No Restriction", icon: Server }
    ],
    apmCompliance: [
      { 
        id: 'sgp-grabpay', 
        name: 'GrabPay', 
        icon: 'bg-green-500', 
        status: 'Live',
        regulator: 'MAS',
        lastReviewDate: '2025-07-15',
        keyRisks: [
          'Adherence to MAS Cyber Hygiene notices.',
          'Flow-through compliance for underlying BaaS provider.',
          'Availability and resilience of API endpoints.',
        ]
      },
      { 
        id: 'sgp-alipay', 
        name: 'Alipay', 
        icon: 'bg-blue-500', 
        status: 'Live',
        regulator: 'MAS',
        lastReviewDate: '2025-07-15',
        keyRisks: [
          'Cross-border data transfer considerations for transactions processed outside Singapore.',
          'Integration with third-party acquirers must be PCI DSS compliant.',
        ]
      },
    ],
    categories: [
      {
        name: "Governance & Strategy",
        description: "Board and senior management oversight of technology risk.",
        items: [
          { id: 'sgp-gov-1', control: "Board & Senior Management Oversight", description: "Establish and maintain a technology risk management framework that is approved by the Board.", status: "Implemented", evidence: "ART-045, ART-062", notes: "Board meeting minutes from Q1 formally approved the 2024 TRM Framework document." },
          { id: 'sgp-gov-2', control: "Defined Roles & Responsibilities", description: "Ensure that roles and responsibilities for technology risk management are clearly defined and segregated.", status: "Implemented", evidence: "ART-014", notes: "RACI chart for TRM is documented in Confluence and reviewed annually." },
        ]
      },
      {
        name: "Incident Response & Reporting",
        description: "Timely detection, response, and reporting of security incidents.",
        items: [
          { id: 'sgp-ir-1', control: "1-Hour Notification for Severe Incidents", description: "Notify MAS no later than 1 hour upon discovery of a 'severe system security incident'.", status: "Implemented", evidence: "ART-006, ART-045", notes: "SOAR playbook has an automated workflow to draft and send a notification to the compliance team for review and submission within 30 minutes of a P1 incident classification." },
          { id: 'sgp-ir-2', control: "Root Cause Analysis (RCA)", description: "Submit a detailed RCA report to MAS within 14 days for severe incidents.", status: "Implemented", evidence: "ART-044", notes: "Our IR plan includes a mandatory post-mortem process with a 10-day internal deadline for the RCA report." },
          { id: 'sgp-ir-3', control: "Annual IR Testing", description: "Conduct regular scenario-based cybersecurity exercises and penetration tests.", status: "In Progress", evidence: "ART-044, ART-029", notes: "Annual data breach tabletop was completed in Q3. Penetration testing is ongoing, results pending." },
        ]
      },
       {
        name: "Cyber Hygiene & Controls",
        description: "Baseline security controls mandated by MAS notices.",
        items: [
          { id: 'sgp-ch-1', control: "Multi-Factor Authentication (MFA)", description: "Implement MFA for all administrative access and for access to sensitive systems.", status: "Implemented", evidence: "ART-015, ART-039", notes: "MFA via Okta is enforced for all CDE access and privileged cloud console access." },
          { id: 'sgp-ch-2', control: "Patch Management", description: "Address critical system vulnerabilities in a timely manner.", status: "Implemented", evidence: "ART-026, ART-027", notes: "Patch SLA is 14 days for critical vulnerabilities, tracked in the KRI dashboard." },
          { id: 'sgp-ch-3', control: "Network Segmentation", description: "Implement network segmentation to isolate critical systems from other zones.", status: "Implemented", evidence: "ART-003, ART-029", notes: "CDE is isolated in its own VPC with strict ingress/egress rules, validated by annual penetration tests." },
        ]
      },
    ]
  },
  idn: {
    framework: "OJK Regulation & UU PDP",
    regulator: "Otoritas Jasa Keuangan (OJK) & Ministry of Communication",
     keyMetrics: [
      { label: "Breach Notification", value: "72 Hours", icon: Bell },
      { label: "Data Centre Location", value: "Onshore Required", icon: Server }
    ],
    apmCompliance: [
       { 
        id: 'idn-qris', 
        name: 'QRIS (QR Code Indonesian Standard)', 
        icon: 'bg-red-500', 
        status: 'Monitoring',
        regulator: 'Bank Indonesia (BI) & ASPI',
        lastReviewDate: '2025-08-01',
        keyRisks: [
          'Strict adherence to ASPI technical & security standards is mandatory.',
          'Interoperability testing with all major issuers (banks, e-wallets) is required.',
          'Data processing must comply with OJK data residency and UU PDP regulations.',
          'Dispute resolution workflows must align with the national standard for chargebacks.',
          'Transaction monitoring must be adapted for real-time, multi-issuer QRIS flows.'
        ]
      },
       { 
        id: 'idn-gopay', 
        name: 'GoPay', 
        icon: 'bg-sky-500', 
        status: 'Live',
        regulator: 'Bank Indonesia / OJK',
        lastReviewDate: '2025-06-20',
        keyRisks: [
          'Data must be processed and stored in the onshore Indonesian data center.',
          'Third-party agreements must comply with OJK outsourcing regulations.',
          'Compliance with UU PDP for user consent and data handling.',
        ]
      },
       { 
        id: 'idn-shopeepay', 
        name: 'ShopeePay', 
        icon: 'bg-orange-500', 
        status: 'Onboarding',
        regulator: 'Bank Indonesia / OJK',
        lastReviewDate: '2025-07-28',
        keyRisks: [
          'Technical integration requires new firewall rules and API security review.',
          'Vendor due diligence (3PRM) in progress to meet OJK requirements.',
          'Data flow diagrams must be updated to include ShopeePay transaction paths.',
        ]
      },
    ],
    categories: [
      {
        name: "Data Governance & Sovereignty",
        description: "Controls related to data residency and cross-border data transfer.",
        items: [
          { id: 'idn-gov-1', control: "Onshore Data Center for PSE", description: "As a Public Electronic System Operator (PSE), maintain a primary data center within Indonesia.", status: "Implemented", evidence: "Equinix-JK1 Contract", notes: "Primary CDE for Indonesian transactions is located in Equinix JK1 (Jakarta). Data is not mirrored offshore." },
          { id: 'idn-gov-2', control: "Cross-Border Data Transfer", description: "Ensure adequate protection and obtain user consent for any cross-border transfer of personal data.", status: "Planned", evidence: "Data Transfer Impact Assessment (Q4)", notes: "Legal is reviewing requirements for processing data of Indonesian citizens who transact outside of Indonesia." },
        ]
      },
      {
        name: "IT Risk Management (POJK)",
        description: "Requirements under OJK Regulation No. 38/POJK.03/2016 concerning IT Risk Management.",
        items: [
          { id: 'idn-itrm-1', control: "Third-Party Outsourcing Risk", description: "Conduct due diligence and establish clear contracts with any third parties involved in IT service delivery.", status: "In Progress", evidence: "ART-016, ART-046", notes: "Current 3PRM program is being updated to include OJK-specific clauses in all vendor contracts for the Indonesian market." },
          { id: 'idn-itrm-2', control: "Disaster Recovery Center (DRC)", description: "Maintain a DRC within Indonesia with regular testing.", status: "Implemented", evidence: "DR Test Report Q2", notes: "DR site is located in a separate seismic zone in Surabaya. Last failover test was successful." },
        ]
      },
      {
        name: "Personal Data Protection (UU PDP)",
        description: "Compliance with Indonesia's Personal Data Protection Law.",
        items: [
          { id: 'idn-pdp-1', control: "Lawful Basis for Processing", description: "Ensure a valid lawful basis (e.g., consent, contract) for all personal data processing activities.", status: "Implemented", evidence: "Privacy Policy v3.1", notes: "Explicit consent is captured at the time of transaction." },
          { id: 'idn-pdp-2', control: "72-Hour Breach Notification", description: "Notify the regulator and data subjects within 72 hours of discovering a personal data breach.", status: "Implemented", evidence: "ART-045 (IDN Appendix)", notes: "IR plan includes specific templates and procedures for UU PDP notifications." },
        ]
      }
    ]
  },
  ind: {
    framework: "RBI Cybersecurity Framework & Data Localisation",
    regulator: "Reserve Bank of India (RBI)",
    keyMetrics: [
      { label: "Breach Notification", value: "6 Hours", icon: Bell },
      { label: "Data Localisation", value: "Strictly Onshore", icon: Database }
    ],
    categories: [
        {
            name: "Data Localisation",
            description: "Mandatory storage of all payment system data within India.",
            items: [
                { id: 'ind-dl-1', control: "Exclusive In-Country Storage", description: "All payment system data must be stored in systems located only within India.", status: "Implemented", evidence: "India DC Audit Report", notes: "Dedicated data center in Mumbai. Geo-blocking policies are in place to prevent data transfer outside India." },
                { id: 'ind-dl-2', control: "No Offshore Mirroring", description: "Data cannot be mirrored or copied to any offshore location, even for DR purposes.", status: "Implemented", evidence: "DR Architecture Diagram", notes: "DR site is located in Chennai. No cross-border replication is configured." },
            ]
        },
        {
            name: "Cybersecurity Framework",
            description: "Adherence to the RBI's guidelines on cybersecurity for financial institutions.",
            items: [
                { id: 'ind-csf-1', control: "SOC for Cyber Security", description: "Establish a Security Operations Center (SOC) for continuous monitoring.", status: "Implemented", evidence: "ART-005, ART-022", notes: "Our central SIEM/SOC monitors the India environment 24/7." },
                { id: 'ind-csf-2', control: "Vulnerability Management", description: "Conduct regular vulnerability assessments and penetration testing.", status: "Implemented", evidence: "ART-007, ART-029", notes: "Quarterly VA scans and annual penetration tests are conducted specifically for the India infrastructure." },
                { id: 'ind-csf-3', control: "Third-Party Risk", description: "Manage risks associated with third-party service providers.", status: "In Progress", evidence: "ART-016", notes: "3PRM program is being extended to cover all local Indian vendors." },
            ]
        },
        {
            name: "Incident Reporting (CERT-In)",
            description: "Reporting obligations to the Indian Computer Emergency Response Team.",
            items: [
                { id: 'ind-ir-1', control: "6-Hour Incident Reporting", description: "Report specified types of cybersecurity incidents to CERT-In within 6 hours of discovery.", status: "Implemented", evidence: "ART-045 (IND Appendix)", notes: "SOAR playbook has a high-priority workflow for CERT-In reporting." },
            ]
        }
    ]
  },
  hkg: {
    framework: "HKMA Cybersecurity Resilience Assessment Framework (C-RAF)",
    regulator: "Hong Kong Monetary Authority (HKMA)",
    keyMetrics: [
      { label: "Maturity Level", value: "Level 3", icon: Shield },
      { label: "Assessment Frequency", value: "Annual", icon: Users }
    ],
     categories: [
        {
            name: "C-RAF Assessment",
            description: "Annual self-assessment against the C-RAF framework.",
            items: [
                { id: 'hkg-raf-1', control: "Annual Self-Assessment", description: "Complete the C-RAF assessment workbook and determine the current maturity level.", status: "Implemented", evidence: "C-RAF 2024 Workbook", notes: "Self-assessed at Maturity Level 3 (Established)." },
                { id: 'hkg-raf-2', control: "Board Endorsement", description: "The results of the C-RAF assessment must be endorsed by the Board of Directors.", status: "Implemented", evidence: "Board Meeting Minutes Q2", notes: "Board formally accepted the Level 3 assessment in the last quarterly meeting." },
            ]
        },
        {
            name: "Incident Response",
            description: "Incident reporting and management requirements.",
            items: [
                { id: 'hkg-ir-1', control: "Prompt Incident Notification", description: "Notify the HKMA 'promptly' of any significant cybersecurity incident.", status: "Implemented", evidence: "ART-045 (HKG Appendix)", notes: "Internal SLA for 'prompt' notification is defined as within 72 hours, with an initial alert within 24 hours." },
            ]
        },
        {
            name: "Outsourcing (SPM TM-E-1)",
            description: "Controls for outsourcing IT services.",
            items: [
                { id: 'hkg-out-1', control: "Vendor Due Diligence", description: "Perform thorough due diligence on any third-party service providers.", status: "In Progress", evidence: "ART-016", notes: "3PRM program covers due diligence; updating contracts to include HKMA right-to-audit clauses." },
            ]
        }
    ]
  },
  aus: {
    framework: "AUSTRAC AML/CTF & APRA CPS 234",
    regulator: "AUSTRAC & APRA",
     keyMetrics: [
      { label: "SMR Reporting", value: "< 3 Days", icon: AlertTriangle },
      { label: "CPS 234 Notification", value: "72 Hours", icon: Bell }
    ],
    categories: [
        {
            name: "Anti-Money Laundering (AUSTRAC)",
            description: "Requirements under the Anti-Money Laundering and Counter-Terrorism Financing Act.",
            items: [
                { id: 'aus-aml-1', control: "Suspicious Matter Reporting (SMR)", description: "Submit SMRs to AUSTRAC within 3 business days of forming a suspicion.", status: "Implemented", evidence: "AUSTRAC Portal Submission Logs", notes: "Transaction monitoring system automatically flags suspicious activity for analyst review." },
                { id: 'aus-aml-2', control: "AML/CTF Program", description: "Maintain a documented and risk-based AML/CTF program.", status: "Implemented", evidence: "AML/CTF Program Document v2.5", notes: "Program reviewed and approved by the Board annually." },
                { id: 'aus-aml-3', control: "Know Your Customer (KYC)", description: "Perform customer identification and verification.", status: "Implemented", evidence: "ART-046 (KYC Vendor)", notes: "Process outsourced to a specialized KYC provider; vendor is monitored via 3PRM." },
            ]
        },
        {
            name: "Information Security (APRA CPS 234)",
            description: "Prudential Standard for Information Security.",
            items: [
                { id: 'aus-cps-1', control: "Defined Roles & Responsibilities", description: "Clearly define information security-related roles and responsibilities.", status: "Implemented", evidence: "ART-014", notes: "RACI chart for CPS 234 is documented." },
                { id: 'aus-cps-2', control: "Information Asset Identification", description: "Identify and classify all critical and sensitive information assets.", status: "Implemented", evidence: "Data Classification Policy", notes: "Asset inventory maintained in CMDB." },
                { id: 'aus-cps-3', control: "Control Effectiveness Testing", description: "Test the effectiveness of security controls through a systematic testing program.", status: "In Progress", evidence: "ART-007, ART-029", notes: "VA scanning and penetration testing are in place. A formalized control testing methodology is under development." },
                { id: 'aus-cps-4', control: "72-Hour Incident Notification", description: "Notify APRA within 72 hours of becoming aware of a material information security incident.", status: "Implemented", evidence: "ART-045 (AUS Appendix)", notes: "IR plan defines 'materiality' and includes the 72-hour notification workflow." },
            ]
        }
    ]
  },
};