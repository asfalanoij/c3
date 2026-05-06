import React, { useState, useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Copy, Check, X as XIcon, Info, ChevronRight, CheckSquare, AlertTriangle, X, ShieldCheck, BookOpen, ClipboardCheck } from 'lucide-react';
import type { ControlStatus, Priority, RiskScoring, RiskLevel, InternalControl, AuditArtifact, ControlStatusState } from '../types';

interface TabButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: (id: string) => void;
  isPrimary?: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, active, onClick, isPrimary = false }) => {
  const baseClasses = 'flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const standardActive = 'bg-blue-50 text-blue-600';
  const standardInactive = 'text-gray-500 hover:bg-gray-100 hover:text-gray-800';
  const standardFocus = 'focus-visible:ring-blue-500';

  const primaryActive = 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 shadow-sm';
  const primaryInactive = 'text-gray-800 bg-white hover:bg-indigo-50 border border-gray-300 hover:border-indigo-400';
  const primaryFocus = 'focus-visible:ring-indigo-500';

  const activeClasses = isPrimary ? primaryActive : standardActive;
  const inactiveClasses = isPrimary ? primaryInactive : standardInactive;
  const focusClasses = isPrimary ? primaryFocus : standardFocus;

  return (
    <button
      onClick={() => onClick(id)}
      className={`${baseClasses} ${focusClasses} ${
        active ? activeClasses : inactiveClasses
      }`}
      aria-pressed={active}
    >
      <Icon className="w-4 h-4 mr-2" />
      <span className="font-semibold">{label}</span>
    </button>
  );
};

interface StatusBadgeProps {
  status: ControlStatus | 'implemented' | 'planned';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<ControlStatus | 'implemented' | 'planned', string> = {
    complete: 'bg-green-50 text-green-700',
    'in-progress': 'bg-yellow-50 text-yellow-800',
    remediation: 'bg-red-50 text-red-700',
    implemented: 'bg-green-50 text-green-700',
    planned: 'bg-blue-50 text-blue-700'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles: Record<Priority, string> = {
    critical: 'bg-red-50 text-red-700',
    high: 'bg-orange-50 text-orange-700',
    medium: 'bg-gray-100 text-gray-700'
  };

  return (
     <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-white p-4 sm:p-6 rounded-xl shadow-[var(--card-shadow)] border-[var(--card-border)] transition-shadow duration-300 ${onClick ? 'cursor-pointer hover:shadow-[var(--card-shadow-hover)]' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColorClass?: string;
  onClick?: () => void;
  isActive?: boolean;
  activeColorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColorClass = "text-gray-500", onClick, isActive, activeColorClass = "border-blue-500" }) => (
  <Card
    onClick={onClick}
    className={`text-center ${onClick ? 'hover:-translate-y-1' : ''} ${isActive ? `border-2 ${activeColorClass}` : ''}`}
  >
    <Icon className={`mx-auto w-8 h-8 mb-2 ${iconColorClass}`} />
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{title}</p>
  </Card>
);


interface CardTitleProps {
    icon: LucideIcon;
    children: React.ReactNode;
    iconColorClass?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({icon: Icon, children, iconColorClass = "text-blue-500"}) => (
    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <Icon className={`w-5 h-5 mr-3 ${iconColorClass}`} />
        {children}
    </h3>
);

interface IconButtonProps {
  icon: LucideIcon;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, onClick, label, className = '' }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 ${className}`}
  >
    <Icon className="w-4 h-4" />
  </button>
);


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = '2xl' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    'md': 'max-w-md', 'lg': 'max-w-lg', 'xl': 'max-w-xl', '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl', '4xl': 'max-w-4xl', '5xl': 'max-w-5xl', '6xl': 'max-w-6xl', '7xl': 'max-w-7xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col modal-content`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h2>
          <IconButton icon={XIcon} onClick={onClose} label="Close modal" className="text-gray-500 hover:bg-gray-100 hover:text-gray-800" />
        </header>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};


interface CodeBlockProps {
    content: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ content }) => {
    return (
        <pre className="bg-slate-900 text-white rounded-lg p-4 text-sm overflow-auto mt-4">
            <code className="font-mono whitespace-pre">
                {content.trim()}
            </code>
        </pre>
    );
};

interface ClickableArtifactsProps {
  evidence: string;
  onArtifactClick: (id: string) => void;
}

export const ClickableArtifacts: React.FC<ClickableArtifactsProps> = ({ evidence, onArtifactClick }) => {
  if (!evidence) return null;

  const artifactIds = evidence.split(',').map(id => id.trim()).filter(Boolean);

  return (
    <div className="flex flex-wrap gap-1">
      {artifactIds.map(id => (
        <button
          key={id}
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click if any
            onArtifactClick(id);
          }}
          className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs font-mono rounded hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {id}
        </button>
      ))}
    </div>
  );
};

interface ClickableControlsProps {
  controlIds: string[];
  onControlClick: (id: string) => void;
}

