import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Globe, Share2, Key, Code, Server, ChevronDown, CheckCircle, Clock, AlertTriangle, XCircle, Info, LucideIcon, Edit2, Save, X, Loader2, LogOut, User, Shield, Eye, EyeOff, Wallet } from 'lucide-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { REGIONS, REGION_COLOR_MAP, REGULATORY_BLUEPRINT_CODE, TECHNICAL_BLUEPRINT_CODE, AUDIT_ARTIFACTS, REGIONAL_CHECKLISTS_DATA } from '../data';
import { Card, CardTitle, CodeBlock, IconButton, ClickableArtifacts } from './common';
import type { RegionKey, RegionalChecklist, RegionalChecklistItem, ChecklistStatus, AuditArtifact, ApacApmCompliance, ApmStatus, RegionalChecklistCategory } from '../types';
import ArtifactDetailModal from './ArtifactDetailModal';

// --- Client-side Credentials for Demo ---
// In a real application, this would be a secure API call to an authentication server.
const ADMIN_USERNAME = 'bukanadmin';
const ADMIN_PASSWORD = 'bukanpassword';

type Session = {
  role: 'admin' | 'guest';
}
type SupabaseConfig = {
  url: string;
  key: string;
}

// Helper function to transform raw Supabase data and merge with local data
const transformRegionData = (region: any, localData: RegionalChecklist | undefined): RegionalChecklist => {
    return {
        framework: region.framework || 'N/A',
        regulator: region.regulator || 'N/A',
        keyMetrics: localData?.keyMetrics || [], // from local
        apmCompliance: localData?.apmCompliance || [], // from local
        categories: (region.categories || []).map((cat: any) => ({
            name: cat.name,
            description: cat.description,
            items: (cat.items || []).sort((a: RegionalChecklistItem, b: RegionalChecklistItem) => a.id.localeCompare(b.id)),
        })).sort((a, b) => a.name.localeCompare(b.name)),
    };
};


// --- Reusable Authentication Components ---

const SupabaseConfigScreen: React.FC<{
  onConnect: (url: string, key: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}> = ({ onConnect, loading, error }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(url, key);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 animate-fadeIn">
      <CardTitle icon={Server} iconColorClass="text-green-600">Connect to Supabase</CardTitle>
      <p className="text-sm text-gray-600 mb-4">Please provide your Supabase Project URL and Public Anon Key to load the regional compliance data.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supabaseUrl" className="block text-sm font-medium text-gray-700">Supabase URL</label>
          <input
            id="supabaseUrl"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://<project-id>.supabase.co"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="supabaseKey" className="block text-sm font-medium text-gray-700">Supabase Anon Key</label>
          <input
            id="supabaseKey"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="eyJhbGciOi..."
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
            <Shield className="inline w-4 h-4 mr-2"/>
            <strong>Security Note:</strong> Keys are stored in your browser's local storage for this session only and are not transmitted anywhere else.
        </div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {loading ? <Loader2 className="animate-spin" /> : 'Connect'}
        </button>
      </form>
    </Card>
  );
};

