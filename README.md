# AlgoVista Construction & Real Estate Admin Panel

A high-end, data-driven management dashboard built with React, styled with professional CSS, and powered by real-world Excel data.

## 🚀 Overview

This application is a comprehensive **Enterprise Admin Suite** designed for construction site operations and real estate market intelligence. It transforms complex Excel datasets into interactive, searchable, and paginated visual interfaces.

### Key Features
- **Project Intelligence Sidebar**: Unified navigation for Procurement, Contractors, Inventory, Marketing, and Market Insights.
- **Dynamic Data Viewer**: Custom `ExcelDataViewer` component with:
  - Global Search across all columns.
  - Client-side Pagination (adjustable rows per page).
  - Smart Header Cleaning for complex Excel structures.
- **Executive Analytics**: KPI cards and interactive charts (Bar, Gauge, Line) visualizing project costs, vendor spend, and market yields.
- **Real Estate Insights**: Deep-dive analytics into 11+ categories of real estate market research including Valuation, Pricing, and Market Research.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS (Custom tokens for a premium look) & React-Bootstrap
- **Data Visualization**: Chart.js with `react-chartjs-2`
- **Data Processing**: SheetJS (`xlsx`) for parsing Excel files
- **Icons**: Lucide/Feather icons via `react-icons`

## 📊 Data Management

### 1. Source Files
- `construction_demo_data.xlsx`: Contains operational logs for Vendors, Contractors, Inventory, and Marketing Spend.
- `Real_Estate_Data_Analytics.xlsx`: Contains 11 sheets of market intelligence and research data.

### 2. Processing Pipeline
The data is not read directly by the browser (for performance and security). Instead, a Node.js script processes the Excel files into a structured JSON file.
- **Script**: `process_excel.cjs`
- **Output**: `src/data/dashboardData.json`

### 3. Executive Dashboard Data
The **Executive Dashboard** (`src/pages/Dashboard.jsx`) combines real-time processed data with high-level project KPIs:
- **Operational KPIs**: Metrics like *Cost Overruns*, *Schedule Variance*, and *Budget Usage* are dynamically calculated from `src/data/dashboardData.json` (sourced from the primary Excel files).
- **Executive Summary**: High-level visual components like the *Budget Meter*, *Monthly Budget Graph*, and *Project Progress Status* are powered by `src/data/constructionKpiData.json`. 
- **Dynamic Updates**: All charts and tables are linked to these JSON structures. Updating the source Excel files and running the processing script will refresh the data across the entire suite.

### 4. How to Update Data
If you modify the Excel files, run the following command to update the dashboard:
```bash
node process_excel.cjs
```

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Professional vertical navigation
│   │   ├── TopNavbar.jsx        # Search and Profile header
│   │   ├── ExcelDataViewer.jsx  # Reusable unified table component
│   │   └── Dashboard/           # KPI and Chart sub-components
│   ├── pages/
│   │   ├── Dashboard.jsx        # Executive Executive summary
│   │   ├── ConstructionData.jsx # Combined ledger page
│   │   └── RealEstateData.jsx   # Market intelligence page
│   └── data/
│       └── dashboardData.json   # Processed JSON (Main data source)
├── process_excel.cjs            # Excel processing script
├── construction_demo_data.xlsx  # Raw data source 1
└── Real_Estate_Data_Analytics.xlsx # Raw data source 2
```

## 🚦 Getting Started

1. **Install Dependencies**: `npm install`
2. **Process Data**: `node process_excel.cjs` (Ensure Excel files are in the root)
3. **Run Dev Server**: `npm run dev`
4. **Build for Production**: `npm run build`

---
Developed with ❤️ by AlgoVista Team.
