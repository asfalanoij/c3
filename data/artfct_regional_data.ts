import { Region, RegionColorMap, RegionKey } from '../types';

export const REGIONS: Record<RegionKey, Region> = {
  overview: { name: 'APAC Overview', flag: '🌏', color: 'blue' },
  idn: { name: 'Indonesia', flag: '🇮🇩', color: 'red' },
  sgp: { name: 'Singapore', flag: '🇸🇬', color: 'green' },
  hkg: { name: 'Hong Kong', flag: '🇭🇰', color: 'purple' },
  aus: { name: 'Australia', flag: '🇦🇺', color: 'orange' },
  ind: { name: 'India', flag: '🇮🇳', color: 'indigo' }
};

export const REGION_COLOR_MAP: RegionColorMap = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', ring: 'ring-blue-400' },
  red: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', ring: 'ring-red-400' },
  green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', ring: 'ring-green-400' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', ring: 'ring-purple-400' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', ring: 'ring-orange-400' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500', ring: 'ring-indigo-400' },
};
  
export const REGULATORY_BLUEPRINT_CODE = `/apac-regulators-comparison
├── similarities/                          # Common ground (all regulators demand these)
│   ├── governance/                        # ISMS (Information Security Mgmt System)
│   │   ├── policies/                      # Security policy, risk mgmt, data classification
│   │   └── board-oversight/               # Senior mgmt accountability
│   ├── pci-dss-alignment/                 # Reuse PCI DSS v4.0 controls
│   │   ├── logging/                       # Req.10 → audit trails, integrity
│   │   ├── patching/                      # Req.6 → timely vuln mgmt
│   │   └── key-mgmt/                      # Req.3 → HSM, RKI, dual control
│   ├── incident-response/                 # Mandatory IR policy, drills, regulator notice
│   └── third-party-risk/                  # 3PRM (vendor risk assessment, SLA, right-to-audit)
│
├── differences/                           # Where regulators diverge (the “deltas”)
│   ├── ojk/ (Indonesia, Otoritas Jasa Keuangan)
│   │   ├── uu-pdp/                        # UU PDP (Data Protection Law) → consent, cross-border
│   │   ├── pojak-it/                      # POJK 38/2016 (IT Risk Mgmt) → strict on outsourcing
│   │   └── breach-report/                 # Draft PDP Reg: 3-day breach notification
│   ├── mas/ (Singapore, Monetary Authority of Singapore)
│   │   ├── mas-trm/                       # TRM Guidelines (2021) → cyber resilience, RTO ≤ 4hr
│   │   ├── tech-risk-notice/              # MAS Notice 644 → cyber hygiene mandatory
│   │   └── incident-window/               # 1-hr immediate notice + 14-day full report
│   ├── hkma/ (Hong Kong Monetary Authority)
│   │   ├── cyber-resilience-assessment/   # C-RAF (assessment framework, maturity levels)
│   │   ├── outsourcing/                   # TME-2 → local vs. offshore restrictions
│   │   └── breach-window/                 # Prompt notice (practically within 72 hrs)
│   ├── austrac/ (Australia, AUSTRAC AML/CTF regulator)
│   │   ├── aml-ctf-act/                   # Strong KYC/AML → enhanced due diligence
│   │   ├── transaction-reporting/         # TTR (Threshold Transaction Reporting ≥ AUD 10k)
│   │   └── breach-notice/                 # 24-hr AML/CTF event notification
│   ├── rbi/ (Reserve Bank of India)
│   │   ├── cyber-security-framework/      # 2016 circular → baseline controls for banks/NBFCs
│   │   ├── data-localisation/             # Mandatory storage of payments data in India
│   │   └── incident-window/               # 6-hr reporting for significant cyber events`;