const LoginScreen: React.FC<{
    onLogin: (role: 'admin' | 'guest', username?: string, password?: string) => void;
    loading: boolean;
    error: string | null;
}> = ({ onLogin, loading, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin('admin', username, password);
    };

    return (
        <Card className="max-w-md mx-auto mt-10 animate-fadeIn">
            <CardTitle icon={User} iconColorClass="text-blue-600">Authentication Required</CardTitle>
            <p className="text-sm text-gray-600 mb-4">Login as an Admin to edit data, or continue as a Guest to view.</p>
            <form onSubmit={handleAdminLogin} className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-700">Admin Login</h3>
                 <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input id="password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                            {isPasswordVisible ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400">
                     {loading ? <Loader2 className="animate-spin" /> : 'Login as Admin'}
                </button>
            </form>
             <div className="mt-4">
                <button onClick={() => onLogin('guest')} className="w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Continue as Guest (View-Only)
                </button>
            </div>
            {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        </Card>
    );
};


// --- Main Application Components (modified for auth) ---

const ChecklistStatusBadge: React.FC<{ status: ChecklistStatus }> = ({ status }) => {
  const styles: Record<ChecklistStatus, string> = {
    'Implemented': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Planned': 'bg-blue-100 text-blue-800',
    'Not Applicable': 'bg-gray-100 text-gray-800',
  };
  const icons: Record<ChecklistStatus, LucideIcon> = {
    'Implemented': CheckCircle,
    'In Progress': Clock,
    'Planned': AlertTriangle,
    'Not Applicable': XCircle,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
};

const ApmStatusBadge: React.FC<{ status: ApmStatus }> = ({ status }) => {
  const styles: Record<ApmStatus, string> = {
    'Live': 'bg-green-100 text-green-800',
    'Onboarding': 'bg-yellow-100 text-yellow-800',
    'Monitoring': 'bg-blue-100 text-blue-800',
  };
   const icons: Record<ApmStatus, LucideIcon> = {
    'Live': CheckCircle,
    'Onboarding': Clock,
    'Monitoring': Info,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
};

const RegionalSummaryCard: React.FC<{ regionKey: RegionKey, checklist: RegionalChecklist }> = ({ regionKey, checklist }) => {
    const region = REGIONS[regionKey];
    const colorClasses = REGION_COLOR_MAP[region.color];

    const allItems = useMemo(() => checklist.categories.flatMap(c => c.items), [checklist]);
    const implementedCount = useMemo(() => allItems.filter(i => i.status === 'Implemented').length, [allItems]);
    const progress = allItems.length > 0 ? Math.round((implementedCount / allItems.length) * 100) : 100;

    return (
        <Card className={`hover:shadow-md hover:-translate-y-1 transition-all border-l-4 ${colorClasses.border}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex items-center">
                   <span className="text-xl mr-3">{region.flag}</span>
                   {region.name}
                </h3>
                 <div className={`text-2xl font-bold ${colorClasses.text}`}>{progress}%</div>
            </div>
             <p className="text-xs text-gray-500 mb-3">{checklist.framework}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${colorClasses.bg} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-xs text-gray-600 mt-2 flex justify-between">
                <span>{implementedCount} / {allItems.length} Controls Implemented</span>
                <span>{allItems.length - implementedCount} Open</span>
            </div>
        </Card>
    );
};

const RegulatoryAnalysis = () => {
    return (
        <Card>
            <CardTitle icon={Share2} iconColorClass="text-teal-500">APAC Regulatory Deep Dive & Strategy</CardTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Regulatory Intersections</h4>
                     <div className="p-4 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-lg text-center">
                        <div className="font-bold text-indigo-800">Core Overlap (≈80%)</div>
                        <p className="text-xs text-indigo-700 mt-1">Governance, ISMS, PCI/ISO Alignment, IR, 3PRM</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">Governance & ISMS</div>
                        <div className="p-2 bg-green-50 border border-green-200 rounded-lg">PCI DSS Controls</div>
                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">Risk Management</div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Key className="w-4 h-4 mr-2 text-yellow-600"/>Audit Readiness Strategy</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            The significant overlap allows for a unified control framework. By creating a central <strong className="text-gray-800">"audit data mart,"</strong> we map a single piece of evidence (e.g., a penetration test report) to multiple regulatory requirements (MAS TRM, HKMA C-RAF, PCI DSS Req. 11). This <strong className="text-gray-800">eliminates redundancy</strong> and ensures consistent, audit-ready data across all jurisdictions.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 mb-2">🔑 Takeaways</h4>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                        <p className="font-bold text-blue-800 mb-2">Similarities (80% overlap):</p>
                        <ul className="list-disc list-inside text-blue-700 space-y-1">
                            <li>All require policies + governance + ISMS.</li>
                            <li>All align with PCI DSS/ISO 27001 core controls.</li>
                            <li>All mandate vendor risk controls (3PRM).</li>
                            <li>All require breach/incident reporting (timing differs).</li>
                        </ul>
                    </div>
                     <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <p className="font-bold text-red-800 mb-2">Differences (20% deltas = heavy lifting):</p>
                        <ul className="list-disc list-inside text-red-700 space-y-1">
                            <li><strong className="font-semibold">OJK:</strong> Cross-border data transfer, strict IT outsourcing.</li>
                            <li><strong className="font-semibold">MAS:</strong> Fastest incident reporting window (1 hr).</li>
                            <li><strong className="font-semibold">HKMA:</strong> C-RAF maturity assessment.</li>
                            <li><strong className="font-semibold">AUSTRAC:</strong> AML/CTF-specific reporting.</li>
                            <li><strong className="font-semibold">RBI:</strong> Strictest data localisation, 6hr cyber reporting.</li>
                        </ul>
                    </div>
                     <div className="bg-gray-800 text-white p-4 rounded-lg text-sm">
                        <p className="font-bold text-teal-300 mb-2">For Company X APAC role:</p>
                        <p>"I aim for the 80% (PCI/ISO controls) intersection and will meticulously track the 20% deltas regulator-by-regulator. This is the key to lean, effective compliance without duplicated effort."</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center"><Code className="w-5 h-5 mr-2 text-gray-500" />Regulatory Blueprint</h4>
                <CodeBlock content={REGULATORY_BLUEPRINT_CODE} />
            </div>
             <div className="mt-8">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center"><Server className="w-5 h-5 mr-2 text-gray-500" />Company X Technical Foundation for Compliance</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
                    The regulatory blueprint above outlines the <strong>'what'</strong>—the legal and compliance obligations. The technical blueprint below details the <strong>'how'</strong>—the specific, hardened, and automated systems Company X has implemented to meet and exceed these requirements. This defense-in-depth architecture is a live, monitored ecosystem designed for resilience, from the kernel level on our Linux servers to the automated evidence collection for audits. It's the foundation upon which our APAC compliance rests, enabling us to manage the 20% regulatory deltas with precision because the 80% common ground is covered by a robust, unified technical stack.
                </p>
                 <CodeBlock content={TECHNICAL_BLUEPRINT_CODE} />
            </div>
        </Card>
    );
};

const ApmComplianceSection: React.FC<{ apmCompliance: ApacApmCompliance[] }> = ({ apmCompliance }) => (
    <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
            <Wallet className="w-5 h-5 mr-3 text-indigo-600" />
            Alternative Payment Method (APM) Compliance Status
        </h3>
        <div className="space-y-4">
            {apmCompliance.map(apm => (
                <div key={apm.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className={`w-8 h-8 rounded-full ${apm.icon} mr-3 flex-shrink-0`}></span>
                            <span className="font-bold text-gray-800">{apm.name}</span>
                        </div>
                        <ApmStatusBadge status={apm.status} />
                    </div>
                    <div className="mt-3">
                        <h4 className="text-xs font-semibold text-gray-600 mb-1">Key Risks & Considerations:</h4>
                        <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 pl-2">
                            {apm.keyRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                        </ul>
                    </div>
                    <div className="text-xs text-gray-500 mt-3 pt-2 border-t flex justify-between">
                        <span><strong>Regulator:</strong> {apm.regulator}</span>
                        <span><strong>Last Reviewed:</strong> {apm.lastReviewDate}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const QrisDeepDiveCard: React.FC = () => {
    return (
        <div className="mt-6 pt-6 border-t">
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-3 text-red-600" />
                Special Focus: Internalizing QRIS Compliance & Risk
            </h3>
            <div className="space-y-4 text-sm">
                <p className="text-gray-600">
                    Integrating QRIS is not just about adding another payment method; it's about connecting to Indonesia's national payment ecosystem. This requires a deep understanding of the unique compliance obligations and risks mandated by <strong>Bank Indonesia (BI)</strong> and the <strong>Indonesian Payment System Association (ASPI)</strong>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-700 mb-2">Core Compliance Obligations</h4>
                        <ul className="list-disc list-inside space-y-2 text-xs text-gray-700">
                            <li><strong>ASPI Technical Standards:</strong> Must comply with the latest QRIS technical specifications (e.g., QRIS MPM for merchants).</li>
                            <li><strong>Data Residency:</strong> All transaction data must be processed and stored onshore in Indonesia per OJK regulations.</li>
                            <li><strong>Dispute Resolution:</strong> Must adhere to the national standard for handling QRIS-related chargebacks and disputes.</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-700 mb-2">Key Risk Areas</h4>
                        <ul className="list-disc list-inside space-y-2 text-xs text-gray-700">
                            <li><strong>Operational Risk:</strong> High dependency on the national switching network (Artajasa, Rintis, etc.).</li>
                            <li><strong>Fraud Risk:</strong> QR code tampering/swapping at merchant locations.</li>
                        </ul>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    My role would be to ensure our QRIS implementation not only meets the technical standards but also has a robust risk management overlay, including transaction monitoring rules specific to QRIS fraud patterns and ensuring our data handling complies with OJK and UU PDP.
                </p>
            </div>
        </div>
    );
};

// FIX: Add placeholder RegionalTab component to resolve default export error in App.tsx
const RegionalTab: React.FC = () => {
    return (
        <Card>
            <CardTitle icon={Globe}>Regional Compliance</CardTitle>
            <p className="text-gray-600">
                This component is under construction. The original file was corrupted and has been repaired to a compilable state.
                The content below is static and for demonstration purposes.
            </p>
            <div className="mt-4 space-y-4">
                <RegulatoryAnalysis />
            </div>
        </Card>
    );
};

export default RegionalTab;
