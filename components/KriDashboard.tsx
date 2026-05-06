import React, { useState } from 'react';
import { Activity, AlertTriangle, Eye, KeyRound, Handshake, Info, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardTitle, Modal, CodeBlock, IconButton } from './common';
import { PATCH_SLA_DATA, ESTATE_VISIBILITY_DATA, KEY_LIFECYCLE_DATA } from '../data';
import { VENDORS } from '../data'; // For 3PRM data

// Define the content for the modals
const KRI_MODAL_CONTENT = {
  patchSla: {
    title: "Data Source: Critical Patch SLA",
    description: "This data is aggregated from vulnerability scanning tools (e.g., Nessus, Qualys) and correlated with our CMDB asset inventory. The process involves identifying 'Critical' severity vulnerabilities on in-scope systems and calculating their age. While direct API integration is the goal, this KRI is often updated via scheduled CSV/Excel imports from the security operations team.",
    code: `# Pseudocode for data aggregation
def get_patch_sla_data():
    # Fetch critical vulns from scanner
    vulns = nessus_api.get_critical_vulns(target_scope="pci")
    
    # Fetch assets from CMDB
    assets = cmdb_api.get_assets(scope="pci")

    # Correlate and calculate age
    for asset in assets:
        asset_vulns = [v for v in vulns if v.host == asset.ip]
        asset.overdue_vulns = len([v for v in asset_vulns if v.age_days > 14])
    
    # export_to_excel(assets) or push_to_grc_api(assets)
    return assets`
  },
  estate: {
    title: "Data Source: Estate Visibility",
    description: "This metric reconciles multiple asset data sources to identify unmanaged or 'shadow IT' devices. The 'Managed' asset count comes from our CMDB, which is populated by endpoint agents, cloud provider APIs, and network device configurations. The total estate is estimated using data from passive network discovery tools. An Excel-based reconciliation is performed quarterly to validate CMDB accuracy.",
    code: `-- Simplified SQL-like query for reconciliation
SELECT 
    'Managed' as category, COUNT(DISTINCT a.asset_id)
FROM cmdb_assets a
WHERE a.agent_status = 'active'

UNION

SELECT 
    'Unmanaged' as category, COUNT(DISTINCT d.ip_address)
FROM network_discovery_logs d
LEFT JOIN cmdb_assets a ON d.ip_address = a.ip_address
WHERE a.asset_id IS NULL;`
  },
  keyLifecycle: {
    title: "Data Source: Key Lifecycle Management",
    description: "This KRI is a composite metric sourced from several highly sensitive systems. HSM key status comes from HSM management logs. TLS certificate data is collected via automated scripts that scan our public and internal endpoints. API and database key status is pulled from HashiCorp Vault's audit logs. These disparate sources are often aggregated into a central tracking sheet (Excel/Google Sheets) for GRC review.",
    code: `#!/bin/bash
# Simulated script to check TLS certificate expiry
DOMAINS_FILE="domains.txt"
while read -r domain; do
  end_date=$(echo | openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f 2)
  
  # ... complex date comparison logic ...
  if [[ $days_left -lt 30 ]]; then
    echo "WARNING: $domain expires in $days_left days"
    # POST to GRC/monitoring API
  fi
done < "$DOMAINS_FILE"`
  },
  prm: {
    title: "Data Source: 3rd Party Risk Coverage",
    description: "This data is pulled directly from our GRC platform's Third-Party Risk Management (3PRM) module, which is the system of record for vendor information. The platform tracks vendor onboarding status, assessment completion dates, and risk tiering. The 'Update from Excel' feature would typically be used to perform a bulk import of new vendors or update assessment statuses from a third-party assessor's report.",
    code: `// Example API response from a GRC tool
{
  "kri_name": "3PRM_Coverage",
  "total_vendors": 40,
  "assessment_status": {
    "complete": 35,
    "onboarding": 2,
    "needs_review": 3
  },
  "coverage_percent": 92.5, // (complete + needs_review) / total
  "data_as_of": "2024-07-25T10:00:00Z"
}`
  }
};


// Helper function to calculate overall percentage
const calculateOverallPercentage = (numerator: number, denominator: number) => {
    if (denominator === 0) return 100;
    return Math.round((numerator / denominator) * 100);
};

const UpdateButton: React.FC<{ kriKey: string; loadingKri: string | null; onClick: (key: string) => void; }> = ({ kriKey, loadingKri, onClick }) => (
    <button
        onClick={() => onClick(kriKey)}
        disabled={!!loadingKri}
        aria-label="Update from Source"
        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
    >
        {loadingKri === kriKey ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <RefreshCw className="w-4 h-4" />
        )}
    </button>
);


