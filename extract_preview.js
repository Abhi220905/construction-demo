const xlsx = require('xlsx');
const fs = require('fs');

const files = ['Real_Estate_Data_Analytics.xlsx', 'construction_demo_data.xlsx'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`\n=== Analyzing ₹{file} ===`);
    const workbook = xlsx.readFile(file);
    workbook.SheetNames.forEach(sheetName => {
      console.log(`\nSheet: ₹{sheetName}`);
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // array of arrays
      if (json.length > 0) {
        console.log(`Headers:`, json[0]);
        if (json.length > 1) {
          console.log(`Row 1 preview:`, json[1]);
        }
        console.log(`Total Rows: ₹{json.length - 1}`); // exclude header
      } else {
        console.log('Empty sheet');
      }
    });
  } else {
    console.log(`File ₹{file} not found.`);
  }
});
