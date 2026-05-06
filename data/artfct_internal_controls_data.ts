import type { InternalControl } from '../types';

const generateTestDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const INTERNAL_CONTROLS_DATA: InternalControl[] = [
    // --- Organizational Controls (A.5) ---
    {
        id: 'CTRL-ORG-01', name: 'Asset Management',
        description: 'An inventory of all information and other associated assets, including hardware, software, and data, is maintained and owners are assigned.',
        domain: 'Organizational', type: 'Directive', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(120), nextTestDue: generateTestDate(-245),
        mappings: { iso27001: ['A.5.9'], pci: ['2.4', '9.5'], soc2: ['CC6.1'] },
        linkedArtifacts: ['ART-060']
    },
    {
        id: 'CTRL-ORG-02', name: 'Information Security Policies',
        description: 'A comprehensive set of information security policies, approved by management, is defined, published, and communicated to all relevant personnel.',
        domain: 'Organizational', type: 'Directive', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(200), nextTestDue: generateTestDate(-165),
        mappings: { iso27001: ['A.5.1'], pci: ['12.1'], soc2: ['CC1.1'] },
        linkedArtifacts: ['ART-018', 'ART-045', 'ART-066']
    },
    {
        id: 'CTRL-ORG-03', name: 'Security Awareness, Education and Training',
        description: 'All personnel and relevant interested parties receive appropriate and regular information security awareness education and training.',
        domain: 'Organizational', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(90), nextTestDue: generateTestDate(-275),
        mappings: { iso27001: ['A.6.3'], pci: ['12.6'], soc2: ['CC1.2'] },
        linkedArtifacts: ['ART-038']
    },
    {
        id: 'CTRL-ORG-04', name: 'Third-Party Risk Management',
        description: 'Processes and procedures are in place to manage information security risks associated with the use of supplier products or services.',
        domain: 'Organizational', type: 'Directive', status: 'Needs Improvement', testFrequency: 'Annual',
        lastTested: generateTestDate(60), nextTestDue: generateTestDate(-305),
        mappings: { iso27001: ['A.5.19', 'A.5.20'], pci: ['12.8'], soc2: ['CC9.2'] },
        linkedArtifacts: ['ART-016', 'ART-043', 'ART-046']
    },
    {
        id: 'CTRL-ORG-05', name: 'Threat Intelligence',
        description: 'Information relating to information security threats is collected and analyzed to produce threat intelligence.',
        domain: 'Organizational', type: 'Detective', status: 'Operating Effectively', testFrequency: 'Quarterly',
        lastTested: generateTestDate(30), nextTestDue: generateTestDate(-60),
        mappings: { iso27001: ['A.5.7'], pci: ['6.3.1'], soc2: ['CC7.1'] },
        linkedArtifacts: ['ART-028']
    },
    {
        id: 'CTRL-ORG-06', name: 'Incident Management Planning and Preparation',
        description: 'An incident response plan is established, documented, and regularly tested to ensure a timely and effective response to security incidents.',
        domain: 'Organizational', type: 'Directive', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(110), nextTestDue: generateTestDate(-255),
        mappings: { iso27001: ['A.5.24'], pci: ['12.10.1'], soc2: ['CC7.3'] },
        linkedArtifacts: ['ART-045']
    },
    {
        id: 'CTRL-ORG-07', name: 'Incident Response Testing',
        description: 'The incident response plan is tested at least annually through exercises such as tabletop simulations to validate its effectiveness.',
        domain: 'Organizational', type: 'Detective', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(45), nextTestDue: generateTestDate(-320),
        mappings: { iso27001: ['A.5.26'], pci: ['12.10.2'], soc2: ['CC7.3'] },
        linkedArtifacts: ['ART-044']
    },

    // --- Technological Controls (A.8) ---
    {
        id: 'CTRL-TEC-01', name: 'Network Security Controls',
        description: 'Network security controls, including segmentation and filtering, are implemented to manage information flow and protect the CDE.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Quarterly',
        lastTested: generateTestDate(15), nextTestDue: generateTestDate(-75),
        mappings: { iso27001: ['A.8.20'], pci: ['1.2', '1.3'], soc2: ['CC6.6'] },
        linkedArtifacts: ['ART-003', 'ART-004', 'ART-029', 'ART-054']
    },
    {
        id: 'CTRL-TEC-02', name: 'Access Control',
        description: 'Access to systems, applications, and data is restricted based on the principle of least privilege and business need-to-know.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Quarterly',
        lastTested: generateTestDate(40), nextTestDue: generateTestDate(-50),
        mappings: { iso27001: ['A.5.15', 'A.5.18'], pci: ['7.2'], soc2: ['CC6.1', 'CC6.3'] },
        linkedArtifacts: ['ART-013', 'ART-014', 'ART-042']
    },
    {
        id: 'CTRL-TEC-03', name: 'Strong Authentication',
        description: 'Multi-factor authentication (MFA) is enforced for all remote access to the network and for all administrative access to the CDE.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Continuous',
        lastTested: generateTestDate(1), nextTestDue: generateTestDate(-1),
        mappings: { iso27001: ['A.8.5'], pci: ['8.4', '8.5'], soc2: ['CC6.2'] },
        linkedArtifacts: ['ART-015', 'ART-039']
    },
    {
        id: 'CTRL-TEC-04', name: 'Cryptography',
        description: 'Strong cryptographic controls are used to protect sensitive data at rest and in transit, including robust key management processes.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(30), nextTestDue: generateTestDate(-335),
        mappings: { iso27001: ['A.8.24'], pci: ['3.5', '3.6', '4.2'], soc2: ['CC6.7'] },
        linkedArtifacts: ['ART-009', 'ART-030', 'ART-032', 'ART-033', 'ART-051']
    },
    {
        id: 'CTRL-TEC-05', name: 'Secure Configurations',
        description: 'Security configuration baselines are established, documented, and deployed for all production systems, including network devices, servers, and applications.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Quarterly',
        lastTested: generateTestDate(10), nextTestDue: generateTestDate(-80),
        mappings: { iso27001: ['A.8.9'], pci: ['2.2'], soc2: ['CC6.8'] },
        linkedArtifacts: ['ART-001', 'ART-002', 'ART-018', 'ART-024']
    },
    {
        id: 'CTRL-TEC-06', name: 'Secure Development Lifecycle',
        description: 'Security is integrated into all phases of the software development lifecycle, including secure coding training, code reviews, and application security testing (SAST/DAST).',
        domain: 'Technological', type: 'Preventative', status: 'Needs Improvement', testFrequency: 'Annual',
        lastTested: generateTestDate(75), nextTestDue: generateTestDate(-290),
        mappings: { iso27001: ['A.8.25', 'A.8.28'], pci: ['6.2', '6.4'], soc2: ['CC8.1'] },
        linkedArtifacts: ['ART-011', 'ART-012', 'ART-034', 'ART-037']
    },
    {
        id: 'CTRL-TEC-07', name: 'Vulnerability Management',
        description: 'A comprehensive process is in place to identify, assess, and remediate security vulnerabilities in a timely manner, including regular internal and external scanning.',
        domain: 'Technological', type: 'Detective', status: 'Operating Effectively', testFrequency: 'Quarterly',
        lastTested: generateTestDate(15), nextTestDue: generateTestDate(-75),
        mappings: { iso27001: ['A.8.8'], pci: ['6.3', '11.3'], soc2: ['CC7.1'] },
        linkedArtifacts: ['ART-007', 'ART-008', 'ART-025', 'ART-026', 'ART-027']
    },
    {
        id: 'CTRL-TEC-08', name: 'Malware Protection',
        description: 'Anti-malware solutions are deployed and maintained on all applicable systems to protect against malicious software.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Continuous',
        lastTested: generateTestDate(1), nextTestDue: generateTestDate(-1),
        mappings: { iso27001: ['A.8.7'], pci: ['5.2', '5.3'], soc2: ['CC7.2'] },
        linkedArtifacts: ['ART-052']
    },
    {
        id: 'CTRL-TEC-09', name: 'Logging and Monitoring',
        description: 'Audit logs are generated, protected, and reviewed for all critical systems to detect and respond to potential security incidents.',
        domain: 'Technological', type: 'Detective', status: 'Operating Effectively', testFrequency: 'Continuous',
        lastTested: generateTestDate(1), nextTestDue: generateTestDate(-1),
        mappings: { iso27001: ['A.8.15', 'A.8.16'], pci: ['10.2', '10.4'], soc2: ['CC7.2'] },
        linkedArtifacts: ['ART-005', 'ART-020', 'ART-021', 'ART-022', 'ART-023']
    },
    {
        id: 'CTRL-TEC-10', name: 'Security Orchestration, Automation, and Response (SOAR)',
        description: 'Automated playbooks are developed and maintained to provide a rapid and consistent response to common security alerts.',
        domain: 'Technological', type: 'Corrective', status: 'Design Effective', testFrequency: 'Quarterly',
        lastTested: generateTestDate(50), nextTestDue: generateTestDate(-40),
        mappings: { iso27001: ['A.5.26'], pci: ['12.10.1'], soc2: ['CC7.3'] },
        linkedArtifacts: ['ART-006']
    },
    {
        id: 'CTRL-TEC-11', name: 'Remote Key Injection (RKI)',
        description: 'Secure protocols and infrastructure are used to inject cryptographic keys into remote Point-of-Interaction (POI) terminals.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Annual',
        lastTested: generateTestDate(180), nextTestDue: generateTestDate(-185),
        mappings: { iso27001: ['A.8.24'], pci: ['3.7.2'], soc2: [] },
        linkedArtifacts: ['ART-031']
    },
     {
        id: 'CTRL-TEC-15', name: 'Privileged Access Management (PAM)',
        description: 'Access for privileged accounts (e.g., administrator, root) is strictly controlled, monitored, and managed.',
        domain: 'Technological', type: 'Preventative', status: 'Operating Effectively', testFrequency: 'Quarterly',
        lastTested: generateTestDate(40), nextTestDue: generateTestDate(-50),
        mappings: { iso27001: ['A.8.2'], pci: ['7.2.1', '8.2.2'], soc2: ['CC6.2'] },
        linkedArtifacts: ['ART-010', 'ART-061']
    },
    {
        id: 'CTRL-TEC-16', name: 'Biometric Authentication Lifecycle Management',
        description: 'Define, implement, and maintain secure processes for the entire lifecycle of biometric data used for payment authentication, including enrollment, template storage, transmission, and revocation.',
        domain: 'Technological', type: 'Preventative', status: 'Design Effective', testFrequency: 'Annual',
        lastTested: generateTestDate(30), nextTestDue: generateTestDate(-335),
        mappings: { iso27001: ['A.5.17', 'A.8.33'], pci: ['8.3', '3.5'], soc2: ['CC6.2', 'P1.2'] },
        linkedArtifacts: ['ART-067', 'ART-068', 'ART-069']
    },


    // --- Physical Controls (A.7) ---
    {
        id: 'CTRL-PHY-01', name: 'Physical Security',
        description: 'Physical access to sensitive areas, such as data centers, is controlled, monitored, and restricted to authorized personnel.',
        domain: 'Physical', type: 'Preventative', status: 'Not Tested', testFrequency: 'Annual',
        lastTested: generateTestDate(400), nextTestDue: generateTestDate(-1),
        mappings: { iso27001: ['A.7.1', 'A.7.2'], pci: ['9.2'], soc2: ['CC6.6'] },
        linkedArtifacts: ['ART-047', 'ART-048']
    },

    // --- New Controls for Hardware & Software Innovation ---
    {
        id: 'CTRL-HW-01', name: 'PCI PTS Certification Management',
        description: 'Manage the lifecycle of PCI PIN Transaction Security (PTS) device certifications, including planning for new versions (e.g., v7), conducting gap analyses, and tracking recertification timelines for all hardware.',
        domain: 'Hardware', type: 'Directive', status: 'Design Effective', testFrequency: 'Annual',
        lastTested: generateTestDate(30), nextTestDue: generateTestDate(-335),
        mappings: { iso27001: ['A.5.32'], pci: ['9.5'], soc2: ['CC7.1'] },
        linkedArtifacts: ['ART-070']
    },
    {
        id: 'CTRL-SW-05', name: 'SoftPOS Application Security Lifecycle',
        description: 'A secure software development lifecycle specifically for Mobile Payment on COTS (MPoC) applications, including mandatory threat modeling, software protection mechanism testing, and anti-tampering controls.',
        domain: 'Software', type: 'Preventative', status: 'Design Effective', testFrequency: 'Quarterly',
        lastTested: generateTestDate(45), nextTestDue: generateTestDate(-45),
        mappings: { iso27001: ['A.8.25', 'A.8.28'], pci: ['6.2'], soc2: ['CC8.1'] },
        linkedArtifacts: ['ART-071']
    },
    {
        id: 'CTRL-SW-06', name: 'Back-end Monitoring & Attestation for COTS',
        description: 'Implement and operate a back-end system to monitor the security state of COTS devices in real-time. The system must ingest and validate attestations from the mobile application and have the ability to remotely disable compromised instances.',
        domain: 'Software', type: 'Detective', status: 'Design Effective', testFrequency: 'Continuous',
        lastTested: generateTestDate(1), nextTestDue: generateTestDate(-1),
        mappings: { iso27001: ['A.8.16'], pci: ['10.2', '11.5'], soc2: ['CC7.2'] },
        linkedArtifacts: ['ART-072']
    }
];

export const ICT_METRICS = {
    totalControls: INTERNAL_CONTROLS_DATA.length,
    operatingEffectively: INTERNAL_CONTROLS_DATA.filter(c => c.status === 'Operating Effectively').length,
    needsRemediation: INTERNAL_CONTROLS_DATA.filter(c => c.status === 'Needs Improvement').length,
    testCoverage: Math.round(
        (INTERNAL_CONTROLS_DATA.filter(c => c.status !== 'Not Tested').length / INTERNAL_CONTROLS_DATA.length) * 100
    )
};