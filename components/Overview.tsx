import React, { useState } from 'react';
import { Shield, Activity, CheckCircle, Globe, ClipboardCheck, Download, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { COMPLIANCE_STATUS, KRIS, PCI_CONTROLS, SOC2_CRITERIA, REGIONAL_CHECKLISTS_DATA } from '../data';
import { Card, CardTitle, StatusBadge, PriorityBadge } from './common';
import type { KRI } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ComplianceStatusCard: React.FC<{ framework: string; data: typeof COMPLIANCE_STATUS[string] }> = ({ framework, data }) => (
  <Card>
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-700 text-sm">{framework}</h3>
      <Shield className="w-5 h-5 text-blue-500" />
    </div>
    <div className="mb-2">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Progress</span>
        <span className="font-medium">{data.status}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${data.status}%` }}
        ></div>
      </div>
    </div>
    <div className="text-xs text-gray-600">
      <span className="text-red-500 font-semibold">{data.critical}</span> critical / {data.total} total
    </div>
  </Card>
);

const KriItem: React.FC<{ kri: KRI }> = ({ kri }) => {
    const trendInfo = {
        up: { icon: TrendingUp, color: 'text-green-600' },
        down: { icon: TrendingDown, color: 'text-red-600' },
        stable: { icon: Minus, color: 'text-gray-600' }
    };
    const statusColor = {
        good: 'text-green-600',
        warning: 'text-yellow-600',
        critical: 'text-red-600'
    };
     const statusBgColor = {
        good: 'bg-green-100',
        warning: 'bg-yellow-100',
        critical: 'bg-red-100'
    };

    const TrendIcon = trendInfo[kri.trend].icon;

    return (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-4 ${statusBgColor[kri.status]}`}>
                    <kri.icon className={`w-5 h-5 ${statusColor[kri.status]}`} />
                </div>
                <div>
                    <div className="font-semibold text-gray-800 text-sm">{kri.name}</div>
                    <div className={`text-xs font-medium ${statusColor[kri.status]}`}>
                        {kri.status.charAt(0).toUpperCase() + kri.status.slice(1)}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{kri.value}</div>
                <div className={`text-xs flex items-center justify-end ${trendInfo[kri.trend].color}`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{kri.trend}</span>
                </div>
            </div>
        </div>
    );
};

