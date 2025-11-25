# AutonomOS Discovery Visualization

A standalone visual demonstration UI for the AutonomOS Discovery pipeline. This project is designed for visual presentation in Replit Designer, featuring an interactive graph-based visualization with animated transitions.

## Project Overview

The visualization demonstrates the four key stages of the AutonomOS platform:
1.  **Asset Discovery**: Scanning and identifying assets across vendors (Salesforce, MongoDB, etc.) and Shadow IT.
2.  **Adaptive API Mesh**: Connecting diverse data sources through a unified mesh.
3.  **Data Unification**: Mapping and unifying data into a consistent ontology (DCL).
4.  **Agent Execution**: AI agents utilizing the unified data for intelligence and NLP tasks.

## Tech Stack

-   **Frontend Framework**: React (Vite)
-   **Visualization**: React Flow
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Animations**: CSS Transitions & Framer Motion concepts

## Getting Started

### Prerequisites

-   Node.js (v20+ recommended)
-   npm

### Installation

1.  Clone the repository (if applicable).
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Demo

Start the frontend development server:

```bash
npm run dev:client
```

Open your browser to the local server address (typically `http://0.0.0.0:5000` on Replit).

## Project Structure

-   `client/src/pages/discovery-demo.tsx`: Main component containing the entire visualization logic.
-   `client/src/assets/`: Static assets including logos and diagrams.
-   `client/src/components/ui/`: Reusable UI components (shadcn/ui based).

## License

Proprietary - AutonomOS
