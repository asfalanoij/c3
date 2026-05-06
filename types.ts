
import type { LucideIcon } from 'lucide-react';

export enum TabId {
  Overview = 'overview',
  Regional = 'regional',
  Soc2 = 'soc2',
  TechStack = 'techstack',
  Incident = 'incident',
  PciDeepDive = 'pciDeepDive',
  ThreePRM = '3prm',
  SiemSoar = 'siemSoar',
  KriDashboard = 'kriDashboard',
  FleetInsights = 'fleetInsights',
  RiskUniverse = 'riskUniverse',
  ProjectInfo = 'projectInfo',
  InternalControls = 'internalControls',
}

export type RegionKey = 'overview' | 'idn' | 'sgp' | 'hkg' | 'aus' | 'ind';

export interface Region {
  name: string;
  flag: string;
  color: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'indigo';
}

export interface ComplianceStatusItem {
  status: number;
  critical: number;
  total: number;
}

export type Trend = 'up' | 'down' | 'stable';
export type KriStatus = 'good' | 'warning' | 'critical';

export interface KRI {
  name: string;
  value: string;
  trend: Trend;
  status: KriStatus;
  icon: LucideIcon;
}

export type ControlStatus = 'complete' | 'in-progress' | 'remediation';
export type Priority = 'critical' | 'high' | 'medium';

export interface PCIControl {
  req: string;
  name: string;
  status: ControlStatus;
  priority: Priority;
}

export type ChecklistStatus = 'Implemented' | 'In Progress' | 'Planned' | 'Not Applicable';

export interface RegionalChecklistItem {
  id: string;
  control: string;
  description: string;
  status: ChecklistStatus;
  evidence: string; // Could be artifact ID in the future
  notes: string;
}

export interface RegionalChecklistCategory {
  name:string;
  description: string;
  items: RegionalChecklistItem[];
}

export type ApmStatus = 'Live' | 'Onboarding' | 'Monitoring';

export interface ApacApmCompliance {
  id: string;
  name: string;
  icon: string; // Could be a URL or an identifier for a local component
  status: ApmStatus;
  keyRisks: string[];
  regulator: string;
  lastReviewDate: string; // YYYY-MM-DD
}

export interface RegionalChecklist {
  framework: string;
  regulator: string;
  keyMetrics: {
    label: string;
    value: string;
    icon: LucideIcon;
  }[];
  categories: RegionalChecklistCategory[];
  apmCompliance?: ApacApmCompliance[];
}

export interface Tab {
    id: TabId;
    label: string;
    icon: LucideIcon;
}

export interface RegionColorMap {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
    ring: string;
  };
}

// New detailed types for PCI DSS v4 checklist
export interface PciSubRequirement {
  id: string;
  description: string;
  status: ControlStatus;
}

export interface PciMainRequirement {
  id: string;
  title: string;
  subRequirements: PciSubRequirement[];
}

export interface PciIsoMapping {
  pciReq: string;
  isoControl: string;
  mapping: 'Direct' | 'Overlap' | 'Foundation';
  auditEvidence: string;
  dualPurpose: string;
}

export interface BlueprintNode {
    name: string;
    icon: LucideIcon;
    color?: string;
    children?: BlueprintNode[];
    modalContent?: {
        title: string;
        description: string;
        code?: {
            content: string;
        };
    };
}

export type Soc2ControlStatus = 'in-place' | 'needs-improvement' | 'not-applicable' | 'processing-integrity' | 'privacy';

export interface Soc2Control {
  id: string;
  description: string;
  status: Soc2ControlStatus;
  evidence: string;
}

export interface TrustServiceCriterion {
  id: string;
  name: string;
  description: string;
  controls: Soc2Control[];
}

export interface UnifiedEvidence {
  pciReq: string;
  artifact: string;
  description:string;
  synergies: {
    iso27001: string;
    iso27701: boolean;
    mas: boolean;
    ojk: boolean;
    hkma: boolean;
    austrac: boolean;
    rbi: boolean;
  };
  justification: string;
}

// --- Enterprise Risk Management (ERM) Types ---
export type RiskDomain = 'Cybersecurity' | 'Operational' | 'Strategic' | 'Third-Party' | 'Compliance' | 'Financial' | 'Legal' | 'Reputational' | 'IT';
export type RiskScoreValue = 1 | 2 | 3 | 4 | 5;
export type ControlEffectiveness = 'Effective' | 'Partially Effective' | 'Ineffective';
export type RiskTreatmentStrategy = 'Accept' | 'Mitigate' | 'Transfer' | 'Avoid';
export type RiskLinkType = 'Correlates With' | 'Causal Inference' | 'Severes';