// Sub-component for Patch SLA
const PatchSlaCard: React.FC<{ loadingKri: string | null; onUpdateClick: (key: string) => void; }> = ({ loadingKri, onUpdateClick }) => {
    const totalAssets = PATCH_SLA_DATA.reduce((sum, item) => sum + item.total, 0);
    const totalOverdue = PATCH_SLA_DATA.reduce((sum, item) => sum + item.overdue, 0);
    const overallSla = calculateOverallPercentage(totalAssets - totalOverdue, totalAssets);

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <CardTitle icon={AlertTriangle} iconColorClass="text-red-500">Critical Patch SLA</CardTitle>
                <UpdateButton kriKey="patchSla" loadingKri={loadingKri} onClick={onUpdateClick} />
            </div>
            <div className="text-center my-4 flex-grow">
                <div className={`text-5xl font-bold ${overallSla >= 95 ? 'text-green-600' : 'text-red-600'}`}>{overallSla}%</div>
                <p className="text-sm text-gray-500">of critical vulnerabilities patched within 14 days</p>
            </div>
            <div className="space-y-3">
                {PATCH_SLA_DATA.map(item => {
                    const sla = calculateOverallPercentage(item.total - item.overdue, item.total);
                    return (
                         <div key={item.category} className="text-xs">
                            <div className="flex justify-between mb-0.5">
                                <span className="font-medium text-gray-700">{item.category}</span>
                                <span className={`font-semibold ${sla >= 95 ? 'text-green-600' : 'text-red-600'}`}>{sla}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`${sla >= 95 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} style={{ width: `${sla}%` }}></div>
                            </div>
                        </div>
                    )
                })}
            </div>
             <p className="text-xs text-gray-500 mt-4 bg-gray-50 p-2 rounded-md flex items-start">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>Tracks adherence to PCI DSS Req. 6.3.1. A high percentage mitigates risk from known exploits.</span>
            </p>
        </Card>
    );
};

// Sub-component for Estate Visibility
const EstateVisibilityCard: React.FC<{ loadingKri: string | null; onUpdateClick: (key: string) => void; }> = ({ loadingKri, onUpdateClick }) => {
    const totalAssets = ESTATE_VISIBILITY_DATA.reduce((sum, item) => sum + item.value, 0);
    const managedAssets = ESTATE_VISIBILITY_DATA.filter(item => item.category !== 'Unmanaged').reduce((sum, item) => sum + item.value, 0);
    const visibility = calculateOverallPercentage(managedAssets, totalAssets);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <CardTitle icon={Eye} iconColorClass="text-blue-500">Estate Visibility</CardTitle>
                <UpdateButton kriKey="estate" loadingKri={loadingKri} onClick={onUpdateClick} />
            </div>
            <div className="relative flex-grow flex items-center justify-center my-4">
                <svg className="w-40 h-40" viewBox="0 0 140 140">
                    <circle className="text-gray-200" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" />
                    {ESTATE_VISIBILITY_DATA.map(item => {
                        const percentage = (item.value / totalAssets) * 100;
                        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                        const strokeDashoffset = -accumulatedOffset;
                        accumulatedOffset += (percentage / 100) * circumference;
                        return (
                             <circle key={item.category} strokeWidth="12" stroke={item.color} fill="transparent" r={radius} cx="70" cy="70"
                                style={{ strokeDasharray, strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                            />
                        );
                    })}
                </svg>
                <div className="absolute text-center">
                    <div className={`text-4xl font-bold ${visibility >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>{visibility}%</div>
                    <p className="text-xs text-gray-500">Managed Assets</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                {ESTATE_VISIBILITY_DATA.map(item => (
                    <div key={item.category} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-700">{item.category}:</span>
                        <span className="font-semibold ml-1">{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
             <p className="text-xs text-gray-500 mt-4 bg-gray-50 p-2 rounded-md flex items-start">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>Measures percentage of the IT estate inventoried and monitored. Low visibility creates security blind spots (ISO 27001 A.8.1.1).</span>
            </p>
        </Card>
    );
};

// Sub-component for Key Lifecycle
const KeyLifecycleCard: React.FC<{ loadingKri: string | null; onUpdateClick: (key: string) => void; }> = ({ loadingKri, onUpdateClick }) => {
    const totalKeys = KEY_LIFECYCLE_DATA.reduce((sum, item) => sum + item.total, 0);
    const totalOutOfPolicy = KEY_LIFECYCLE_DATA.reduce((sum, item) => sum + item.outOfPolicy, 0);
    const overallCompliance = calculateOverallPercentage(totalKeys - totalOutOfPolicy, totalKeys);

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <CardTitle icon={KeyRound} iconColorClass="text-amber-500">Key Lifecycle Mgmt</CardTitle>
                <UpdateButton kriKey="keyLifecycle" loadingKri={loadingKri} onClick={onUpdateClick} />
            </div>
             <div className="text-center my-4 flex-grow">
                <div className={`text-5xl font-bold ${overallCompliance >= 98 ? 'text-green-600' : 'text-yellow-600'}`}>{overallCompliance}%</div>
                <p className="text-sm text-gray-500">of cryptographic keys within policy</p>
            </div>
            <div className="space-y-3">
                {KEY_LIFECYCLE_DATA.map(item => (
                    <div key={item.category} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="font-semibold text-gray-800">{item.category}</p>
                        <div className="grid grid-cols-3 text-xs mt-1 text-center">
                            <div><span className="font-bold text-green-600">{item.rotatedOnSchedule}</span><span className="text-gray-500"> OK</span></div>
                            <div><span className="font-bold text-yellow-600">{item.expiresSoon}</span><span className="text-gray-500"> Expires Soon</span></div>
                            <div><span className="font-bold text-red-600">{item.outOfPolicy}</span><span className="text-gray-500"> Out of Policy</span></div>
                        </div>
                    </div>
                ))}
            </div>
             <p className="text-xs text-gray-500 mt-4 bg-gray-50 p-2 rounded-md flex items-start">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>Monitors adherence to key management policies (PCI DSS Req. 3.6), tracking rotation and expiration to prevent outages and compromise.</span>
            </p>
        </Card>
    );
};


// Sub-component for 3PRM
const PrmCoverageCard: React.FC<{ loadingKri: string | null; onUpdateClick: (key: string) => void; }> = ({ loadingKri, onUpdateClick }) => {
    const totalVendors = VENDORS.length;
    const assessedVendors = VENDORS.filter(v => v.status !== 'Onboarding').length;
    const coverage = calculateOverallPercentage(assessedVendors, totalVendors);
    const needsReview = VENDORS.filter(v => v.status === 'Needs Review').length;

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <CardTitle icon={Handshake} iconColorClass="text-violet-500">3rd Party Risk Management</CardTitle>
                <UpdateButton kriKey="prm" loadingKri={loadingKri} onClick={onUpdateClick} />
            </div>
            <div className="text-center my-4 flex-grow">
                <div className={`text-5xl font-bold ${coverage >= 80 ? 'text-green-600' : 'text-orange-600'}`}>{coverage}%</div>
                <p className="text-sm text-gray-500">vendor assessment coverage</p>
            </div>
             <div className="space-y-3 text-center">
                <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{totalVendors}</p>
                    <p className="text-xs text-gray-600">Total Vendors</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-700">{needsReview}</p>
                    <p className="text-xs text-yellow-600">Vendors Need Review</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 bg-gray-50 p-2 rounded-md flex items-start">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>Tracks the percentage of vendors that have undergone formal risk assessment, a key part of managing supply chain risk (PCI DSS Req. 12.8).</span>
            </p>
        </Card>
    );
};


const KriDashboardTab: React.FC = () => {
    const [modalContent, setModalContent] = useState<{ title: string; description: string; code?: string } | null>(null);
    const [loadingKri, setLoadingKri] = useState<string | null>(null);

    const handleUpdateClick = (kriKey: string) => {
        setLoadingKri(kriKey);
        setTimeout(() => {
            setLoadingKri(null);
            setModalContent(KRI_MODAL_CONTENT[kriKey as keyof typeof KRI_MODAL_CONTENT]);
        }, 1500); // Simulate 1.5 second fetch
    };
    
    return (
        <div className="space-y-6 animate-fadeIn">
             <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                    <Activity className="w-6 h-6 mr-3 text-blue-600" />
                    Key Risk Indicator (KRI) Dashboard
                </h3>
                <p className="text-gray-600">
                    Data-driven insights into the top operational risks impacting the organization's compliance and security posture.
                </p>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PatchSlaCard loadingKri={loadingKri} onUpdateClick={handleUpdateClick} />
                <EstateVisibilityCard loadingKri={loadingKri} onUpdateClick={handleUpdateClick} />
                <KeyLifecycleCard loadingKri={loadingKri} onUpdateClick={handleUpdateClick} />
                <PrmCoverageCard loadingKri={loadingKri} onUpdateClick={handleUpdateClick} />
            </div>
            
            <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
                {modalContent && (
                    <div className="space-y-4">
                        <p className="text-gray-600">{modalContent.description}</p>
                        {modalContent.code && (
                            <div>
                                <h4 className="font-semibold text-sm text-gray-800 mb-2 mt-4">Simulated Data Source Logic:</h4>
                                <CodeBlock content={modalContent.code} />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default KriDashboardTab;