export const ClickableControls: React.FC<ClickableControlsProps> = ({ controlIds, onControlClick }) => {
    if (!controlIds || controlIds.length === 0) return <span>-</span>;
    
    return (
        <div className="flex flex-wrap gap-1">
            {controlIds.map(id => (
                 <button
                    key={id}
                    onClick={(e) => {
                        e.stopPropagation();
                        onControlClick(id);
                    }}
                    className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-mono rounded hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    {id}
                </button>
            ))}
        </div>
    );
};

export const getRiskScore = (scoring: RiskScoring): number => {
  if (!scoring) return 0;
  return scoring.impact * scoring.likelihood;
};

export const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 15) return 'Critical';
    if (score >= 10) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
};

interface RiskLevelBadgeProps {
  level: RiskLevel;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({ level }) => {
  const styles: Record<RiskLevel, string> = {
    Critical: 'bg-red-50 text-red-700',
    High: 'bg-orange-50 text-orange-700',
    Medium: 'bg-yellow-50 text-yellow-800',
    Low: 'bg-green-50 text-green-700',
  };
  
  return (
     <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
  );
};

export const RiskScoreBubble: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 15) return 'bg-red-500 text-white';
    if (score >= 10) return 'bg-orange-500 text-white';
    if (score >= 5) return 'bg-yellow-400 text-gray-800';
    return 'bg-green-500 text-white';
  };
  return (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${getColor()}`}>
      {score}
    </div>
  );
};

export const ControlStatusStateBadge: React.FC<{ status: ControlStatusState }> = ({ status }) => {
    const styles: Record<ControlStatusState, string> = {
        'Design Effective': 'bg-blue-100 text-blue-800',
        'Operating Effectively': 'bg-green-100 text-green-800',
        'Needs Improvement': 'bg-yellow-100 text-yellow-800',
        'Not Tested': 'bg-gray-100 text-gray-800',
    };
    const icons: Record<ControlStatusState, React.ElementType> = {
        'Design Effective': CheckSquare,
        'Operating Effectively': Check,
        'Needs Improvement': AlertTriangle,
        'Not Tested': X,
    };
    const Icon = icons[status];
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            <Icon className="w-3.5 h-3.5 mr-1.5" />
            {status}
        </span>
    );
};

export const ControlDetailModal: React.FC<{
    control: InternalControl | null;
    onClose: () => void;
    onArtifactClick: (id: string) => void;
}> = ({ control, onClose, onArtifactClick }) => {
    if (!control) return null;

    return (
        <Modal isOpen={!!control} onClose={onClose} title="Internal Control Details">
            <div className="space-y-6">
                 <div>
                    <p className="text-xs text-gray-500 font-mono">{control.id}</p>
                    <h3 className="text-lg font-bold text-gray-800">{control.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><span className="font-semibold text-gray-700">Domain:</span><br/>{control.domain}</div>
                    <div><span className="font-semibold text-gray-700">Type:</span><br/>{control.type}</div>
                    <div className="col-span-2"><span className="font-semibold text-gray-700">Status:</span><br/><ControlStatusStateBadge status={control.status} /></div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Description</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{control.description}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Testing Information</h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-gray-50 rounded-lg border">
                        <div><p className="font-medium text-gray-500">Frequency</p><p className="font-semibold text-gray-800">{control.testFrequency}</p></div>
                        <div><p className="font-medium text-gray-500">Last Tested</p><p className="font-semibold text-gray-800">{control.lastTested}</p></div>
                        <div><p className="font-medium text-gray-500">Next Due</p><p className="font-semibold text-gray-800">{control.nextTestDue}</p></div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Framework Mappings</h4>
                    <div className="space-y-3">
                        {control.mappings.pci.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start">
                                <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-blue-800">PCI DSS v4.0.1</h5>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {control.mappings.pci.map(m => (
                                            <span key={m} className="px-2.5 py-1 text-xs font-medium rounded-full bg-white border border-blue-200 text-blue-800">
                                                Req. {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {control.mappings.iso27001.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-start">
                                <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                                    <BookOpen className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-green-800">ISO 27001:2022</h5>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {control.mappings.iso27001.map(m => (
                                            <span key={m} className="px-2.5 py-1 text-xs font-medium rounded-full bg-white border border-green-200 text-green-800">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {control.mappings.soc2.length > 0 && (
                             <div className="p-4 bg-teal-50 rounded-lg border border-teal-200 flex items-start">
                                <div className="mr-4 mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-teal-100">
                                    <ClipboardCheck className="w-5 h-5 text-teal-700" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-teal-800">SOC 2</h5>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {control.mappings.soc2.map(m => (
                                            <span key={m} className="px-2.5 py-1 text-xs font-medium rounded-full bg-white border border-teal-200 text-teal-800">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {control.mappings.pci.length === 0 && control.mappings.iso27001.length === 0 && control.mappings.soc2.length === 0 && (
                             <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md border">No framework mappings defined for this control.</p>
                        )}
                    </div>
                </div>

                 <div>
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Linked Evidence (Audit Artifacts)</h4>
                    <ClickableArtifacts evidence={control.linkedArtifacts.join(', ')} onArtifactClick={onArtifactClick} />
                </div>

            </div>
        </Modal>
    );
};