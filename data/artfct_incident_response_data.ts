import { 
    Phone, Users, UserCog, Shield, Briefcase, LandPlot, Siren,
    Timer, LocateFixed, GitCommit, FileClock, Gauge, BrainCircuit,
    Database, Server, Network, Fingerprint, HardDrive,
    BookOpen, CheckSquare, ShieldCheck, ClipboardList,
} from 'lucide-react';
import type { CallTreeNode, IncidentMetric, SeverityDefinition, FrameworkAlignment, DfirArtifact } from '../types';

const BREACH_PLAYBOOK_CODE = `
# playbook.yaml - Shuffle SOAR Playbook
name: PCI - Potential Data Breach Response
triggers:
  - name: "Wazuh Alert - Level 12+"
    schema:
      rule_description: ".*multiple cardholder data.*"

workflow:
- name: "Initial Triage & Containment"
  loop: "{{.triggers.results}}"
  actions:
  - name: "Isolate Host"
    app: "Crowdstrike"
    action: "contain_host"
    parameters:
      hostname: "{{.loop.value.agent.name}}"

  - name: "Take Memory Dump"
    app: "Velociraptor"
    action: "collect_memory_dump"
    parameters:
      agent_id: "{{.loop.value.agent.id}}"

  - name: "Create High-Severity Jira Ticket"
    app: "Jira"
    action: "create_issue"
    parameters:
      project: "SECINC"
      summary: "Potential Data Breach on {{.loop.value.agent.name}}"
      issue_type: "Incident"
      priority: "Highest"

- name: "Notify Stakeholders"
  actions:
  - name: "Page On-Call Incident Commander"
    app: "PagerDuty"
    action: "trigger_incident"
    parameters:
      summary: "PCI DATA BREACH - INVESTIGATION STARTED"

  - name: "Post to Legal & Compliance Channel"
    app: "Slack"
    action: "send_message"
    parameters:
      channel: "#legal-compliance-apac"
      message: |
        *Regulatory Notification Advisory*
        A potential payment data breach is under investigation. 
        Stand by for impact assessment. Review notification timelines for:
        - MAS (1hr)
        - CERT-IN (6hr)
`;

const TERMINAL_PLAYBOOK_CODE = `
# playbook.yaml
name: POS Terminal Compromise
triggers:
  - name: "Terminal Mgmt Alert"
    schema:
      alert_type: "unusual_firmware_hash"

workflow:
- name: "Isolate and Revoke"
  loop: "{{.triggers.results}}"
  actions:
  - name: "Disable Terminal in Gateway"
    app: "Internal Payment Gateway API"
    action: "set_terminal_status"
    parameters:
      terminal_id: "{{.loop.value.terminal_id}}"
      status: "DISABLED"

  - name: "Initiate Remote Key Revocation"
    app: "HSM Control API"
    action: "revoke_terminal_keys"
    parameters:
      terminal_id: "{{.loop.value.terminal_id}}"
      reason: "Suspected compromise"
      
  - name: "Create Logistics Ticket for Device Swap"
    app: "ServiceNow"
    action: "create_ticket"
    parameters:
      category: "Hardware"
      short_description: "Urgent Terminal Swap - {{.loop.value.terminal_id}}"
`;

const NOTICE_PLAYBOOK_CODE = `
# playbook.yaml
name: Generate Regulatory Notification Drafts
triggers:
  - name: "Jira Issue Update"
    schema:
      project: "SECINC"
      status: "Confirmed Breach"
      labels: "data-breach, pci"

workflow:
- name: "Fetch Incident Details"
  actions:
  - name: "Get Jira Issue"
    app: "Jira"
    action: "get_issue"
    parameters:
      issue_id: "{{.triggers.issue_key}}"

- name: "Generate and Send Drafts"
  actions:
  - name: "Apply MAS Template"
    app: "Internal Templating Service"
    action: "generate_from_template"
    parameters:
      template: "MAS_TRM_1hr_Notice.md"
      incident_data: "{{.Get_Jira_Issue.results}}"

  - name: "Email Draft to Compliance Team"
    app: "Gmail"
    action: "send_email"
    parameters:
      to: "apac-compliance@companyx.com"
      subject: "DRAFT: MAS TRM Notification for {{.triggers.issue_key}}"
      body: "{{.Apply_MAS_Template.results.content}}"
`;

export const PLAYBOOK_DATA: Record<string, { title: string; description: string; code: string }> = {
    breach: {
        title: "Payment Data Breach Playbook",
        description: "This is a simplified Shuffle SOAR playbook for responding to a potential payment data breach. It automates initial containment, evidence gathering, and stakeholder notification.",
        code: BREACH_PLAYBOOK_CODE
    },
    terminal: {
        title: "Terminal Compromise Playbook",
        description: "This playbook outlines the response to a suspected terminal compromise alert, focusing on immediate device isolation and key revocation to prevent further impact.",
        code: TERMINAL_PLAYBOOK_CODE
    },
    notice: {
        title: "Regulatory Notice Playbook",
        description: "This playbook is triggered after an incident has been confirmed and classified. It automates the creation of draft notifications based on jurisdiction-specific templates and timelines.",
        code: NOTICE_PLAYBOOK_CODE
    }
};

