
// Using a slightly different type to differentiate from the framework interconnectivity sankey
export interface EvidenceSankeyNode {
  nodeId: string;
  name: string;
  type: 'domain' | 'framework';
}

export interface EvidenceSankeyLink {
  source: string; // nodeId
  target: string; // nodeId
  value: number;
}

export const artfct_evidence_sankey_data: { nodes: EvidenceSankeyNode[], links: EvidenceSankeyLink[] } = {
  nodes: [
    // Level 0: Evidence Domains
    { nodeId: 'domain_iac', name: 'IaC & Config Mgmt', type: 'domain' },
    { nodeId: 'domain_siem', name: 'Logging & SIEM', type: 'domain' },
    { nodeId: 'domain_vuln', name: 'Vulnerability Mgmt', type: 'domain' },
    { nodeId: 'domain_crypto', name: 'Cryptography & Secrets', type: 'domain' },
    { nodeId: 'domain_iam', name: 'IAM & Access Control', type: 'domain' },
  
    // Level 1: Compliance Frameworks
    { nodeId: 'fw_pci', name: 'PCI DSS', type: 'framework' },
    { nodeId: 'fw_iso', name: 'ISO 27001', type: 'framework' },
    { nodeId: 'fw_apac', name: 'APAC Regulations', type: 'framework' },
  ],
  links: [
    // IaC & Config Mgmt -> Frameworks
    { source: 'domain_iac', target: 'fw_pci', value: 7 },
    { source: 'domain_iac', target: 'fw_iso', value: 7 },
    { source: 'domain_iac', target: 'fw_apac', value: 5 },
    
    // Logging & SIEM -> Frameworks
    { source: 'domain_siem', target: 'fw_pci', value: 7 },
    { source: 'domain_siem', target: 'fw_iso', value: 7 },
    { source: 'domain_siem', target: 'fw_apac', value: 4 },

    // Vulnerability Mgmt -> Frameworks
    { source: 'domain_vuln', target: 'fw_pci', value: 7 },
    { source: 'domain_vuln', target: 'fw_iso', value: 7 },
    { source: 'domain_vuln', target: 'fw_apac', value: 3 },
    
    // Cryptography & Secrets -> Frameworks
    { source: 'domain_crypto', target: 'fw_pci', value: 6 },
    { source: 'domain_crypto', target: 'fw_iso', value: 6 },
    { source: 'domain_crypto', target: 'fw_apac', value: 4 },
    
    // IAM & Access Control -> Frameworks
    { source: 'domain_iam', target: 'fw_pci', value: 7 },
    { source: 'domain_iam', target: 'fw_iso', value: 7 },
    { source: 'domain_iam', target: 'fw_apac', value: 3 },
  ]
};
