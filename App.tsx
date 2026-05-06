import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { 
    TABS,
    COMPLIANCE_STATUS,
    KRIS,
    PCI_CONTROLS,
    SOC2_CRITERIA,
    VENDORS,
    SIEM_KPIS,
    NOTABLE_EVENTS,
    AUDIT_ARTIFACTS,
    PCI_DSS_V4_CHECKLIST_DATA,
    PCI_ISO_MAPPING,
    UNIFIED_EVIDENCE_DATA,
    FLEET_DATA,
    RISK_UNIVERSE_DATA,
    INTERNAL_CONTROLS_DATA,
    REGIONAL_CHECKLISTS_DATA
} from './data';
import { TabId } from './types';
import { TabButton } from './components/common';
import OverviewTab from './components/Overview';
import RegionalTab from './components/Regional';
import AuditArtifactsTab from './components/TechStack';
import IncidentTab from './components/Incident';
import PciDeepDiveTab from './components/PciDeepDive';
import Blueprint from './components/Blueprint';
import Soc2Tab from './components/Soc2';
import ThreePRMTab from './components/ThreePRM';
import SiemSoarTab from './components/SiemSoar';
import KriDashboardTab from './components/KriDashboard';
import LandingPage from './components/LandingPage';
import ProjectInfoTab from './components/ProjectInfoTab';
import FleetInsightsTab from './components/FleetInsights';
import RiskUniverseTab from './components/RiskUniverse';
import InternalControlsTab from './components/InternalControls';

const PRIMARY_TABS = new Set([TabId.Overview, TabId.RiskUniverse, TabId.InternalControls, TabId.TechStack]);

const Header = () => (
  <header className="mb-8 p-6 bg-slate-900 rounded-xl shadow-lg border border-slate-700">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-slate-100 font-title tracking-wider">
        APAC Compliance Framework
      </h1>
      <p className="text-slate-400 mt-1">
        Company X Security, Risk & Compliance Dashboard
      </p>
    </div>
  </header>
);

const Footer = () => (
  <footer className="mt-12 text-center text-gray-500 text-sm space-y-2">
    <p>Built for Company X Security, Risk & Compliance Officer (APAC) Position</p>
    <p>IT GRC Lab for Regulatory Deltas in PCI DSS v4.0.1, ISO 27001, SOC 2, and APAC regulatory frameworks</p>
    <div className="pt-4 mt-4 border-t border-gray-200">
        <p>© 2025 rudyprasetiya.com. All Rights Reserved.</p>
        <p className="text-xs text-gray-400 mt-1">This dashboard is for demonstration purposes only and does not process personal information.</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(TabId.Overview);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Consolidate all data for the AI assistant
  const allData = {
      complianceStatus: COMPLIANCE_STATUS,
      kris: KRIS,
      pciControls: PCI_CONTROLS,
      soc2Criteria: SOC2_CRITERIA,
      vendors: VENDORS,
      siemKpis: SIEM_KPIS,
      notableEvents: NOTABLE_EVENTS,
      auditArtifacts: AUDIT_ARTIFACTS,
      pciDssChecklist: PCI_DSS_V4_CHECKLIST_DATA,
      pciIsoMapping: PCI_ISO_MAPPING,
      unifiedEvidence: UNIFIED_EVIDENCE_DATA,
      regionalChecklists: REGIONAL_CHECKLISTS_DATA,
      fleetData: FLEET_DATA,
      riskUniverse: RISK_UNIVERSE_DATA,
      internalControls: INTERNAL_CONTROLS_DATA,
  };

  // Set sidebar to be closed by default on mobile and open on desktop.
  useEffect(() => {
    const checkSize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', checkSize);
    checkSize(); // initial check
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case TabId.Overview:
        return <OverviewTab />;
      case TabId.RiskUniverse:
        return <RiskUniverseTab />;
      case TabId.InternalControls:
        return <InternalControlsTab />;
      case TabId.KriDashboard:
        return <KriDashboardTab />;
      case TabId.Regional:
        return <RegionalTab />;
      case TabId.Soc2:
        return <Soc2Tab />;
      case TabId.SiemSoar:
        return <SiemSoarTab />;
      case TabId.ThreePRM:
        return <ThreePRMTab />;
      case TabId.TechStack:
        return <AuditArtifactsTab />;
      case TabId.Incident:
        return <IncidentTab />;
      case TabId.PciDeepDive:
        return <PciDeepDiveTab />;
      case TabId.FleetInsights:
        return <FleetInsightsTab />;
      case TabId.ProjectInfo:
        return <ProjectInfoTab />;
      default:
        return <OverviewTab />;
    }
  };
  
  if (!showDashboard) {
    return <LandingPage onEnter={() => setShowDashboard(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Blueprint isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-40 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 shadow-lg border border-gray-200 hover:bg-gray-100 transition-all lg:hidden"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Header />

          <nav className="mb-8 flex flex-wrap justify-center items-center gap-2 md:gap-3 p-2 bg-white/70 backdrop-blur-lg sticky top-2 z-20 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors hidden lg:block"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {TABS.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                isPrimary={PRIMARY_TABS.has(tab.id)}
              />
            ))}
          </nav>

          <main className="max-w-7xl mx-auto">
            {renderContent()}
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
