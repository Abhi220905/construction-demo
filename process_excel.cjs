const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('construction_demo_data.xlsx');
const sheets = {};

workbook.SheetNames.forEach(sheetName => {
  sheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
});

// Also parse Real_Estate_Data_Analytics
const realEstateWb = xlsx.readFile('Real_Estate_Data_Analytics.xlsx');
const realEstateData = {};
realEstateWb.SheetNames.forEach(sheetName => {
  realEstateData[sheetName] = xlsx.utils.sheet_to_json(realEstateWb.Sheets[sheetName]);
});

fs.writeFileSync('./src/data/dashboardData.json', JSON.stringify({
  vendorPurchases: sheets['Vendor_Purchases'] || [],
  materialInventory: sheets['Material_Inventory'] || [],
  projectCosts: sheets['Project_Costs'] || [],
  contractorPerformance: sheets['Contractor_Performance'] || [],
  salesBookings: sheets['Sales_Bookings'] || [],
  marketingSpend: sheets['Marketing_Spend'] || [],
  realEstateAnalytics: realEstateData // newly added
}, null, 2));

console.log("Processed Extensively Excel Data securely into src/data/dashboardData.json");
