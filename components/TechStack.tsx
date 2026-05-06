import React, { useState, useMemo } from 'react';
import { FolderCheck, Download, Loader2, Info, Search, X, Link as LinkIcon, ChevronRight, Shield, Activity, CheckCircle, SlidersHorizontal, Eye, EyeOff, Printer } from 'lucide-react';
import { Card, CardTitle, Modal } from './common';
import { AUDIT_ARTIFACTS, artfct_evidence_sankey_data } from '../data';
import type { AuditArtifact, ArtifactLink, ArtifactType, ArtifactClassification, ApacRegulation } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ArtifactDetailModal from './ArtifactDetailModal';
import EvidenceSankeyDiagram from './EvidenceSankeyDiagram';

const EvidenceStrategyCard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const generatePdf = () => {
        setIsLoading(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Company X: GRC Engineering & Audit Readiness', 15, 20);
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('Philosophy: Continuous Compliance-as-Code', 15, 30);

            const introText = "Our approach treats compliance evidence not as a manual, point-in-time artifact, but as a continuous, automated output of our core engineering and security processes. Evidence is generated directly from the tools that enforce our controls (IaC, SIEM, IAM), ensuring it is timely, accurate, and immutable. This creates a perpetually audit-ready state, transforming audits from disruptive events into simple validation exercises.";
            doc.text(doc.splitTextToSize(introText, pageWidth - 30), 15, 38);

            autoTable(doc, {
                startY: 65,
                head: [['Principle', 'Implementation', 'Example Artifact']],
                body: [
                    ['Source of Truth', 'All configurations are defined as code in version-controlled repositories (Git).', '[Git] Ansible Role: ssh-hardening'],
                    ['Automation', 'Security controls and configurations are applied automatically via CI/CD and configuration management.', '[Ansible] Job #1138: CIS Hardening'],
                    ['Active Verification', 'SIEM and monitoring tools continuously check for drift and policy violations, generating alerts.', '[Wazuh] FIM Alert on config change'],
                    ['Interconnectivity', 'Artifacts are linked, showing a clear causality chain from detection to remediation.', 'FIM Alert → SOAR Log → Ansible Log'],
                ],
                theme: 'striped',
                headStyles: { fillColor: [67, 56, 202] },
            });

            doc.save('CompanyX_GRC_Engineering_Strategy.pdf');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardTitle icon={FolderCheck} iconColorClass="text-indigo-600">Evidence Strategy: From Artifacts to Readiness</CardTitle>
            <p className="text-gray-600 mb-4 text-sm">
                This playbook outlines our "Compliance-as-Code" strategy. It details how we leverage automation to generate interconnected, auditable evidence directly from our tech stack, ensuring continuous audit readiness.
            </p>
            <button
                onClick={generatePdf}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
                {isLoading ? 'Generating Strategy...' : 'Download GRC Strategy (PDF)'}
            </button>
        </Card>
    );
};

const EvidenceMatrixCard: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
    <Card>
        <CardTitle icon={Printer} iconColorClass="text-slate-600">Comprehensive Evidence Matrix</CardTitle>
        <p className="text-gray-600 mb-4 text-sm">
          Generate a complete, printable tabular report of all {AUDIT_ARTIFACTS.length} audit artifacts. This matrix cross-references each piece of evidence against its corresponding PCI DSS, ISO 27001, and APAC regulatory requirements, providing a unified view for auditors.
        </p>
        <button
            onClick={onOpen}
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors text-sm"
        >
            <Printer className="w-5 h-5 mr-2" />
            Generate Printable Matrix
        </button>
    </Card>
);

