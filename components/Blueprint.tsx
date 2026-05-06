import React, { useState, useEffect } from 'react';
import { LayoutGrid, X, ChevronDown, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { BLUEPRINT_DATA } from '../data';
import type { BlueprintNode as BlueprintNodeType } from '../types';
import { Modal, CodeBlock } from './common';

const getAllNodeKeys = (nodes: BlueprintNodeType[]): string[] => {
    let keys: string[] = [];
    nodes.forEach(node => {
        keys.push(node.name);
        if (node.children) {
            keys = keys.concat(getAllNodeKeys(node.children));
        }
    });
    return keys;
};

interface BlueprintNodeProps {
    node: BlueprintNodeType;
    level: number;
    onNodeClick: (content: BlueprintNodeType['modalContent']) => void;
    expandedNodes: Set<string>;
    setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const BlueprintNode: React.FC<BlueprintNodeProps> = ({ node, level, onNodeClick, expandedNodes, setExpandedNodes }) => {
  const { name, icon: Icon, children, modalContent, color } = node;
  const isOpen = expandedNodes.has(name);
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      const newExpandedNodes = new Set(expandedNodes);
      if (newExpandedNodes.has(name)) {
        newExpandedNodes.delete(name);
      } else {
        newExpandedNodes.add(name);
      }
      setExpandedNodes(newExpandedNodes);
    } else if (modalContent) {
      onNodeClick(modalContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const isClickable = hasChildren || !!modalContent;

  return (
    <li style={{ paddingLeft: `${level > 0 ? 1 : 0}rem` }}>
      <div
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : -1}
        aria-expanded={hasChildren ? isOpen : undefined}
        className={`flex items-center justify-between py-2 pr-2 rounded-md transition-colors w-full text-left ${
          isClickable ? 'hover:bg-slate-800 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-indigo-500' : ''
        }`}
      >
        <div className="flex items-center overflow-hidden">
          <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${color || 'text-slate-400'}`} />
          <span className="font-medium text-slate-200 text-sm truncate">{name}</span>
        </div>
        {hasChildren && (
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ml-2 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>
      {isOpen && hasChildren && (
        <ul className={`pl-4 border-l-2 border-slate-700 ml-2.5 animate-fadeIn`}>
          {children.map((child, index) => (
            <BlueprintNode 
                key={child.name + index} 
                node={child} 
                level={level + 1} 
                onNodeClick={onNodeClick}
                expandedNodes={expandedNodes}
                setExpandedNodes={setExpandedNodes}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

interface BlueprintProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Blueprint: React.FC<BlueprintProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [modalContent, setModalContent] = useState<BlueprintNodeType['modalContent'] | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(BLUEPRINT_DATA.children?.map(node => node.name) || [])
  );
  
  const allNodeKeys = getAllNodeKeys(BLUEPRINT_DATA.children || []);

  const expandAll = () => setExpandedNodes(new Set(allNodeKeys));
  const collapseAll = () => setExpandedNodes(new Set());

  const handleNodeClick = (content: BlueprintNodeType['modalContent']) => {
      setModalContent(content);
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
          className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
      ></div>

      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-700 z-40 transition-transform duration-300 ease-in-out w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-slate-700">
                 <div className="flex items-center">
                    <LayoutGrid className="w-6 h-6 mr-3 text-teal-400" />
                    <h2 className="font-bold text-lg text-slate-100">Application Blueprint</h2>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-800 lg:hidden"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>
            <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Controls</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={expandAll} className="flex-1 text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md flex items-center justify-center transition-colors">
                        <ChevronsRight className="w-4 h-4 mr-1" /> Expand All
                    </button>
                    <button onClick={collapseAll} className="flex-1 text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md flex items-center justify-center transition-colors">
                        <ChevronsLeft className="w-4 h-4 mr-1" /> Collapse All
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                 <ul className="space-y-1">
                    {BLUEPRINT_DATA.children?.map((node, index) => (
                        <BlueprintNode 
                            key={node.name + index} 
                            node={node} 
                            level={0} 
                            onNodeClick={handleNodeClick}
                            expandedNodes={expandedNodes}
                            setExpandedNodes={setExpandedNodes} 
                        />
                    ))}
                </ul>
            </div>
        </div>
      </aside>

      <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
        {modalContent && (
            <div>
                <p className="text-gray-600">{modalContent.description}</p>
                {modalContent.code && (
                    <CodeBlock content={modalContent.code.content} />
                )}
            </div>
        )}
      </Modal>
    </>
  );
};

export default Blueprint;