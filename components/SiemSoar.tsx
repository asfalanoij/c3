import React, { useState, useMemo } from 'react';
import { BarChartHorizontal, Bot, BrainCircuit, ShieldAlert, Cpu, Activity, Info } from 'lucide-react';
import { Card, CardTitle, Modal, CodeBlock, StatCard } from './common';
import { SIEM_KPIS, ALERT_TREND_DATA, MITRE_ATTACK_TACTICS, NOTABLE_EVENTS } from '../data';
import type { NotableEvent, AlertSeverity, EventStatus, AlertTrendDataPoint } from '../types';

const severityStyles: Record<AlertSeverity, { text: string; bg: string; border: string; darkBg: string; }> = {
    Critical: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', darkBg: 'bg-red-500' },
    High: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', darkBg: 'bg-orange-500' },
    Medium: { text: 'text-yellow-800', bg: 'bg-yellow-50', border: 'border-yellow-200', darkBg: 'bg-yellow-500' },
    Low: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', darkBg: 'bg-blue-500' },
};

const AlertTrendChart: React.FC<{data: AlertTrendDataPoint[]}> = ({ data }) => {
    const severities: AlertSeverity[] = ['Critical', 'High', 'Medium', 'Low'];
    const colors: Record<AlertSeverity, string> = { Critical: '#EF4444', High: '#F97316', Medium: '#EAB308', Low: '#3B82F6' };
    
    const width = 500, height = 200, padding = 30;
    const maxY = Math.max(...data.flatMap(d => severities.map(s => d[s]))) * 1.1;
    const xPoint = (i: number) => padding + i * (width - padding * 2) / (data.length - 1);
    const yPoint = (value: number) => height - padding - (value / maxY) * (height - padding * 2);

    const generatePath = (severity: AlertSeverity) => {
        let path = `M ${xPoint(0)} ${yPoint(data[0][severity])}`;
        data.slice(1).forEach((d, i) => {
            path += ` L ${xPoint(i + 1)} ${yPoint(d[severity])}`;
        });
        return path;
    };

    return (
        <div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Y-axis grid */}
                {[...Array(5)].map((_, i) => (
                    <g key={i} className="text-gray-400">
                        <text x={padding - 8} y={yPoint(i * (maxY / 4))} dy="0.3em" textAnchor="end" className="text-[8px] fill-current">{Math.round(i * (maxY / 4))}</text>
                        <line x1={padding} x2={width - padding} y1={yPoint(i * (maxY / 4))} y2={yPoint(i * (maxY / 4))} className="stroke-current opacity-20" strokeWidth="0.5" />
                    </g>
                ))}

                {/* X-axis labels */}
                {data.map((d, i) => ( i % 4 === 0 &&
                    <text key={i} x={xPoint(i)} y={height - padding + 15} textAnchor="middle" className="text-[8px] fill-current text-gray-400">
                        {24 - d.hour}h ago
                    </text>
                ))}
                
                {/* Lines */}
                {severities.map(s => <path key={s} d={generatePath(s)} stroke={colors[s]} fill="none" strokeWidth="2" />)}
                
                {/* Points */}
                {data.map((d, i) => severities.map(s => <circle key={`${s}-${i}`} cx={xPoint(i)} cy={yPoint(d[s])} r="2" fill={colors[s]} />)
                )}
            </svg>
            <div className="flex justify-center gap-4 mt-2">
                {severities.map(s => (
                    <div key={s} className="flex items-center text-xs">
                        <span className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: colors[s]}}></span>
                        {s}
                    </div>
                ))}
            </div>
        </div>
    );
};

const EventStatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => {
  const styles: Record<EventStatus, string> = {
    'Analyst Review': 'bg-purple-100 text-purple-800',
    'Remediation Successful': 'bg-green-100 text-green-800',
    'False Positive': 'bg-gray-100 text-gray-800',
    'Escalated': 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const SiemSoarTab: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<NotableEvent | null>(null);
    const [selectedTactic, setSelectedTactic] = useState<string | null>(null);

    const filteredEvents = useMemo(() => {
        if (!selectedTactic) return NOTABLE_EVENTS;
        return NOTABLE_EVENTS.filter(event => event.tactic.id === selectedTactic);
    }, [selectedTactic]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-white">
                    <ShieldAlert className="w-6 h-6 mr-3 text-cyan-400" />
                    SIEM & SOAR Command Center
                </h3>
                <p className="text-slate-400">
                    Unified security analytics, threat detection, and automated response orchestration.
                </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Alerts (24h)" value={SIEM_KPIS.alertsToday.toLocaleString()} icon={Activity} iconColorClass="text-blue-500" />
                <StatCard title="High-Severity Incidents" value={SIEM_KPIS.highSeverityIncidents.toString()} icon={ShieldAlert} iconColorClass="text-red-500" />
                <StatCard title="Endpoints Monitored" value={`${(SIEM_KPIS.endpointsMonitored / 1000).toFixed(1)}k`} icon={Cpu} iconColorClass="text-green-500" />
                <StatCard title="Automated Remediations" value={SIEM_KPIS.automatedRemediations.toLocaleString()} icon={Bot} iconColorClass="text-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardTitle icon={Activity} iconColorClass="text-blue-500">Alert Volume (Last 24 Hours)</CardTitle>
                    <AlertTrendChart data={ALERT_TREND_DATA} />
                </Card>
                 <Card className="lg:col-span-2">
                    <CardTitle icon={BrainCircuit} iconColorClass="text-purple-500">MITRE ATT&CK® Detections</CardTitle>
                    <div className="space-y-1">
                        {MITRE_ATTACK_TACTICS.map(tactic => {
                            const maxCount = Math.max(...MITRE_ATTACK_TACTICS.map(t => t.count));
                            const percentage = (tactic.count / maxCount) * 100;
                            const isActive = selectedTactic === tactic.id;
                            return (
                                <button
                                    key={tactic.id}
                                    onClick={() => setSelectedTactic(isActive ? null : tactic.id)}
                                    className={`w-full text-left text-xs p-2 rounded-lg transition-all ${isActive ? 'bg-purple-100 ring-2 ring-purple-300' : 'hover:bg-gray-50'}`}
                                    aria-pressed={isActive}
                                >
                                    <div className="flex justify-between mb-0.5">
                                        <span className="font-medium text-gray-700">{tactic.name}</span>
                                        <span className="text-gray-500">{tactic.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    {selectedTactic && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setSelectedTactic(null)}
                                className="text-xs font-semibold text-purple-600 hover:underline"
                            >
                                Clear Tactic Filter
                            </button>
                        </div>
                    )}
                </Card>
            </div>

            <Card>
                <CardTitle icon={BarChartHorizontal} iconColorClass="text-orange-500">Notable Events</CardTitle>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Detection Rule</th>
                                <th className="px-4 py-3">Entity</th>
                                <th className="px-4 py-3">MITRE ATT&CK Tactic & Technique</th>
                                <th className="px-4 py-3">Severity</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map(event => (
                                <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{new Date(event.timestamp).toLocaleString()}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{event.ruleName}</td>
                                    <td className="px-4 py-3 text-gray-600">{event.entity}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-800">{event.tactic.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{event.technique.name} ({event.technique.id})</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityStyles[event.severity].bg} ${severityStyles[event.severity].text} border ${severityStyles[event.severity].border}`}>
                                            {event.severity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3"><EventStatusBadge status={event.status} /></td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setSelectedEvent(event)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No notable events match the selected tactic.
                        </div>
                    )}
                </div>
            </Card>
            
            <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={`Event Details: ${selectedEvent?.ruleName}`}>
                {selectedEvent && (
                    <div className="space-y-6">
                         <div>
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
                                MITRE ATT&CK® Correlation
                            </h3>
                            <div className="p-3 bg-gray-50 border rounded-lg text-sm space-y-2">
                                <div>
                                    <span className="font-semibold text-gray-700">Tactic:</span>
                                    <a href={`https://attack.mitre.org/tactics/${selectedEvent.tactic.id}/`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                                        {selectedEvent.tactic.name} ({selectedEvent.tactic.id})
                                    </a>
                                </div>
                                 <div>
                                    <span className="font-semibold text-gray-700">Technique:</span>
                                    <a href={`https://attack.mitre.org/techniques/${selectedEvent.technique.id.replace('.', '/')}/`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                                       {selectedEvent.technique.name} ({selectedEvent.technique.id})
                                    </a>
                                </div>
                            </div>
                         </div>
                         <div>
                            <h3 className="font-semibold text-gray-800 mb-2">SOAR Automation Playbook Triggered</h3>
                            <CodeBlock content={selectedEvent.playbook} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Raw Log Snippet</h3>
                            <CodeBlock content={selectedEvent.rawLog} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SiemSoarTab;