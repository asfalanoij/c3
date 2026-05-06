import React, { useState, useMemo } from 'react';
import { BookOpen, GitBranch, ChevronDown, Download, Loader2, FolderCheck, Share2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { PCI_DSS_V4_CHECKLIST_DATA, PCI_ISO_MAPPING, UNIFIED_EVIDENCE_DATA, SANKEY_NODES, SANKEY_LINKS, INTERNAL_CONTROLS_DATA, AUDIT_ARTIFACTS } from '../data';
import { Card, CardTitle, StatusBadge, ClickableControls, ControlDetailModal } from './common';
import SankeyDiagram from './SankeyDiagram';
import type { PciMainRequirement, ControlStatus, InternalControl } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ArtifactDetailModal from './ArtifactDetailModal';

const getStatusIcon = (status: ControlStatus) => {
    switch (status) {
        case 'complete': return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
        case 'in-progress': return <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
        case 'remediation': return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />;
        default: return null;
    }
};

interface RequirementComplianceCardProps {
    title: string;
    reqId: string;
    complianceRate: number;
    complete: number;
    total: number;
}

const RequirementComplianceCard: React.FC<RequirementComplianceCardProps> = ({ title, reqId, complianceRate, complete, total }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (complianceRate / 100) * circumference;
    
    const getStrokeColor = () => {
        if (complianceRate >= 95) return 'stroke-green-500';
        if (complianceRate >= 80) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };

    return (
        <Card className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-full h-full" viewBox="0 0 70 70">
                    <circle className="text-gray-200" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="35" cy="35" />
                    <circle
                        className={`transition-all duration-1000 ease-out ${getStrokeColor()}`}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="35"
                        cy="35"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">{complianceRate}%</span>
                </div>
            </div>
            <h4 className="font-semibold text-gray-800 text-sm leading-tight">{reqId}: {title}</h4>
            <p className="text-xs text-gray-500 mt-1">{complete} / {total} Controls Met</p>
        </Card>
    );
};


const RequirementDetailAccordion: React.FC<{ requirement: PciMainRequirement, onControlClick: (id: string) => void; }> = ({ requirement, onControlClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const total = requirement.subRequirements.length;
    const complete = requirement.subRequirements.filter(sr => sr.status === 'complete').length;
    const complianceRate = total > 0 ? Math.round((complete / total) * 100) : 100;

    const getImplementingControls = (subReqId: string) => {
        const reqNumber = subReqId.split('.')[0];
        return INTERNAL_CONTROLS_DATA.filter(c => c.mappings.pci.includes(reqNumber)).map(c => c.id);
    }

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                className="w-full flex justify-between items-center p-3 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <div className={`w-12 h-8 text-white rounded-md text-xs font-bold flex items-center justify-center mr-3 ${complianceRate >= 95 ? 'bg-green-600' : complianceRate >= 80 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        {requirement.id.split('.')[1]}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800 text-sm">{requirement.title}</div>
                        <div className="text-xs text-gray-500">{requirement.id}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <span className="text-xs font-medium text-gray-600 hidden sm:inline">{complete} / {total} Complete</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="px-1 sm:px-4 pb-4 border-t border-gray-200 animate-fadeIn">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 mt-3">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-semibold">
                                <tr>
                                    <th scope="col" className="px-4 py-3 w-24">Control ID</th>
                                    <th scope="col" className="px-4 py-3">Description</th>
                                    <th scope="col" className="px-4 py-3 w-32">Status</th>
                                    <th scope="col" className="px-4 py-3 w-32">Implementing Controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requirement.subRequirements.map((subReq) => (
                                    <tr key={subReq.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 text-xs">
                                        <td className="px-4 py-3 font-medium text-gray-800">{subReq.id}</td>
                                        <td className="px-4 py-3">{subReq.description}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                {getStatusIcon(subReq.status)}
                                                <StatusBadge status={subReq.status} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <ClickableControls controlIds={getImplementingControls(subReq.id)} onControlClick={onControlClick} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};


const EvidenceFactoryCard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const generateEvidenceMatrixPdf = () => {
        setIsLoading(true);
        try {
            const doc = new jsPDF({ orientation: 'landscape' });
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;

            const addHeader = (docInstance: jsPDF) => {
                docInstance.setFontSize(14);
                docInstance.setFont('helvetica', 'bold');
                docInstance.text('Company X APAC', 15, 15);
                docInstance.setFontSize(10);
                docInstance.setFont('helvetica', 'normal');
                docInstance.text('Unified Evidence Matrix', pageWidth - 15, 15, { align: 'right' });
                docInstance.setDrawColor(200);
                docInstance.line(15, 20, pageWidth - 15, 20);
            };

            const addFooter = (docInstance: jsPDF, pageNum: number) => {
                docInstance.setFontSize(8);
                docInstance.setTextColor(150);
                docInstance.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                docInstance.text('CONFIDENTIAL - EVIDENCE FACTORY', 15, pageHeight - 10);
            };

            addHeader(doc);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Strategy: Collect Once, Satisfy Many', 15, 30);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const introText = "To mitigate audit fatigue and ensure consistency, Company X's Evidence Factory centralizes compliance artifacts linked directly to their source systems. This matrix demonstrates how a single piece of evidence, programmatically generated from our tech stack for a specific PCI DSS requirement, simultaneously satisfies controls across ISO standards and diverse APAC regulatory landscapes. This approach eliminates redundant effort and presents a unified, cohesive, and automated compliance posture to all auditors.";
            doc.text(doc.splitTextToSize(introText, pageWidth - 30), 15, 40);

            const tableBody = UNIFIED_EVIDENCE_DATA.map(item => {
                 const synergyText = [
                    item.synergies.iso27001 ? `✓ ISO 27001 (${item.synergies.iso27001})` : '',
                    item.synergies.iso27701 ? '✓ ISO 27701' : '',
                    item.synergies.mas ? '✓ MAS TRM' : '',
                    item.synergies.ojk ? '✓ OJK (POJK)' : '',
                    item.synergies.hkma ? '✓ HKMA C-RAF' : '',
                    item.synergies.austrac ? '✓ AUSTRAC' : '',
                    item.synergies.rbi ? '✓ RBI CSF' : ''
                ].filter(Boolean).join('\n');

                return [
                    item.pciReq,
                    item.artifact,
                    item.description,
                    synergyText,
                    item.justification
                ];
            });

            autoTable(doc, {
                startY: 65,
                head: [['PCI DSS Req', 'Evidence Source & Artifact', 'Description', 'Framework Synergies', 'Justification / Dual Purpose']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], fontSize: 7, halign: 'center' },
                styles: { fontSize: 6.5, cellPadding: 1.5 },
                columnStyles: {
                    0: { cellWidth: 20, halign: 'center' },
                    1: { cellWidth: 50 },
                    2: { cellWidth: 70 },
                    3: { cellWidth: 40 },
                    4: { cellWidth: 'auto' },
                },
                didDrawPage: (data) => {
                    addHeader(doc);
                    addFooter(doc, data.pageNumber);
                }
            });

            doc.save('Company X_Unified_Evidence_Matrix.pdf');

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("An error occurred while generating the PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardTitle icon={FolderCheck} iconColorClass="text-purple-600">The Evidence Factory: Unified Audit Strategy</CardTitle>
            <p className="text-gray-600 mb-4 text-sm">
                Our "Collect Once, Satisfy Many" approach leverages PCI DSS as a baseline to generate evidence that meets multiple compliance needs. This reduces audit fatigue and ensures consistency. Download the matrix to see how specific PCI artifacts are mapped to ISO 27001, 27701, and APAC regulatory requirements.
            </p>
            <button
                onClick={generateEvidenceMatrixPdf}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Matrix...
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Unified Evidence Matrix (PDF)
                    </>
                )}
            </button>
        </Card>
    );
};


const PciDeepDiveTab: React.FC = () => {
    const [selectedControl, setSelectedControl] = useState<InternalControl | null>(null);
    const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

    const sankeyData = { nodes: SANKEY_NODES, links: SANKEY_LINKS };

     const complianceData = useMemo(() => {
        return PCI_DSS_V4_CHECKLIST_DATA.map(req => {
            const total = req.subRequirements.length;
            const complete = req.subRequirements.filter(sr => sr.status === 'complete').length;
            return {
                ...req,
                complianceRate: total > 0 ? Math.round((complete / total) * 100) : 100,
                total,
                complete,
            };
        });
    }, []);

    const handleControlClick = (id: string) => {
        const control = INTERNAL_CONTROLS_DATA.find(c => c.id === id);
        if (control) setSelectedControl(control);
    };

    const handleArtifactClick = (id: string) => {
        setSelectedArtifactId(id);
    };

    const selectedArtifact = useMemo(() => {
        return AUDIT_ARTIFACTS.find(a => a.id === selectedArtifactId) || null;
    }, [selectedArtifactId]);


    return (
        <div className="space-y-6 animate-fadeIn">
             <Card>
                <CardTitle icon={BookOpen} iconColorClass="text-blue-600">PCI DSS v4.0.1 Compliance Dashboard</CardTitle>
                 <p className="text-gray-600 text-sm -mt-2 mb-4">
                    At-a-glance overview of compliance status for each of the 12 core PCI DSS requirements, based on the full control checklist.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {complianceData.map(req => (
                        <RequirementComplianceCard
                            key={req.id}
                            reqId={req.id}
                            title={req.title}
                            complianceRate={req.complianceRate}
                            complete={req.complete}
                            total={req.total}
                        />
                    ))}
                </div>
            </Card>

            <Card>
                <CardTitle icon={BookOpen} iconColorClass="text-blue-500">Detailed Control Status</CardTitle>
                 <p className="text-gray-600 text-sm -mt-2 mb-4">
                    Expand each requirement to view the status of individual sub-controls and the internal controls used to satisfy them.
                </p>
                <div className="space-y-2">
                    {PCI_DSS_V4_CHECKLIST_DATA.map(req => <RequirementDetailAccordion key={req.id} requirement={req} onControlClick={handleControlClick} />)}
                </div>
            </Card>

            <EvidenceFactoryCard />
            
            <Card>
                <CardTitle icon={Share2} iconColorClass="text-emerald-500">Framework Interconnectivity: A Unified View</CardTitle>
                <div className="text-sm text-gray-600 mb-4">
                    <p>This Sankey diagram illustrates the flow of security concepts from the prescriptive requirements of PCI DSS through the functional framework of NIST CSF 2.0 to the comprehensive control set of ISO 27001:2022. The thickness of a link represents the strength of the relationship.</p>
                    <p className="mt-2">This visualization demonstrates how a strong PCI program builds a foundation for achieving compliance with other major security frameworks, enabling a "comply once, satisfy many" strategy. Hover over a link for more details.</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50/50">
                     <SankeyDiagram data={sankeyData} />
                </div>
                <div className="flex justify-center items-center gap-6 mt-4 text-xs font-semibold">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>PCI DSS v4.0.1</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-violet-500 mr-2"></span>NIST CSF 2.0</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>ISO 27001:2022</div>
                </div>
            </Card>

            <Card>
                <CardTitle icon={GitBranch} iconColorClass="text-purple-500">PCI DSS to ISO 27001:2022 Mapping</CardTitle>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-semibold">
                            <tr>
                                <th scope="col" className="px-4 py-3">PCI Requirement</th>
                                <th scope="col" className="px-4 py-3">ISO Control</th>
                                <th scope="col" className="px-4 py-3">Mapping</th>
                                <th scope="col" className="px-4 py-3">Audit Evidence</th>
                                <th scope="col" className="px-4 py-3">Dual Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PCI_ISO_MAPPING.map((item, index) => (
                                <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50 text-xs">
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{item.pciReq}</th>
                                    <td className="px-4 py-3">{item.isoControl}</td>
                                    <td className="px-4 py-3">{item.mapping}</td>
                                    <td className="px-4 py-3">{item.auditEvidence}</td>
                                    <td className="px-4 py-3">{item.dualPurpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <ControlDetailModal control={selectedControl} onClose={() => setSelectedControl(null)} onArtifactClick={handleArtifactClick} />
            <ArtifactDetailModal 
                artifact={selectedArtifact}
                allArtifacts={AUDIT_ARTIFACTS}
                onSelectArtifact={setSelectedArtifactId}
                onClose={() => setSelectedArtifactId(null)}
            />
        </div>
    );
};

export default PciDeepDiveTab;