// 3PRM Types
export type RiskCategory = 'Cloud Provider' | 'DevOps Toolchain' | 'Hardware/Firmware' | 'Data Processor' | 'Managed Service' | 'Software Library' | 'Physical Security' | 'Strategic Partner / Acquirer';
export type RiskStatus = 'Monitored' | 'Needs Review' | 'In Remediation' | 'Onboarding';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

// FIX: Add 'Planned' to ControlCheckStatus to align with its usage and other status types.
export type ControlCheckStatus = 'Pass' | 'Fail' | 'In Progress' | 'Not Applicable' | 'Planned';

export interface VendorControlCheck {
  id: string;
  category: 'Security' | 'Availability' | 'Compliance' | 'Privacy';
  control: string;
  status: ControlCheckStatus;
}

export interface RiskScoring {
    impact: RiskScoreValue;
    likelihood: RiskScoreValue;
}

export interface VendorRiskAlert {
  type: 'Security' | 'Compliance' | 'Operational' | 'Reputational';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface ThirdPartyVendor {
  id: number;
  name: string;
  service: string;
  category: RiskCategory;
  status: RiskStatus;
  inherentRisk: RiskScoring;
  residualRisk: RiskScoring;
  lastAssessed: string; // "YYYY-MM-DD"
  riskScenario: string;
  checklist: VendorControlCheck[];
  contractClauses: {
    rightToAudit: boolean;
    breachNotificationSla: string; // e.g., "24 hours"
  };
  alerts: VendorRiskAlert[];
}


// SIEM/SOAR Types
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type EventStatus = 'Analyst Review' | 'Remediation Successful' | 'False Positive' | 'Escalated';

export interface AlertTrendDataPoint {
  hour: number;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface MitreTactic {
  id: string;
  name: string;
  count: number;
}

export interface NotableEvent {
  id: string;
  timestamp: string;
  ruleName: string;
  entity: string;
  sourceIp: string;
  tactic: { id: string; name: string };
  technique: { id: string; name: string };
  severity: AlertSeverity;
  status: EventStatus;
  rawLog: string;
  playbook: string;
}

// KRI Dashboard Types
export interface PatchSlaData {
  category: 'CDE Servers' | 'Cloud VMs' | 'Corporate Laptops' | 'Network Devices';
  total: number;
  patched: number;
  pending: number;
  overdue: number;
}

export interface EstateVisibilityData {
  category: 'Endpoints' | 'Cloud Resources' | 'Network Devices' | 'Unmanaged';
  value: number;
  color: string;
}

export interface KeyLifecycleData {
  category: 'HSM Master Keys' | 'TLS Certificates' | 'Database Keys' | 'API Keys';
  total: number;
  rotatedOnSchedule: number;
  expiresSoon: number; // e.g., within 30 days for TLS
  outOfPolicy: number;
}

// New types for Incident Response
export interface CallTreeNode {
  role: string;
  contact?: string; // e.g., "On-Call Pager", "slack #channel"
  triggers: string[];
  icon: LucideIcon;
  children?: CallTreeNode[];
}

export interface IncidentMetric {
  acronym: string;
  name: string;
  description: string;
  target: string;
  icon: LucideIcon;
}

export interface SeverityDefinition {
  level: 'Critical' | 'High' | 'Medium' | 'Low';
  impact: string;
  examples: string;
}

export interface FrameworkAlignment {
  framework: string;
  icon: LucideIcon;
  clauses: {
    id: string;
    description: string;
  }[];
}

export interface DfirArtifact {
  name: string;
  description: string;
  volatility: 'Volatile' | 'Non-Volatile';
  icon: LucideIcon;
}

// Sankey Diagram Types
export type Framework = 'PCI' | 'NIST' | 'ISO';

export interface SankeyNode {
  nodeId: string;
  name: string;
  framework: Framework;
}

export interface SankeyLink {
  source: string; // nodeId
  target: string; // nodeId
  value: number;
  description: string;
}

// Audit Artifacts Types v2
export interface ArtifactLink {
  targetId: string; // ID of the linked artifact
  type: 'correlated' | 'supplemented' | 'causality' | 'optimized';
  description: string;
}

export type ArtifactType = 'Log' | 'Configuration' | 'Report' | 'Policy' | 'Evidence Package' | 'Code';
export type ArtifactClassification = 'Preventative' | 'Detective' | 'Corrective' | 'Directive';

export interface PciMapping {
  req: string;
  customizedApproach?: string;
}

export interface IsoMapping {
  control: string;
  description: string;
}

export type ApacRegulation = 'MAS-TRM' | 'OJK' | 'HKMA-CRAF' | 'RBI-CSF' | 'AUSTRAC';


export interface AuditArtifact {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceIcon: LucideIcon;
  artifactType: ArtifactType;
  classification: ArtifactClassification;
  pciMappings: PciMapping[];
  isoMappings: IsoMapping[];
  localRegulations: ApacRegulation[];
  links: ArtifactLink[];
  lastGenerated: string;
}

// GRC AI Assistant
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
}

// Fleet & Growth Insights Types
export type TerminalStatus = 'Online' | 'Offline' | 'Needs Maintenance';
export type ApacCountry = 'Singapore' | 'Indonesia' | 'India' | 'Australia' | 'Hong Kong';
export type ApacAPM = 'GrabPay' | 'GoPay' | 'Paytm' | 'WeChat Pay' | 'Alipay' | 'eftpos';
export type ConnectionType = '4G' | 'WiFi' | 'Ethernet';
export type TamperStatus = 'None' | 'Alert';

export interface TerminalCompliance {
  standard: 'PCI-PTS v6' | 'PCI-PTS v7' | 'EMV L3' | 'Local Mandate' | 'PCI MPoC';
  status: 'Compliant' | 'Expires Soon' | 'Non-Compliant' | 'Planned' | 'In Progress';
  expiry?: string; // "YYYY-MM-DD" or "N/A"
}

export interface RiskAlert {
  type: 'Compliance' | 'Fraud' | 'Operational' | 'Security';
  severity: 'High' | 'Medium';
  description: string;
}

export interface PaymentTerminal {
  id: string;
  model: string;
  merchant: string;
  country: ApacCountry;
  status: TerminalStatus;
  lastSeen: string; // ISO 8601
  compliance: TerminalCompliance[];
  monthlyTxns: number;
  monthlyVol: number; // in USD
  avgTxnValue: number; // in USD
  fraudScore: number; // 0-100
  alerts: RiskAlert[];
  supportedAPMs: ApacAPM[];
  firmwareVersion: string;
  connectionType: ConnectionType;
  tamperStatus: TamperStatus;
  aiRecommendation?: string;
  batteryHealth?: number;
}

export interface GrowthOpportunity {
  terminalId: string;
  suggestedAPM?: ApacAPM;
  suggestedUpgrade?: string; // e.g., 'TETRA to AXIUM'
  opportunityScore: number; // 0-100
  estimatedLift: number; // percentage
  rationale: string;
}

// Internal Control Testing (ICT) Types
export type ControlStatusState = 'Design Effective' | 'Operating Effectively' | 'Needs Improvement' | 'Not Tested';

export interface InternalControl {
  id: string; // e.g., 'CTRL-TEC-05'
  name: string;
  description: string;
  domain: 'Organizational' | 'People' | 'Physical' | 'Technological' | 'Hardware' | 'Software';
  type: ArtifactClassification; // Preventative, Detective, etc.
  status: ControlStatusState;
  testFrequency: 'Annual' | 'Quarterly' | 'Continuous';
  lastTested: string; // "YYYY-MM-DD"
  nextTestDue: string; // "YYYY-MM-DD"
  mappings: {
    iso27001: string[]; // e.g., ['A.8.9']
    pci: string[]; // e.g., ['2.2']
    soc2: string[]; // e.g., ['CC6.8']
  };
  linkedArtifacts: string[]; // Array of artifact IDs that serve as evidence
}


// ERM Types (continued)
export interface RiskCodification {
  domain: 'CYBER' | 'OPS' | 'STRAT' | '3PRM' | 'COMP';
  sequence: number;
}

export interface RiskControlLink {
  controlId: string; // e.g., an InternalControl ID like 'CTRL-TEC-05'
  effectiveness: ControlEffectiveness;
  description: string;
}

export interface RiskTreatmentPlan {
  strategy: RiskTreatmentStrategy;
  details: string;
  owner: string;
  dueDate: string; // YYYY-MM-DD
}

export interface RiskLink {
    targetId: string;
    type: RiskLinkType;
    description: string;
}

export interface RiskProfile {
  id: string; // e.g., CYBER-001
  riskEvent: string;
  description: string;
  domain: RiskDomain;
  businessProcess: string;
  kpi?: string; // Key Performance Indicator affected
  kri?: string; // Key Risk Indicator to monitor this risk
  owner: string;
  frameworkMapping?: {
    pci: string[];
    iso: string[];
  };
  inherentRisk: RiskScoring;
  rcsa: RiskControlLink[];
  residualRisk: RiskScoring;
  treatmentPlan?: RiskTreatmentPlan;
  lastReviewed: string; // YYYY-MM-DD
  links?: RiskLink[];
  pciImplications?: string;
  cascadesFrom?: string; // ID of the parent risk, e.g., 'CYBER-001'
}
