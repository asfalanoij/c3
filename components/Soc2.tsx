import React, { useState, useMemo } from 'react';
import { ClipboardCheck, ChevronDown } from 'lucide-react';
import { SOC2_CRITERIA, AUDIT_ARTIFACTS, INTERNAL_CONTROLS_DATA } from '../data';
import { Card, CardTitle, ClickableArtifacts, ClickableControls, ControlDetailModal } from './common';
import type { TrustServiceCriterion, Soc2ControlStatus, AuditArtifact, InternalControl } from '../types';
import ArtifactDetailModal from './ArtifactDetailModal';

const Soc2StatusBadge: React.FC<{ status: Soc2ControlStatus }> = ({ status }) => {
  const styles: Record<Soc2ControlStatus, string> = {
    'in-place': 'bg-green-50 text-green-700',
    'needs-improvement': 'bg-yellow-50 text-yellow-800',
    'not-applicable': 'bg-gray-100 text-gray-700',
    'processing-integrity': 'bg-blue-50 text-blue-700',
    'privacy': 'bg-purple-50 text-purple-700',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
};


const CriterionAccordionItem: React.FC<{ 
    criterion: TrustServiceCriterion,
    onArtifactClick: (id: string) => void,
    onControlClick: (id: string) => void,
}> = ({ criterion, onArtifactClick, onControlClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const totalControls = criterion.controls.length;
    const inPlaceControls = criterion.controls.filter(c => c.status === 'in-place').length;

    const getImplementingControls = (soc2Id: string) => {
        return INTERNAL_CONTROLS_DATA.filter(c => c.mappings.soc2.includes(soc2Id)).map(c => c.id);
    }

    return (
        <div className="border border-gray-200 rounded-lg">
            <button 
                className="w-full flex justify-between items-center p-3 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="flex-1 pr-4">
                    <div className="font-semibold text-gray-800 text-sm">{criterion.name}</div>
                    <div className="text-xs text-gray-500">{criterion.id}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600">{inPlaceControls} / {totalControls} In Place</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-200 animate-fadeIn">
                    <p className="text-sm text-gray-600 my-3">{criterion.description}</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-semibold">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Control ID</th>
                                    <th scope="col" className="px-4 py-3">Description</th>
                                    <th scope="col" className="px-4 py-3">Status</th>
                                    <th scope="col" className="px-4 py-3">Internal Controls</th>
                                    <th scope="col" className="px-4 py-3">Evidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {criterion.controls.map((control) => (
                                    <tr key={control.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 text-xs">
                                        <td className="px-4 py-3 font-medium text-gray-800">{control.id}</td>
                                        <td className="px-4 py-3">{control.description}</td>
                                        <td className="px-4 py-3"><Soc2StatusBadge status={control.status} /></td>
                                        <td className="px-4 py-3">
                                            <ClickableControls controlIds={getImplementingControls(control.id)} onControlClick={onControlClick} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <ClickableArtifacts evidence={control.evidence} onArtifactClick={onArtifactClick} />
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

const Soc2Tab: React.FC = () => {
    const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
    const [selectedControl, setSelectedControl] = useState<InternalControl | null>(null);

    const selectedArtifact = useMemo(() => {
        return AUDIT_ARTIFACTS.find(a => a.id === selectedArtifactId) || null;
    }, [selectedArtifactId]);

    const handleControlClick = (id: string) => {
        const control = INTERNAL_CONTROLS_DATA.find(c => c.id === id);
        if (control) setSelectedControl(control);
    };

    return (
        <>
            <div className="space-y-6 animate-fadeIn">
                <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100">
                    <h3 className="text-lg font-bold mb-1 flex items-center text-gray-800">
                        <ClipboardCheck className="w-6 h-6 mr-3 text-teal-600" />
                        SOC 2 Type 2 Compliance
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Overview of controls for the Trust Services Criteria, mapped to our central internal control library.
                    </p>
                </Card>

                <Card>
                    <CardTitle icon={ClipboardCheck} iconColorClass="text-teal-500">Trust Services Criteria & Controls</CardTitle>
                    <div className="space-y-2">
                        {SOC2_CRITERIA.map(criterion => <CriterionAccordionItem key={criterion.id} criterion={criterion} onArtifactClick={setSelectedArtifactId} onControlClick={handleControlClick} />)}
                    </div>
                </Card>
            </div>
            <ArtifactDetailModal
                artifact={selectedArtifact}
                allArtifacts={AUDIT_ARTIFACTS}
                onSelectArtifact={setSelectedArtifactId}
                onClose={() => setSelectedArtifactId(null)}
            />
            <ControlDetailModal 
                control={selectedControl} 
                onClose={() => setSelectedControl(null)}
                onArtifactClick={setSelectedArtifactId}
            />
        </>
    );
};

export default Soc2Tab;