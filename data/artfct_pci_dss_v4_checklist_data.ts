import type { PciMainRequirement, ControlStatus } from '../types';

// Helper function to assign statuses based on a completion rate, ensuring a realistic distribution.
const assignStatuses = (details: { id: string; description: string }[], completionRate: number): { id: string; description: string; status: ControlStatus }[] => {
    const total = details.length;
    if (total === 0) return [];
    
    const completedCount = Math.floor(total * completionRate);
    const inProgressCount = Math.ceil((total - completedCount) / 2);
    
    let statuses: ControlStatus[] = [
        ...Array(completedCount).fill('complete'),
        ...Array(inProgressCount).fill('in-progress'),
        ...Array(total - completedCount - inProgressCount).fill('remediation')
    ];
    
    // Shuffle statuses for randomness
    for (let i = statuses.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
    }

    return details.map((detail, index) => ({ ...detail, status: statuses[index] || 'remediation' }));
};

export const PCI_DSS_V4_CHECKLIST_DATA: PciMainRequirement[] = [
  {
    id: 'Req.1',
    title: 'Install and Maintain Network Security Controls',
    subRequirements: assignStatuses([
        { id: '1.1.1', description: 'All security policies and operational procedures that are identified in Requirement 1 are documented, kept up to date, in use, and known to all affected parties.' },
        { id: '1.1.2', description: 'Roles and responsibilities for performing activities in Requirement 1 are documented, assigned, and understood.' },
        { id: '1.2.1', description: 'Configuration standards for Network Security Control (NSC) rulesets are defined, implemented, and maintained.' },
        { id: '1.2.2', description: 'All changes to network connections and to configurations of NSCs are approved and managed in accordance with the change control process.' },
        { id: '1.2.3', description: 'An accurate network diagram(s) is maintained that shows all connections between the CDE and other networks, including any wireless networks.' },
        { id: '1.2.4', description: 'An accurate data-flow diagram(s) is maintained that shows all account data flows across systems and networks.' },
        { id: '1.2.5', description: 'All services, protocols and ports allowed are identified, approved, and have a defined business need.' },
        { id: '1.2.6', description: 'Security features are defined and implemented for all services, protocols, and ports that are in use and considered to be insecure, such that the risk is mitigated.' },
        { id: '1.2.7', description: 'Configurations of NSCs are reviewed at least once every six months to confirm they are relevant and effective.' },
        { id: '1.2.8', description: 'Configuration files for NSCs are secured from unauthorized access and kept consistent with active network configurations.' },
        { id: '1.3.1', description: 'Inbound traffic to the CDE is restricted to only necessary traffic, and all other traffic is specifically denied.' },
        { id: '1.3.2', description: 'Outbound traffic from the CDE is restricted to only necessary traffic, and all other traffic is specifically denied.' },
        { id: '1.3.3', description: 'NSCs are installed between all wireless networks and the CDE, such that all wireless traffic is denied by default.' },
        { id: '1.4.1', description: 'NSCs are implemented between trusted and untrusted networks.' },
        { id: '1.4.2', description: 'Inbound traffic from untrusted networks is restricted to authorized communications.' },
        { id: '1.4.3', description: 'Anti-spoofing measures are implemented to detect and block forged source IP addresses.' },
        { id: '1.4.4', description: 'System components that store cardholder data are not directly accessible from untrusted networks.' },
        { id: '1.4.5', description: 'The disclosure of internal IP addresses and routing information is limited to only authorized parties.' },
        { id: '1.5.1', description: 'Security controls are implemented on any computing devices that connect to both untrusted networks and the CDE.' },
    ], 0.95)
  },
  {
    id: 'Req.2',
    title: 'Apply Secure Configurations to All System Components',
    subRequirements: assignStatuses([
        { id: '2.1.1', description: 'All security policies and operational procedures that are identified in Requirement 2 are documented and known.' },
        { id: '2.1.2', description: 'Roles and responsibilities for performing activities in Requirement 2 are documented, assigned, and understood.' },
        { id: '2.2.1', description: 'Configuration standards are developed, implemented, and maintained for all system components.' },
        { id: '2.2.2', description: 'Vendor default accounts are managed by changing passwords or removing/disabling accounts.' },
        { id: '2.2.3', description: 'Primary functions requiring different security levels are managed and isolated.' },
        { id: '2.2.4', description: 'Only necessary services, protocols, daemons, and functions are enabled.' },
        { id: '2.2.5', description: 'Insecure services, protocols, or daemons have documented business justification and security features.' },
        { id: '2.2.6', description: 'System security parameters are configured to prevent misuse.' },
        { id: '2.2.7', description: 'All non-console administrative access is encrypted using strong cryptography.' },
        { id: '2.3.1', description: 'For wireless environments, all wireless vendor defaults are changed at installation or confirmed to be secure.' },
        { id: '2.3.2', description: 'For wireless environments, wireless encryption keys are changed when personnel leave or a key is compromised.' },
    ], 0.88)
  },
  {
    id: 'Req.3',
    title: 'Protect Stored Account Data',
    subRequirements: assignStatuses([
        { id: '3.1.1', description: 'All security policies and operational procedures for Requirement 3 are documented and known.' },
        { id: '3.1.2', description: 'Roles and responsibilities for Requirement 3 are documented, assigned, and understood.' },
        { id: '3.2.1', description: 'Account data storage is kept to a minimum through data retention and disposal policies.' },
        { id: '3.3.1', description: 'Sensitive Authentication Data (SAD) is not stored after authorization.' },
        { id: '3.3.2', description: 'SAD that is stored electronically prior to completion of authorization is encrypted using strong cryptography.' },
        { id: '3.3.3', description: 'For issuers, any storage of SAD is limited to legitimate business need and is secured.' },
        { id: '3.4.1', description: 'Primary Account Number (PAN) is masked when displayed.' },
        { id: '3.4.2', description: 'When using remote-access technologies, technical controls prevent copy and/or relocation of PAN.' },
        { id: '3.5.1', description: 'PAN is rendered unreadable anywhere it is stored.' },
        { id: '3.5.1.1', description: 'Hashes used to render PAN unreadable are keyed cryptographic hashes of the entire PAN.' },
        { id: '3.5.1.2', description: 'Disk-level or partition-level encryption is only used on removable media or with another rendering mechanism.' },
        { id: '3.6.1', description: 'Procedures are defined and implemented to protect cryptographic keys used to protect stored account data.' },
        { id: '3.6.1.1', description: 'Service providers maintain a documented description of the cryptographic architecture.' },
        { id: '3.7.1', description: 'Key-management policies are implemented for generation of strong cryptographic keys.' },
        { id: '3.7.2', description: 'Key-management policies are implemented for secure distribution of cryptographic keys.' },
        { id: '3.7.3', description: 'Key-management policies are implemented for secure storage of cryptographic keys.' },
        { id: '3.7.4', description: 'Key-management policies are implemented for cryptographic key changes at the end of their cryptoperiod.' },
        { id: '3.7.5', description: 'Key-management policies are implemented for the retirement or replacement of keys.' },
    ], 0.92)
  },
  {
    id: 'Req.4',
    title: 'Protect Cardholder Data with Strong Cryptography During Transmission',
    subRequirements: assignStatuses([
        { id: '4.1.1', description: 'All security policies and operational procedures for Requirement 4 are documented and known.' },
        { id: '4.1.2', description: 'Roles and responsibilities for Requirement 4 are documented, assigned, and understood.' },
        { id: '4.2.1', description: 'Strong cryptography and security protocols are implemented to safeguard PAN during transmission over open, public networks.' },
        { id: '4.2.1.1', description: 'An inventory of the entity’s trusted keys and certificates is maintained.' },
        { id: '4.2.1.2', description: 'Wireless networks transmitting PAN use industry best practices for strong cryptography.' },
        { id: '4.2.2', description: 'PAN is secured with strong cryptography whenever it is sent via end-user messaging technologies.' },
    ], 1.0)
  },
  {
    id: 'Req.5',
    title: 'Protect All Systems and Networks from Malicious Software',
    subRequirements: assignStatuses([
        { id: '5.1.1', description: 'All security policies and operational procedures for Requirement 5 are documented and known.' },
        { id: '5.1.2', description: 'Roles and responsibilities for Requirement 5 are documented, assigned, and understood.' },
        { id: '5.2.1', description: 'An anti-malware solution(s) is deployed on all system components, except for those identified as not at risk.' },
        { id: '5.2.2', description: 'The deployed anti-malware solution detects, removes, blocks, or contains all known types of malware.' },
        { id: '5.2.3', description: 'System components not at risk for malware are evaluated periodically.' },
        { id: '5.3.1', description: 'The anti-malware solution is kept current via automatic updates.' },
        { id: '5.3.2', description: 'The anti-malware solution performs periodic scans and active/real-time scans or continuous behavioral analysis.' },
        { id: '5.3.3', description: 'For removable electronic media, the anti-malware solution performs automatic scans or behavioral analysis.' },
        { id: '5.3.4', description: 'Audit logs for the anti-malware solution are enabled and retained.' },
        { id: '5.3.5', description: 'Anti-malware mechanisms cannot be disabled or altered by users without authorization.' },
        { id: '5.4.1', description: 'Processes and automated mechanisms are in place to detect and protect personnel against phishing attacks.' },
    ], 0.95)
  },
  {
    id: 'Req.6',
    title: 'Develop and Maintain Secure Systems and Software',
    subRequirements: assignStatuses([
        { id: '6.1.1', description: 'All security policies and operational procedures for Requirement 6 are documented and known.' },
        { id: '6.1.2', description: 'Roles and responsibilities for Requirement 6 are documented, assigned, and understood.' },
        { id: '6.2.1', description: 'Bespoke and custom software are developed securely based on industry standards.' },
        { id: '6.2.2', description: 'Software development personnel are trained at least annually on software security.' },
        { id: '6.2.3', description: 'Bespoke and custom software is reviewed prior to release to identify and correct vulnerabilities.' },
        { id: '6.3.1', description: 'Security vulnerabilities are identified and managed from industry-recognized sources.' },
        { id: '6.3.2', description: 'An inventory of bespoke and custom software and third-party components is maintained.' },
        { id: '6.3.3', description: 'All system components are protected from known vulnerabilities by installing applicable security patches/updates.' },
        { id: '6.4.1', description: 'Public-facing web applications are protected against known attacks.' },
        { id: '6.4.2', description: 'For public-facing web applications, an automated technical solution is deployed that continually detects and prevents web-based attacks.' },
        { id: '6.4.3', description: 'All payment page scripts that are loaded and executed in the consumer’s browser are managed.' },
        { id: '6.5.1', description: 'Changes to all system components in the production environment are made according to established procedures.' },
        { id: '6.5.2', description: 'Upon completion of a significant change, all applicable PCI DSS requirements are confirmed to be in place.' },
    ], 0.82)
  },
  {
    id: 'Req.7',
    title: 'Restrict Access to System Components and Cardholder Data by Business Need to Know',
    subRequirements: assignStatuses([
        { id: '7.1.1', description: 'All security policies and operational procedures for Requirement 7 are documented and known.' },
        { id: '7.1.2', description: 'Roles and responsibilities for Requirement 7 are documented, assigned, and understood.' },
        { id: '7.2.1', description: 'An access control model is defined and includes granting access based on least privileges.' },
        { id: '7.2.2', description: 'Access is assigned to users based on job classification and least privileges.' },
        { id: '7.2.3', description: 'Required privileges are approved by authorized personnel.' },
        { id: '7.2.4', description: 'All user accounts and related access privileges are reviewed at least once every six months.' },
        { id: '7.2.5', description: 'All application and system accounts and related access privileges are assigned and managed based on least privileges.' },
        { id: '7.2.6', description: 'All user access to query repositories of stored cardholder data is restricted.' },
        { id: '7.3.1', description: 'An access control system(s) is in place that restricts access based on a user’s need to know.' },
        { id: '7.3.2', description: 'The access control system(s) is configured to enforce privileges assigned.' },
        { id: '7.3.3', description: 'The access control system(s) is set to “deny all” by default.' },
    ], 0.90)
  },
  {
    id: 'Req.8',
    title: 'Identify Users and Authenticate Access to System Components',
    subRequirements: assignStatuses([
        { id: '8.1.1', description: 'All security policies and operational procedures for Requirement 8 are documented and known.' },
        { id: '8.1.2', description: 'Roles and responsibilities for Requirement 8 are documented, assigned, and understood.' },
        { id: '8.2.1', description: 'All users are assigned a unique ID before access.' },
        { id: '8.2.2', description: 'Group, shared, or generic IDs are only used when necessary on an exception basis and managed.' },
        { id: '8.2.3', description: 'Service providers with remote access to customer premises use unique authentication factors for each customer.' },
        { id: '8.2.4', description: 'Addition, deletion, and modification of user IDs and authentication factors are managed.' },
        { id: '8.2.5', description: 'Access for terminated users is immediately revoked.' },
        { id: '8.2.6', description: 'Inactive user accounts are removed or disabled within 90 days.' },
        { id: '8.3.1', description: 'All user access is authenticated via at least one authentication factor.' },
        { id: '8.3.2', description: 'Strong cryptography is used to render all authentication factors unreadable during transmission and storage.' },
        { id: '8.3.6', description: 'Passwords/passphrases meet a minimum level of complexity (12 characters, alphanumeric).' },
        { id: '8.4.2', description: 'MFA is implemented for all non-console access into the CDE.' },
        { id: '8.4.3', description: 'MFA is implemented for all remote network access originating from outside the entity’s network.' },
        { id: '8.5.1', description: 'MFA systems are implemented securely and cannot be bypassed.' },
        { id: '8.6.2', description: 'Passwords/passphrases for application/system accounts are not hard coded.' },
    ], 0.78)
  },
  {
    id: 'Req.9',
    title: 'Restrict Physical Access to Cardholder Data',
    subRequirements: assignStatuses([
        { id: '9.1.1', description: 'All security policies and operational procedures for Requirement 9 are documented and known.' },
        { id: '9.1.2', description: 'Roles and responsibilities for Requirement 9 are documented, assigned, and understood.' },
        { id: '9.2.1', description: 'Appropriate facility entry controls are in place to restrict physical access.' },
        { id: '9.2.1.1', description: 'Individual physical access to sensitive areas is monitored with video cameras or access control mechanisms.' },
        { id: '9.3.1.1', description: 'Physical access to sensitive areas for personnel is controlled based on job function.' },
        { id: '9.4.1', description: 'All media with cardholder data is physically secured.' },
        { id: '9.4.5', description: 'Inventory logs of all electronic media with cardholder data are maintained.' },
        { id: '9.4.6', description: 'Hard-copy materials with cardholder data are destroyed when no longer needed.' },
        { id: '9.5.1', description: 'Point-of-interaction (POI) devices are protected from tampering and unauthorized substitution.' },
        { id: '9.5.1.3', description: 'Training is provided for personnel in POI environments to be aware of attempted tampering.' },
    ], 1.0)
  },
  {
    id: 'Req.10',
    title: 'Log and Monitor All Access to System Components and Cardholder Data',
    subRequirements: assignStatuses([
        { id: '10.1.1', description: 'All security policies and operational procedures for Requirement 10 are documented and known.' },
        { id: '10.1.2', description: 'Roles and responsibilities for Requirement 10 are documented, assigned, and understood.' },
        { id: '10.2.1', description: 'Audit logs are enabled and active for all system components and cardholder data.' },
        { id: '10.2.2', description: 'Audit logs record details for each auditable event (user ID, event type, date/time, success/failure, etc.).' },
        { id: '10.3.2', description: 'Audit log files are protected to prevent modifications by individuals.' },
        { id: '10.3.3', description: 'Audit log files are promptly backed up to a secure, central, internal log server.' },
        { id: '10.4.1', description: 'Specific audit logs are reviewed at least once daily.' },
        { id: '10.4.1.1', description: 'Automated mechanisms are used to perform audit log reviews.' },
        { id: '10.5.1', description: 'Retain audit log history for at least 12 months, with the most recent three months immediately available.' },
        { id: '10.6.1', description: 'System clocks and time are synchronized using time-synchronization technology.' },
        { id: '10.7.2', description: 'Failures of critical security control systems are detected, alerted, and addressed promptly.' },
    ], 0.96)
  },
  {
    id: 'Req.11',
    title: 'Test Security of Systems and Networks Regularly',
    subRequirements: assignStatuses([
        { id: '11.1.1', description: 'All security policies and operational procedures for Requirement 11 are documented and known.' },
        { id: '11.1.2', description: 'Roles and responsibilities for Requirement 11 are documented, assigned, and understood.' },
        { id: '11.2.1', description: 'Authorized and unauthorized wireless access points are managed and tested for at least quarterly.' },
        { id: '11.3.1', description: 'Internal vulnerability scans are performed at least quarterly and after significant changes.' },
        { id: '11.3.1.2', description: 'Internal vulnerability scans are performed via authenticated scanning.' },
        { id: '11.3.2', description: 'External vulnerability scans are performed at least quarterly by a PCI SSC Approved Scanning Vendor (ASV).' },
        { id: '11.4.1', description: 'A penetration testing methodology is defined, documented, and implemented.' },
        { id: '11.4.2', description: 'Internal penetration testing is performed at least annually and after significant changes.' },
        { id: '11.4.3', description: 'External penetration testing is performed at least annually and after significant changes.' },
        { id: '11.4.5', description: 'If segmentation is used, penetration tests are performed on segmentation controls at least annually.' },
        { id: '11.5.1', description: 'Intrusion-detection and/or intrusion-prevention techniques are used to detect/prevent intrusions.' },
        { id: '11.5.2', description: 'A change-detection mechanism (e.g., FIM) is deployed to alert on unauthorized modification of critical files.' },
        { id: '11.6.1', description: 'A change- and tamper-detection mechanism is deployed for payment pages.' },
    ], 0.85)
  },
  {
    id: 'Req.12',
    title: 'Support Information Security with Organizational Policies and Programs',
    subRequirements: assignStatuses([
        { id: '12.1.1', description: 'An overall information security policy is established, published, maintained, and disseminated.' },
        { id: '12.1.3', description: 'The security policy clearly defines information security roles and responsibilities.' },
        { id: '12.2.1', description: 'Acceptable use policies for end-user technologies are documented and implemented.' },
        { id: '12.3.1', description: 'Targeted risk analyses are performed for specific PCI DSS requirements.' },
        { id: '12.5.2', description: 'PCI DSS scope is documented and confirmed at least annually.' },
        { id: '12.6.1', description: 'A formal security awareness program is implemented for all personnel.' },
        { id: '12.6.3', description: 'Personnel receive security awareness training upon hire and at least annually.' },
        { id: '12.7.1', description: 'Potential personnel are screened prior to hire.' },
        { id: '12.8.2', description: 'Written agreements with Third-Party Service Providers (TPSPs) are maintained.' },
        { id: '12.8.4', description: 'A program is implemented to monitor TPSPs’ PCI DSS compliance status at least annually.' },
        { id: '12.10.1', description: 'An incident response plan exists and is ready to be activated.' },
        { id: '12.10.2', description: 'The security incident response plan is tested at least annually.' },
    ], 0.98)
  }
];
