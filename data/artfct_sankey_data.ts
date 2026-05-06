import type { SankeyNode, SankeyLink } from '../types';

export const SANKEY_NODES: SankeyNode[] = [
  // Level 0: PCI DSS v4.0.1 Objectives
  { nodeId: 'pci_network', name: 'Secure Network & Systems (Req 1-2)', framework: 'PCI' },
  { nodeId: 'pci_data', name: 'Protect Data (Req 3-4)', framework: 'PCI' },
  { nodeId: 'pci_vuln', name: 'Vulnerability Management (Req 5-6)', framework: 'PCI' },
  { nodeId: 'pci_access', name: 'Strong Access Control (Req 7-9)', framework: 'PCI' },
  { nodeId: 'pci_monitor', name: 'Monitor & Test Networks (Req 10-11)', framework: 'PCI' },
  { nodeId: 'pci_policy', name: 'Maintain InfoSec Policy (Req 12)', framework: 'PCI' },

  // Level 1: NIST CSF 2.0 Functions
  { nodeId: 'nist_govern', name: 'Govern', framework: 'NIST' },
  { nodeId: 'nist_identify', name: 'Identify', framework: 'NIST' },
  { nodeId: 'nist_protect', name: 'Protect', framework: 'NIST' },
  { nodeId: 'nist_detect', name: 'Detect', framework: 'NIST' },
  { nodeId: 'nist_respond', name: 'Respond', framework: 'NIST' },
  { nodeId: 'nist_recover', name: 'Recover', framework: 'NIST' },

  // Level 2: ISO 27001:2022 Thematic Control Groups
  { nodeId: 'iso_org', name: 'Organizational Controls (A.5)', framework: 'ISO' },
  { nodeId: 'iso_people', name: 'People Controls (A.6)', framework: 'ISO' },
  { nodeId: 'iso_physical', name: 'Physical Controls (A.7)', framework: 'ISO' },
  { nodeId: 'iso_tech', name: 'Technological Controls (A.8)', framework: 'ISO' },
];

export const SANKEY_LINKS: SankeyLink[] = [
  // PCI -> NIST
  { source: 'pci_network', target: 'nist_protect', value: 10, description: 'Network security and hardening are core to the Protect function.' },
  { source: 'pci_data', target: 'nist_protect', value: 12, description: 'Cryptography and secure transmission are primary protection mechanisms.' },
  { source: 'pci_vuln', target: 'nist_identify', value: 5, description: 'Identifying vulnerabilities is a key part of asset and risk identification.' },
  { source: 'pci_vuln', target: 'nist_protect', value: 8, description: 'Patching and anti-malware are fundamental protection activities.' },
  { source: 'pci_access', target: 'nist_protect', value: 15, description: 'Identity, authentication, and physical security are central to the Protect function.' },
  { source: 'pci_access', target: 'nist_identify', value: 4, description: 'Identifying users and assets is a prerequisite for access control.' },
  { source: 'pci_monitor', target: 'nist_detect', value: 18, description: 'Logging, monitoring, and regular testing are the essence of the Detect function.' },
  { source: 'pci_monitor', target: 'nist_respond', value: 6, description: 'Incident response planning within testing requirements informs the Respond function.' },
  { source: 'pci_policy', target: 'nist_govern', value: 20, description: 'A formal InfoSec policy is the foundation of the entire Governance function.' },
  { source: 'pci_policy', target: 'nist_respond', value: 5, description: 'The incident response plan mandated by PCI policies directly maps to the Respond function.' },

  // NIST -> ISO
  { source: 'nist_govern', target: 'iso_org', value: 20, description: 'The Governance function maps directly to ISO\'s Organizational Controls (policies, roles, risk management).' },
  { source: 'nist_govern', target: 'iso_people', value: 5, description: 'Governance includes security awareness and HR security, mapping to People Controls.' },
  { source: 'nist_identify', target: 'iso_org', value: 8, description: 'Asset management and risk identification are key Organizational Controls in ISO.' },
  { source: 'nist_identify', target: 'iso_tech', value: 4, description: 'Identifying technical vulnerabilities maps to Technological Controls.' },
  { source: 'nist_protect', target: 'iso_tech', value: 30, description: 'Protect heavily maps to Technological Controls (access control, crypto, network security).' },
  { source: 'nist_protect', target: 'iso_physical', value: 8, description: 'Protect includes physical security measures, mapping to Physical Controls.' },
  { source: 'nist_protect', target: 'iso_people', value: 4, description: 'Aspects of HR security and secure development fall under Protect.' },
  { source: 'nist_detect', target: 'iso_tech', value: 15, description: 'Detection capabilities rely on logging, monitoring, and vulnerability scanning, all Technological Controls.' },
  { source: 'nist_respond', target: 'iso_org', value: 12, description: 'Incident management planning and response are defined as Organizational Controls.' },
  { source: 'nist_recover', target: 'iso_org', value: 8, description: 'Business continuity and disaster recovery planning are Organizational Controls.' },
  { source: 'nist_recover', target: 'iso_tech', value: 5, description: 'Technical recovery, like restoring from backups, falls under Technological Controls.' },
];