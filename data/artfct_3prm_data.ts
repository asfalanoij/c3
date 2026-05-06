import type { ThirdPartyVendor } from '../types';

export const VENDORS: ThirdPartyVendor[] = [
  {
    id: 52,
    name: 'DBS Bank (APAC AXIUM Partner)',
    service: 'Acquiring Services & Terminal Deployment',
    category: 'Strategic Partner / Acquirer',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 4 },
    residualRisk: { impact: 3, likelihood: 2 },
    lastAssessed: '2025-07-30',
    riskScenario: 'A security flaw in our AXIUM terminal firmware is exploited, leading to a data breach for DBS merchants. This violates our partnership agreement, triggers regulatory scrutiny from MAS, and causes severe reputational damage.',
    contractClauses: {
        rightToAudit: true,
        breachNotificationSla: '4 hours (contractual)',
    },
    checklist: [
        { id: 'dbs-pci-aoc', category: 'Compliance', control: 'DBS PCI DSS AOC on file', status: 'Pass' },
        { id: 'dbs-shared-resp', category: 'Security', control: 'PCI DSS Shared Responsibility Matrix Review', status: 'In Progress' },
        { id: 'dbs-joint-ir', category: 'Security', control: 'Joint Incident Response Playbook Tested', status: 'Planned' },
        { id: 'dbs-api-sec', category: 'Security', control: 'Secure API Integration for Settlement', status: 'Pass' },
    ],
    alerts: [
        { type: 'Compliance', severity: 'Medium', description: 'Quarterly review of shared responsibility matrix is overdue by 15 days.' }
    ]
  },
  // Cloud Provider
  {
    id: 1,
    name: 'Amazon Web Services',
    service: 'IaaS/PaaS Provider',
    category: 'Cloud Provider',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 4 }, // score 20
    residualRisk: { impact: 3, likelihood: 2 }, // score 6
    lastAssessed: '2024-06-15',
    riskScenario: 'Widespread S3 misconfiguration by our internal teams leads to sensitive data exposure. Although an AWS service, the risk lies in our implementation.',
    contractClauses: {
      rightToAudit: true, // Through their certs like SOC2
      breachNotificationSla: 'As per AWS agreement',
    },
    checklist: [
      { id: 'aws-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
      { id: 'aws-pci', category: 'Compliance', control: 'PCI DSS Level 1 AOC', status: 'Pass' },
      { id: 'aws-sec-iam', category: 'Security', control: 'Strong IAM Controls Available', status: 'Pass' },
      { id: 'aws-sec-enc', category: 'Security', control: 'Data-at-Rest Encryption by Default', status: 'Pass' },
      { id: 'aws-avail-sla', category: 'Availability', control: '99.99% Uptime SLA', status: 'Pass' },
    ],
    alerts: [],
  },
  // DevOps Toolchain
  {
    id: 6,
    name: 'CircleCI',
    service: 'CI/CD Platform',
    category: 'DevOps Toolchain',
    status: 'In Remediation',
    inherentRisk: { impact: 5, likelihood: 5 }, // score 25
    residualRisk: { impact: 4, likelihood: 4 }, // score 16
    lastAssessed: '2024-04-12',
    riskScenario: 'A compromised build agent or a malicious build configuration could steal production secrets (API keys, credentials) used during the deployment process.',
    contractClauses: {
        rightToAudit: false,
        breachNotificationSla: '72 hours',
    },
    checklist: [
        { id: 'cci-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'cci-sec-secrets', category: 'Security', control: 'Secure Secrets Management (OIDC)', status: 'In Progress' },
        { id: 'cci-sec-audit', category: 'Security', control: 'Immutable Audit Logs', status: 'Fail' },
        { id: 'cci-priv-data', category: 'Privacy', control: 'Data Segregation', status: 'Pass' },
    ],
    alerts: [
        { type: 'Security', severity: 'High', description: 'Recent security incident involving exposure of customer secrets. Remediation plan is being monitored.'}
    ]
  },
  // Hardware/Firmware
  {
    id: 11,
    name: 'Company X Hardware Division',
    service: 'POS Terminals (EDC)',
    category: 'Hardware/Firmware',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 4 }, // score 20
    residualRisk: { impact: 2, likelihood: 2 }, // score 4
    lastAssessed: '2024-06-18',
    riskScenario: 'A vulnerability in the terminal firmware allows for remote code execution, potentially enabling card data skimming.',
    contractClauses: {
        rightToAudit: true,
        breachNotificationSla: 'Internal',
    },
    checklist: [
        { id: 'hdw-p2pe', category: 'Security', control: 'P2PE Validated Solution', status: 'Pass' },
        { id: 'hdw-pci-pts', category: 'Compliance', control: 'PCI PTS v6 Certification', status: 'Pass' },
        { id: 'hdw-rki', category: 'Security', control: 'Remote Key Injection (RKI) Support', status: 'Pass' },
    ],
    alerts: [],
  },
  // Data Processor
  {
    id: 18,
    name: 'Twilio SendGrid',
    service: 'Transactional Email API',
    category: 'Data Processor',
    status: 'Needs Review',
    inherentRisk: { impact: 3, likelihood: 5 }, // score 15
    residualRisk: { impact: 3, likelihood: 3 }, // score 9
    lastAssessed: '2023-12-15',
    riskScenario: 'Compromise of our SendGrid API key allows an attacker to send phishing emails from our domain, damaging brand reputation.',
    contractClauses: {
        rightToAudit: false,
        breachNotificationSla: '48 hours',
    },
    checklist: [
        { id: 'tsg-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'tsg-sec-api', category: 'Security', control: 'API Key IP Allow-listing', status: 'In Progress' },
        { id: 'tsg-priv-gdpr', category: 'Privacy', control: 'GDPR Compliance', status: 'Pass' },
    ],
    alerts: [
        { type: 'Security', severity: 'Medium', description: 'Recent reports of increased phishing campaigns originating from the platform. Awaiting vendor response.'}
    ]
  },
  // Managed Service
  {
    id: 27,
    name: 'IT-Global-Outsource',
    service: 'Offshore IT Support',
    category: 'Managed Service',
    status: 'Needs Review',
    inherentRisk: { impact: 4, likelihood: 4 }, // score 16
    residualRisk: { impact: 4, likelihood: 4 }, // score 16
    lastAssessed: '2023-10-30',
    riskScenario: 'An insider at the outsourced IT helpdesk abuses their access to reset passwords and gain unauthorized access to internal systems.',
    contractClauses: {
        rightToAudit: true,
        breachNotificationSla: '24 hours',
    },
    checklist: [
        { id: 'igo-iso27k', category: 'Compliance', control: 'ISO 27001 Certification', status: 'Pass' },
        { id: 'igo-sec-bgc', category: 'Security', control: 'Background Checks for Staff', status: 'Fail' },
        { id: 'igo-sec-access', category: 'Security', control: 'Least Privilege Access Model', status: 'Fail' },
        { id: 'igo-avail-dr', category: 'Availability', control: 'Documented DR Plan', status: 'In Progress' },
    ],
    alerts: [
        { type: 'Security', severity: 'High', description: 'Lack of background checks for privileged staff poses a significant insider threat risk.' },
        { type: 'Operational', severity: 'Medium', description: 'SLA for ticket response times were missed for the last two quarters.' }
    ]
  },
  // Software Library
  {
    id: 31,
    name: 'Log4j',
    service: 'Java Logging Library',
    category: 'Software Library',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 5 }, // score 25
    residualRisk: { impact: 2, likelihood: 2 }, // score 4
    lastAssessed: '2024-07-12',
    riskScenario: 'A critical RCE vulnerability (like Log4Shell) is discovered, making almost all Java applications vulnerable to immediate, widespread attack.',
    contractClauses: {
        rightToAudit: false,
        breachNotificationSla: 'N/A',
    },
    checklist: [
        { id: 'l4j-sec-sbom', category: 'Security', control: 'Included in SBOM', status: 'Pass' },
        { id: 'l4j-sec-scan', category: 'Security', control: 'Snyk Scans for Vulnerabilities', status: 'Pass' },
        { id: 'l4j-sec-waf', category: 'Security', control: 'WAF Virtual Patching Rules', status: 'Pass' },
    ],
    alerts: [],
  },
  {
    id: 32,
    name: 'Google Cloud Platform',
    service: 'IaaS/PaaS Provider',
    category: 'Cloud Provider',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 4 },
    residualRisk: { impact: 3, likelihood: 2 },
    lastAssessed: '2024-06-20',
    riskScenario: 'Accidental exposure of BigQuery datasets containing transaction metadata due to IAM misconfiguration.',
    contractClauses: { rightToAudit: true, breachNotificationSla: 'As per GCP agreement' },
    checklist: [
        { id: 'gcp-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'gcp-pci', category: 'Compliance', control: 'PCI DSS Level 1 AOC', status: 'Pass' },
        { id: 'gcp-sec-iam', category: 'Security', control: 'Granular IAM Controls', status: 'Pass' },
        { id: 'gcp-avail-sla', category: 'Availability', control: '99.99% Uptime SLA', status: 'Pass' },
    ],
    alerts: []
  },
  {
    id: 33,
    name: 'Microsoft Azure',
    service: 'IaaS/PaaS Provider',
    category: 'Cloud Provider',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 4 },
    residualRisk: { impact: 3, likelihood: 2 },
    lastAssessed: '2024-06-18',
    riskScenario: 'Vulnerability in a managed Azure service (e.g., Azure Functions) is exploited, allowing an attacker to pivot into our CDE.',
    contractClauses: { rightToAudit: true, breachNotificationSla: 'As per Azure agreement' },
    checklist: [
        { id: 'az-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'az-pci', category: 'Compliance', control: 'PCI DSS Level 1 AOC', status: 'Pass' },
        { id: 'az-sec-entra', category: 'Security', control: 'Entra ID for Identity', status: 'Pass' },
        { id: 'az-avail-sla', category: 'Availability', control: '99.99% Uptime SLA', status: 'Pass' },
    ],
    alerts: []
  },
  {
    id: 34,
    name: 'Alibaba Cloud',
    service: 'IaaS/PaaS for China Market',
    category: 'Cloud Provider',
    status: 'Needs Review',
    inherentRisk: { impact: 5, likelihood: 5 },
    residualRisk: { impact: 4, likelihood: 3 },
    lastAssessed: '2023-11-01',
    riskScenario: 'Data sovereignty and access concerns related to operating within China. Failure to comply with local regulations (e.g., CSL, DSL) could lead to operational shutdown.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '48 hours' },
    checklist: [
        { id: 'ali-compliance', category: 'Compliance', control: 'MLPS Level 3 Certification', status: 'Pass' },
        { id: 'ali-sec-access', category: 'Security', control: 'Data Access Controls', status: 'Fail' },
        { id: 'ali-avail-sla', category: 'Availability', control: 'China Region SLA', status: 'Pass' },
        { id: 'ali-priv-xborder', category: 'Privacy', control: 'Cross-Border Data Transfer', status: 'In Progress' }
    ],
    alerts: [{ type: 'Compliance', severity: 'High', description: 'Annual assessment overdue. Cross-border data transfer controls need urgent validation.' }]
  },
  {
    id: 35,
    name: 'Equinix',
    service: 'Data Center Colocation',
    category: 'Physical Security',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 2 },
    residualRisk: { impact: 2, likelihood: 1 },
    lastAssessed: '2024-05-10',
    riskScenario: 'Unauthorized physical access to our CDE cage within the Equinix facility, leading to hardware tampering or theft.',
    contractClauses: { rightToAudit: true, breachNotificationSla: '24 hours' },
    checklist: [
        { id: 'eqnx-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'eqnx-pci', category: 'Compliance', control: 'PCI DSS Physical Security', status: 'Pass' },
        { id: 'eqnx-sec-access', category: 'Security', control: 'Biometric Access Controls', status: 'Pass' },
        { id: 'eqnx-avail-power', category: 'Availability', control: 'Power/Cooling Redundancy', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 36,
    name: 'CrowdStrike',
    service: 'Endpoint Detection & Response (EDR)',
    category: 'Managed Service',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 4 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-07-01',
    riskScenario: 'A sophisticated adversary bypasses CrowdStrike EDR, allowing malware to execute undetected on a critical CDE server.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '24 hours' },
    checklist: [
        { id: 'cs-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'cs-sec-intel', category: 'Security', control: 'Threat Intelligence Integration', status: 'Pass' },
        { id: 'cs-avail-cloud', category: 'Availability', control: 'Cloud-native Platform', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 37,
    name: 'Palo Alto Networks',
    service: 'Next-Gen Firewalls',
    category: 'Hardware/Firmware',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 3 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-04-30',
    riskScenario: 'A zero-day vulnerability in PAN-OS allows an external attacker to bypass the perimeter firewall and gain access to the internal network.',
    contractClauses: { rightToAudit: false, breachNotificationSla: 'Vendor advisory' },
    checklist: [
        { id: 'pa-cc', category: 'Compliance', control: 'Common Criteria Certification', status: 'Pass' },
        { id: 'pa-sec-threat', category: 'Security', control: 'Threat Prevention Subscriptions', status: 'Pass' },
        { id: 'pa-avail-ha', category: 'Availability', control: 'High Availability (HA) Pair', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 38,
    name: 'Akamai',
    service: 'CDN & WAF Provider',
    category: 'Managed Service',
    status: 'Monitored',
    inherentRisk: { impact: 4, likelihood: 5 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-06-25',
    riskScenario: 'A large-scale DDoS attack overwhelms Akamai\'s mitigation capabilities, causing a prolonged outage of our public-facing payment APIs.',
    contractClauses: { rightToAudit: false, breachNotificationSla: 'Vendor status page' },
    checklist: [
        { id: 'akam-pci', category: 'Compliance', control: 'PCI DSS Level 1 AOC', status: 'Pass' },
        { id: 'akam-sec-ddos', category: 'Security', control: 'DDoS Mitigation SLA', status: 'Pass' },
        { id: 'akam-avail-dist', category: 'Availability', 'control': 'Globally Distributed Network', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 39,
    name: 'Tenable.io',
    service: 'Vulnerability Management Platform',
    category: 'DevOps Toolchain',
    status: 'Monitored',
    inherentRisk: { impact: 4, likelihood: 4 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-07-10',
    riskScenario: 'A compromised Tenable scanner with privileged credentials could be used by an attacker to map the internal network and discover vulnerabilities.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '48 hours' },
    checklist: [
        { id: 'tenb-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'tenb-sec-auth', category: 'Security', control: 'Role-Based Access Control', status: 'Pass' },
        { id: 'tenb-sec-pci', category: 'Compliance', control: 'PCI ASV Certified', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 40,
    name: 'Stripe',
    service: 'Payment Processing Partner',
    category: 'Data Processor',
    status: 'Monitored',
    inherentRisk: { impact: 4, likelihood: 3 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-05-15',
    riskScenario: 'An API integration error with Stripe leads to incorrect transaction reconciliation, causing financial discrepancies and merchant disputes.',
    contractClauses: { rightToAudit: true, breachNotificationSla: '24 hours' },
    checklist: [
        { id: 'strp-pci', category: 'Compliance', control: 'PCI DSS Level 1 AOC', status: 'Pass' },
        { id: 'strp-sec-api', category: 'Security', control: 'Robust API Versioning', status: 'Pass' },
        { id: 'strp-avail-uptime', category: 'Availability', control: 'High Uptime Platform', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 41,
    name: 'Adyen',
    service: 'Unified Commerce Platform',
    category: 'Data Processor',
    status: 'Onboarding',
    inherentRisk: { impact: 5, likelihood: 4 },
    residualRisk: { impact: 4, likelihood: 3 },
    lastAssessed: '2024-07-20',
    riskScenario: 'Onboarding Adyen as a new acquiring partner. Risk of misconfiguration during integration, potentially exposing sensitive data or disrupting transaction flows.',
    contractClauses: { rightToAudit: true, breachNotificationSla: '24 hours' },
    checklist: [
        { id: 'ady-pci', category: 'Compliance', control: 'PCI DSS Level 1 AOC', status: 'In Progress' },
        { id: 'ady-sec-due', category: 'Security', control: 'Security Due Diligence', status: 'In Progress' },
        { id: 'ady-priv-dpa', category: 'Privacy', control: 'Data Processing Agreement', status: 'In Progress' }
    ],
    alerts: []
  },
  {
    id: 42,
    name: 'Paytm',
    service: 'Indian APM Partner',
    category: 'Data Processor',
    status: 'Monitored',
    inherentRisk: { impact: 4, likelihood: 4 },
    residualRisk: { impact: 3, likelihood: 3 },
    lastAssessed: '2024-03-10',
    riskScenario: 'Regulatory action by the RBI against Paytm Payments Bank causes disruption to our merchants in India who rely on Paytm for QR code payments.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '72 hours' },
    checklist: [
        { id: 'paytm-pci', category: 'Compliance', control: 'PCI DSS Compliant', status: 'Pass' },
        { id: 'paytm-sec-rbi', category: 'Compliance', control: 'Adherence to RBI Framework', status: 'Fail' },
        { id: 'paytm-avail-api', category: 'Availability', control: 'API Uptime SLA', status: 'Pass' }
    ],
    alerts: [{ type: 'Compliance', severity: 'Medium', description: 'Ongoing regulatory scrutiny of vendor by RBI. Monitoring for service impact.' }]
  },
  {
    id: 43,
    name: 'GrabPay',
    service: 'SEA APM Partner',
    category: 'Data Processor',
    status: 'Monitored',
    inherentRisk: { impact: 3, likelihood: 3 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-06-05',
    riskScenario: 'Frequent API changes from GrabPay without sufficient notice break our integration, causing transaction failures for merchants in Singapore and Indonesia.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '48 hours' },
    checklist: [
        { id: 'grab-mas', category: 'Compliance', control: 'MAS PSA License', status: 'Pass' },
        { id: 'grab-sec-api', category: 'Security', control: 'Stable API and Docs', status: 'Pass' },
        { id: 'grab-avail-sla', category: 'Availability', control: 'Uptime SLA', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 44,
    name: 'NXP Semiconductors',
    service: 'Secure Microcontroller Supplier',
    category: 'Hardware/Firmware',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 2 },
    residualRisk: { impact: 3, likelihood: 1 },
    lastAssessed: '2024-01-20',
    riskScenario: 'A hardware-level vulnerability (e.g., side-channel attack) is discovered in NXP chips used in our terminals, requiring a costly and complex hardware recall.',
    contractClauses: { rightToAudit: false, breachNotificationSla: 'Vendor advisory' },
    checklist: [
        { id: 'nxp-cc', category: 'Compliance', control: 'Common Criteria EAL6+', status: 'Pass' },
        { id: 'nxp-sec-supply', category: 'Security', control: 'Secure Supply Chain', status: 'Pass' },
        { id: 'nxp-avail-fab', category: 'Availability', control: 'Multiple Fabrication Plants', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 45,
    name: 'DHL Express',
    service: 'Terminal Logistics & Shipping',
    category: 'Managed Service',
    status: 'Needs Review',
    inherentRisk: { impact: 3, likelihood: 3 },
    residualRisk: { impact: 3, likelihood: 2 },
    lastAssessed: '2023-09-15',
    riskScenario: 'Theft of a large shipment of payment terminals from a DHL warehouse allows criminals to tamper with devices before they reach merchants.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '96 hours' },
    checklist: [
        { id: 'dhl-sec-chain', category: 'Security', control: 'Secure Chain of Custody', status: 'Fail' },
        { id: 'dhl-avail-network', category: 'Availability', control: 'Global Logistics Network', status: 'Pass' },
        { id: 'dhl-priv-tracking', category: 'Privacy', control: 'Shipment Data Protection', status: 'Pass' }
    ],
    alerts: [{ type: 'Operational', severity: 'Medium', description: 'Chain of custody controls for secure hardware shipments are not clearly defined in the contract.' }]
  },
  {
    id: 46,
    name: 'Salesforce',
    service: 'CRM Platform',
    category: 'Data Processor',
    status: 'Monitored',
    inherentRisk: { impact: 4, likelihood: 4 },
    residualRisk: { impact: 2, likelihood: 3 },
    lastAssessed: '2024-05-22',
    riskScenario: 'A misconfigured Salesforce integration exposes sensitive merchant and sales pipeline data to unauthorized internal users or the public internet.',
    contractClauses: { rightToAudit: true, breachNotificationSla: 'As per Salesforce MSA' },
    checklist: [
        { id: 'sf-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'sf-sec-perm', category: 'Security', control: 'Permission Sets & Profiles', status: 'Pass' },
        { id: 'sf-priv-shield', category: 'Privacy', control: 'Data Privacy Controls', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 47,
    name: 'ServiceNow',
    service: 'ITSM & CMDB Platform',
    category: 'DevOps Toolchain',
    status: 'Monitored',
    inherentRisk: { impact: 4, likelihood: 3 },
    residualRisk: { impact: 2, likelihood: 2 },
    lastAssessed: '2024-06-11',
    riskScenario: 'Inaccurate or outdated asset data in the ServiceNow CMDB leads to gaps in vulnerability scanning and patch management coverage for CDE systems.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '48 hours' },
    checklist: [
        { id: 'sn-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'sn-sec-access', category: 'Security', control: 'Granular Access Roles', status: 'Pass' },
        { id: 'sn-avail-platform', category: 'Availability', control: 'Platform Uptime', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 48,
    name: 'PricewaterhouseCoopers (PwC)',
    service: 'PCI QSA & External Audit',
    category: 'Managed Service',
    status: 'Monitored',
    inherentRisk: { impact: 3, likelihood: 2 },
    residualRisk: { impact: 2, likelihood: 1 },
    lastAssessed: '2024-02-01',
    riskScenario: 'Conflict of interest or auditor error leads to an inaccurate PCI Report on Compliance (ROC), which is later challenged by the card schemes.',
    contractClauses: { rightToAudit: true, breachNotificationSla: 'N/A' },
    checklist: [
        { id: 'pwc-pci', category: 'Compliance', control: 'PCI QSA Certification', status: 'Pass' },
        { id: 'pwc-sec-conf', category: 'Security', control: 'Confidentiality Agreement', status: 'Pass' },
        { id: 'pwc-priv-data', category: 'Privacy', control: 'Data Handling Procedures', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 49,
    name: 'DataDog',
    service: 'Cloud Monitoring & APM',
    category: 'DevOps Toolchain',
    status: 'In Remediation',
    inherentRisk: { impact: 5, likelihood: 4 },
    residualRisk: { impact: 4, likelihood: 3 },
    lastAssessed: '2024-07-05',
    riskScenario: 'The DataDog agent, with its high level of privilege, is compromised, providing an attacker with deep visibility and potential control over our production environment.',
    contractClauses: { rightToAudit: false, breachNotificationSla: '72 hours' },
    checklist: [
        { id: 'dd-soc2', category: 'Compliance', control: 'SOC 2 Type II Report', status: 'Pass' },
        { id: 'dd-sec-filter', category: 'Security', control: 'Sensitive Data Filtering', status: 'Fail' },
        { id: 'dd-avail-platform', category: 'Availability', control: 'Platform Uptime', status: 'Pass' },
        { id: 'dd-priv-access', category: 'Privacy', control: 'RBAC for Dashboards', status: 'In Progress' }
    ],
    alerts: [{ type: 'Security', severity: 'High', description: 'Sensitive data filtering rules for logs sent to DataDog are incomplete, risking accidental leakage of PII or credentials.' }]
  },
  {
    id: 50,
    name: 'F5 Networks',
    service: 'Application Delivery Controllers (ADC)',
    category: 'Hardware/Firmware',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 3 },
    residualRisk: { impact: 3, likelihood: 2 },
    lastAssessed: '2024-04-18',
    riskScenario: 'A critical vulnerability in the F5 BIG-IP management interface is exploited, allowing an attacker to decrypt TLS traffic and steal sensitive data.',
    contractClauses: { rightToAudit: false, breachNotificationSla: 'Vendor advisory' },
    checklist: [
        { id: 'f5-cc', category: 'Compliance', control: 'Common Criteria Certification', status: 'Pass' },
        { id: 'f5-sec-patch', category: 'Security', control: 'Timely Security Patches', status: 'Pass' },
        { id: 'f5-avail-ha', category: 'Availability', control: 'High Availability (HA)', status: 'Pass' }
    ],
    alerts: []
  },
  {
    id: 51,
    name: 'Visa Inc.',
    service: 'Card Scheme Network',
    category: 'Data Processor',
    status: 'Monitored',
    inherentRisk: { impact: 5, likelihood: 2 },
    residualRisk: { impact: 3, likelihood: 1 },
    lastAssessed: '2024-07-01',
    riskScenario: 'A major VisaNet outage disrupts transaction processing globally, directly impacting our revenue and merchant services.',
    contractClauses: { rightToAudit: true, breachNotificationSla: 'Direct communication' },
    checklist: [
      { id: 'visa-pci', category: 'Compliance', control: 'Maintains PCI DSS Compliance', status: 'Pass' },
      { id: 'visa-conn', category: 'Availability', control: 'Redundant Network Connections', status: 'Pass' }
   ],
    alerts: []
  }
];