import React, { useState, useMemo } from 'react';
import { TerminalSquare, Shield, Activity, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, XCircle, Info, Wifi, Signal, ArrowUpDown, Server, HardDrive, Cpu, MapPin, DollarSign, Hash, Fingerprint, Smartphone } from 'lucide-react';
import { Card, CardTitle, Modal, RiskLevelBadge, StatCard } from './common';
import { FLEET_DATA } from '../data';
import type { PaymentTerminal, GrowthOpportunity, TerminalStatus, TerminalCompliance, RiskLevel, ConnectionType, TamperStatus, RiskAlert } from '../types';

type FleetView = 'estate' | 'risk' | 'growth';

const generateDynamicAlerts = (terminal: PaymentTerminal): RiskAlert[] => {
    const dynamicAlerts: RiskAlert[] = [];

    // Check for EOL firmware
    if (terminal.firmwareVersion.includes('_EOL')) {
        dynamicAlerts.push({
            type: 'Security',
            severity: 'High',
            description: `Firmware version ${terminal.firmwareVersion} is End-of-Life and unsupported. Immediate upgrade required to mitigate security risks.`
        });
    }

    // Check for low battery health
    if (terminal.batteryHealth && terminal.batteryHealth < 50) {
        dynamicAlerts.push({
            type: 'Operational',
            severity: 'Medium',
            description: `Low battery health reported (${terminal.batteryHealth}%). Proactive replacement recommended to avoid service disruption.`
        });
    }

    // Check for expiring compliance
    (terminal.compliance || []).forEach(c => {
        if (c.status === 'Expires Soon') {
            dynamicAlerts.push({
                type: 'Compliance',
                severity: 'High',
                description: `${c.standard} certification expires soon on ${c.expiry}. Schedule hardware refresh.`
            });
        }
    });

    return dynamicAlerts;
};


