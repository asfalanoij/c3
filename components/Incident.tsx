import React, { useState } from 'react';
import {
    AlertTriangle, Bell, FileText, Bot, Terminal, Shield, Phone, Siren, Users,
    UserCog, Briefcase, LandPlot, Timer, LocateFixed, GitCommit, FileClock, Gauge, BrainCircuit,
    Database, Server, Network, Fingerprint, HardDrive, BookOpen, CheckSquare, ShieldCheck, ChevronDown, Check,
} from 'lucide-react';
import { Card, CardTitle, Modal, CodeBlock } from './common';
import {
    PLAYBOOK_DATA,
    CALL_TREE_DATA,
    INCIDENT_METRICS,
    SEVERITY_DEFINITIONS,
    FRAMEWORK_ALIGNMENTS,
    DFIR_ARTIFACTS
} from '../data';
import type { CallTreeNode as CallTreeNodeType, FrameworkAlignment, DfirArtifact } from '../types';

const CallTreeNode: React.FC<{ node: CallTreeNodeType, level: number }> = ({ node, level }) => (
    <div className={`relative ${level > 0 ? 'pl-8' : ''}`}>
        {level > 0 && <div className="absolute left-3 top-4 h-full border-l-2 border-gray-300"></div>}
        <div className="relative flex items-start mb-4">
            <div className="absolute -left-0 -top-0 flex items-center">
                 {level > 0 && <div className="w-3 h-px bg-gray-300"></div>}
                 <div className={`z-10 flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center`}>
                    <node.icon className="w-3.5 h-3.5 text-gray-600" />
                </div>
            </div>
            <div className="ml-9 w-full">
                <div className="font-bold text-gray-800 text-sm">{node.role}</div>
                {node.contact && <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block my-1">{node.contact}</div>}
                <ul className="mt-1 space-y-1">
                    {node.triggers.map((trigger, i) => (
                        <li key={i} className="flex items-start text-xs text-gray-600">
                            <Check className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{trigger}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        {node.children && (
            <div className="mt-4">
                {node.children.map((child, i) => <CallTreeNode key={i} node={child} level={level + 1} />)}
            </div>
        )}
    </div>
);

const FrameworkAlignmentItem: React.FC<{ item: FrameworkAlignment }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-left"
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3 text-indigo-600" />
                    <span className="font-semibold text-gray-800">{item.framework}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-200 animate-fadeIn space-y-2">
                    {item.clauses.map(clause => (
                        <div key={clause.id} className="pt-2">
                            <div className="font-semibold text-gray-700 text-sm">{clause.id}</div>
                            <p className="text-gray-600 text-xs">{clause.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const DfirArtifactItem: React.FC<{ item: DfirArtifact }> = ({ item }) => (
    <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg">
        <item.icon className="w-6 h-6 mr-4 text-teal-600 mt-1 flex-shrink-0" />
        <div>
            <div className="font-semibold text-gray-800 flex items-center">
                {item.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${item.volatility === 'Volatile' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                    {item.volatility}
                </span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
        </div>
    </div>
)


const IncidentTab: React.FC = () => {
  const [modalData, setModalData] = useState<{ title: string; description: string; code: string } | null>(null);

  const handleCardClick = (playbookKey: string) => {
    setModalData(PLAYBOOK_DATA[playbookKey]);
  };
    
  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
          <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
            Incident Response & Regulatory Reporting
          </h3>
          <p className="text-gray-600">
            Multi-jurisdictional incident management with automated compliance reporting, aligned with CISSP, CRISC, and DFIR best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardTitle icon={Gauge} iconColorClass="text-blue-600">Key Performance Metrics</CardTitle>
                <div className="space-y-4">
                    {INCIDENT_METRICS.map(metric => (
                        <div key={metric.acronym} className="flex items-start">
                            <metric.icon className="w-7 h-7 mr-4 text-blue-500 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-800">{metric.name} ({metric.acronym})</div>
                                <p className="text-sm text-gray-600">{metric.description}</p>
                                <p className="text-xs font-semibold text-blue-700 bg-blue-100 inline-block px-2 py-0.5 rounded-full mt-1">Target: {metric.target}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
             <Card>
                <CardTitle icon={AlertTriangle} iconColorClass="text-red-600">Severity Level Definitions</CardTitle>
                <div className="space-y-3">
                    {SEVERITY_DEFINITIONS.map(sev => {
                        const colors = {
                            Critical: 'border-red-500 bg-red-50',
                            High: 'border-orange-500 bg-orange-50',
                            Medium: 'border-yellow-500 bg-yellow-50',
                            Low: 'border-blue-500 bg-blue-50',
                        }
                        return (
                            <div key={sev.level} className={`p-3 border-l-4 rounded-r-lg ${colors[sev.level]}`}>
                                <div className="font-bold text-gray-800">{sev.level}: <span className="font-medium">{sev.impact}</span></div>
                                <p className="text-sm text-gray-600 mt-1"><strong>Examples:</strong> {sev.examples}</p>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <Card>
                    <CardTitle icon={Users} iconColorClass="text-green-600">Incident Response Call Tree</CardTitle>
                    <CallTreeNode node={CALL_TREE_DATA} level={0} />
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardTitle icon={Bell} iconColorClass="text-orange-600">Notification Timelines (APAC)</CardTitle>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex justify-between items-center">
                        <span className="font-medium text-red-800">Singapore (MAS)</span>
                        <span className="text-sm font-semibold text-red-800">1 hour</span>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex justify-between items-center">
                        <span className="font-medium text-orange-800">India (CERT-IN)</span>
                        <span className="text-sm font-semibold text-orange-800">6 hours</span>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex justify-between items-center">
                        <span className="font-medium text-yellow-800">Australia (APRA)</span>
                        <span className="text-sm font-semibold text-yellow-800">72 hours</span>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
                        <span className="font-medium text-blue-800">Indonesia (UU PDP)</span>
                        <span className="text-sm font-semibold text-blue-800">72 hours</span>
                      </div>
                    </div>
                </Card>
                 <Card>
                    <CardTitle icon={CheckSquare} iconColorClass="text-indigo-600">Framework Alignment</CardTitle>
                    <div className="space-y-2">
                        {FRAMEWORK_ALIGNMENTS.map(item => <FrameworkAlignmentItem key={item.framework} item={item} />)}
                    </div>
                </Card>
            </div>
        </div>

        <Card>
            <CardTitle icon={HardDrive} iconColorClass="text-teal-600">Digital Forensics & Evidence Collection (DFIR)</CardTitle>
            <p className="text-sm text-gray-600 mb-4 -mt-2">Key artifacts to be collected following the principle of "Order of Volatility". Chain of custody must be maintained for all evidence.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DFIR_ARTIFACTS.map(artifact => <DfirArtifactItem key={artifact.name} item={artifact} />)}
            </div>
        </Card>

        <Card>
          <CardTitle icon={FileText} iconColorClass="text-indigo-600">Automated Playbooks & Templates</CardTitle>
          <p className="text-sm text-gray-600 mb-4 -mt-2">Click on a card to view the simplified SOAR playbook.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card onClick={() => handleCardClick('breach')} className="p-0 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 h-full">
                <h5 className="font-semibold text-indigo-800 mb-2 flex items-center"><Shield className="w-4 h-4 mr-2"/>Payment Data Breach</h5>
                <ul className="text-sm text-indigo-700 list-disc list-inside space-y-1">
                  <li>Card data scope assessment</li>
                  <li>Forensic evidence collection</li>
                  <li>Acquirer notification</li>
                </ul>
              </div>
            </Card>
            <Card onClick={() => handleCardClick('terminal')} className="p-0 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 h-full">
                <h5 className="font-semibold text-purple-800 mb-2 flex items-center"><Terminal className="w-4 h-4 mr-2"/>Terminal Compromise</h5>
                <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                  <li>Remote disable/isolation</li>
                  <li>Key revocation (RKI)</li>
                  <li>Firmware rollback</li>
                </ul>
              </div>
            </Card>
            <Card onClick={() => handleCardClick('notice')} className="p-0 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200 h-full">
                <h5 className="font-semibold text-teal-800 mb-2 flex items-center"><Bot className="w-4 h-4 mr-2"/>Regulatory Notice</h5>
                <ul className="text-sm text-teal-700 list-disc list-inside space-y-1">
                  <li>Multi-jurisdiction templates</li>
                  <li>Timeline automation</li>
                  <li>Status tracking</li>
                </ul>
              </div>
            </Card>
          </div>
        </Card>
      </div>
      
      <Modal isOpen={!!modalData} onClose={() => setModalData(null)} title={modalData?.title || ''}>
        {modalData && (
            <div>
                <p className="text-gray-600">{modalData.description}</p>
                <CodeBlock content={modalData.code} />
            </div>
        )}
      </Modal>
    </>
  );
};

export default IncidentTab;