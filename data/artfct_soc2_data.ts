import { TrustServiceCriterion } from '../types';

export const SOC2_CRITERIA: TrustServiceCriterion[] = [
    {
        id: 'CC6',
        name: 'Security (Common Criteria)',
        description: 'The entity implements logical and physical access controls to protect information assets from security events.',
        controls: [
            { id: 'CC6.1', description: 'Logical access security measures restrict access based on need-to-know.', status: 'in-place', evidence: 'Role-based access control (RBAC) configuration matrix.' },
            { id: 'CC6.2', description: 'User authentication (passwords, MFA) is required for system access.', status: 'in-place', evidence: 'MFA configuration screenshots; Password policy doc.' },
            { id: 'CC6.3', description: 'Access is reviewed periodically and revoked upon termination.', status: 'in-place', evidence: 'Quarterly access review reports; Termination checklist.' },
            { id: 'CC6.6', description: 'Physical access to facilities and protected information is restricted.', status: 'in-place', evidence: 'Data center access logs; Visitor logs.' },
            { id: 'CC6.7', description: 'Transmission of data is protected through encryption.', status: 'in-place', evidence: 'TLS/SSL configuration report (e.g., Qualys SSL Labs).' },
            { id: 'CC6.8', description: 'Change management process is in place for system changes.', status: 'needs-improvement', evidence: 'Jira change management workflow; CAB meeting minutes.' },
        ]
    },
    {
        id: 'A1',
        name: 'Availability',
        description: 'The entity monitors the system and takes action to maintain compliance with its availability commitments and service-level agreements (SLAs).',
        controls: [
            { id: 'A1.1', description: 'System performance and capacity are monitored.', status: 'in-place', evidence: 'Grafana/Prometheus dashboards; Capacity planning reports.' },
            { id: 'A1.2', description: 'A disaster recovery plan is in place and tested periodically.', status: 'in-place', evidence: 'DR plan; Annual DR test results and after-action report.' },
            { id: 'A1.3', description: 'Environmental protections (power, cooling) are in place.', status: 'not-applicable', evidence: 'Cloud provider SOC 2 report (e.g., AWS, GCP).' },
        ]
    },
    {
        id: 'C1',
        name: 'Confidentiality',
        description: 'The entity identifies and protects confidential information to meet its objectives.',
        controls: [
            { id: 'C1.1', description: 'Policies are in place for identifying and classifying confidential information.', status: 'in-place', evidence: 'Data classification policy document.' },
            { id: 'C1.2', description: 'Confidential information is protected during storage and disposal.', status: 'in-place', evidence: 'Data-at-rest encryption policy; Media destruction certs.' },
        ]
    },
    {
        id: 'PI1',
        name: 'Processing Integrity',
        description: 'System processing is complete, valid, accurate, timely, and authorized to meet the entity’s objectives.',
        controls: [
            { id: 'PI1.1', description: 'Data input is validated for accuracy and completeness.', status: 'in-place', evidence: 'API input validation schema (e.g., OpenAPI spec).' },
            { id: 'PI1.2', description: 'Reconciliation processes are in place to detect data inconsistencies.', status: 'in-place', evidence: 'Daily transaction reconciliation reports.' },
            { id: 'PI1.3', description: 'System outputs are reviewed for accuracy before distribution.', status: 'needs-improvement', evidence: 'Output review checklist and sign-off sheets.' },
        ]
    },
    {
        id: 'P1',
        name: 'Privacy',
        description: 'Personal information is collected, used, retained, disclosed, and disposed of in conformity with the commitments in the entity’s privacy notice.',
        controls: [
            { id: 'P1.1', description: 'A privacy notice is published and accessible to data subjects.', status: 'in-place', evidence: 'Link to public privacy policy; version history.' },
            { id: 'P1.2', description: 'Data is collected and used only for the purposes stated in the privacy notice.', status: 'in-place', evidence: 'Data Processing Agreement (DPA) templates.' },
            { id: 'P1.3', description: 'A process is in place to handle data subject access requests (DSARs).', status: 'in-place', evidence: 'DSAR workflow documentation; Redacted DSAR log.' },
        ]
    }
];
