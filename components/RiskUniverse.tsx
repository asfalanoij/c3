import React, { useState, useMemo, useEffect } from 'react';
import { Library, ArrowRight, Check, X, AlertTriangle, Shield, Info, Link as LinkIcon, ChevronsDown, GitBranch, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardTitle, RiskScoreBubble, getRiskScore, ControlDetailModal, ClickableControls } from './common';
import { RISK_UNIVERSE_DATA, AUDIT_ARTIFACTS, INTERNAL_CONTROLS_DATA } from '../data';
import type { RiskProfile, ControlEffectiveness, RiskTreatmentStrategy, AuditArtifact, RiskLinkType, InternalControl } from '../types';
import ArtifactDetailModal from './ArtifactDetailModal';
import { GoogleGenAI } from '@google/genai';

const ControlEffectivenessBadge: React.FC<{ effectiveness: ControlEffectiveness }> = ({ effectiveness }) => {
    const styles: Record<ControlEffectiveness, string> = {
        'Effective': 'bg-green-100 text-green-800',
        'Partially Effective': 'bg-yellow-100 text-yellow-800',
        'Ineffective': 'bg-red-100 text-red-800',
    };
    const icons: Record<ControlEffectiveness, React.ElementType> = {
        'Effective': Check,
        'Partially Effective': AlertTriangle,
        'Ineffective': X,
    };
    const Icon = icons[effectiveness];
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[effectiveness]}`}>
            <Icon className="w-3 h-3 mr-1.5" />
            {effectiveness}
        </span>
    );
};

const CascadingRisks: React.FC<{ risks?: RiskProfile[] }> = ({ risks }) => {
    if (!risks || risks.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 pt-4 border-t">
            <CardTitle icon={ChevronsDown} iconColorClass="text-gray-600">Cascading Risk Register</CardTitle>
            <p className="text-sm text-gray-600 mb-4 -mt-2">
                The following operational risks are direct consequences or secondary impacts of the selected strategic risk, spread across various business functions.
            </p>
            <div className="overflow-x-auto max-h-64 pr-2">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold sticky top-0">
                        <tr>
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Cascading Risk Event</th>
                            <th className="px-3 py-2">Domain</th>
                            <th className="px-3 py-2 text-center">Residual Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {risks.map(risk => (
                            <tr key={risk.id} className="hover:bg-gray-50 text-xs">
                                <td className="px-3 py-2 font-mono text-gray-500">{risk.id}</td>
                                <td className="px-3 py-2 text-gray-800">{risk.riskEvent}</td>
                                <td className="px-3 py-2 text-gray-600">{risk.domain}</td>
                                <td className="px-3 py-2 text-center">
                                    <div className="flex justify-center">
                                      <RiskScoreBubble score={getRiskScore(risk.residualRisk)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PciImplicationsRenderer: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            {parts.map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part
            )}
        </p>
    );
};

const RiskDossier: React.FC<{
  risk: RiskProfile;
  cascadingRisks?: RiskProfile[];
  onControlClick: (id: string) => void;
  onRiskLinkClick: (id: string) => void;
  aiInsight: string;
  isAiLoading: boolean;
}> = ({ risk, cascadingRisks, onControlClick, onRiskLinkClick, aiInsight, isAiLoading }) => {
  const inherentScore = getRiskScore(risk.inherentRisk);
  const residualScore = getRiskScore(risk.residualRisk);
  
  const treatmentStyles: Record<RiskTreatmentStrategy, string> = {
    Mitigate: 'bg-blue-100 text-blue-800', Accept: 'bg-gray-100 text-gray-800',
    Transfer: 'bg-purple-100 text-purple-800', Avoid: 'bg-red-100 text-red-800',
  };
  
  const linkTypeColors: Record<RiskLinkType, string> = {
    'Causal Inference': 'border-purple-500', 'Correlates With': 'border-blue-500', 'Severes': 'border-red-500',
  };

  return (
    <Card className="animate-fadeIn">
        <div className="border-b pb-4 mb-4">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">{risk.domain}</span>
            <h3 className="text-xl font-bold text-gray-800 mt-2">{risk.id}: {risk.riskEvent}</h3>
            <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
                <CardTitle icon={Info} iconColorClass="text-gray-500">Risk Assessment</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="font-semibold text-xs text-gray-600">Business Process</p>
                        <p className="text-sm text-gray-800">{risk.businessProcess}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="font-semibold text-xs text-gray-600">Risk Owner</p>
                        <p className="text-sm text-gray-800">{risk.owner}</p>
                    </div>
                </div>
                <div className="flex items-center justify-around text-center p-4 bg-gray-50/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-gray-700 mb-2">Inherent Risk</p>
                        <RiskScoreBubble score={inherentScore} />
                        <p className="text-xs text-gray-500 mt-2">L: {risk.inherentRisk.likelihood} / I: {risk.inherentRisk.impact}</p>
                    </div>
                    <div className="text-gray-400"><ArrowRight className="w-8 h-8" /><p className="text-xs font-semibold mt-1">Controls</p></div>
                    <div>
                        <p className="font-semibold text-gray-700 mb-2">Residual Risk</p>
                        <RiskScoreBubble score={residualScore} />
                        <p className="text-xs text-gray-500 mt-2">L: {risk.residualRisk.likelihood} / I: {risk.residualRisk.impact}</p>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <CardTitle icon={Shield} iconColorClass="text-green-600">Risk Treatment</CardTitle>
                <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">Risk & Control Self-Assessment (RCSA)</h4>
                    <div className="space-y-2">
                        {(risk.rcsa || []).map((control, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-white">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm text-gray-800 pr-2">{control.description}</p>
                              <ControlEffectivenessBadge effectiveness={control.effectiveness} />
                            </div>
                            <div className="mt-2">
                              <ClickableControls controlIds={[control.controlId]} onControlClick={onControlClick} />
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
                 {risk.treatmentPlan && (
                    <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Risk Treatment Plan (RT)</h4>
                        <div className="p-4 bg-gray-50/50 rounded-lg border">
                            <div className="flex justify-between items-center">
                                <p className="text-sm"><strong className="text-gray-800">Strategy:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${treatmentStyles[risk.treatmentPlan.strategy]}`}>{risk.treatmentPlan.strategy}</span></p>
                                <p className="text-xs text-gray-500">Due: {risk.treatmentPlan.dueDate}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{risk.treatmentPlan.details}</p>
                        </div>
                    </div>
                 )}
            </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
            <CardTitle icon={Sparkles} iconColorClass="text-indigo-500">AI-driven Risk Insight</CardTitle>
            {isAiLoading ? (
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing risk and generating strategic insights...</span>
                </div>
            ) : (
                <p className="text-sm text-gray-800 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    {aiInsight}
                </p>
            )}
        </div>

        {risk.pciImplications && (
            <div className="mt-6 pt-4 border-t">
                <CardTitle icon={Shield} iconColorClass="text-blue-600">PCI DSS Implications Analysis</CardTitle>
                <PciImplicationsRenderer text={risk.pciImplications} />
            </div>
        )}

        {(risk.links || []).length > 0 && (
            <div className="mt-6 pt-4 border-t">
                <CardTitle icon={LinkIcon} iconColorClass="text-indigo-500">Risk Interconnectivity</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(risk.links || []).map(link => {
                        const targetRisk = (RISK_UNIVERSE_DATA || []).find(r => r.id === link.targetId);
                        if (!targetRisk) return null;
                        return (
                            <button key={link.targetId} onClick={() => onRiskLinkClick(link.targetId)}
                                className={`p-3 border-l-4 rounded-r-lg text-left bg-gray-50 hover:bg-indigo-50 transition-colors ${linkTypeColors[link.type]}`}>
                                <p className="text-xs font-bold text-gray-600">{link.type}</p>
                                <p className="font-semibold text-sm text-indigo-700">{link.targetId}: {targetRisk.riskEvent}</p>
                                <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}

        <CascadingRisks risks={cascadingRisks} />
    </Card>
  );
};

const RiskHeatmap: React.FC<{ strategicRisks: RiskProfile[]; onRiskClick: (id: string) => void, selectedRiskId: string | null }> = ({ strategicRisks, onRiskClick, selectedRiskId }) => {
    const heatmapGrid: (RiskProfile[] | undefined)[][] = Array(5).fill(0).map(() => Array(5).fill(undefined));
    strategicRisks.forEach(risk => {
        const x = risk.residualRisk.impact - 1;
        const y = 4 - (risk.residualRisk.likelihood - 1);
        if (!heatmapGrid[y][x]) {
            heatmapGrid[y][x] = [];
        }
        heatmapGrid[y][x]?.push(risk);
    });

    const getBgColor = (impact: number, likelihood: number) => {
        const score = impact * likelihood;
        if (score < 5) return 'bg-green-100/60 hover:bg-green-200/60';
        if (score < 10) return 'bg-yellow-100/60 hover:bg-yellow-200/60';
        if (score < 15) return 'bg-orange-100/60 hover:bg-orange-200/60';
        return 'bg-red-100/60 hover:bg-red-200/60';
    }

    return (
        <div className="flex gap-2">
            <div className="flex flex-col-reverse justify-between text-xs font-semibold text-gray-500 py-4" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                <span>Likelihood</span>
            </div>
            <div className="flex-1">
                <div className="grid grid-cols-5 grid-rows-5 gap-1 aspect-square max-w-md mx-auto">
                    {heatmapGrid.map((row, y) => 
                        row.map((cellRisks, x) => (
                            <div key={`${y}-${x}`} className={`rounded-md p-1 flex items-center justify-center flex-wrap gap-1 transition-colors ${getBgColor(x+1, 5-y)}`}>
                                {cellRisks?.map(risk => (
                                    <button key={risk.id} onClick={() => onRiskClick(risk.id)}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm transition-all duration-200 transform hover:scale-110
                                            ${getRiskScore(risk.residualRisk) >= 15 ? 'bg-red-600' : getRiskScore(risk.residualRisk) >= 10 ? 'bg-orange-500' : getRiskScore(risk.residualRisk) >= 5 ? 'bg-yellow-500' : 'bg-green-600'}
                                            ${selectedRiskId === risk.id ? 'ring-4 ring-offset-1 ring-blue-500' : ''}`}
                                        title={`${risk.id}: ${risk.riskEvent}`}
                                    >
                                        {risk.id.split('-')[0].substring(0,1) + risk.id.split('-')[1]}
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
                 <div className="flex justify-between mt-1 text-xs font-semibold text-gray-500 max-w-md mx-auto">
                    <span>Low</span>
                    <span>Impact</span>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

const CausalInferenceTree: React.FC<{ strategicRisks: RiskProfile[], onRiskClick: (id: string) => void }> = ({ strategicRisks, onRiskClick }) => {
    const { nodes, roots } = useMemo(() => {
        const nodes = new Map<string, RiskProfile & { children: { link: any, target: any }[] }>(strategicRisks.map(r => [r.id, { ...r, children: [] }]));
        const childIds = new Set<string>();

        strategicRisks.forEach(risk => {
            if (risk.links) {
                risk.links.filter(link => link.type === 'Causal Inference').forEach(link => {
                    if (nodes.has(link.targetId)) {
                        const sourceNode = nodes.get(risk.id);
                        const targetNode = nodes.get(link.targetId);
                        if(sourceNode && targetNode) {
                            sourceNode.children.push({ link, target: targetNode });
                            childIds.add(link.targetId);
                        }
                    }
                });
            }
        });
        
        const roots = strategicRisks.filter(r => !childIds.has(r.id));
        return { nodes, roots };
    }, [strategicRisks]);

    const linkTypeStyles: Record<RiskLinkType, { text: string; bg: string }> = {
        'Causal Inference': { text: 'text-purple-800', bg: 'bg-purple-100' },
        'Correlates With': { text: 'text-blue-800', bg: 'bg-blue-100' },
        'Severes': { text: 'text-red-800', bg: 'bg-red-100' },
    };

    const TreeNode: React.FC<{ risk: RiskProfile, level: number }> = ({ risk, level }) => {
        const nodeData = nodes.get(risk.id);
        
        return (
            <div className="relative">
                {level > 0 && <div className="absolute top-5 -left-4 w-4 h-[calc(100% - 20px)] border-l border-b border-gray-300 rounded-bl-lg"></div>}
                <div className="relative pl-4">
                    <button onClick={() => onRiskClick(risk.id)} className="p-3 my-2 border rounded-lg w-full text-left hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <RiskScoreBubble score={getRiskScore(risk.residualRisk)} />
                            <div className="ml-3">
                                <p className="font-bold text-gray-800 text-sm">{risk.id}: {risk.riskEvent}</p>
                                <p className="text-xs text-gray-500">{risk.domain}</p>
                            </div>
                        </div>
                    </button>

                    {nodeData && nodeData.children.length > 0 && (
                        <div className="pl-4">
                            {nodeData.children.map(({ link, target }, index) => (
                                <div key={index} className="relative mt-2">
                                     <div className={`absolute top-2 -left-8 text-[10px] font-bold p-1 rounded-md transform -rotate-90 ${linkTypeStyles[link.type].text} ${linkTypeStyles[link.type].bg}`}>
                                        {link.type.split(' ')[0].toUpperCase()}
                                    </div>
                                    <TreeNode risk={target} level={level + 1} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {roots.map(root => <TreeNode key={root.id} risk={root} level={0} />)}
        </div>
    );
};

const DirectRelationships: React.FC<{
    selectedRisk: RiskProfile;
    allRisks: (RiskProfile | undefined)[];
    onRiskClick: (id: string) => void;
}> = ({ selectedRisk, allRisks, onRiskClick }) => {
    const { severesRisks, correlatesRisks } = useMemo(() => {
        const severes: { risk: RiskProfile, description: string }[] = [];
        const correlates: { risk: RiskProfile, description: string }[] = [];
        const addedIds = new Set<string>();
        addedIds.add(selectedRisk.id);

        if (selectedRisk.links) {
            for (const link of selectedRisk.links) {
                if (link.type === 'Severes' || link.type === 'Correlates With') {
                    const targetRisk = allRisks.find(r => r && r.id === link.targetId);
                    if (targetRisk) {
                        const list = link.type === 'Severes' ? severes : correlates;
                        if (!addedIds.has(targetRisk.id)) {
                            list.push({ risk: targetRisk, description: link.description });
                            addedIds.add(targetRisk.id);
                        }
                    }
                }
            }
        }

        for (const risk of allRisks) {
            if (!risk || !risk.links) continue;
            for (const link of risk.links) {
                if (link.targetId === selectedRisk.id && !addedIds.has(risk.id)) {
                    if (link.type === 'Severes') {
                         severes.push({ risk, description: link.description });
                         addedIds.add(risk.id);
                    } else if (link.type === 'Correlates With') {
                         correlates.push({ risk, description: link.description });
                         addedIds.add(risk.id);
                    }
                }
            }
        }
        return { severesRisks: severes, correlatesRisks: correlates };
    }, [selectedRisk, allRisks]);

    const hasRelationships = severesRisks.length > 0 || correlatesRisks.length > 0;

    const RelationshipCard: React.FC<{
        risk: RiskProfile;
        description: string;
        onClick: (id: string) => void;
    }> = ({ risk, description, onClick }) => (
        <button 
            onClick={() => onClick(risk.id)}
            className="w-full text-left p-3 border rounded-lg bg-white hover:bg-gray-50/80 transition-colors shadow-sm"
        >
            <p className="font-semibold text-sm text-gray-800">{risk.id}: {risk.riskEvent}</p>
            <p className="text-xs text-gray-500 mt-1 italic">"{description}"</p>
        </button>
    );

    return (
        <Card className="h-full">
            <CardTitle icon={LinkIcon} iconColorClass="text-gray-700">Direct Relationships</CardTitle>
             {!hasRelationships ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 -mt-4">
                    <LinkIcon className="mx-auto w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-600">No Direct Links</p>
                    <p className="text-xs text-gray-500">No amplifying or correlated risks are defined for {selectedRisk.id}.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-red-700 flex items-center mb-3">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            Amplifies / Severes
                        </h4>
                        {severesRisks.length > 0 ? (
                            <div className="space-y-3">
                                {severesRisks.map(({ risk, description }) => (
                                    <RelationshipCard key={risk.id} risk={risk} description={description} onClick={onRiskClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md border">None</div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-700 flex items-center mb-3">
                            <LinkIcon className="w-5 h-5 mr-2" />
                            Correlates With
                        </h4>
                        {correlatesRisks.length > 0 ? (
                            <div className="space-y-3">
                                {correlatesRisks.map(({ risk, description }) => (
                                    <RelationshipCard key={risk.id} risk={risk} description={description} onClick={onRiskClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md border">None</div>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
};

const RiskUniverseTab: React.FC = () => {
    const [selectedRiskId, setSelectedRiskId] = useState<string | null>('STRAT-001');
    const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
    const [selectedControl, setSelectedControl] = useState<InternalControl | null>(null);
    const [aiInsight, setAiInsight] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    const { strategicRisks, riskMap, cascadingRisksByParent } = useMemo(() => {
        const allRisks = RISK_UNIVERSE_DATA || [];
        const riskMap = new Map<string, RiskProfile>((allRisks || []).filter(r => r && r.id).map(r => [r.id, r]));
        const strategicRisks = allRisks.filter(r => r && !r.cascadesFrom) as RiskProfile[];
        const cascadingRisksByParent = new Map<string, RiskProfile[]>();

        allRisks.forEach(risk => {
            if (risk && risk.cascadesFrom) {
                if (!cascadingRisksByParent.has(risk.cascadesFrom)) {
                    cascadingRisksByParent.set(risk.cascadesFrom, []);
                }
                cascadingRisksByParent.get(risk.cascadesFrom)!.push(risk);
            }
        });

        for (const risks of cascadingRisksByParent.values()) {
            risks.sort((a,b) => getRiskScore(b.residualRisk) - getRiskScore(a.residualRisk));
        }

        return { strategicRisks, riskMap, cascadingRisksByParent };
    }, []);
    
    const selectedRisk = useMemo(() => riskMap.get(selectedRiskId || ''), [selectedRiskId, riskMap]);
    const selectedArtifact = useMemo(() => AUDIT_ARTIFACTS.find(a => a.id === selectedArtifactId) || null, [selectedArtifactId]);

    useEffect(() => {
        if (!selectedRiskId) return;

        const risk = riskMap.get(selectedRiskId);
        if (!risk) return;

        const fetchInsight = async () => {
            setIsAiLoading(true);
            setAiInsight('');
            try {
                if (!process.env.API_KEY) {
                    throw new Error("API key not configured.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const prompt = `
                    You are a seasoned GRC strategist and Principal Risk Advisor analyzing a risk for a global payment technology company.
                    Based on the following risk profile, provide a concise, actionable insight (2-3 sentences) for a C-level executive.
                    Focus on a novel mitigation strategy, a potential blind spot, or a strategic opportunity hidden within the risk. Do not simply repeat the information provided.

                    Risk Profile:
                    - ID: ${risk.id}
                    - Event: ${risk.riskEvent}
                    - Description: ${risk.description}
                    - Domain: ${risk.domain}
                    - PCI DSS Implications: ${risk.pciImplications || 'Not specified.'}

                    Your concise insight:
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                setAiInsight(response.text);

            } catch (error) {
                console.error("Error fetching AI risk insight:", error);
                setAiInsight("Could not generate AI insight due to a configuration error.");
            } finally {
                setIsAiLoading(false);
            }
        };

        fetchInsight();

    }, [selectedRiskId, riskMap]);

    const handleArtifactClick = (id: string) => {
        setSelectedControl(null);
        setSelectedArtifactId(id);
    };
    
    const handleControlClick = (id: string) => {
        const control = INTERNAL_CONTROLS_DATA.find(c => c.id === id);
        if (control) {
            setSelectedArtifactId(null);
            setSelectedControl(control);
        }
    };

    return (
        <>
            <div className="space-y-6 animate-fadeIn">
                <Card className="bg-gradient-to-r from-slate-50 to-gray-100 border-slate-200">
                    <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                        <Library className="w-6 h-6 mr-3 text-slate-600" />
                        Enterprise Risk Management
                    </h3>
                    <p className="text-gray-600">
                        A top-down view of the strategic risk landscape, its causal relationships, and its impact on operations. Select a risk from the heatmap to begin analysis.
                    </p>
                </Card>

                <Card>
                    <CardTitle icon={Library} iconColorClass="text-slate-700">Strategic Risk Heatmap</CardTitle>
                    <p className="text-sm text-gray-600 mb-4 -mt-2">
                        Click a bubble to explore a strategic risk. Each bubble represents a top-tier risk, positioned by its residual likelihood and impact.
                    </p>
                    <RiskHeatmap 
                        strategicRisks={strategicRisks} 
                        onRiskClick={setSelectedRiskId}
                        selectedRiskId={selectedRiskId}
                    />
                </Card>

                {selectedRisk && (
                    <RiskDossier 
                        risk={selectedRisk} 
                        cascadingRisks={cascadingRisksByParent.get(selectedRisk.id)}
                        onControlClick={handleControlClick}
                        onRiskLinkClick={setSelectedRiskId}
                        aiInsight={aiInsight}
                        isAiLoading={isAiLoading}
                    />
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-3">
                        <Card>
                            <CardTitle icon={GitBranch} iconColorClass="text-purple-600">Risk Interconnectivity & Causality</CardTitle>
                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-4">
                                <h4 className="font-semibold text-indigo-800 flex items-center mb-2 text-sm"><LinkIcon className="w-4 h-4 mr-2" />From Correlation to Causation: A GRC Deep Dive</h4>
                                <div className="space-y-3 text-xs text-indigo-700">
                                    <p>
                                        In modern Enterprise Risk Management (ERM), distinguishing between correlation and causation is critical for effective decision-making. Traditional risk registers often highlight correlations (e.g., 'a rise in phishing attacks correlates with increased credential theft'), which are useful for identifying trends but can lead to treating symptoms instead of root causes.
                                    </p>
                                    <div>
                                        <p>
                                            Cutting-edge GRC, aligned with frameworks like ISO 31000 and recent research in causal inference, pushes us to map the direct cause-and-effect pathways. For example, a causal link might be:
                                        </p>
                                        <div className="mt-1 p-2 bg-indigo-100/50 rounded-md border border-indigo-200/50 text-center">
                                           <p className="text-indigo-800"><strong>'Unpatched vulnerability in remote access software (root cause) → allows for initial attacker foothold → leads to credential theft → enables data exfiltration (impact)'</strong></p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>This dashboard visualizes both:</p>
                                        <ul className="list-disc list-inside mt-1 space-y-1 pl-2">
                                            <li>The <strong>Causal Inference Tree</strong> below maps these direct, actionable pathways, allowing you to trace a potential impact back to its source.</li>
                                            <li>The <strong>Direct Risk Relationships</strong> panel shows correlations and amplifiers, providing a complete picture of how risks interact within the ecosystem.</li>
                                        </ul>
                                        <p className="mt-2">By understanding both, we can allocate resources to controls that disrupt the causal chain at its most critical points, delivering the highest possible risk reduction.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg bg-gray-50/50 max-h-[600px] overflow-y-auto">
                                <CausalInferenceTree strategicRisks={strategicRisks} onRiskClick={setSelectedRiskId} />
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                         {selectedRisk ? (
                            <DirectRelationships 
                                selectedRisk={selectedRisk} 
                                allRisks={Array.from(riskMap.values())}
                                onRiskClick={setSelectedRiskId} 
                            />
                        ) : (
                            <Card className="h-full flex flex-col items-center justify-center text-center">
                                <LinkIcon className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-md font-semibold text-gray-700">Direct Relationships</h3>
                                <p className="text-sm text-gray-500">Select a risk to see its direct correlations and amplifiers.</p>
                            </Card>
                        )}
                    </div>
                </div>

            </div>
            
            <ArtifactDetailModal
                artifact={selectedArtifact}
                allArtifacts={AUDIT_ARTIFACTS || []}
                onSelectArtifact={setSelectedArtifactId}
                onClose={() => setSelectedArtifactId(null)}
            />
            <ControlDetailModal
                control={selectedControl}
                onClose={() => setSelectedControl(null)}
                onArtifactClick={handleArtifactClick}
            />
        </>
    );
};

export default RiskUniverseTab;