import React, { useState, useMemo } from 'react';
import { ClipboardList, ShieldCheck, Check, AlertTriangle, Percent, SlidersHorizontal, Search, BookOpen, ClipboardCheck as ClipboardCheckIcon } from 'lucide-react';
import { Card, CardTitle, StatCard, ControlDetailModal, ControlStatusStateBadge } from './common';
import { INTERNAL_CONTROLS_DATA, ICT_METRICS, AUDIT_ARTIFACTS } from '../data';
import type { InternalControl } from '../types';
import ArtifactDetailModal from './ArtifactDetailModal';

const InternalControlsTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        domain: 'all' as const,
        status: 'all' as const,
    });

    const [selectedControl, setSelectedControl] = useState<InternalControl | null>(null);
    const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

    const selectedArtifact = useMemo(() => {
        return AUDIT_ARTIFACTS.find(a => a.id === selectedArtifactId) || null;
    }, [selectedArtifactId]);

    const filteredControls = useMemo(() => {
        return INTERNAL_CONTROLS_DATA.filter(control => {
            const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  control.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  control.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDomain = filters.domain === 'all' || control.domain === filters.domain;
            const matchesStatus = filters.status === 'all' || control.status === filters.status;

            return matchesSearch && matchesDomain && matchesStatus;
        });
    }, [searchTerm, filters]);
    
    const handleArtifactClick = (id: string) => {
        setSelectedControl(null); // Close control modal if open
        setSelectedArtifactId(id);
    };
    
    return (
        <>
            <div className="space-y-6 animate-fadeIn">
                <Card className="bg-gradient-to-r from-slate-50 to-gray-100 border-slate-200">
                    <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                        <ClipboardList className="w-6 h-6 mr-3 text-slate-600" />
                        Internal Control Management
                    </h3>
                    <p className="text-gray-600">
                        A centralized library of all internal security controls, tracking their effectiveness, testing status, and mapping to various compliance frameworks.
                    </p>
                </Card>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Controls" value={ICT_METRICS.totalControls} icon={ClipboardList} iconColorClass="text-slate-500" />
                    <StatCard title="Operating Effectively" value={ICT_METRICS.operatingEffectively} icon={Check} iconColorClass="text-green-500" />
                    <StatCard title="Needs Remediation" value={ICT_METRICS.needsRemediation} icon={AlertTriangle} iconColorClass="text-yellow-500" />
                    <StatCard title="Test Coverage" value={`${ICT_METRICS.testCoverage}%`} icon={Percent} iconColorClass="text-blue-500" />
                </div>
                
                <Card>
                    <CardTitle icon={SlidersHorizontal} iconColorClass="text-gray-700">Control Library</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="relative md:col-span-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by control ID, name, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filters.domain}
                            onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value as any }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Domains</option>
                            <option value="Organizational">Organizational</option>
                            <option value="People">People</option>
                            <option value="Physical">Physical</option>
                            <option value="Technological">Technological</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Design Effective">Design Effective</option>
                            <option value="Operating Effectively">Operating Effectively</option>
                            <option value="Needs Improvement">Needs Improvement</option>
                            <option value="Not Tested">Not Tested</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Control</th>
                                    <th className="px-4 py-3">Domain</th>
                                    <th className="px-4 py-3">Frameworks</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Next Test Due</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredControls.map(control => (
                                    <tr key={control.id}
                                        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => setSelectedControl(control)}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-gray-800">{control.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{control.id}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{control.domain}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-1.5">
                                                {control.mappings.pci.length > 0 && (
                                                    <div className="p-1 bg-blue-100 rounded-full" title="PCI DSS v4.0.1">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                )}
                                                {control.mappings.iso27001.length > 0 && (
                                                    <div className="p-1 bg-green-100 rounded-full" title="ISO 27001:2022">
                                                        <BookOpen className="w-3.5 h-3.5 text-green-600" />
                                                    </div>
                                                )}
                                                {control.mappings.soc2.length > 0 && (
                                                    <div className="p-1 bg-teal-100 rounded-full" title="SOC 2">
                                                        <ClipboardCheckIcon className="w-3.5 h-3.5 text-teal-600" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><ControlStatusStateBadge status={control.status} /></td>
                                        <td className="px-4 py-3 text-gray-500">{control.nextTestDue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredControls.length === 0 && <p className="text-center py-8 text-gray-500">No controls match the current filters.</p>}
                    </div>
                </Card>
            </div>

            <ControlDetailModal 
                control={selectedControl} 
                onClose={() => setSelectedControl(null)}
                onArtifactClick={handleArtifactClick}
            />
            <ArtifactDetailModal 
                artifact={selectedArtifact}
                allArtifacts={AUDIT_ARTIFACTS}
                onSelectArtifact={setSelectedArtifactId}
                onClose={() => setSelectedArtifactId(null)}
            />
        </>
    );
};

export default InternalControlsTab;
