const xlsx = require('xlsx');
const fs = require('fs');

const files = ['Real_Estate_Data_Analytics.xlsx', 'construction_demo_data.xlsx'];
let results = {};

files.forEach(file => {
  if (fs.existsSync(file)) {
    const workbook = xlsx.readFile(file);
    results[file] = {};
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // array of arrays
      if (json.length > 0) {
        results[file][sheetName] = {
          headers: json[0],
          row1: json.length > 1 ? json[1] : null,
          totalRows: json.length - 1
        };
      }
    });
  }
});

fs.writeFileSync('preview.json', JSON.stringify(results, null, 2));
