import type { PaymentTerminal, GrowthOpportunity } from '../types';

const generateLastSeen = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    return date.toISOString();
};

const FLEET_TERMINALS: PaymentTerminal[] = [
    // --- Singapore (4 + 2 pilot + 1 softpos) ---
    {
        id: 'ING-SGP-001', model: 'AXIUM DX8000', merchant: 'Global Retail SG', country: 'Singapore',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [
            { standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2028-04-30' }, 
            { standard: 'EMV L3', status: 'Compliant' },
            { standard: 'PCI-PTS v7', status: 'Planned' }
        ],
        monthlyTxns: 12050, monthlyVol: 602500, avgTxnValue: 50, fraudScore: 8, alerts: [], supportedAPMs: ['GrabPay', 'Alipay'],
        firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'Ethernet', tamperStatus: 'None',
        aiRecommendation: "Transaction volume is high. Consider enabling WeChat Pay to capture more tourist spending.",
        batteryHealth: 98,
    },
    {
        id: 'ING-SGP-002', model: 'TETRA MOVE/5000', merchant: 'Changi Airport Cafe', country: 'Singapore',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [
            { standard: 'PCI-PTS v6', status: 'Expires Soon', expiry: '2025-01-15' }, 
            { standard: 'EMV L3', status: 'Compliant' },
            { standard: 'PCI-PTS v7', status: 'Non-Compliant', expiry: 'N/A' }
        ],
        monthlyTxns: 8500, monthlyVol: 212500, avgTxnValue: 25, fraudScore: 22,
        alerts: [], // Alert is now dynamic
        supportedAPMs: ['GrabPay'], firmwareVersion: 'FW_1.8.9_LEGACY', connectionType: 'WiFi', tamperStatus: 'None',
        aiRecommendation: "High fraud score relative to volume. Review terminal security settings and staff procedures for card handling.",
        batteryHealth: 85,
    },
    {
        id: 'ING-SGP-SP01', model: 'Tap-to-Pay on iPhone', merchant: 'SG Food Truck Fest', country: 'Singapore',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI MPoC', status: 'Compliant' }],
        monthlyTxns: 1800, monthlyVol: 36000, avgTxnValue: 20, fraudScore: 12, alerts: [],
        supportedAPMs: [], firmwareVersion: 'App v1.2.0 / iOS 17.5', connectionType: 'WiFi', tamperStatus: 'None',
        aiRecommendation: "Represents a new, growing segment of micro-merchants. Monitor for OS-specific vulnerabilities and ensure back-end attestation is functioning correctly.",
    },
    {
        id: 'ING-SGP-003', model: 'AXIUM DX8000', merchant: 'Marina Bay Hotel', country: 'Singapore',
        status: 'Online', lastSeen: generateLastSeen(1),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2029-06-01' }],
        monthlyTxns: 4500, monthlyVol: 2250000, avgTxnValue: 500, fraudScore: 5,
        alerts: [], // Alert is now dynamic
        supportedAPMs: ['Alipay', 'WeChat Pay'], firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'WiFi', tamperStatus: 'None',
        batteryHealth: 45,
    },
    {
        id: 'ING-SGP-004', model: 'TETRA LANE/5000', merchant: 'Orchard Road Kiosk', country: 'Singapore',
        status: 'Offline', lastSeen: generateLastSeen(5),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2027-02-11' }],
        monthlyTxns: 2200, monthlyVol: 44000, avgTxnValue: 20, fraudScore: 18,
        alerts: [{ type: 'Operational', severity: 'High', description: 'Terminal has been offline for 5 days. Investigate immediately.' }],
        supportedAPMs: [], firmwareVersion: 'FW_1.8.5_LEGACY', connectionType: '4G', tamperStatus: 'None',
        batteryHealth: 91,
    },
    {
        id: 'ING-SGP-PILOT-01', model: 'AXIUM PV-9000', merchant: 'FuturePay SG Pilot', country: 'Singapore',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2031-01-01' }, { standard: 'Local Mandate', status: 'Compliant' }],
        monthlyTxns: 500, monthlyVol: 50000, avgTxnValue: 100, fraudScore: 1, alerts: [{ type: 'Operational', severity: 'Medium', description: 'Biometric sensor calibration drift detected. Remote recalibration initiated.' }], supportedAPMs: [],
        firmwareVersion: 'FW_3.0.1_BETA_PV', connectionType: 'Ethernet', tamperStatus: 'None',
        aiRecommendation: "Pilot program. Monitor transaction success rate and user feedback for biometric adoption. Low fraud score is a positive indicator.",
        batteryHealth: 100,
    },
    {
        id: 'ING-SGP-PILOT-02', model: 'AXIUM PV-9000', merchant: 'SG Innovation Hub', country: 'Singapore',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2031-01-01' }, { standard: 'EMV L3', status: 'Compliant' }],
        monthlyTxns: 850, monthlyVol: 68000, avgTxnValue: 80, fraudScore: 2, alerts: [], supportedAPMs: [],
        firmwareVersion: 'FW_3.0.1_BETA_PV', connectionType: 'WiFi', tamperStatus: 'None',
        aiRecommendation: "High average transaction value for a pilot device. This indicates strong user trust in the new technology for larger purchases.",
        batteryHealth: 99,
    },
    // --- Indonesia (4) ---
    {
        id: 'ING-IDN-001', model: 'AXIUM DX8000', merchant: 'Jakarta Grand Mall', country: 'Indonesia',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [
            { standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2029-11-20' }, 
            { standard: 'Local Mandate', status: 'Compliant' },
            { standard: 'PCI-PTS v7', status: 'Planned' }
        ],
        monthlyTxns: 25000, monthlyVol: 875000, avgTxnValue: 35, fraudScore: 15, alerts: [],
        supportedAPMs: ['GoPay'], firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'Ethernet', tamperStatus: 'None',
        aiRecommendation: "Highest transaction count in the region. Monitor for performance bottlenecks.",
        batteryHealth: 99,
    },
    {
        id: 'ING-IDN-002', model: 'TETRA MOVE/5000', merchant: 'Bali Resort', country: 'Indonesia',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2027-08-01' }],
        monthlyTxns: 5000, monthlyVol: 500000, avgTxnValue: 100, fraudScore: 5, alerts: [],
        supportedAPMs: ['Alipay'], firmwareVersion: 'FW_1.8.9_LEGACY', connectionType: '4G', tamperStatus: 'None',
        aiRecommendation: "Transaction profile suggests high tourist traffic. Activate WeChat Pay and GrabPay to maximize conversions.",
        batteryHealth: 78,
    },
    {
        id: 'ING-IDN-003', model: 'AXIUM DX8000', merchant: 'Bandung Factory Outlet', country: 'Indonesia',
        status: 'Online', lastSeen: generateLastSeen(1),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2030-03-15' }],
        monthlyTxns: 15000, monthlyVol: 450000, avgTxnValue: 30, fraudScore: 35,
        alerts: [{ type: 'Fraud', severity: 'Medium', description: 'Anomalous number of manual card entries detected for this merchant type.' }],
        supportedAPMs: ['GoPay'], firmwareVersion: 'FW_2.1.0_BETA', connectionType: 'WiFi', tamperStatus: 'None',
        batteryHealth: 92,
    },
    {
        id: 'ING-IDN-004', model: 'TETRA LANE/5000', merchant: 'Surabaya Supermarket', country: 'Indonesia',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2026-10-01' }],
        monthlyTxns: 35000, monthlyVol: 700000, avgTxnValue: 20, fraudScore: 11, alerts: [],
        supportedAPMs: [], firmwareVersion: 'FW_1.8.9_LEGACY', connectionType: 'Ethernet', tamperStatus: 'None',
        batteryHealth: 95,
    },
    // --- India (4) ---
     {
        id: 'ING-IND-001', model: 'AXIUM DX8000', merchant: 'Mumbai Tech Park', country: 'India',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2030-01-10' }],
        monthlyTxns: 18000, monthlyVol: 450000, avgTxnValue: 25, fraudScore: 3, alerts: [],
        supportedAPMs: [], firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'WiFi', tamperStatus: 'None',
        aiRecommendation: "Excellent performance, but no local APMs are enabled. Activating Paytm is a high-priority growth opportunity.",
        batteryHealth: 88,
    },
    {
        id: 'ING-IND-002', model: 'TETRA MOVE/5000', merchant: 'Delhi Eatery Chain', country: 'India',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Non-Compliant', expiry: '2024-06-30' }],
        monthlyTxns: 9500, monthlyVol: 190000, avgTxnValue: 20, fraudScore: 45,
        alerts: [
            { type: 'Compliance', severity: 'High', description: 'PCI-PTS certification has expired. Terminal must be replaced immediately.' },
            { type: 'Security', severity: 'High', description: 'Physical tamper alert triggered. Device is compromised and must be decommissioned.' }
        ],
        supportedAPMs: ['Paytm'], firmwareVersion: 'FW_1.7.2_EOL', connectionType: '4G', tamperStatus: 'Alert',
        batteryHealth: 35,
    },
     {
        id: 'ING-IND-003', model: 'AXIUM DX8000', merchant: 'Bangalore IT Campus', country: 'India',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2029-08-19' }],
        monthlyTxns: 22000, monthlyVol: 660000, avgTxnValue: 30, fraudScore: 9, alerts: [],
        supportedAPMs: ['Paytm'], firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'Ethernet', tamperStatus: 'None',
        batteryHealth: 96,
    },
    {
        id: 'ING-IND-004', model: 'TETRA MOVE/5000', merchant: 'Goa Beach Resort', country: 'India',
        status: 'Online', lastSeen: generateLastSeen(2),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Expires Soon', expiry: '2025-02-28' }],
        monthlyTxns: 6000, monthlyVol: 420000, avgTxnValue: 70, fraudScore: 28,
        alerts: [{ type: 'Operational', severity: 'Medium', description: 'Intermittent connectivity issues reported.' }],
        supportedAPMs: [], firmwareVersion: 'FW_1.8.9_LEGACY', connectionType: '4G', tamperStatus: 'None',
        batteryHealth: 70,
    },
    // --- Australia (4) ---
    {
        id: 'ING-AUS-001', model: 'AXIUM DX8000', merchant: 'Sydney Retail Co.', country: 'Australia',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2028-10-05' }],
        monthlyTxns: 15000, monthlyVol: 900000, avgTxnValue: 60, fraudScore: 6, alerts: [],
        supportedAPMs: ['eftpos'], firmwareVersion: 'FW_2.0.5_PROD', connectionType: 'Ethernet', tamperStatus: 'None',
        batteryHealth: 94,
    },
    {
        id: 'ING-AUS-002', model: 'TETRA LANE/5000', merchant: 'Melbourne Cafe', country: 'Australia',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2026-07-22' }],
        monthlyTxns: 3000, monthlyVol: 75000, avgTxnValue: 25, fraudScore: 33,
        alerts: [{ type: 'Fraud', severity: 'Medium', description: 'Anomalous number of manual card entries detected.' }],
        supportedAPMs: ['eftpos'], firmwareVersion: 'FW_1.8.5_LEGACY', connectionType: 'WiFi', tamperStatus: 'None',
        batteryHealth: 82,
    },
    {
        id: 'ING-AUS-003', model: 'AXIUM DX8000', merchant: 'Perth Mining Services', country: 'Australia',
        status: 'Offline', lastSeen: generateLastSeen(10),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2029-12-01' }],
        monthlyTxns: 800, monthlyVol: 80000, avgTxnValue: 100, fraudScore: 2,
        alerts: [{ type: 'Operational', severity: 'High', description: 'Terminal offline for over 1 week in remote location.' }],
        supportedAPMs: ['eftpos'], firmwareVersion: 'FW_2.0.5_PROD', connectionType: '4G', tamperStatus: 'None',
        batteryHealth: 97,
    },
    {
        id: 'ING-AUS-004', model: 'TETRA MOVE/5000', merchant: 'Brisbane Event Staff', country: 'Australia',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2027-04-14' }],
        monthlyTxns: 1500, monthlyVol: 60000, avgTxnValue: 40, fraudScore: 19, alerts: [],
        supportedAPMs: [], firmwareVersion: 'FW_1.8.9_LEGACY', connectionType: '4G', tamperStatus: 'None',
        batteryHealth: 65,
    },
    // --- Hong Kong (4) ---
    {
        id: 'ING-HKG-001', model: 'AXIUM DX8000', merchant: 'HK Central Suites', country: 'Hong Kong',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2029-05-18' }],
        monthlyTxns: 7800, monthlyVol: 1170000, avgTxnValue: 150, fraudScore: 12, alerts: [],
        supportedAPMs: ['Alipay', 'WeChat Pay'], firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'Ethernet', tamperStatus: 'None',
        batteryHealth: 99,
    },
    {
        id: 'ING-HKG-002', model: 'TETRA MOVE/5000', merchant: 'Kowloon Market', country: 'Hong Kong',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2027-11-30' }],
        monthlyTxns: 19000, monthlyVol: 380000, avgTxnValue: 20, fraudScore: 14, alerts: [],
        supportedAPMs: ['Alipay', 'WeChat Pay'], firmwareVersion: 'FW_1.8.9_LEGACY', connectionType: '4G', tamperStatus: 'None',
        batteryHealth: 55,
    },
    {
        id: 'ING-HKG-003', model: 'AXIUM DX8000', merchant: 'Lantau Attraction', country: 'Hong Kong',
        status: 'Online', lastSeen: generateLastSeen(1),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Compliant', expiry: '2028-09-09' }],
        monthlyTxns: 6500, monthlyVol: 325000, avgTxnValue: 50, fraudScore: 25,
        alerts: [{ type: 'Operational', severity: 'Medium', description: 'Printer module reporting errors.' }],
        supportedAPMs: ['Alipay'], firmwareVersion: 'FW_2.1.3_PROD', connectionType: 'WiFi', tamperStatus: 'None',
        batteryHealth: 48,
    },
    {
        id: 'ING-HKG-004', model: 'TETRA LANE/5000', merchant: 'Wan Chai Restaurant', country: 'Hong Kong',
        status: 'Online', lastSeen: generateLastSeen(0),
        compliance: [{ standard: 'PCI-PTS v6', status: 'Non-Compliant', expiry: '2024-05-20' }],
        monthlyTxns: 4000, monthlyVol: 240000, avgTxnValue: 60, fraudScore: 55,
        alerts: [{ type: 'Compliance', severity: 'High', description: 'PCI-PTS certification expired. Replace immediately.' }, { type: 'Fraud', severity: 'High', description: 'High rate of transaction declines. Possible card testing.' }],
        supportedAPMs: ['WeChat Pay'], firmwareVersion: 'FW_1.7.2_EOL', connectionType: 'Ethernet', tamperStatus: 'None',
        batteryHealth: 25,
    },
];

const GROWTH_OPPORTUNITIES: GrowthOpportunity[] = [
    {
        terminalId: 'ING-IND-001',
        suggestedAPM: 'Paytm',
        opportunityScore: 95,
        estimatedLift: 25,
        rationale: "This high-traffic location in India has zero local APMs. Paytm is the dominant digital wallet and could significantly increase transaction volume and customer satisfaction."
    },
    {
        terminalId: 'ING-SGP-001',
        suggestedAPM: 'WeChat Pay',
        opportunityScore: 80,
        estimatedLift: 15,
        rationale: "Given the merchant type and location, there's a high probability of significant tourist traffic from mainland China. Activating WeChat Pay will capture this lucrative segment."
    },
    {
        terminalId: 'ING-IDN-002',
        suggestedAPM: 'GoPay',
        opportunityScore: 88,
        estimatedLift: 20,
        rationale: "While Alipay serves international tourists, GoPay is the leading local e-wallet in Indonesia. Enabling it is critical for serving the domestic customer base at this resort location."
    },
    {
        terminalId: 'ING-SGP-002',
        suggestedUpgrade: 'TETRA to AXIUM',
        opportunityScore: 75,
        estimatedLift: 10,
        rationale: "Compliance is expiring soon. Upgrading from TETRA to AXIUM provides a modern Android platform, enabling richer app-based experiences (e.g., loyalty programs) and support for more APMs, justifying the hardware refresh."
    },
     {
        terminalId: 'ING-IDN-004',
        suggestedAPM: 'GoPay',
        opportunityScore: 92,
        estimatedLift: 30,
        rationale: "Extremely high transaction count at this supermarket with no APMs. GoPay is essential for this market segment and will likely drive significant new volume."
    }
];

export const FLEET_DATA = {
    terminals: FLEET_TERMINALS,
    opportunities: GROWTH_OPPORTUNITIES
};