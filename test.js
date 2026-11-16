// Preizkus ocenjevanja: izvleče logiko iz predloge in jo požene na vzorčnih odgovorih.  Zagon: node test.js
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src');
const tpl = fs.readFileSync(path.join(dir, 'template.html'), 'utf8');
const crit = fs.readFileSync(path.join(dir, 'criteria.js'), 'utf8');
const QS = JSON.parse(fs.readFileSync(path.join(dir, 'questions.json'), 'utf8'));
const a = tpl.indexOf('// ---------- pomočniki za merila');
const b = tpl.indexOf('// ---------- stanje');
let code = 'const QS = ' + JSON.stringify(QS) + ';\n' + tpl.slice(a, b).replace('/*CRITERIA*/', crit);
code += '\nreturn {grade, CR, PEN};';
const { grade, CR, PEN } = new Function(code)();

const modelText = q => q.model.map(p => p.replace(/\*\*/g, '').replace(/^• /, '')).join(' ');
let bad = 0;
console.log('--- 1) vzorčni odgovor sam sebi (pričakovano visoko) ---');
for (const q of QS) {
  const g = grade(q.n, modelText(q));
  const missed = g.res.filter(r => r.f < 1).map(r => r.label.slice(0, 50));
  console.log(String(q.n).padStart(2), String(g.pct).padStart(3) + '%', g.pen.length ? 'KAZEN!' : '', missed.length ? '| manjka: ' + missed.join(' ; ') : '');
  if (g.pct < 80) bad++;
}
console.log('pod 80 %:', bad);

console.log('--- 2) napačni / prazni odgovori (pričakovano nizko) ---');
const junk = [
  'ne vem',
  'To je zelo zanimivo vprašanje in mislim da je odgovor odvisen od tega kako gledamo na stvar in kaj mislimo o tem da bi to lahko bilo tako ali drugače v vsakem primeru.',
  'Nogomet je najlepša igra na svetu in igralci morajo veliko trenirati vsak dan da postanejo dobri in zmagajo na tekmah.',
];
for (const q of QS) {
  const r = junk.map(j => grade(q.n, j).pct);
  if (Math.max(...r) > 25) console.log('VISOKO za nesmisel pri', q.n, r);
}
console.log('nesmisel preverjen');