export const CALL_TREE_DATA: CallTreeNode = {
  role: 'Automated Alert',
  icon: Siren,
  triggers: ['SIEM/SOAR detects high-severity event'],
  children: [
    {
      role: 'Tier 1: On-Call Engineer / SOC Analyst',
      icon: Phone,
      contact: 'PagerDuty On-Call Rotation',
      triggers: ['Any automated alert fires', 'Initial triage & validation (15 min SLA)'],
      children: [
        {
          role: 'Tier 2: Incident Commander & Technical Lead',
          icon: Users,
          contact: 'Slack #incident-response',
          triggers: ['Validated Critical/High severity incident', 'Potential for significant business impact'],
          children: [
            {
              role: 'Tier 3: Department Heads',
              icon: UserCog,
              contact: 'Direct Call / Dedicated Channel',
              triggers: ['Confirmed data breach', 'Major service outage', 'Regulatory reporting required'],
              children: [
                { role: 'CISO / Head of Security', icon: Shield, triggers: ['All Tier 3 events'], contact: 'Direct Call' },
                { role: 'Head of Engineering', icon: Briefcase, triggers: ['Major service outage', 'Systemic vulnerability'], contact: 'Direct Call' },
                { role: 'Legal Counsel & Compliance Officer', icon: LandPlot, triggers: ['Confirmed data breach', 'Privacy incident'], contact: 'Direct Call' },
              ]
            },
            {
              role: 'Tier 4: Executive Leadership',
              icon: Briefcase,
              contact: 'Executive Briefing Call',
              triggers: ['Material impact to financials or reputation', 'Notification from a national regulator'],
              children: [
                 { role: 'CEO / CTO', icon: Briefcase, triggers: ['All Tier 4 events'], contact: 'Direct Call' },
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const INCIDENT_METRICS: IncidentMetric[] = [
  { acronym: 'MTTD', name: 'Mean Time to Detect', description: 'Average time it takes to discover a potential security incident.', target: '< 1 hour', icon: Timer },
  { acronym: 'MTTA', name: 'Mean Time to Acknowledge', description: 'Average time for an analyst to begin investigation after an alert is triggered.', target: '< 15 mins', icon: LocateFixed },
  { acronym: 'MTTR', name: 'Mean Time to Respond', description: 'Average time taken to contain, eradicate, and recover from an incident.', target: '< 4 hours', icon: GitCommit },
  { acronym: 'MTRC', name: 'Mean Time to Report Compliance', description: 'Average time taken to report to regulators (e.g., MAS 1hr, CERT-IN 6hr).', target: '< 80% of SLA', icon: FileClock },
];

export const SEVERITY_DEFINITIONS: SeverityDefinition[] = [
    { level: 'Critical', impact: 'Imminent, severe threat to the business.', examples: 'Active data breach in CDE, widespread ransomware, loss of production HSM keys.' },
    { level: 'High', impact: 'Significant potential for business, financial, or reputational damage.', examples: 'C2 beaconing from critical server, production service outage, privileged credential compromise.' },
    { level: 'Medium', impact: 'Operational disruption or potential for data exposure.', examples: 'Malware on non-critical system, anomalous user behavior, failed security control.' },
    { level: 'Low', impact: 'Minor policy violations or reconnaissance activity.', examples: 'Port scanning from internet, failed login attempts, non-critical vulnerability detected.' },
];

export const FRAMEWORK_ALIGNMENTS: FrameworkAlignment[] = [
    { 
        framework: 'PCI DSS v4.0.1',
        icon: ShieldCheck,
        clauses: [
            { id: '12.10.1', description: 'Incident response plan is created and maintained.' },
            { id: '12.10.4', description: 'Roles, responsibilities, and communication strategies defined.' },
            { id: '12.10.7', description: 'Incident response personnel are trained at least annually.' },
        ]
    },
    { 
        framework: 'ISO 27001:2022',
        icon: BookOpen,
        clauses: [
            { id: 'A.5.24', description: 'Information security incident management planning and preparation.' },
            { id: 'A.5.26', description: 'Response to information security incidents.' },
            { id: 'A.5.27', description: 'Learning from information security incidents.' },
        ]
    },
    { 
        framework: 'SOC 2 (Trust Services Criteria)',
        icon: CheckSquare,
        clauses: [
            { id: 'CC7.3', description: 'An incident response plan is in place to respond to security events.' },
            { id: 'CC7.4', description: 'Procedures are in place to analyze, contain, eradicate, and recover.' },
        ]
    },
    { 
        framework: 'NIST CSF 2.0',
        icon: ClipboardList,
        clauses: [
            { id: 'RS.MA-01', description: 'Incidents are managed according to a documented response process.' },
            { id: 'RS.MI-01', description: 'Incidents are contained to limit their impact.' },
            { id: 'RS.IM-01', description: 'Incident response processes are improved by incorporating lessons learned.' },
        ]
    }
];

export const DFIR_ARTIFACTS: DfirArtifact[] = [
    { name: 'Volatile Memory Dump', description: 'Captures running processes, network connections, command history. Highest priority.', volatility: 'Volatile', icon: BrainCircuit },
    { name: 'Network Traffic (PCAP)', description: 'Full packet capture of network communications to/from the affected system.', volatility: 'Volatile', icon: Network },
    { name: 'System State', description: 'Live running processes, loaded drivers, open files, logged-on users.', volatility: 'Volatile', icon: Server },
    { name: 'Forensic Disk Image', description: 'Bit-for-bit copy of the entire storage drive for offline analysis.', volatility: 'Non-Volatile', icon: HardDrive },
    { name: 'System Logs', description: 'OS logs (Event Logs, syslog), application logs, web server logs.', volatility: 'Non-Volatile', icon: Database },
    { name: 'Malware Samples', description: 'Copies of suspicious executables or scripts for reverse engineering.', volatility: 'Non-Volatile', icon: Fingerprint },
];
