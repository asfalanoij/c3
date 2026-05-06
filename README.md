# APAC Compliance Framework Dashboard

A React/Vite dashboard for tracking Governance, Risk, and Compliance (GRC) metrics across the APAC region.

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Data Visualization**: D3.js (Sankey diagrams)
- **Security**: DOMPurify (XSS prevention)
- **Export**: jsPDF (PDF reports)

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

## Deployment

Deployment is handled automatically via GitHub Actions (`.github/workflows/deploy.yml`).

- **Trigger:** Pushes to the `main` branch.
- **Process:** 
  1. Runs `npm audit` (fails on critical vulnerabilities).
  2. Builds the static production output (`dist/`).
  3. Deploys to Hostinger (`c3.rudyprasetiya.com`) via FTP.
- **Required GitHub Secrets:**
  - `FTP_SERVER`
  - `FTP_USERNAME`
  - `FTP_PASSWORD`