const PrintableEvidenceMatrix: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };

    const sortedArtifacts = useMemo(() => 
        [...AUDIT_ARTIFACTS].sort((a, b) => {
            const aNum = parseInt(a.id.split('-')[1]);
            const bNum = parseInt(b.id.split('-')[1]);
            return aNum - bNum;
        }), []);

    return (
        <div className="printable-matrix">
             <style>{`
                .printable-matrix-container {
                    padding: 0 !important;
                }
                @media print {
                    body * { visibility: hidden; }
                    .printable-matrix, .printable-matrix * { visibility: visible; }
                    .printable-matrix { position: absolute; left: 0; top: 0; width: 100%; margin-top: -2rem; }
                    .no-print { display: none; }
                    @page {
                        size: A4 landscape;
                        margin: 1cm;
                    }
                    table { 
                        font-size: 8pt !important; 
                        -webkit-print-color-adjust: exact; 
                        color-adjust: exact;
                        width: 100%;
                    }
                    thead { display: table-header-group; }
                    tr { page-break-inside: avoid; }
                    .print-header {
                        display: block !important;
                        text-align: center;
                        margin-bottom: 20px;
                        visibility: visible;
                    }
                }
                .print-header { display: none; }
            `}</style>
            <div className="print-header">
                <h1 className="text-xl font-bold">Company X - Comprehensive Audit Evidence Matrix</h1>
                <p className="text-sm">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="text-lg font-bold text-gray-800">Comprehensive Audit Evidence Matrix</h3>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-xs"
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Matrix
                </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 no-print">
                This table provides a complete list of all {sortedArtifacts.length} audit artifacts. Use your browser's print function to save as PDF. Recommended settings: Landscape, A4.
            </p>

            <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
                <table className="w-full text-[8pt] leading-tight font-mono border-collapse border border-slate-500">
                    <thead className="bg-slate-200 text-slate-800 sticky top-0 z-10">
                        <tr>
                            <th className="border border-slate-400 p-1.5 w-1/6">Artifact (ID & Name)</th>
                            <th className="border border-slate-400 p-1.5 w-1/4">Description</th>
                            <th className="border border-slate-400 p-1.5 w-[15%]">Source / Classification</th>
                            <th className="border border-slate-400 p-1.5 w-[15%]">PCI DSS v4.0.1</th>
                            <th className="border border-slate-400 p-1.5 w-[15%]">ISO 27001:2022</th>
                            <th className="border border-slate-400 p-1.5 w-[15%]">APAC Regulations</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {sortedArtifacts.map(artifact => (
                            <tr key={artifact.id} className="break-inside-avoid odd:bg-slate-50">
                                <td className="border border-slate-400 p-1.5 align-top">
                                    <strong className="text-slate-900">{artifact.id}</strong><br/>{artifact.name}
                                </td>
                                <td className="border border-slate-400 p-1.5 align-top">{artifact.description}</td>
                                <td className="border border-slate-400 p-1.5 align-top">
                                    {artifact.source}<br/>
                                    <span className="italic text-slate-600">({artifact.classification})</span>
                                </td>
                                <td className="border border-slate-400 p-1.5 align-top">
                                    {artifact.pciMappings.map(m => m.req).join(', ')}
                                </td>
                                <td className="border border-slate-400 p-1.5 align-top">
                                    {artifact.isoMappings.map(m => m.control).join(', ')}
                                </td>
                                <td className="border border-slate-400 p-1.5 align-top">
                                    {artifact.localRegulations.join(', ') || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ClassificationCard: React.FC<{
    classification: ArtifactClassification,
    count: number,
    icon: React.ElementType,
    color: string,
    isActive: boolean,
    onClick: () => void
}> = ({ classification, count, icon: Icon, color, isActive, onClick }) => (
    <Card
        onClick={onClick}
        className={`text-center transition-all duration-300 transform hover:-translate-y-1 ${isActive ? `border-2 ${color.replace('text', 'border')}` : 'border-gray-200'}`}
    >
        <Icon className={`mx-auto w-8 h-8 mb-2 ${color}`} />
        <p className="text-3xl font-bold text-gray-800">{count}</p>
        <p className="text-sm text-gray-500">{classification}</p>
    </Card>
);

const AuditArtifactsTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{
        source: string;
        type: ArtifactType | 'all',
        classification: ArtifactClassification | 'all',
        regulation: ApacRegulation | 'all'
    }>({
        source: 'all',
        type: 'all',
        classification: 'all',
        regulation: 'all'
    });
    const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
    const [isSankeyVisible, setIsSankeyVisible] = useState(true);
    const [isPrintMatrixVisible, setIsPrintMatrixVisible] = useState(false);

    const sources = useMemo(() => ['all', ...Array.from(new Set(AUDIT_ARTIFACTS.map(a => a.source)))], []);
    const types = useMemo(() => ['all', ...Array.from(new Set(AUDIT_ARTIFACTS.map(a => a.artifactType)))] as ('all' | ArtifactType)[], []);
    const classifications: ArtifactClassification[] = ['Directive', 'Preventative', 'Detective', 'Corrective'];
    const regulations = useMemo(() => ['all', ...Array.from(new Set(AUDIT_ARTIFACTS.flatMap(a => a.localRegulations)))] as ('all' | ApacRegulation)[], []);

    const classificationData = useMemo(() => {
        return {
            'Directive': AUDIT_ARTIFACTS.filter(a => a.classification === 'Directive').length,
            'Preventative': AUDIT_ARTIFACTS.filter(a => a.classification === 'Preventative').length,
            'Detective': AUDIT_ARTIFACTS.filter(a => a.classification === 'Detective').length,
            'Corrective': AUDIT_ARTIFACTS.filter(a => a.classification === 'Corrective').length,
        };
    }, []);

    const filteredArtifacts = useMemo(() => {
        return AUDIT_ARTIFACTS.filter(artifact => {
            const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  artifact.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSource = filters.source === 'all' || artifact.source === filters.source;
            const matchesType = filters.type === 'all' || artifact.artifactType === filters.type;
            const matchesClassification = filters.classification === 'all' || artifact.classification === filters.classification;
            const matchesRegulation = filters.regulation === 'all' || artifact.localRegulations.includes(filters.regulation);
            
            return matchesSearch && matchesSource && matchesType && matchesClassification && matchesRegulation;
        }).sort((a, b) => new Date(b.lastGenerated).getTime() - new Date(a.lastGenerated).getTime());
    }, [searchTerm, filters]);

    const selectedArtifact = useMemo(() => {
        return AUDIT_ARTIFACTS.find(a => a.id === selectedArtifactId) || null;
    }, [selectedArtifactId]);

    const handleClassificationClick = (classification: ArtifactClassification | 'all') => {
        setFilters(prev => ({...prev, classification: prev.classification === classification ? 'all' : classification }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                    <FolderCheck className="w-6 h-6 mr-3 text-indigo-600" />
                    GRC Evidence Hub
                </h3>
                <p className="text-gray-600">
                    An interactive repository of system-generated evidence. Each artifact is a direct output of our hardened, automated tech stack, forming an interconnected graph that demonstrates continuous compliance.
                </p>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ClassificationCard classification="Directive" count={classificationData.Directive} icon={Info} color="text-gray-500" isActive={filters.classification === 'Directive'} onClick={() => handleClassificationClick('Directive')} />
                <ClassificationCard classification="Preventative" count={classificationData.Preventative} icon={Shield} color="text-blue-500" isActive={filters.classification === 'Preventative'} onClick={() => handleClassificationClick('Preventative')} />
                <ClassificationCard classification="Detective" count={classificationData.Detective} icon={Activity} color="text-orange-500" isActive={filters.classification === 'Detective'} onClick={() => handleClassificationClick('Detective')} />
                <ClassificationCard classification="Corrective" count={classificationData.Corrective} icon={CheckCircle} color="text-green-500" isActive={filters.classification === 'Corrective'} onClick={() => handleClassificationClick('Corrective')} />
            </div>
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EvidenceStrategyCard />
                <EvidenceMatrixCard onOpen={() => setIsPrintMatrixVisible(true)} />
            </div>

            {isSankeyVisible && (
              <Card className="animate-fadeIn">
                <CardTitle icon={SlidersHorizontal} iconColorClass="text-purple-600">Multi-Purpose Evidence Flow</CardTitle>
                <p className="text-gray-600 mb-4 text-sm">
                  This diagram illustrates our "collect once, satisfy many" strategy. It shows how artifacts from core operational domains (left) flow to satisfy multiple compliance frameworks (right). The thickness of each link represents the number of artifacts serving that purpose.
                </p>
                <div className="p-4 border rounded-lg bg-gray-50/50">
                   <EvidenceSankeyDiagram data={artfct_evidence_sankey_data} />
                </div>
              </Card>
            )}

            <div className="flex justify-center -my-2">
                <button
                    onClick={() => setIsSankeyVisible(!isSankeyVisible)}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-pressed={isSankeyVisible}
                >
                    {isSankeyVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {isSankeyVisible ? 'Hide Evidence Flow Diagram' : 'Show Evidence Flow Diagram'}
                </button>
            </div>

            <Card>
                <CardTitle icon={Search} iconColorClass="text-gray-700">Evidence Browser</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="relative md:col-span-2 lg:col-span-4">
                        <input
                            type="text"
                            placeholder="Search artifacts by name, ID, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filters.source}
                        onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        {sources.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sources' : s}</option>)}
                    </select>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as ArtifactType | 'all' }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
                    </select>
                     <select
                        value={filters.regulation}
                        onChange={(e) => setFilters(prev => ({ ...prev, regulation: e.target.value as ApacRegulation | 'all' }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        {regulations.map(r => <option key={r} value={r}>{r === 'all' ? 'All APAC Regulations' : r}</option>)}
                    </select>
                     <button
                        onClick={() => handleClassificationClick('all')}
                        className={`px-3 py-2 border rounded-lg flex items-center justify-center transition-colors ${filters.classification !== 'all' ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                     >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {filters.classification === 'all' ? 'All Classifications' : `${filters.classification}`}
                     </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3">Artifact</th>
                                <th className="px-4 py-3">Source</th>
                                <th className="px-4 py-3">Classification</th>
                                <th className="px-4 py-3">Generated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArtifacts.map(artifact => (
                                <tr key={artifact.id} 
                                    className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setSelectedArtifactId(artifact.id)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-800">{artifact.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{artifact.id}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-gray-600">
                                            <artifact.sourceIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                            {artifact.source}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{artifact.classification}</td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(artifact.lastGenerated).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredArtifacts.length === 0 && <p className="text-center py-8 text-gray-500">No artifacts match the current filters.</p>}
                </div>
            </Card>

             <Modal 
                isOpen={isPrintMatrixVisible} 
                onClose={() => setIsPrintMatrixVisible(false)} 
                title=""
                size="7xl"
            >
                <div className="printable-matrix-container -m-6">
                    <PrintableEvidenceMatrix />
                </div>
            </Modal>
            
            <ArtifactDetailModal 
                artifact={selectedArtifact}
                allArtifacts={AUDIT_ARTIFACTS}
                onSelectArtifact={setSelectedArtifactId}
                onClose={() => setSelectedArtifactId(null)}
            />
        </div>
    );
};

export default AuditArtifactsTab;