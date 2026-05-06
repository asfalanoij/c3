import React from 'react';
import DOMPurify from 'dompurify';
import { Card, CardTitle, CodeBlock } from './common';
import { BookMarked, Package, Rocket, Info, FolderTree, ShieldCheck } from 'lucide-react';
import { README_CONTENT, DEPENDENCIES_CONTENT, MVP_VISION, PROJECT_STRUCTURE_CONTENT, IP_NOTICE_CONTENT } from '../data';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Process inline markdown (bold)
    const renderInline = (text: string) => {
        const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return { __html: DOMPurify.sanitize(html) };
    };

    const blocks = content.trim().split(/\n\s*\n/); // Split into paragraphs/blocks

    const elements = blocks.map((block, blockIndex) => {
        const lines = block.split('\n');

        // Heading
        if (lines.length === 1 && lines[0].startsWith('### ')) {
            return <h3 key={blockIndex} className="text-base font-semibold text-gray-800 mt-4 mb-2" dangerouslySetInnerHTML={renderInline(lines[0].substring(4))} />;
        }
        
        // Bolded title paragraph
        if (lines.length === 1 && lines[0].startsWith('**') && lines[0].endsWith('**')) {
             return <p key={blockIndex} className="font-semibold text-gray-700 mt-3" dangerouslySetInnerHTML={renderInline(lines[0].substring(2, lines[0].length - 2))} />;
        }

        // List
        const isList = lines.every(line => line.trim().startsWith('* '));
        if (isList) {
            return (
                <ul key={blockIndex} className="list-disc pl-5 mt-2 space-y-1">
                    {lines.map((line, lineIndex) => (
                        <li key={lineIndex} dangerouslySetInnerHTML={renderInline(line.substring(line.indexOf('* ') + 2))} />
                    ))}
                </ul>
            );
        }

        // Default paragraph, preserving line breaks
        return <p key={blockIndex} dangerouslySetInnerHTML={renderInline(block.replace(/\n/g, '<br />'))} />;
    });

    return <div className="prose prose-sm max-w-none text-gray-600">{elements}</div>;
};

const ProjectInfoTab: React.FC = () => {
    return (
        <div className="space-y-6 animate-fadeIn">
             <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                    <Info className="w-6 h-6 mr-3 text-gray-600" />
                    Project Vision & Blueprint
                </h3>
                <p className="text-gray-600">
                    This section provides an overview of the GRC Dashboard's purpose, technical foundation, and its strategic vision as a product champion within Company X.
                </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Card className="h-full">
                        <CardTitle icon={BookMarked} iconColorClass="text-blue-600">README.md</CardTitle>
                        <MarkdownRenderer content={README_CONTENT} />
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardTitle icon={FolderTree} iconColorClass="text-teal-600">Project Structure</CardTitle>
                         <p className="text-sm text-gray-600 mb-4">
                            The project follows a flat, feature-oriented structure with clear separation between components and data artifacts.
                        </p>
                        <CodeBlock content={PROJECT_STRUCTURE_CONTENT} />
                    </Card>
                     <Card>
                        <CardTitle icon={Package} iconColorClass="text-green-600">Key Dependencies</CardTitle>
                        <p className="text-sm text-gray-600 mb-4">
                            This project is built as a modern, dependency-free single-page application using ES modules and an import map.
                        </p>
                        <CodeBlock content={DEPENDENCIES_CONTENT} />
                    </Card>
                </div>
            </div>

             <Card>
                <CardTitle icon={Rocket} iconColorClass="text-purple-600">MVP Vision: The Company X Trust Center</CardTitle>
                <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                    <h3 className="text-lg font-bold text-purple-800">{MVP_VISION.productName}</h3>
                    <p className="text-base italic">"{MVP_VISION.vision}"</p>
                    
                    <div>
                        <h4 className="font-semibold text-gray-800">Target Audience</h4>
                        <ul className="list-disc list-inside">
                            {MVP_VISION.targetAudience.map(audience => <li key={audience}>{audience}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-800">Value Proposition</h4>
                        <p>{MVP_VISION.valueProposition}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Key MVP Features</h4>
                         <ol className="list-decimal list-inside space-y-2">
                            {MVP_VISION.mvpFeatures.map(feature => (
                                <li key={feature.title}>
                                    <strong className="text-gray-700">{feature.title}:</strong> {feature.description}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </Card>
            
            <Card>
                <CardTitle icon={ShieldCheck} iconColorClass="text-gray-700">Intellectual Property Notice</CardTitle>
                <div className="prose prose-sm max-w-none text-gray-600">
                    <MarkdownRenderer content={IP_NOTICE_CONTENT} />
                </div>
            </Card>
        </div>
    );
};

export default ProjectInfoTab;