export const TECHNICAL_BLUEPRINT_CODE = `/company-x-security-risk-compliance
├── os-platforms/
│   ├── linux-servers/                # Ubuntu/RHEL hardened nodes
│   │   ├── selinux/                  # SELinux (Security-Enhanced Linux; MAC kernel layer)
│   │   ├── auditd/                   # Audit daemon (logs syscalls, kernel events)
│   │   ├── apparmor/                 # AppArmor (Linux MAC profiles)
│   │   └── bastion-hosts/            # SSH hardened gateways w/ PAM+MFA
│   └── containers/
│       ├── docker/                   # Payment microservices (segregated)
│       ├── k8s/                      # Kubernetes (if multi-tenant estate mgmt)
│       └── istio/                    # Service mesh (mTLS east-west traffic)
├── key-mgmt-and-crypto/
│   ├── hsm/                          # HSM (Hardware Security Module; PCI PIN/Key mgmt)
│   ├── pkcs11/                       # PKCS#11 (API interface to HSM)
│   ├── rki/                          # RKI (Remote Key Injection for terminals)
│   └── kms/                          # KMS (Key Mgmt Service; Vault+HSM hybrid)
├── data-ingestion/
│   ├── api-gw/                       # API-GW (API Gateway, Nginx/HAProxy, mTLS, WAF)
│   ├── mqtt-broker/                  # MQTT (Telemetry channel for AXIUM/TETRA devices)
│   ├── tls-mgmt/                     # TLS lifecycle (Vault PKI, cert rotation)
│   └── edi/                          # EDI (Electronic Data Interchange logs from partners)
├── log-collection-and-monitoring/
│   ├── beats/                        # Filebeat/Metricbeat (log & metrics shippers)
│   ├── syslog-ng/                    # Syslog-NG (secure syslog over TLS)
│   ├── osquery/                      # Osquery (endpoint visibility on Linux hosts)
│   └── journald-export/              # Systemd Journald → Elastic/Wazuh pipeline
├── analytics-and-siem/
│   ├── wazuh/                        # Wazuh (open SIEM; FIM, rules, alerts)
│   ├── elk/                          # ELK (Elasticsearch, Logstash, Kibana)
│   ├── grafana/                      # Grafana (dashboards, KRIs: patch SLA, key status)
│   ├── prometheus/                   # Prometheus (metrics collection, exporters)
│   └── soar/                         # SOAR (Security Orchestration, Automation, Response)
├── automation-and-compliance-as-code/
│   ├── ansible/                      # Ansible (infra-as-code, patch automation)
│   ├── terraform/                    # Terraform (IaC; enforce baseline infra)
│   ├── vault/                        # HashiCorp Vault (secrets mgmt, PKI engine)
│   └── gitops/                       # GitOps (policy & controls versioned in Git)
├── vulnerability-and-testing/
│   ├── openvas/                      # OpenVAS (VA scanner; CVE detection)
│   ├── nessus/                       # Nessus (commercial VA scanning)
│   ├── zap/                          # OWASP ZAP (DAST; API & web test)
│   ├── burp/                         # Burp Suite (manual pen-test)
│   └── asv/                          # ASV scans (Approved Scanning Vendor; PCI DSS ext req)
├── evidence-and-audit-factory/
│   ├── configs/                      # Config snapshots (firewall, Linux sysctl, SSHD)
│   ├── policies/                     # PCI DSS, ISO 27001/37301, SOC2 docs
│   ├── roc-saq/                      # ROC (Report on Compliance) / SAQ (Self-Assessment Q)
│   ├── immutable-logs/               # Hash-chained evidence storage
│   └── crosswalks/
│       ├── pci-iso-xwalk.md          # PCI ↔ ISO 27001 Annex A
│       ├── pci-soc2-xwalk.md         # PCI ↔ SOC 2 CC series
│       └── regulator-apac-xwalk.md   # OJK, MAS, HKMA, AUSTRAC, RBI deltas
├── incident-response/
│   ├── runbooks/                     # IR runbooks (who to call, when, how)
│   ├── tabletop/                     # Simulation scripts (quarterly exercises)
│   ├── soar-playbooks/               # Automated playbooks (auto isolate, auto ticket)
│   ├── regulator-templates/          # Incident notification (MAS 72hr, AUSTRAC 24hr, OJK 3-day)
│   └── comms-packs/                  # Drafted PR/regulator/customer messaging
└── partner-and-3prm/
    ├── questionnaires/               # TPRM (Third-Party Risk Mgmt) security questionnaires
    ├── contracts/                    # Security clauses (data residency, SLA, right-to-audit)
    ├── vendor-dashboard/             # 3PRM dashboard (KRIs: patch %, key compliance)
    └── audit-reports/                # SOC2, ISO27001 certs collected from vendors
`;