const ExecutiveReportCard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const generatePdf = () => {
        setIsLoading(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const now = new Date();
            
            // Header
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Company X APAC', 15, 20);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Executive Compliance Summary', 15, 27);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(`Generated on: ${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 15, 25, { align: 'right' });
            doc.setDrawColor(220);
            doc.line(15, 32, pageWidth - 15, 32);

            let currentY = 45;

            // Section: Overall Compliance Posture
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(50);
            doc.text('Overall Compliance Posture', 15, currentY);
            currentY += 8;

            Object.entries(COMPLIANCE_STATUS).forEach(([framework, data]) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(framework, 18, currentY);
                doc.text(`${data.status}%`, pageWidth - 18, currentY, { align: 'right' });
                
                doc.setFillColor(230, 230, 230);
                doc.rect(18, currentY + 2, pageWidth - 36, 4, 'F');
                doc.setFillColor(79, 70, 229);
                doc.rect(18, currentY + 2, (pageWidth - 36) * (data.status / 100), 4, 'F');
                currentY += 12;
            });
            
            doc.setDrawColor(240);
            doc.line(15, currentY, pageWidth - 15, currentY);
            currentY += 12;

            // Section: Key Risk & Trust Indicators
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Key Risk & Trust Indicators', 15, currentY);
            currentY += 8;

            autoTable(doc, {
                startY: currentY,
                head: [['Key Risk Indicator (KRI)', 'Status'], ['SOC 2 Trust Services', 'Controls In-Place']],
                body: [
                    ...KRIS.map(k => [k.name, k.value]),
                    ['',''], // Spacer
                    ...(SOC2_CRITERIA || []).map(c => {
                        const controls = c?.controls || [];
                        const inPlace = controls.filter(ctrl => ctrl?.status === 'in-place').length;
                        return [c.name, `${inPlace} / ${controls.length}`];
                    })
                ],
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [67, 56, 202] },
                didParseCell: (data) => {
                    if (data.section === 'body') {
                        const kri = KRIS.find(k => k.name === data.cell.raw);
                        if (kri) {
                            if (kri.status === 'critical') data.cell.styles.textColor = [220, 38, 38];
                            if (kri.status === 'warning') data.cell.styles.textColor = [217, 119, 6];
                        }
                    }
                }
            });
            currentY = (doc as any).lastAutoTable.finalY + 12;
            
            // Section: Regional Hotspots
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Regional Compliance Hotspots (Items In-Progress)', 15, currentY);
            currentY += 8;
            
            const hotspots = Object.entries(REGIONAL_CHECKLISTS_DATA || {})
                .flatMap(([region, checklist]) => 
                    (checklist?.categories || []).flatMap(c => c?.items || [])
                    .filter(item => item?.status === 'In Progress')
                    .map(item => ({ region: region.toUpperCase(), requirement: item.control }))
                ).slice(0, 3);

             autoTable(doc, {
                startY: currentY,
                head: [['Region', 'Requirement Focus']],
                body: hotspots.map(h => [h.region, h.requirement]),
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [67, 56, 202] },
             });
            
            // Footer
            const footerY = pageHeight - 15;
            doc.setDrawColor(220);
            doc.line(15, footerY, pageWidth - 15, footerY);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('CONFIDENTIAL - For Internal Executive Use Only', 15, footerY + 5);
            doc.text(`Page 1 of 1`, pageWidth - 15, footerY + 5, { align: 'right' });


            doc.save('Company X_Executive_Compliance_Summary.pdf');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("An error occurred while generating the PDF.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardTitle icon={Download} iconColorClass="text-indigo-600">Executive Summary</CardTitle>
            <p className="text-gray-600 mb-4 text-sm">
                Generate a one-page, board-ready report summarizing the current compliance posture, key risks, and regional status across the APAC landscape.
            </p>
            <button
                onClick={generatePdf}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Report...
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Executive Report (PDF)
                    </>
                )}
            </button>
        </Card>
    )
}

const OverviewTab: React.FC = () => {
  // Defensive data processing to prevent crashes on load
  const soc2InProgress = (SOC2_CRITERIA || [])
    .flatMap(c => c?.controls || [])
    .filter(c => c?.status === 'needs-improvement').length;
    
  const regionalInProgress = Object.values(REGIONAL_CHECKLISTS_DATA || {})
    .flatMap(checklist => checklist?.categories || [])
    .flatMap(category => category?.items || [])
    .filter(item => item?.status === 'In Progress').length;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(COMPLIANCE_STATUS).map(([framework, data]) => (
          <ComplianceStatusCard key={framework} framework={framework} data={data} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardTitle icon={Activity} iconColorClass="text-green-500">Key Risk Indicators (KRIs)</CardTitle>
              <div className="space-y-3">
                {KRIS.map((kri) => <KriItem key={kri.name} kri={kri} />)}
              </div>
            </Card>
             <Card>
                <CardTitle icon={CheckCircle} iconColorClass="text-blue-500">PCI DSS v4.0.1 Controls Spotlight</CardTitle>
                <div className="space-y-3">
                    {PCI_CONTROLS.slice(0, 3).map((control) => (
                         <div key={control.req} className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="font-medium text-gray-800 text-sm">{control.name}</div>
                                <div className="text-xs text-gray-500 ml-2">({control.req})</div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <PriorityBadge priority={control.priority} />
                                <StatusBadge status={control.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardTitle icon={ClipboardCheck} iconColorClass="text-teal-500">SOC 2 Status</CardTitle>
                <div className="space-y-3">
                    {(SOC2_CRITERIA || []).map(c => {
                         const controls = c?.controls || [];
                         const inPlace = controls.filter(ctrl => ctrl?.status === 'in-place').length;
                         const total = controls.length;
                         const percentage = total > 0 ? Math.round((inPlace / total) * 100) : 0;
                         return (
                            <div key={c.id}>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span className="font-medium">{c.name}</span>
                                    <span>{inPlace} / {total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                         )
                    })}
                </div>
                 <div className="mt-4 text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md">
                    <strong>{soc2InProgress}</strong> controls marked for improvement.
                </div>
            </Card>
            <Card>
                <CardTitle icon={Globe} iconColorClass="text-purple-500">Regional Compliance</CardTitle>
                <p className="text-sm text-gray-600">
                    Actively managing deltas across all APAC jurisdictions.
                </p>
                <div className="mt-3 text-xs text-orange-700 bg-orange-50 p-2 rounded-md">
                    <strong>{regionalInProgress}</strong> requirements currently in-progress.
                </div>
            </Card>
            <ExecutiveReportCard />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;