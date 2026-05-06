import { ComplianceStatusItem, KRI, PCIControl } from '../types';
import { Gauge, Network, KeyRound, Handshake } from 'lucide-react';

export const COMPLIANCE_STATUS: Record<string, ComplianceStatusItem> = {
  'PCI DSS v4.0.1': { status: 85, critical: 3, total: 12 },
  'ISO 27001': { status: 92, critical: 1, total: 8 },
  'SOC 2 Type 2': { status: 78, critical: 2, total: 5 },
  'Local Regulations': { status: 88, critical: 4, total: 15 }
};

export const KRIS: KRI[] = [
  { name: 'Critical Patch SLA', value: '95%', trend: 'up', status: 'good', icon: Gauge },
  { name: 'Estate Visibility', value: '87%', trend: 'up', status: 'warning', icon: Network },
  { name: 'Key Lifecycle Mgmt', value: '98%', trend: 'stable', status: 'good', icon: KeyRound },
  { name: '3PRM Coverage', value: '72%', trend: 'down', status: 'critical', icon: Handshake }
];

export const PCI_CONTROLS: PCIControl[] = [
  { req: 'Req.1', name: 'Network Security', status: 'complete', priority: 'high' },
  { req: 'Req.3', name: 'Protect Stored Data', status: 'in-progress', priority: 'critical' },
  { req: 'Req.6', name: 'Secure Systems', status: 'complete', priority: 'high' },
  { req: 'Req.8', name: 'Identity & Auth', status: 'remediation', priority: 'critical' },
  { req: 'Req.10', name: 'Logging & Monitoring', status: 'complete', priority: 'medium' },
  { req: 'Req.11', name: 'Security Testing', status: 'in-progress', priority: 'high' }
];