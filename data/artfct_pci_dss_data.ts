import { PciIsoMapping, UnifiedEvidence } from '../types';

export const PCI_ISO_MAPPING: PciIsoMapping[] = [
    { pciReq: 'Req.1 - Network Security', isoControl: 'A.8.20 - Network security', mapping: 'Direct', auditEvidence: 'Firewall rules, network diagrams, segmentation testing', dualPurpose: 'Network access controls serve both PCI segmentation and ISO network security requirements.' },
    { pciReq: 'Req.2 - Secure Configurations', isoControl: 'A.8.9 - Configuration management', mapping: 'Direct', auditEvidence: 'Configuration baselines, hardening procedures, change records', dualPurpose: 'System hardening standards fulfill both PCI secure configuration and ISO asset management.' },
    { pciReq: 'Req.3 - Protect Stored CHD', isoControl: 'A.8.24 - Use of cryptography', mapping: 'Overlap', auditEvidence: 'Encryption policies, key management procedures, HSM documentation', dualPurpose: 'Encryption controls protect cardholder data (PCI) and sensitive information (ISO).' },
    { pciReq: 'Req.5 - Anti-Malware', isoControl: 'A.8.7 - Protection against malware', mapping: 'Direct', auditEvidence: 'Anti-malware deployment, signature updates, detection logs', dualPurpose: 'Malware protection covers all systems including payment and general IT infrastructure.' },
    { pciReq: 'Req.6 - Secure Development', isoControl: 'A.8.25 - Secure development lifecycle', mapping: 'Direct', auditEvidence: 'SDLC procedures, code reviews, vulnerability testing', dualPurpose: 'Development security applies to payment applications and general software development.' },
    { pciReq: 'Req.8 - User Identification', isoControl: 'A.5.15 - Access control', mapping: 'Overlap', auditEvidence: 'Identity management system, authentication policies, MFA implementation', dualPurpose: 'User identification and authentication covers payment systems and enterprise access.' },
    { pciReq: 'Req.9 - Physical Access', isoControl: 'A.7.1 - Physical security perimeters', mapping: 'Direct', auditEvidence: 'Physical security procedures, access logs, facility controls', dualPurpose: 'Physical controls protect data centers housing both payment and general systems.' },
    { pciReq: 'Req.10 - Logging & Monitoring', isoControl: 'A.8.15 - Logging', mapping: 'Direct', auditEvidence: 'Log management system, audit trails, monitoring procedures', dualPurpose: 'Comprehensive logging covers payment transactions and general system activities.' },
    { pciReq: 'Req.11 - Security Testing', isoControl: 'A.8.8 - Management of technical vulnerabilities', mapping: 'Overlap', auditEvidence: 'Penetration test reports, vulnerability scans, remediation tracking', dualPurpose: 'Security testing program covers payment environment and broader IT infrastructure.' },
    { pciReq: 'Req.12 - InfoSec Program', isoControl: 'A.5.1 - Policies for information security', mapping: 'Foundation', auditEvidence: 'ISMS documentation, policy framework, governance structure', dualPurpose: 'The overall information security program supports both PCI compliance and the broader ISO 27001 ISMS.' }
];

