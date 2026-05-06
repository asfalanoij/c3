import { BlueprintNode } from '../types';
import { 
    LayoutGrid, Activity, HardDrive, Server, Shield, FileText, Lock, Box, Network,
    Code, KeyRound, Cpu, Radio, Database, Zap, DatabaseZap, Route, MessageSquare, BarChart2,
    HeartPulse, Search, Layers, PieChart, AreaChart, BrainCircuit, GitCommit, GitBranch,
    Bug, FileCheck, Bot, ShieldAlert, ScanSearch, Globe, ShieldCheck, FolderCheck, FileCog,
    Archive, GitCompare, UserCheck, Users, CloudCog, Handshake, FileQuestion, LayoutDashboard
} from 'lucide-react';

// --- Start of refactored code: Inlined constants to remove broken imports ---

const SELINUX_CODE = `
# Example: Set SELinux context for web content
# This ensures the httpd process can only read files labeled 'httpd_sys_content_t'
semanage fcontext -a -t httpd_sys_content_t "/var/www/payment_portal(/.*)?"
restorecon -Rv /var/www/payment_portal
`;

const AUDITD_CODE = `
# /etc/audit/rules.d/pci.rules
# PCI DSS Req 10.2.2: Log all administrative actions
-a always,exit -F arch=b64 -S execve -C uid!=euid -F euid=0 -k admin_action
-a always,exit -F arch=b32 -S execve -C uid!=euid -F euid=0 -k admin_action

# PCI DSS Req 10.2.3: Log access to audit logs
-w /var/log/audit/ -p wa -k audit_log_access
`;

const PAM_MFA_CODE = `
# /etc/pam.d/sshd
# Enforce MFA for all SSH access to the CDE bastion host
auth required pam_google_authenticator.so nullok
auth required pam_unix.so use_first_pass

# Standard sshd PAM config follows...
`;

const ISTIO_MTLS_CODE = `
# Force STRICT mTLS for all services in the 'payments' namespace
apiVersion: "security.istio.io/v1beta1"
kind: "PeerAuthentication"
metadata:
  name: "payments-mtls-strict"
  namespace: "payments"
spec:
  mtls:
    mode: STRICT
`;

const OPA_POLICY_CODE = `
# OPA Gatekeeper constraint to block containers running as root
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRestrictRootUser
metadata:
  name: pci-req-2-2-no-root-containers
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
    namespaces:
      - "cde-production"
`;

const HSM_EVIDENCE_CODE = `
# Using pkcs11-tool to demonstrate key attributes within the HSM
# The "Never extractable: TRUE" attribute is critical evidence for PCI DSS Req 3.6
$ pkcs11-tool --module /opt/nfast/toolkits/pkcs11/libcknfast.so -l -p <PIN> -O --id <KEY_ID>

Private Key Object; RSA 
  label:      pci-card-encryption-key
  ID:         <KEY_ID>
  Usage:      decrypt, sign, unwrap
  Access:     sensitive, always sensitive, never extractable
`;

const RKI_PROCESS_CODE = `
# Conceptual workflow for an RKI transaction
1. Terminal initiates connection to RKI server with its device certificate.
2. RKI server validates terminal certificate against trusted CA.
3. RKI server requests a one-time wrapping key from the HSM.
4. HSM generates and encrypts the new terminal key with the wrapping key.
5. Encrypted key bundle is sent to the terminal.
6. Terminal decrypts and securely stores the new key.
7. Terminal sends a signed acknowledgement to the RKI server.
`;

const VAULT_DYNAMIC_SECRETS_CODE = `
# 1. Configure Vault database secrets engine for PostgreSQL
$ vault write database/config/cde-postgres ...

# 2. Define a role with specific, limited permissions and a short TTL
$ vault write database/roles/payment-processor-role \
    db_name=cde-postgres \
    creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT,INSERT ON transactions TO \\"{{name}}\\";" \
    default_ttl="5m" \
    max_ttl="1h"

# 3. Application requests credentials when needed
$ vault read database/creds/payment-processor-role
> username: v-token-payment-processor-role-abcd...
> password: some-random-password
`;

const WAZUH_FIM_CODE = `
<!-- Wazuh rule to detect unauthorized changes to critical files -->
<rule id="100201" level="12">
  <if_sid>550</if_sid>
  <field name="file">/etc/ssh/sshd_config</field>
  <description>PCI DSS Req 2.2: Critical configuration file sshd_config modified.</description>
  <group>pci_dss_11.5,pci_dss_10.5.5,</group>
</rule>
`;