console.log('--- 3) preizkusi s svojimi besedami ---');
const T = {
  '9b': 'To v praksi pomeni, da dejansko odlocitev nosi oseba z njegovim subjektivnim mnenjem, ce mam na primer izbiro med tem, da rabim kupit novo graficno ali pa novi procesor, bi jaz kupil kartico, saj jo rabim. Ce pa bi to izbiro mel moj prijatel pa bi kupil procesor, saj ga rabi nadgradit. Dva posameznika se lahko soocata z razlicnimi oportunetnimi stroski iz iste odlocitvije, saj imata oba svoje potrebe v tistem casu.',
  '8b': 'Ce izberem nove porizvodnje opreme, izgubim vecji prostor za zaloge in organizacije dobrin. Ce pa izberem razsiritev skladiscnih zmogljivosti pa izgubim posodobljeno opremo, ki mi lahko izbolsa delovno silo in tudi kvlaiteto in kvantiteo izdelka. Informacije, katere bi rabo so kolko imam zaloge, ce je potrebna razsiritev skladisca ali kaj podobniga in tudi kako moderno opremo imam, ce zaostaja ali ce kaj nedela ali nagaja.',
  '7b': 'Oportunitveni stroski so stroski, ki se vezejo na vrednost druge odlocitve. Povezani so z ekonosko odlocitvjo tako, da ce ti hoces eno stvar se mores odpovedati drugi stvari. Pri odlocanju moremo upostevati poleg financnih stroskov tudi, kaj izgubimo ce se odpovemo neki stvari za drugo stvar. Naprimer: namesto, da grem na faks grem delati. Pri tem sem izgubil znanje iz predavanj, ampak sem pridobil denar iz sluzbe',
  7: 'Oportunitetni strošek je to, česar se odpovem, ko izberem eno stvar namesto druge. Ni samo denar, ampak tudi čas. Če grem v soboto delat, ne morem učit za izpit. Zato moram vedno izbirat, ker imam omejeno.',
  21: 'Ko se podjetje zadolži, dobi več sredstev ampak se mu poveča tudi dolg. Kapital se ne poveča. Smiselno je če naložba prinese več kot obresti, nevarno pa če ima prevelike dolgove in negotove prihodke. Po mojem je to dobra odločitev če je dobro načrtovana.',
  21.5: 'Zadolževanje poveča kapital podjetja.',
  27: 'Proporcionalni stroški rastejo enako hitro kot proizvodnja, degresivni pocasneje, progresivni pa hitreje. Najbolj skrbi progresivne ker pojedo dobiček, na primer nadure.',
  28: 'Prag rentabilnosti je tocka kjer so prihodki enaki stroskom. Pod pragom je izguba, nad pragom dobicek. Pomaga pri odločanju o ceni in koliko moramo prodati.',
  '28b': 'Pod pragom je dobiček, nad pragom izguba.',
  24: 'Stopnja je 100/4 = 25 %, letna amortizacija je 50.000 €. Prednost je da je enostavno, slabost pa da ne upošteva dejanske obrabe.',
  30: 'Ne, prag ni dovolj. Podjetje je takrat brez izgube ampak tudi brez dobička. Za dolgoročno uspešnost spremlja rentabilnost, ekonomičnost in produktivnost ter likvidnost.',
};
for (const [k, txt] of Object.entries(T)) {
  const n = parseInt(k, 10) === 21 && k === '21.5' ? 21 : (k === '28b' ? 28 : parseInt(k, 10));
  const g = grade(n, txt);
  console.log(k.padEnd(5), String(g.pct).padStart(3) + '%', g.pen.map(p => 'KAZEN: ' + p.label.slice(0, 40)).join(' '), '| manjka:', g.res.filter(r => r.f < 1).map(r => r.label.slice(0, 35)).join(' ; '));
}

console.log('--- 4) baterija: povprečni študentski odgovori s tipkarskimi napakami (pričakovano 60 do 95 %) ---');
const battery = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests', 'battery.json'), 'utf8')).concat(JSON.parse(fs.readFileSync(path.join(__dirname, 'tests', 'hard.json'), 'utf8')));
let sum = 0, low = 0;
for (const [n, txt] of battery) {
  const g = grade(n, txt);
  sum += g.pct;
  if (g.pct < 60) low++;
  console.log('B' + String(n).padStart(2), String(g.pct).padStart(3) + '%', g.sim !== undefined ? '(vsebina ' + Math.round(g.sim * 100) + '%)' : '', g.pct < 60 ? '| manjka: ' + g.res.filter(r => r.f < 1).map(r => r.label.slice(0, 32)).join(' ; ') : '');
}
console.log('povprečje baterije:', Math.round(sum / battery.length) + '%', '| pod 60 %:', low);
console.log('--- 5) kopija vprašanja in splošno blebetanje (pričakovano pod 25 %) ---');
const blah = [
  'To je zelo zanimivo vprasanje in mislim da je odgovor odvisen od tega kako gledamo na stvar in kaj mislimo o tem da bi to lahko bilo tako ali drugace v vsakem primeru.',
  'Po mojem mnenju je to pomembno za vsakega cloveka ker se vsi odlocamo in vsak ima svoje mnenje, na primer v sluzbi ali doma, in zato je vazno da o tem razmisljamo.',
  'Nogomet je najlepsa igra na svetu in igralci morajo veliko trenirati vsak dan da postanejo dobri in zmagajo na tekmah.',
];
let leak = 0;
for (const q of QS) {
  const cases = [q.question, ...blah];
  const r = cases.map(c => grade(q.n, c).pct);
  if (Math.max(...r) >= 25) { leak++; console.log('PUŠČA pri', q.n, r); }
}
console.log('puščanje (kopija/blebetanje >= 25 %):', leak);