export const UNIFIED_EVIDENCE_DATA: UnifiedEvidence[] = [
    {
      pciReq: "Req 1.2.1",
      artifact: "[Palo Alto Panorama] CDE_Firewall_Policy.xml",
      description: "XML export of the live firewall policy for the CDE perimeter, explicitly showing deny-all-by-default with specific allow rules for approved ports (e.g., TCP/443).",
      synergies: { iso27001: "A.8.20", iso27701: true, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Core network control proving isolation for ISO, MAS TRM cyber resilience, and HKMA C-RAF."
    },
    {
      pciReq: "Req 2.2.1",
      artifact: "[Ansible Tower] Job #1138: CIS Hardening.log",
      description: "Execution log from Ansible Tower job applying the CIS Level 1 benchmark for Ubuntu 22.04 LTS. Shows 'changed=0' indicating all hosts are compliant.",
      synergies: { iso27001: "A.8.9", iso27701: true, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "'Compliance-as-Code' proves proactive, automated system hardening required by all major frameworks."
    },
    {
      pciReq: "Req 3.6.1",
      artifact: "[Thales HSM] Key Attributes Export",
      description: "PKCS#11 tool output verifying that the Card Data Encryption Key has the 'CKA_EXTRACTABLE' attribute set to FALSE, proving it cannot leave the HSM boundary.",
      synergies: { iso27001: "A.8.24", iso27701: true, mas: true, ojk: true, hkma: false, austrac: false, rbi: true },
      justification: "Critical evidence for PCI, ISO crypto controls, OJK IT Risk, and RBI data protection rules."
    },
    {
      pciReq: "Req 4.2.1",
      artifact: "[Qualys SSL Labs] API Gateway Scan (A+ Rating)",
      description: "Scan report for api.companyx.com, showing an 'A+' rating, with TLS 1.2/1.3 enforced and all insecure ciphers (e.g., SSLv3, RC4) disabled.",
      synergies: { iso27001: "A.8.24", iso27701: true, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Verifies secure data-in-transit, a key control for ISO, MAS cyber hygiene, and RBI tech standards."
    },
    {
      pciReq: "Req 5.2.3",
      artifact: "[Crowdstrike Falcon] CDE_Policy_v3.json",
      description: "JSON export of the endpoint protection policy applied to CDE systems, showing real-time protection is enabled and cannot be disabled by end-users.",
      synergies: { iso27001: "A.8.7", iso27701: false, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Demonstrates endpoint security controls required by PCI, ISO, and mandated by MAS Cyber Hygiene notices."
    },
    {
      pciReq: "Req 6.3.1",
      artifact: "[Tenable.io] CDE Vulnerability Scan #9821",
      description: "Authenticated scan results showing no vulnerabilities with a CVSS score of 7.0 or higher on any in-scope CDE system.",
      synergies: { iso27001: "A.8.8", iso27701: true, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Core artifact for vulnerability management programs across PCI, ISO, MAS TRM, and HKMA C-RAF."
    },
     {
      pciReq: "Req 6.4.1",
      artifact: "[CI/CD Pipeline] ZAP DAST Scan Results",
      description: "OWASP ZAP XML report from the pre-production build pipeline, showing zero High-risk vulnerabilities (e.g., SQLi, XSS) in the payment API.",
      synergies: { iso27001: "A.8.28", iso27701: false, mas: true, ojk: true, hkma: false, austrac: false, rbi: true },
      justification: "Evidence of secure coding and application security testing, vital for MAS TRM and OJK IT Risk."
    },
    {
      pciReq: "Req 7.2.1",
      artifact: "[Okta] CDE Access Report",
      description: "Generated report from Okta showing user-to-group mappings for CDE-related applications, validating Role-Based Access Control (RBAC).",
      synergies: { iso27001: "A.5.15", iso27701: true, mas: true, ojk: true, hkma: true, austrac: true, rbi: true },
      justification: "Fundamental 'least privilege' evidence required by all security, privacy, and financial regulations."
    },
    {
      pciReq: "Req 8.2.4",
      artifact: "[Okta] MFA Enrollment Policy Report",
      description: "System report confirming that the 'CDE Access' user group is enforced with mandatory MFA using Okta Verify or a hardware token.",
      synergies: { iso27001: "A.8.5", iso27701: false, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Strong authentication is a direct requirement of PCI and a key expectation in MAS and RBI frameworks."
    },
    {
      pciReq: "Req 9.1.1",
      artifact: "[Equinix DC] Physical Access Log",
      description: "Quarterly physical access logs from the Equinix data center, correlated with our internal authorized personnel list.",
      synergies: { iso27001: "A.7.1", iso27701: false, mas: true, ojk: true, hkma: false, austrac: false, rbi: true },
      justification: "Proves physical security controls, a requirement for ISO and a component of MAS TRM and OJK."
    },
    {
      pciReq: "Req 10.4.1",
      artifact: "[Jira] Ticket GRC-4321: Q3 Access Review",
      description: "Jira ticket with attached Kibana dashboards showing completion of the quarterly review of all administrative access to CDE systems, signed off by the system owner.",
      synergies: { iso27001: "A.5.25", iso27701: true, mas: true, ojk: true, hkma: true, austrac: true, rbi: true },
      justification: "Universally valuable log review evidence, proving active oversight to all auditors and regulators."
    },
    {
      pciReq: "Req 10.7.2",
      artifact: "[Wazuh] FIM Alert -> SOAR Playbook Log",
      description: "Wazuh alert log for a change on /etc/ssh/sshd_config, with corresponding Shuffle SOAR execution log showing an automated Jira ticket was created.",
      synergies: { iso27001: "A.8.16", iso27701: false, mas: true, ojk: false, hkma: true, austrac: false, rbi: true },
      justification: "Demonstrates automated response to security alerts, a sign of a mature program for MAS and HKMA."
    },
    {
      pciReq: "Req 11.3.1",
      artifact: "[Coalfire] ASV Scan Attestation Q3",
      description: "Official 'Attestation of Compliance' from PCI-certified ASV, Coalfire, showing a 'PASS' status for all external IP ranges.",
      synergies: { iso27001: "A.8.8", iso27701: true, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Cornerstone of assurance for PCI, ISO vulnerability management, MAS TRM, HKMA C-RAF, and RBI."
    },
    {
      pciReq: "Req 11.4.1",
      artifact: "[Internal Pentest] Segmentation Test Report",
      description: "Report from internal penetration test confirming that a host in the corporate network cannot initiate connections to a host within the CDE on any port.",
      synergies: { iso27001: "A.8.20", iso27701: false, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Direct proof of network segmentation effectiveness, complementing the firewall ruleset artifact."
    },
    {
      pciReq: "Req 12.6.1",
      artifact: "[KnowBe4] Annual Security Training Report",
      description: "Annual report from the KnowBe4 platform showing a 100% completion rate for the 'PCI DSS v4.0 Essentials' training module for all in-scope personnel.",
      synergies: { iso27001: "A.6.3", iso27701: true, mas: true, ojk: true, hkma: true, austrac: true, rbi: true },
      justification: "Proves 'human firewall' training, a foundational control for all security and regulatory frameworks."
    },
    {
      pciReq: "Req 12.10.1",
      artifact: "[Confluence] Incident Response Plan v4.2",
      description: "Link to the board-approved IR plan in Confluence, including specific playbooks for data breach scenarios and APAC regulatory reporting timelines (e.g., MAS 1-hour).",
      synergies: { iso27001: "A.5.24", iso27701: true, mas: true, ojk: true, hkma: true, austrac: true, rbi: true },
      justification: "Required by every framework; APAC-specific appendices prove readiness for MAS 1-hour rule, etc."
    },
    {
      pciReq: "Req 12.10.7",
      artifact: "[Jira] Ticket GRC-4200: Q3 IR Tabletop",
      description: "Jira ticket containing the after-action report and lessons learned from the Q3 'Data Breach' tabletop exercise, with assigned follow-up tasks.",
      synergies: { iso27001: "A.5.26", iso27701: false, mas: true, ojk: true, hkma: true, austrac: false, rbi: true },
      justification: "Demonstrates that the IR plan is tested and effective, a key requirement for MAS, OJK, and HKMA."
    }
  ];