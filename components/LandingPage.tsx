import React from 'react';
import { ArrowRight, ShieldCheck, Layers, Globe, Rocket, Briefcase, Zap, CheckCircle, BrainCircuit } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4 flex-shrink-0">
            <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm flex-grow">{description}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-6xl mx-auto text-center">
        
        <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                A Strategic GRC Blueprint for the APAC Payment Landscape
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Explore a hands-on GRC lab that translates complex APAC regulations and technical controls into a clear, strategic narrative for business growth and resilience.
            </p>
            <p className="mt-2 text-sm text-gray-500">
                Created by Rudy Prasetiya for the Security, Risk & Compliance Officer (APAC) role.
            </p>
        </header>

        <main>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <FeatureCard 
                    icon={ShieldCheck}
                    title="Unified GRC Command Center"
                    description="Navigate a holistic GRC landscape where PCI DSS, ISO 27001, the Enterprise Risk Universe, and SOC 2 are interconnected, not siloed."
                />
                <FeatureCard 
                    icon={Globe}
                    title="APAC Regulatory Navigator"
                    description="Go beyond theory. Actively manage the specific regulatory 'deltas' for key markets like Singapore (MAS), India (RBI), and Indonesia (OJK)."
                />
                <FeatureCard 
                    icon={Layers}
                    title="The 'Compliance-as-Code' Engine"
                    description="Browse an interconnected evidence graph of audit artifacts generated from the tech stack, proving compliance is an automated outcome, not a manual task."
                />
                <FeatureCard 
                    icon={Rocket}
                    title="From Risk to Revenue"
                    description="Leverage AI-driven insights from the Fleet & Growth dashboard to turn risk management into a strategic driver for business development."
                />
            </div>
            
            <section className="my-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">What's New in V4: A Deeper Strategic Lens</h2>
                <p className="text-gray-600 mb-8 max-w-3xl mx-auto">This version evolves from a compliance tracker into a strategic GRC engine, modeling how a mature program drives business, solves complex problems, and anticipates the future.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><Briefcase className="w-5 h-5 mr-3 text-blue-600" />1. Enhanced Business Acumen</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Connects risk directly to revenue with the "Fleet Risk & Opportunity" dashboard.</li>
                            <li>Models the full innovation lifecycle, from anticipating future standards (PCI PTS v7) to managing market disruptions (Tap-to-Pay).</li>
                            <li>Frames GRC not as a cost center, but as a direct enabler of high-stakes initiatives like biometric payments and strategic partnerships.</li>
                        </ul>
                    </div>
                     <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><Zap className="w-5 h-5 mr-3 text-orange-600" />2. Deeper, Realistic Problem-Solving</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Moves beyond theory by modeling real-world operational failures, like a broken "chain of custody" for terminals sold on unauthorized marketplaces.</li>
                            <li>Creates a fully traceable GRC narrative by linking high-level risks (ERM) to the specific internal controls and audit artifacts that mitigate them.</li>
                            <li>Integrates a full Internal Control Management system for tracking effectiveness, testing, and multi-framework mapping.</li>
                        </ul>
                    </div>
                     <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><BrainCircuit className="w-5 h-5 mr-3 text-teal-600" />3. Sharpened Situational Awareness</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Introduces a nuanced understanding of platform-specific threats, adding risks for the Android OS ecosystem on AXIUM terminals.</li>
                            <li>Expands 3PRM to model complex, shared-responsibility partnerships with strategic acquirers, reflecting modern payment ecosystems.</li>
                            <li>Enhances the AI Assistant with richer data context for more sophisticated, cross-domain analysis.</li>
                        </ul>
                    </div>
                     <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-purple-600" />4. Strategic Foresight & Communication</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Proactively tracks future compliance obligations (PCI PTS v7) and models their impact on the current hardware fleet for strategic planning.</li>
                            <li>Presents a causal risk story, showing how strategic risks cascade into operational impacts for clearer board-level communication.</li>
                            <li>Functions as a dynamic model of a forward-looking GRC program that enables innovation while securing against emerging threats.</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <button
                onClick={onEnter}
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            >
                Launch the Dashboard
                <ArrowRight className="w-5 h-5 ml-3" />
            </button>
        </main>
        
        <footer className="mt-16 text-center text-gray-500 text-sm space-y-2">
            <div className="flex justify-center items-center gap-6 md:gap-8">
                 <a href="https://rudyprasetiya.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-gray-700 hover:text-indigo-600 transition-colors">
                    rudyprasetiya.com
                </a>
                <span className="text-gray-300">|</span>
                 <a href="https://www.linkedin.com/in/rudyprasetiya/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                    LinkedIn
                </a>
                <span className="text-gray-300">|</span>
                <a href="mailto:rudyhendra@iuj.ac.jp" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                    Email Me!
                </a>
            </div>
            <p className="pt-4 text-xs text-gray-400">© 2025 rudyprasetiya.com. This dashboard is for demonstration purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
