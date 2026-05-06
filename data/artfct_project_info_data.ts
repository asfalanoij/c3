

export const README_CONTENT = `
### APAC Compliance Framework Dashboard

This project is an interactive GRC (Governance, Risk, and Compliance) lab designed to demonstrate a unified and automated approach to managing security compliance across the complex Asia-Pacific regulatory landscape. It serves as a single pane of glass for stakeholders, from C-level executives to auditors and engineers.

**Core Philosophy: Compliance-as-Code**

The central thesis of this dashboard is that compliance should be a continuous, automated outcome of well-engineered systems, not a periodic, manual checklist exercise. The "Audit Artifacts" tab is the heart of this concept, showing how evidence can be programmatically generated from source-of-truth systems (like IaC tools, SIEMs, and IAM platforms).

**Technology Stack**

This is a modern, serverless frontend application built with:
* **React & TypeScript:** For a robust, type-safe component architecture.
* **TailwindCSS:** For rapid, utility-first styling.
* **Lucide Icons:** For clean, consistent iconography.
* **D3.js & d3-sankey:** For interactive data visualizations.
* **@google/genai:** For the AI-powered GRC Assistant.
* **ES Modules & Import Maps:** For a dependency-free, modern web setup with no build step.

**Key Features to Explore:**
* **PCI DSS v4.0.1 Tab:** A deep dive into all 12 requirements, including a Sankey diagram showing the relationship between PCI, NIST, and ISO 27001.
* **Regional Compliance Tab:** A tracker for the specific regulatory "deltas" in key APAC markets like Singapore (MAS), India (RBI), and Indonesia (OJK).
* **Audit Artifacts Hub:** An interactive browser for 166 interconnected pieces of evidence, demonstrating causality from preventative controls to detective alerts and corrective actions.
* **KRI Dashboard:** A high-level view of top operational risks, such as patch SLAs and vendor risk coverage.
* **GRC AI Assistant:** A Gemini-powered chatbot that can analyze dashboard data to answer natural language questions about your compliance posture.
`;

export const DEPENDENCIES_CONTENT = `
"imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/": "https://esm.sh/react-dom@18.2.0/",
    "lucide-react": "https://esm.sh/lucide-react@0.363.0",
    "d3": "https://esm.sh/d3@7.8.5",
    "d3-sankey": "https://esm.sh/d3-sankey@0.12.3",
    "jspdf": "https://esm.sh/jspdf@2.5.1",
    "jspdf-autotable": "https://esm.sh/jspdf-autotable@3.8.2",
    "@google/genai": "https://esm.sh/@google/genai@0.14.0"
}
`;

export const MVP_VISION = {
    productName: "Unified GRC Trust Center",
    vision: "To create a B2B 'Compliance-as-a-Service' engine that automates trust for the global payment ecosystem. We replace manual audits with real-time data engineering, solving the 'Audit Tax' for Telkom, Visa, Ingenico, and beyond.",
    targetAudience: [
        "Global Payment Infrastructure Providers (Ingenico, Visa, Mastercard): To automate compliance for massive terminal fleets.",
        "Telkom Group & Subsidiaries (Telin, Telkomsel, NeutraDC): To harmonize cross-border regulations (OJK, MAS, GDPR).",
        "Enterprise Fintechs & Digital Banks (GoTo, Jenius): To accelerate time-to-market by reducing certification lead times.",
    ],
    valueProposition: "The 'Evidence Factory': Audit Automation for the API Economy. We don't ask humans for proof; we ask the machines. Our platform connects directly to the tech stack to generate immutable, real-time audit artifacts that satisfy multiple regulators (OJK, PCI, ISO) simultaneously.",
    mvpFeatures: [
        {
            title: "The Evidence Factory",
            description: "A universal connector that pulls immutable logs from payment terminals, cloud configs, and CI/CD pipelines. It treats compliance evidence as data, not documents."
        },
        {
            title: "Multi-Framework Mapping",
            description: "A 'Regulatory Delta' engine that automatically maps a single piece of technical evidence (e.g., encryption logs) to satisfy overlapping requirements from OJK, MAS, and PCI DSS."
        },
        {
            title: "Real-Time Fleet Compliance",
            description: "Specifically for hardware giants like Ingenico, this module tracks physical asset security (tamper status, key injection) against PCI-PTS standards in real-time."
        },
        {
            title: "Automated Regulatory Reports",
            description: "One-click generation of audit-ready PDFs for specific regulators (e.g., 'Generate MAS Report' or 'Generate Visa ROC')."
        },
        {
            title: "Compliance-as-a-Service API",
            description: "Allowing partners (like Banks hosting on NeutraDC) to consume compliance status programmatically via API, turning compliance from a blocker into a sales enabler."
        }
    ]
};

export const PROJECT_STRUCTURE_CONTENT = `/src
├── App.tsx             # Main application component & router
├── index.tsx           # Entry point
├── types.ts            # Global TypeScript types
├── components/
│   ├── Overview.tsx    # Main dashboard view
│   ├── Regional.tsx    # APAC regulatory deep-dive
│   ├── TechStack.tsx   # Evidence hub / audit artifacts
│   ├── ... (11 other feature tabs)
│   ├── common.tsx      # Reusable UI components (Card, Modal, etc.)
│   └── GrcAiAssistant.tsx # Gemini-powered chatbot
└── data/
    ├── index.ts        # Barrel file for exporting all data
    └── artfct_*.ts     # 19 semantic data modules (e.g., PCI, SOC2)`;

export const IP_NOTICE_CONTENT = `
### Intellectual Property Notice

**This GRC Dashboard is a proprietary work created by Rudy Prasetiya for demonstration purposes as part of a professional application process.**

* **Content & Narrative:** All strategic analyses, risk scenarios, control descriptions, and the overall GRC narrative are the intellectual property of the author. They are based on industry best practices and public frameworks but have been synthesized into a unique, demonstrative work product.
* **Code & Architecture:** The React/TypeScript codebase, component structure, and data model were developed by the author.
* **Usage:** This project is intended solely for evaluation of the author's skills and strategic thinking. It may not be reproduced, distributed, or used for any commercial purpose without explicit written permission from the author. All rights are reserved.
`;