const ANSIBLE_IAC_CODE = `
- name: PCI DSS Req 2.2 - Apply Hardening Standards
  hosts: cde_servers
  become: true
  tasks:
    - name: Disable insecure SSH ciphers and MACs
      template:
        src: templates/sshd_config.j2
        dest: /etc/ssh/sshd_config
        validate: 'sshd -t -f %s'
      notify: restart sshd

    - name: Ensure auditd is installed and running
      package:
        name: auditd
        state: present
`;

const ASV_SCAN_CODE = `
{
  "asv_scan_metadata": {
    "scan_id": "ASV-Q3-2024-CDE-External",
    "vendor_name": "Tenable",
    "scan_date": "2024-07-20",
    "pci_validation_status": "PASS",
    "attestation_document_hash": "sha256:a1b2c3d4...",
    "evidence_s3_uri": "s3://companyx-pci-evidence/asv-scans/q3_2024_report.pdf"
  }
}
`;

const TPRM_MODAL_CONTENT = {
    title: 'Third-Party Risk Management (3PRM) Dashboard',
    description: 'Our 3PRM program uses a data-driven approach to continuously monitor vendor risk. We integrate data from security questionnaires (SIG/CAIQ), external security ratings, and SLA performance into a centralized dashboard. This provides an at-a-glance view of our third-party risk posture, satisfying PCI DSS Req 12.8.',
    code: {
        content: `
# 3PRM Dashboard KRI - Pseudocode/Logic

# KRI 1: Vendor Security Rating Score (e.g., from SecurityScorecard)
function get_vendor_security_rating(vendor_id):
  api_data = security_rating_api.get(vendor_id)
  return api_data.score # e.g., 'A', 'B', 'C' or 850/1000

# KRI 2: Overdue Critical Patching
function get_overdue_patches(vendor_id):
  sig_data = vendor_questionnaires.get(vendor_id)
  sla_days = sig_data.patching_sla.critical # e.g., 14 days
  
  monitoring_data = continuous_monitoring_api.get(vendor_id)
  overdue = filter(vuln for vuln in monitoring_data.vulnerabilities 
               where vuln.severity == 'CRITICAL' and 
               vuln.age > sla_days)
  return count(overdue)

# KRI 3: Compliance Status (e.g., SOC 2, ISO 27001)
function get_compliance_status(vendor_id):
  vendor_docs = vendor_documents.get(vendor_id)
  soc2_report = vendor_docs.soc2_type2
  if soc2_report.is_expired() or soc2_report.has_exceptions():
    return "NON-COMPLIANT"
  return "COMPLIANT"
`
    }
};

// --- End of refactored code ---


