import { Tab, TabId } from '../types';
import { Shield, Globe, AlertTriangle, BookOpen, ClipboardCheck, BarChartHorizontal, FolderCheck, Handshake, Activity, Info, TerminalSquare, Library, ClipboardList } from 'lucide-react';

export const TABS: Tab[] = [
    { id: TabId.Overview, label: 'Overview', icon: Shield },
    { id: TabId.RiskUniverse, label: 'Risk Universe', icon: Library },
    { id: TabId.InternalControls, label: 'Internal Controls', icon: ClipboardList },
    { id: TabId.KriDashboard, label: 'KRI Dashboard', icon: Activity },
    { id: TabId.PciDeepDive, label: 'PCI DSS v.4.0.1', icon: BookOpen },
    { id: TabId.FleetInsights, label: 'Fleet Risk & Opportunity', icon: TerminalSquare },
    { id: TabId.Regional, label: 'Regional Compliance', icon: Globe },
    { id: TabId.Soc2, label: 'SOC 2', icon: ClipboardCheck },
    { id: TabId.SiemSoar, label: 'SIEM/SOAR', icon: BarChartHorizontal },
    { id: TabId.ThreePRM, label: '3PRM', icon: Handshake },
    { id: TabId.TechStack, label: 'Audit Artifacts', icon: FolderCheck },
    { id: TabId.Incident, label: 'Incident Response', icon: AlertTriangle },
    { id: TabId.ProjectInfo, label: 'Project Vision', icon: Info },
];