const ViewToggle: React.FC<{ view: FleetView; setView: (view: FleetView) => void }> = ({ view, setView }) => (
  <div className="flex justify-center p-1 bg-gray-200 rounded-lg">
    <button onClick={() => setView('estate')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-1/3 ${view === 'estate' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>
      <Users className="inline w-4 h-4 mr-2" />Full Estate
    </button>
    <button onClick={() => setView('risk')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-1/3 ${view === 'risk' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>
      <AlertTriangle className="inline w-4 h-4 mr-2" />Risk Hotspots
    </button>
    <button onClick={() => setView('growth')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-1/3 ${view === 'growth' ? 'bg-white shadow text-green-600' : 'text-gray-600'}`}>
      <TrendingUp className="inline w-4 h-4 mr-2" />Growth Opportunities
    </button>
  </div>
);

const TerminalStatusBadge: React.FC<{ status: TerminalStatus }> = ({ status }) => {
  const styles: Record<TerminalStatus, string> = {
    Online: 'bg-green-100 text-green-800', Offline: 'bg-gray-100 text-gray-800', 'Needs Maintenance': 'bg-yellow-100 text-yellow-800',
  };
  const icons: Record<TerminalStatus, React.ElementType> = {
    Online: CheckCircle, Offline: XCircle, 'Needs Maintenance': Clock,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
};

const getTerminalRiskLevel = (terminal: PaymentTerminal): RiskLevel => {
    if (!terminal) return 'Low';
    if ((terminal.compliance || []).some(c => c?.status === 'Non-Compliant') || terminal.tamperStatus === 'Alert') return 'Critical';
    if ((terminal.alerts || []).some(a => a?.severity === 'High') || (terminal.compliance || []).some(c => c?.status === 'Expires Soon')) return 'High';
    if ((terminal.alerts || []).some(a => a?.severity === 'Medium')) return 'Medium';
    return 'Low';
}

const FleetTable: React.FC<{ 
    terminals: PaymentTerminal[], 
    onTerminalClick: (t: PaymentTerminal) => void,
    sortConfig: { key: string, direction: 'asc' | 'desc' } | null,
    requestSort: (key: string) => void
}> = ({ terminals, onTerminalClick, sortConfig, requestSort }) => {
    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-30" />;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('merchant')}>Merchant {getSortIndicator('merchant')}</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('status')}>Status {getSortIndicator('status')}</th>
                        <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('risk')}>Risk Level {getSortIndicator('risk')}</th>
                        <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('monthlyVol')}>Volume (USD) {getSortIndicator('monthlyVol')}</th>
                        <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('firmwareVersion')}>Firmware/App {getSortIndicator('firmwareVersion')}</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {terminals.map(terminal => {
                        const riskLevel = getTerminalRiskLevel(terminal);
                        return (
                            <tr key={terminal.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-gray-800">{terminal.merchant}</div>
                                    <div className="text-xs text-gray-500 font-mono">{terminal.id}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{terminal.country}</td>
                                <td className="px-4 py-3"><TerminalStatusBadge status={terminal.status} /></td>
                                <td className="px-4 py-3"><RiskLevelBadge level={riskLevel} /></td>
                                <td className="px-4 py-3 text-gray-600 font-medium text-right">${terminal.monthlyVol.toLocaleString()}</td>
                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{terminal.firmwareVersion}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => onTerminalClick(terminal)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                        <Info className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {terminals.length === 0 && <p className="text-center py-8 text-gray-500">No terminals match the current view.</p>}
        </div>
    );
};


const ConnectionIcon: React.FC<{ type: ConnectionType }> = ({ type }) => {
    const icons: Record<ConnectionType, React.ElementType> = { '4G': Signal, 'WiFi': Wifi, 'Ethernet': Server };
    const Icon = icons[type];
    return <Icon className="w-4 h-4 mr-2 inline-block" />;
};

const TerminalDetailsModal: React.FC<{ terminal: PaymentTerminal | null; onClose: () => void }> = ({ terminal, onClose }) => {
    if (!terminal) return null;
    
    const isBiometric = terminal.model.includes('PV-9000');
    const isTapToPay = terminal.model.includes('Tap-to-Pay');

    return (
        <Modal isOpen={!!terminal} onClose={onClose} title={`Terminal Details: ${terminal.id}`}>
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{terminal.merchant}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-x-4 gap-y-2">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{terminal.country}</span>
                        <span className="flex items-center"><Cpu className="w-4 h-4 mr-2" />{terminal.model}</span>
                         {isBiometric && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full flex items-center">
                                <Fingerprint className="w-3 h-3 mr-1.5" /> Palm Vein Enabled
                            </span>
                        )}
                        {isTapToPay && (
                             <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-xs font-semibold rounded-full flex items-center">
                                <Smartphone className="w-3 h-3 mr-1.5" /> SoftPOS Solution
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card><Hash className="mx-auto text-gray-500" /><span className="text-xl font-bold">{terminal.monthlyTxns.toLocaleString()}</span><p className="text-xs text-gray-500">Transactions/mo</p></Card>
                    <Card><DollarSign className="mx-auto text-gray-500" /><span className="text-xl font-bold">${terminal.monthlyVol.toLocaleString()}</span><p className="text-xs text-gray-500">Volume/mo</p></Card>
                    <Card><TrendingUp className="mx-auto text-gray-500" /><span className="text-xl font-bold">${terminal.avgTxnValue.toFixed(2)}</span><p className="text-xs text-gray-500">Avg. Txn Value</p></Card>
                </div>
                
                {terminal.aiRecommendation && (
                     <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">AI Recommendation</h4>
                        <p className="text-sm text-indigo-800 bg-indigo-50 p-3 rounded-lg border border-indigo-200">{terminal.aiRecommendation}</p>
                    </div>
                )}
                
                {(terminal.alerts || []).length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Active Risk Alerts</h4>
                        <div className="space-y-2">
                          {(terminal.alerts || []).map((alert, i) => (
                             <div key={i} className={`p-3 rounded-md text-sm border-l-4 ${alert.severity === 'High' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-yellow-50 border-yellow-500 text-yellow-800'}`}>
                                <strong>{alert.type}:</strong> {alert.description}
                             </div>
                          ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Compliance Status</h4>
                        <div className="space-y-2">
                            {(terminal.compliance || []).map(c => (
                                <div key={c.standard} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-md">
                                    <span className="font-medium text-gray-800">{c.standard}</span>
                                    <span className={`font-semibold ${
                                        c.status === 'Compliant' ? 'text-green-600' :
                                        c.status === 'Expires Soon' ? 'text-yellow-600' :
                                        c.status === 'Planned' ? 'text-blue-600' :
                                        c.status === 'In Progress' ? 'text-purple-600' :
                                        'text-red-600'
                                    }`}>
                                        {c.status} {c.expiry ? `(${c.expiry})` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Technical Details</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span>Status:</span> <TerminalStatusBadge status={terminal.status} /></div>
                            <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span>Last Seen:</span> <span className="font-medium">{new Date(terminal.lastSeen).toLocaleString()}</span></div>
                            <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span>Connection:</span> <span className="font-medium flex items-center"><ConnectionIcon type={terminal.connectionType} /> {terminal.connectionType}</span></div>
                            <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span>Firmware/App:</span> <span className="font-mono">{terminal.firmwareVersion}</span></div>
                            <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span>Tamper Status:</span> <span className={`font-semibold ${terminal.tamperStatus === 'Alert' ? 'text-red-600' : 'text-green-600'}`}>{terminal.tamperStatus}</span></div>
                            {terminal.batteryHealth && !isTapToPay && <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span>Battery Health:</span> <span className={`font-semibold ${terminal.batteryHealth < 50 ? 'text-yellow-600' : 'text-gray-600'}`}>{terminal.batteryHealth}%</span></div>}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};


const FleetInsightsTab: React.FC = () => {
    const [view, setView] = useState<FleetView>('estate');
    const [selectedTerminal, setSelectedTerminal] = useState<PaymentTerminal | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'risk', direction: 'desc' });
    
    // Defensive data loading
    const { terminals, opportunities } = FLEET_DATA || { terminals: [], opportunities: [] };

    const processedTerminals = useMemo(() => {
        return (terminals || []).map(t => {
            const dynamicAlerts = generateDynamicAlerts(t);
            const allAlerts = [...(t.alerts || []), ...dynamicAlerts];

            let finalStatus: TerminalStatus = t.status;
            const maintenanceTriggers: RiskAlert['type'][] = ['Operational', 'Security', 'Compliance'];
            if (finalStatus === 'Online' && allAlerts.some(a => maintenanceTriggers.includes(a.type))) {
                finalStatus = 'Needs Maintenance';
            }

            return { ...t, alerts: allAlerts, status: finalStatus };
        });
    }, [terminals]);

    const highRiskCount = useMemo(() => (processedTerminals || []).filter(t => getTerminalRiskLevel(t) === 'High' || getTerminalRiskLevel(t) === 'Critical').length, [processedTerminals]);
    
    const fleetUptime = useMemo(() => {
        if (!terminals || terminals.length === 0) return '0.0';
        const onlineCount = terminals.filter(t => t.status !== 'Offline').length;
        return ((onlineCount / terminals.length) * 100).toFixed(1);
    }, [terminals]);

    const sortedAndFilteredTerminals = useMemo(() => {
        let filtered = [...(processedTerminals || [])];
        if (view === 'risk') {
            filtered = filtered.filter(t => getTerminalRiskLevel(t) === 'Medium' || getTerminalRiskLevel(t) === 'High' || getTerminalRiskLevel(t) === 'Critical');
        } else if (view === 'growth') {
            const opportunityIds = new Set((opportunities || []).map(o => o.terminalId));
            filtered = filtered.filter(t => opportunityIds.has(t.id));
        }
        
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'risk') {
                    const riskOrder: Record<RiskLevel, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    aValue = riskOrder[getTerminalRiskLevel(a)];
                    bValue = riskOrder[getTerminalRiskLevel(b)];
                } else if (sortConfig.key === 'monthlyVol') {
                    aValue = a.monthlyVol;
                    bValue = b.monthlyVol;
                } else {
                     aValue = a[sortConfig.key as keyof PaymentTerminal] as string;
                     bValue = b[sortConfig.key as keyof PaymentTerminal] as string;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [processedTerminals, opportunities, view, sortConfig]);
    
    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                    <TerminalSquare className="w-6 h-6 mr-3 text-blue-600" />
                    Fleet Risk & Opportunity
                </h3>
                <p className="text-gray-600">
                    A unified command center for managing terminal risk, compliance, and identifying revenue opportunities across the APAC fleet.
                </p>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Terminals Managed" value={terminals.length} icon={Users} iconColorClass="text-blue-500" />
                <StatCard title="Fleet Uptime" value={`${fleetUptime}%`} icon={Activity} iconColorClass="text-green-500" />
                <StatCard title="High/Critical Risk" value={highRiskCount} icon={AlertTriangle} iconColorClass="text-red-500" />
                <StatCard title="Growth Opportunities" value={(opportunities || []).length} icon={TrendingUp} iconColorClass="text-indigo-500" />
            </div>

            <Card>
                <div className="mb-4">
                    <ViewToggle view={view} setView={setView} />
                </div>
                <FleetTable 
                    terminals={sortedAndFilteredTerminals} 
                    onTerminalClick={setSelectedTerminal}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                />
            </Card>

            <TerminalDetailsModal terminal={selectedTerminal} onClose={() => setSelectedTerminal(null)} />
        </div>
    );
};

export default FleetInsightsTab;