import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Modal, ClickableControls } from './common'; // Assuming ClickableControls is exported from common
import type { AuditArtifact, ArtifactLink, ApacRegulation } from '../types';
import { INTERNAL_CONTROLS_DATA } from '../data';

const ArtifactDetailModal: React.FC<{
    artifact: AuditArtifact | null;
    allArtifacts: AuditArtifact[];
    onSelectArtifact: (id: string) => void;
    onClose: () => void;
}> = ({ artifact, allArtifacts, onSelectArtifact, onClose }) => {
    if (!artifact) return null;

    const getLinkTypeInfo = (type: ArtifactLink['type']) => {
        const info = {
            correlated: { text: 'Correlated With', color: 'text-blue-600' },
            supplemented: { text: 'Supplemented By', color: 'text-green-600' },
            causality: { text: 'Leads To / Caused By', color: 'text-purple-600' },
            optimized: { text: 'Optimizes / Is Optimized By', color: 'text-orange-600' },
        };
        return info[type];
    };

    const regulationColors: Record<ApacRegulation, string> = {
        'MAS-TRM': 'bg-red-100 text-red-800',
        'OJK': 'bg-green-100 text-green-800',
        'HKMA-CRAF': 'bg-purple-100 text-purple-800',
        'RBI-CSF': 'bg-indigo-100 text-indigo-800',
        'AUSTRAC': 'bg-orange-100 text-orange-800',
    };
    
    // Reverse lookup to find which controls this artifact provides evidence for
    const linkedControls = useMemo(() => {
        return INTERNAL_CONTROLS_DATA.filter(control => control.linkedArtifacts.includes(artifact.id));
    }, [artifact]);

    return (
        <Modal isOpen={!!artifact} onClose={onClose} title="Audit Artifact Details">
            <div className="space-y-6">
                <div>
                    <p className="text-xs text-gray-500 font-mono">{artifact.id}</p>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <artifact.sourceIcon className="w-5 h-5 mr-2 text-gray-600" /> {artifact.name}
                    </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><span className="font-semibold text-gray-700">Source:</span><br/>{artifact.source}</div>
                    <div><span className="font-semibold text-gray-700">Type:</span><br/>{artifact.artifactType}</div>
                    <div><span className="font-semibold text-gray-700">Classification:</span><br/>{artifact.classification}</div>
                    <div><span className="font-semibold text-gray-700">Generated:</span><br/>{new Date(artifact.lastGenerated).toLocaleDateString()}</div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Description</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{artifact.description}</p>
                </div>
                
                {linkedControls.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Evidence For Internal Controls</h4>
                        <div className="p-3 border border-gray-200 rounded-lg">
                           {linkedControls.map(control => (
                               <div key={control.id} className="text-sm">
                                   <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded mr-2">{control.id}</span>
                                   <span className="font-medium text-gray-800">{control.name}</span>
                               </div>
                           ))}
                        </div>
                    </div>
                )}
                
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">PCI DSS v4.0.1 Alignment</h4>
                    <div className="space-y-3">
                        {artifact.pciMappings.map(pci => (
                            <div key={pci.req} className="p-3 border border-gray-200 rounded-lg">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Req. {pci.req}</span>
                                {pci.customizedApproach && (
                                     <p className="text-xs text-gray-600 mt-2"><strong className="text-gray-800">Customized Approach:</strong> {pci.customizedApproach}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                 
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">ISO 27001:2022 Alignment</h4>
                     <div className="space-y-2">
                        {artifact.isoMappings.map(iso => (
                            <div key={iso.control} className="flex items-center text-xs p-2 bg-gray-50 rounded-md">
                               <span className="font-bold text-gray-700 mr-2">{iso.control}</span>
                               <span className="text-gray-600">{iso.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {artifact.localRegulations.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">APAC Regulatory Alignment</h4>
                         <div className="flex flex-wrap gap-2">
                            {artifact.localRegulations.map(reg => (
                                <span key={reg} className={`px-2 py-1 text-xs font-medium rounded-full ${regulationColors[reg]}`}>
                                    {reg}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


                {artifact.links.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Evidence Graph</h4>
                        <div className="space-y-3">
                            {artifact.links.map(link => {
                                const targetArtifact = allArtifacts.find(a => a.id === link.targetId);
                                if (!targetArtifact) return null;
                                const linkInfo = getLinkTypeInfo(link.type);
                                return (
                                    <div key={link.targetId} className="p-3 border border-gray-200 rounded-lg">
                                        <p className={`text-xs font-bold ${linkInfo.color}`}>{linkInfo.text}</p>
                                        <button onClick={() => onSelectArtifact(link.targetId)} className="text-left w-full group">
                                            <h5 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors flex items-center">
                                               <targetArtifact.sourceIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                                               {targetArtifact.name} <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h5>
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ArtifactDetailModal;