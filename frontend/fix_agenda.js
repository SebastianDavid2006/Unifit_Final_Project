// const fs = require('fs');
const f = fs.readFileSync('frontend/src/features/student/pages/AgendaPage.tsx', 'utf8');

let fixed = f;

// Replace all template literal concatenations with string concatenation
fixed = fixed
  .replace(/\$\{apt\.color\}20/g, 'apt.color + "20"')
  .replace(/\$\{apt\.color\}15/g, 'apt.color + "15"')
  .replace(/\$\{apt\.color\}10/g, 'apt.color + "10"')
  .replace(/\$\{apt\.color\}30/g, 'apt.color + "30"')
  .replace(/\$\{apt\.color\}40/g, 'apt.color + "40"')
  .replace(/\$\{apt\.color\}50/g, 'apt.color + "50"')
  .replace(/\$\{apt\.color\}60/g, 'apt.color + "60"')
  .replace(/\$\{apt\.color\}70/g, 'apt.color + "70"')
  .replace(/\$\{apt\.color\}80/g, 'apt.color + "80"')
  .replace(/\$\{apt\.color\}90/g, 'apt.color + "90"')
  .replace(/\$\{apt\.color\}20/g, 'apt.color + "20"')
  .replace(/\$\{selectedDate\?\.\.getDate\(\)\}/g, 'selectedDate?.getDate().toString()')
  .replace(/\$\{selectedDate\?\.\.getMonth\(\)\}/g, 'selectedDate?.getMonth().toString()')
  .replace(/\$\{selectedDate\?\.\.getFullYear\(\)\}/g, 'selectedDate?.getFullYear().toString()')
  .replace(/\$\{date\.getDate\(\)\}/g, 'date.getDate().toString()')
  .replace(/\$\{date\.getMonth\(\)\}/g, 'date.getMonth().toString()')
  .replace(/\$\{date\.getFullYear\(\)\}/g, 'date.getFullYear().toString()')
  .replace(/format\(selectedDate\!\,/g, 'format(selectedDate || new Date(),')
  .replace(/format\(currentDate\,/g, 'format(currentDate,')
  .replace(/format\(date\,/g, 'format(date,');

fs.writeFileSync('frontend/src/features/student/pages/AgendaPage.tsx', fixed);
console.log('Fixed template literals');