export const BLUEPRINT_DATA: BlueprintNode = {
    name: 'Company X Technical Blueprint',
    icon: LayoutGrid,
    children: [
        {
            name: 'OS & Workloads', icon: HardDrive, color: 'text-sky-500', children: [
                { name: 'Hardened Linux Servers', icon: Server, children: [
                    { 
                        name: 'SELinux / AppArmor (MAC)', icon: Shield,
                        modalContent: {
                            title: 'SELinux Mandatory Access Control',
                            description: 'SELinux provides mandatory, non-discretionary access control, which is foundational for PCI DSS Req 2.2. Unlike standard permissions, not even the root user can bypass its policy. This ensures processes (like a web server) can ONLY access the specific files and ports defined in their security context, effectively containing potential breaches.',
                            code: { content: SELINUX_CODE }
                        }
                    },
                    { 
                        name: 'Auditd (Kernel Auditing)', icon: FileText,
                         modalContent: {
                            title: 'Auditd Kernel Auditing',
                            description: 'The Linux Audit daemon (auditd) provides a high-fidelity, non-bypassable log of security-relevant events at the kernel level. This satisfies PCI DSS Req 10 by creating a comprehensive audit trail of system calls, file access, and administrative actions, which is then forwarded to the central SIEM for analysis and retention.',
                            code: { content: AUDITD_CODE }
                        }
                    },
                    { 
                        name: 'Bastion Hosts (PAM+MFA)', icon: Lock,
                        modalContent: {
                            title: 'Bastion Hosts with PAM and MFA',
                            description: 'All administrative access to the Cardholder Data Environment (CDE) is proxied through a hardened bastion host. Pluggable Authentication Modules (PAM) are configured to enforce strong authentication, including Multi-Factor Authentication (MFA), satisfying PCI DSS Req 8.3.2. This creates a single, heavily monitored entry point. When an admin connects, they are prompted for their public key passphrase AND a TOTP code. All activity is logged via auditd and forwarded to the SIEM, creating a clear record of privileged access.',
                            code: { content: PAM_MFA_CODE }
                        }
                    },
                ]},
                { name: 'Container Platform', icon: Box, children: [
                    { name: 'Kubernetes (EKS/GKE)', icon: Box, modalContent: { title: 'Kubernetes Container Orchestration', description: 'Using managed Kubernetes services like EKS or GKE allows for scalable, resilient deployment of payment microservices. Security is managed via NetworkPolicies, PodSecurityPolicies, and RBAC.' } },
                    { 
                        name: 'Istio Service Mesh (mTLS)', 
                        icon: Network, 
                        modalContent: { 
                            title: 'Istio Service Mesh for Zero-Trust', 
                            description: 'Istio provides a transparent service mesh layer that automatically enforces mutual TLS (mTLS) for all east-west traffic between microservices. This satisfies PCI DSS Req 4.1 for encrypting data in transit within the internal network. It creates a zero-trust environment where services must authenticate each other via certificates, regardless of network location.',
                            code: { content: ISTIO_MTLS_CODE }
                        } 
                    },
                    { 
                        name: 'Policy Enforcement (OPA)', 
                        icon: Code, 
                        modalContent: { 
                            title: 'Open Policy Agent (OPA) for Kubernetes', 
                            description: 'OPA Gatekeeper acts as a Kubernetes admission controller, enforcing security policies *before* a workload is allowed to run. This is a preventative control that satisfies PCI DSS Req 2.2 (Secure Configurations) by programmatically blocking non-compliant deployments, such as containers attempting to run as root or mount sensitive host paths.',
                            code: { content: OPA_POLICY_CODE }
                        } 
                    },
                ]}
            ]
        },
        {
            name: 'Key Mgmt & Crypto', icon: KeyRound, color: 'text-amber-500', children: [
                { name: 'Hardware Security Modules', icon: Cpu, children: [
                    { 
                        name: 'HSM & PKCS#11 API', icon: Cpu,
                        modalContent: {
                            title: 'Hardware Security Module (HSM)',
                            description: 'FIPS 140-2 Level 3 validated HSMs are the root of trust for all cryptographic operations, satisfying PCI DSS Req 3.6. They ensure that cryptographic keys for protecting cardholder data are generated, stored, and used entirely within a tamper-proof hardware boundary. Keys are never exposed in plaintext to the operating system or applications.',
                            code: { content: HSM_EVIDENCE_CODE }
                        }
                    },
                    { 
                        name: 'RKI (Remote Key Injection)', icon: Radio,
                        modalContent: {
                            title: 'Remote Key Injection (RKI)',
                            description: 'RKI is a secure protocol used to inject cryptographic keys into remote Point-of-Interaction (POI) terminals from our central HSM facility. This eliminates the need for manual, in-person key loading, which is operationally complex and high-risk. The process establishes a mutually authenticated, encrypted channel with the terminal before injecting keys, all managed via the HSM, adhering to PCI PIN Security requirements.',
                            code: { content: RKI_PROCESS_CODE }
                        }
                    },
                ]},
                { name: 'Secrets Management', icon: Database, children: [
                    { 
                        name: 'HashiCorp Vault (KMS)', icon: Database,
                        modalContent: {
                            title: 'HashiCorp Vault for Secrets Management',
                            description: 'Vault provides a centralized service to secure and manage secrets like database credentials and API keys. It integrates with our physical HSMs for master key unwrapping (Auto Unseal), providing a robust hybrid solution. We heavily utilize its ability to generate dynamic, short-lived database credentials on-demand, which significantly reduces the risk of static credential leakage and helps satisfy PCI DSS Req 2.1 and 8.2.',
                            code: { content: VAULT_DYNAMIC_SECRETS_CODE }
                        }
                    },
                    { name: 'Dynamic Secrets & PKI', icon: Zap, modalContent: { title: 'Dynamic Secrets & PKI Engine', description: 'Vault\'s ability to generate dynamic, short-lived database credentials on-demand significantly reduces the risk of credential leakage. The integrated PKI engine automates the lifecycle of TLS certificates for mTLS.' } },
                ]},
            ]
        },
        {
            name: 'Data Ingestion & Edge', icon: DatabaseZap, color: 'text-fuchsia-500', children: [
                { name: 'API Gateway (WAF, mTLS)', icon: Route },
                { name: 'Streaming (Kafka, MQTT)', icon: MessageSquare },
                { name: 'TLS Lifecycle Mgmt', icon: Lock },
            ]
        },
        {
            name: 'Log & Metrics Pipeline', icon: BarChart2, color: 'text-lime-500', children: [
                { name: 'Collection (Beats, Fluentd)', icon: HeartPulse },
                { name: 'Endpoint (Osquery, Wazuh Agent)', icon: Search },
                { name: 'Streaming & Buffering (Kafka)', icon: Layers },
            ]
        },
        {
            name: 'Analytics & SIEM', icon: PieChart, color: 'text-red-500', children: [
                { 
                    name: 'SIEM Core (Wazuh & ELK)', icon: Shield,
                    modalContent: {
                        title: 'Wazuh SIEM & ELK Stack',
                        description: 'Wazuh provides core SIEM capabilities, including log analysis, intrusion detection, and File Integrity Monitoring (FIM). It integrates with the ELK Stack (Elasticsearch, Logstash, Kibana) for long-term log storage, search, and visualization, meeting PCI DSS Req 10. This rule detects unauthorized changes to a critical security configuration file.',
                        code: { content: WAZUH_FIM_CODE }
                    }
                },
                { name: 'Visualisation (Grafana)', icon: AreaChart },
                { name: 'Metrics (Prometheus)', icon: HeartPulse },
                { name: 'Threat Intel & UEBA', icon: BrainCircuit },
            ]
        },
        {
            name: 'Automation & DevSecOps', icon: GitCommit, color: 'text-indigo-500', children: [
                { 
                    name: 'IaC (Terraform, Ansible)', icon: Layers,
                    modalContent: {
                        title: 'Infrastructure-as-Code (IaC)',
                        description: 'We use Terraform for provisioning and Ansible for configuration management. This "Compliance-as-Code" approach ensures security standards (e.g., CIS Benchmarks) are applied consistently, providing auditable evidence of our hardened configurations (PCI Req 2.2). Playbooks serve as executable documentation.',
                        code: { content: ANSIBLE_IAC_CODE }
                    }
                },
                { name: 'CI/CD Pipeline Security', icon: GitBranch, children: [
                    { name: 'SAST & DAST Scanning', icon: Bug },
                    { name: 'Container Image Signing', icon: FileCheck },
                ] },
                { name: 'SOAR (TheHive, Shuffle)', icon: Bot },
            ]
        },
        {
            name: 'Vulnerability Management', icon: ShieldAlert, color: 'text-rose-500', children: [
                { name: 'VA Scanning (Nessus, OpenVAS)', icon: ScanSearch },
                { name: 'Attack Surface Management', icon: Globe },
                { 
                    name: 'ASV Scans (PCI Mandated)', 
                    icon: ShieldCheck,
                    modalContent: {
                        title: 'Approved Scanning Vendor (ASV) Scans',
                        description: 'As required by PCI DSS Req 11.3.2, quarterly external vulnerability scans are performed by a PCI SSC Approved Scanning Vendor. The output is a formal Attestation of Scan Compliance, which is a critical piece of evidence for our quarterly compliance reviews and annual ROC. The metadata for each scan artifact is tracked for audit purposes.',
                        code: { content: ASV_SCAN_CODE }
                    }
                },
            ]
        },
        {
            name: 'Evidence & Audit Factory', icon: FolderCheck, color: 'text-cyan-500', children: [
                { name: 'Configuration Snapshots', icon: FileCog },
                { name: 'ROC/SAQ Automation Scripts', icon: FileCheck },
                { name: 'Immutable Log Storage (S3)', icon: Archive },
                { name: 'Framework Crosswalks (DB)', icon: GitCompare },
            ]
        },
        {
            name: 'Identity & Access Mgmt', icon: UserCheck, color: 'text-emerald-500', children: [
                 { name: 'Central IAM (Okta, EntraID)', icon: Users },
                 { name: 'Privileged Access (PAM)', icon: KeyRound },
                 { name: 'Cloud IAM (AWS/GCP)', icon: CloudCog },
            ]
        },
        {
            name: 'Third-Party Risk (3PRM)', icon: Handshake, color: 'text-violet-500', children: [
                { name: 'SIG/CAIQ Automation', icon: FileQuestion },
                { 
                    name: 'Vendor Risk Dashboards', 
                    icon: LayoutDashboard,
                    modalContent: TPRM_MODAL_CONTENT
                },
                { name: 'Continuous Monitoring', icon: Activity },
            ]
        }
    ]
};