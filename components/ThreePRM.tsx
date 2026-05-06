import React, { useState, useMemo } from 'react';
// FIX: Import AlertTriangle icon for the 'Planned' status badge.
import { Handshake, Search, Info, Users, AlertCircle, CheckSquare, XCircle, Clock, ShieldCheck, FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card, CardTitle, Modal, getRiskScore, RiskLevelBadge, StatCard } from './common';
import { VENDORS } from '../data';
import type { ThirdPartyVendor, RiskCategory, RiskStatus, ControlCheckStatus, VendorControlCheck, RiskLevel } from '../types';

// --- New Scoring Logic & Types ---
type CompositeRiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

const COMPOSITE_RISK_WEIGHTS = {
  BASE_MULTIPLIER: 2, // Scales residual risk (1-25) to a 50-point scale
  FAILING_CONTROL: {
    Security: 15,
    Compliance: 15,
    Availability: 10,
    Privacy: 10,
  },
  ACTIVE_ALERT: {
    High: 20,
    Medium: 10,
    Low: 5,
  },
  CONTRACT_WEAKNESS: {
    NO_RIGHT_TO_AUDIT: 5,
  }
};

export const calculateCompositeRiskScore = (vendor: ThirdPartyVendor): number => {
  let score = 0;

  // 1. Base score from residual risk
  score += getRiskScore(vendor.residualRisk) * COMPOSITE_RISK_WEIGHTS.BASE_MULTIPLIER;

  // 2. Add points for failing controls
  vendor.checklist.forEach(check => {
    if (check.status === 'Fail') {
      score += COMPOSITE_RISK_WEIGHTS.FAILING_CONTROL[check.category] || 10;
    }
  });

  // 3. Add points for active alerts
  (vendor.alerts || []).forEach(alert => {
    score += COMPOSITE_RISK_WEIGHTS.ACTIVE_ALERT[alert.severity] || 0;
  });

  // 4. Add points for contractual weaknesses
  if (!vendor.contractClauses.rightToAudit) {
    score += COMPOSITE_RISK_WEIGHTS.CONTRACT_WEAKNESS.NO_RIGHT_TO_AUDIT;
  }
  
  return Math.min(100, Math.round(score)); // Cap score at 100
};

export const getCompositeRiskLevel = (score: number): CompositeRiskLevel => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
};


// FIX: Add 'Planned' status to the badge component to render it correctly.
const ChecklistStatusBadge: React.FC<{ status: ControlCheckStatus }> = ({ status }) => {
  const styles: Record<ControlCheckStatus, string> = {
    'Pass': 'bg-green-50 text-green-700',
    'Fail': 'bg-red-50 text-red-700',
    'In Progress': 'bg-yellow-50 text-yellow-800',
    'Not Applicable': 'bg-gray-100 text-gray-700',
    'Planned': 'bg-blue-100 text-blue-800',
  };
  const icons: Record<ControlCheckStatus, React.ElementType> = {
    'Pass': CheckSquare,
    'Fail': XCircle,
    'In Progress': Clock,
    'Not Applicable': Info,
    'Planned': AlertTriangle,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {status}
    </span>
  );
};

const CompositeScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
  const level = getCompositeRiskLevel(score);
  const colors: Record<CompositeRiskLevel, string> = {
    Critical: 'text-red-600 ring-red-500/50',
    High: 'text-orange-600 ring-orange-500/50',
    Medium: 'text-yellow-600 ring-yellow-500/50',
    Low: 'text-green-600 ring-green-500/50',
  };
  
  return (
    <div className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-lg ring-4 ${colors[level]}`}>
      {score}
    </div>
  );
};


const VendorDetailsModal: React.FC<{ vendor: ThirdPartyVendor | null; onClose: () => void }> = ({ vendor, onClose }) => {
    if (!vendor) return null;

    const compositeScore = calculateCompositeRiskScore(vendor);
    const compositeLevel = getCompositeRiskLevel(compositeScore);

    const checklistByCategory = vendor.checklist.reduce((acc, check) => {
        if (!acc[check.category]) {
            acc[check.category] = [];
        }
        acc[check.category].push(check);
        return acc;
    }, {} as Record<VendorControlCheck['category'], VendorControlCheck[]>);

    return (
        <Modal isOpen={!!vendor} onClose={onClose} title={`${vendor.name} - Risk Assessment`}>
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-800 text-base">Service Provided</h3>
                    <p className="text-gray-600 text-sm">{vendor.service}</p>
                </div>

                <div className="p-4 bg-red-50/50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 text-sm mb-1">Key Risk Scenario</h4>
                    <p className="text-red-700 text-sm">{vendor.riskScenario}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Composite Risk Profile</h4>
                    <div className="flex items-center justify-around text-center p-4 bg-gray-50 rounded-lg">
                        <div>
                            <CompositeScoreDisplay score={compositeScore} />
                            <div className="mt-2"><RiskLevelBadge level={compositeLevel} /></div>
                        </div>
                        <div className="text-left text-xs space-y-1 text-gray-600">
                            <p><strong>Base Risk (Residual):</strong> {getRiskScore(vendor.residualRisk) * COMPOSITE_RISK_WEIGHTS.BASE_MULTIPLIER}</p>
                            <p><strong>Failing Controls:</strong> +{vendor.checklist.reduce((sum, c) => sum + (c.status === 'Fail' ? (COMPOSITE_RISK_WEIGHTS.FAILING_CONTROL[c.category] || 0) : 0), 0)}</p>
                            <p><strong>Active Alerts:</strong> +{(vendor.alerts || []).reduce((sum, a) => sum + (COMPOSITE_RISK_WEIGHTS.ACTIVE_ALERT[a.severity] || 0), 0)}</p>
                            <p><strong>Contract Weakness:</strong> +{!vendor.contractClauses.rightToAudit ? COMPOSITE_RISK_WEIGHTS.CONTRACT_WEAKNESS.NO_RIGHT_TO_AUDIT : 0}</p>
                        </div>
                    </div>
                </div>

                {(vendor.alerts || []).length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-2">Active Alerts</h4>
                        <div className="space-y-2">
                          {(vendor.alerts || []).map((alert, i) => (
                             <div key={i} className={`p-3 rounded-md text-sm border-l-4 ${
                                alert.severity === 'High' ? 'bg-red-50 border-red-500 text-red-800' :
                                alert.severity === 'Medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                                'bg-blue-50 border-blue-500 text-blue-800'
                             }`}>
                                <strong>{alert.type}:</strong> {alert.description}
                             </div>
                          ))}
                        </div>
                    </div>
                )}


                 <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Contractual Clauses</h4>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border">
                            <ShieldCheck className={`w-5 h-5 mr-3 ${vendor.contractClauses.rightToAudit ? 'text-green-600' : 'text-red-600'}`} />
                            <div>
                                <p className="font-medium text-gray-800">Right to Audit</p>
                                <p className={vendor.contractClauses.rightToAudit ? 'text-green-700' : 'text-red-700'}>{vendor.contractClauses.rightToAudit ? 'Included' : 'Not Included'}</p>
                            </div>
                        </div>
                         <div className="flex items-center p-3 bg-gray-50 rounded-lg border">
                            <FileText className="w-5 h-5 mr-3 text-gray-600" />
                            <div>
                                <p className="font-medium text-gray-800">Breach Notification SLA</p>
                                <p className="text-gray-700">{vendor.contractClauses.breachNotificationSla}</p>
                            </div>
                        </div>
                    </div>
                 </div>

                <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Compliance & Security Checklist</h4>
                    <div className="space-y-3">
                      {Object.entries(checklistByCategory).map(([category, checks]) => (
                        <div key={category}>
                          <h5 className="font-semibold text-gray-700 text-xs uppercase mb-1">{category}</h5>
                          <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                  <tbody>
                                    {(checks as VendorControlCheck[]).map(check => (
                                      <tr key={check.id} className="border-b last:border-b-0 bg-white text-xs">
                                        <td className="px-3 py-2 text-gray-700">{check.control}</td>
                                        <td className="px-3 py-2 text-right"><ChecklistStatusBadge status={check.status} /></td>
                                      </tr>
                                    ))}
                                  </tbody>
                              </table>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const ThreePRMTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const initialFilters = {
        category: 'all' as const,
        status: 'all' as const,
        riskLevel: 'all' as const,
        contractClause: 'all' as const,
        hasFailingControls: false,
    };

    const [filters, setFilters] = useState<{ 
        category: RiskCategory | 'all'; 
        status: RiskStatus | 'all';
        riskLevel: RiskLevel | 'all';
        contractClause: 'all' | 'hasRightToAudit' | 'noRightToAudit';
        hasFailingControls: boolean;
     }>(initialFilters);

    const [selectedVendor, setSelectedVendor] = useState<ThirdPartyVendor | null>(null);

    const handleStatCardClick = (
        filterKey: keyof typeof filters,
        value: RiskLevel | RiskStatus | boolean
    ) => {
        setFilters(prev => {
            const isTogglingOff = prev[filterKey] === value;
            return {
                ...prev,
                [filterKey]: isTogglingOff ? initialFilters[filterKey] : value,
            };
        });
    };
    
    const resetAllFilters = () => setFilters(initialFilters);

    const filteredVendors = useMemo(() => {
        return VENDORS.filter(vendor => {
            const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  vendor.service.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filters.category === 'all' || vendor.category === filters.category;
            const matchesStatus = filters.status === 'all' || vendor.status === filters.status;
            
            const compositeScore = calculateCompositeRiskScore(vendor);
            const vendorRiskLevel = getCompositeRiskLevel(compositeScore);
            const matchesRiskLevel = filters.riskLevel === 'all' || vendorRiskLevel === filters.riskLevel;

            const matchesContractClause = filters.contractClause === 'all' ||
                (filters.contractClause === 'hasRightToAudit' && vendor.contractClauses.rightToAudit) ||
                (filters.contractClause === 'noRightToAudit' && !vendor.contractClauses.rightToAudit);

            const hasFailingControls = vendor.checklist.some(c => c.status === 'Fail');
            const matchesFailingControls = !filters.hasFailingControls || hasFailingControls;

            return matchesSearch && matchesCategory && matchesStatus && matchesRiskLevel && matchesContractClause && matchesFailingControls;
        });
    }, [searchTerm, filters]);

    const categories = useMemo(() => ['all', ...Array.from(new Set(VENDORS.map(v => v.category)))], []);
    const statuses = useMemo(() => ['all', ...Array.from(new Set(VENDORS.map(v => v.status)))], []);
    
    const criticalRiskVendors = VENDORS.filter(v => getCompositeRiskLevel(calculateCompositeRiskScore(v)) === 'Critical').length;
    const needsReview = VENDORS.filter(v => v.status === 'Needs Review').length;
    
    return (
        <div className="space-y-6 animate-fadeIn">
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                    <Handshake className="w-6 h-6 mr-3 text-violet-600" />
                    Third-Party Risk Management Dashboard
                </h3>
                <p className="text-gray-600">
                    Continuous monitoring and evidence-based risk assessment of the entire vendor ecosystem.
                </p>
            </Card>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Vendors"
                    value={VENDORS.length}
                    icon={Users}
                    iconColorClass="text-blue-500"
                    onClick={resetAllFilters}
                    isActive={filters.riskLevel === 'all' && filters.status === 'all' && !filters.hasFailingControls}
                    activeColorClass="border-blue-500"
                />
                <StatCard
                    title="Critical Risk Vendors"
                    value={criticalRiskVendors}
                    icon={AlertCircle}
                    iconColorClass="text-red-500"
                    onClick={() => handleStatCardClick('riskLevel', 'Critical')}
                    isActive={filters.riskLevel === 'Critical'}
                    activeColorClass="border-red-500"
                />
                <StatCard
                    title="Vendors w/ Failing Controls"
                    value={VENDORS.filter(v => v.checklist.some(c => c.status === 'Fail')).length}
                    icon={XCircle}
                    iconColorClass="text-red-500"
                    onClick={() => handleStatCardClick('hasFailingControls', true)}
                    isActive={filters.hasFailingControls}
                    activeColorClass="border-red-500"
                />
                <StatCard
                    title="Need Assessment Review"
                    value={needsReview}
                    icon={Clock}
                    iconColorClass="text-yellow-500"
                    onClick={() => handleStatCardClick('status', 'Needs Review')}
                    isActive={filters.status === 'Needs Review'}
                    activeColorClass="border-yellow-500"
                />
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="relative lg:col-span-5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by vendor or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({...prev, category: e.target.value as RiskCategory | 'all'}))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                    </select>
                     <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({...prev, status: e.target.value as RiskStatus | 'all'}))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
                    </select>
                     <select
                        value={filters.riskLevel}
                        onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value as RiskLevel | 'all' }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="all">All Risk Levels</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <select
                        value={filters.contractClause}
                        onChange={(e) => setFilters(prev => ({ ...prev, contractClause: e.target.value as 'all' | 'hasRightToAudit' | 'noRightToAudit' }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="all">All Contract Clauses</option>
                        <option value="hasRightToAudit">Has Right to Audit</option>
                        <option value="noRightToAudit">No Right to Audit</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3">Vendor</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-center">Composite Score</th>
                                <th className="px-4 py-3">Risk Level</th>
                                <th className="px-4 py-3">Failing Controls</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.map(vendor => {
                                const failingCount = vendor.checklist.filter(c => c.status === 'Fail').length;
                                const compositeScore = calculateCompositeRiskScore(vendor);
                                const riskLevel = getCompositeRiskLevel(compositeScore);
                                return (
                                <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-800">{vendor.name}</div>
                                        <div className="text-gray-500 text-xs">{vendor.service}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{vendor.category}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center">
                                            <CompositeScoreDisplay score={compositeScore} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><RiskLevelBadge level={riskLevel} /></td>
                                    <td className="px-4 py-3 text-center">
                                        {failingCount > 0 ? (
                                            <span className="font-semibold text-red-600">{failingCount}</span>
                                        ) : (
                                            <span className="font-semibold text-green-600">0</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setSelectedVendor(vendor)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                 {filteredVendors.length === 0 && <p className="text-center py-8 text-gray-500">No vendors match the current filters.</p>}
            </Card>

            <VendorDetailsModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
        </div>
    );
};

export default ThreePRMTab;