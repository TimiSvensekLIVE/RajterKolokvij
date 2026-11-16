// Sestavi index.html iz src/ (predloga + vprašanja + merila).  Zagon: node build.js
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'src');
const qs = JSON.parse(fs.readFileSync(path.join(src, 'questions.json'), 'utf8'));
const crit = fs.readFileSync(path.join(src, 'criteria.js'), 'utf8');
const tpl = fs.readFileSync(path.join(src, 'template.html'), 'utf8');
const html = tpl
  .replace('/*QS_JSON*/', () => JSON.stringify(qs))
  .replace('/*CRITERIA*/', () => crit);
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('index.html zgrajen:', qs.length, 'vprašanj,', html.length, 'bajtov');