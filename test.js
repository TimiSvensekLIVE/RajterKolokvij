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
code += '\nreturn {grade, CR, PEN, checkLang, setSpell};';
const { grade, CR, PEN, checkLang, setSpell } = new Function(code)();

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
  '1b': 'Vsak posameznik ima omejen cas in denar. Vsak posameznik ima tudi vec zelja ki jih nazalost nemore zadovoljiti ekonomika nas uci kaj je denar in daj e potrebno se odlociti za dolocena zelja da nam denarja do konca meseca ne zmanka da nismo pod stresom.... Prmer je da student dobi 300 evrov na mesec in se more odlociti med hrano, zabavo in prevozom. to vse si mora dobro razporediti denar da mu ga ne zmanka.',
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
console.log('--- 6) pravi odgovori uporabnika (igra naj bo blizu moje ocene) ---');
const real = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests', 'real.json'), 'utf8'));
let rfail = 0, rerr = 0;
for (const r of real) {
  const g = grade(r.n, r.text);
  const ok = g.pct >= r.lo && g.pct <= r.hi;
  if (!ok) rfail++;
  rerr += Math.abs(g.pct - r.mine);
  console.log((ok ? 'OK  ' : 'NAPAKA'), 'Q' + String(r.n).padStart(2), String(g.pct).padStart(3) + '%', '(moja ' + r.mine + ', razpon ' + r.lo + '-' + r.hi + ')', r.note);
}
console.log('pravi odgovori izven razpona:', rfail, '| povprečna razlika do moje ocene:', Math.round(rerr / real.length) + ' točk');
console.log('--- 7) pravopis in slovnica ---');
// a) pravilno napisani vzorčni odgovori ne smejo dajati (veliko) opozoril
let fp = 0;
for (const q of QS) {
  const txt = q.model.map(p => p.replace(/\*\*/g, '').replace(/^• /, '')).join(' ');
  const L = checkLang(txt, true);
  if (L.total > 1) { fp += L.total; console.log('LAŽNO opozorilo pri vpr.', q.n, L.groups.map(g => g.title + ': ' + g.items.map(i => i.from + '→' + i.to).join(', ')).join(' | ')); }
}
console.log('lažna opozorila na pravilnih vzorcih:', fp);
// b) znane napake morajo biti najdene
const probe = 'ce nemore placati nujnih stroskov, naprimer hrane. Zakon pravi da vsak potrebuje denar in in elektriko.Podjetje kupuje prevec , ker se more odlociti stem kupit dokonca';
const Lp = checkLang(probe, true);
const flat = Lp.groups.flatMap(g => g.items.map(i => i.from + '→' + i.to));
const want = ['nemore→ne more', 'naprimer→na primer', 'stem→s tem', 'dokonca→do konca', 'kupit→kupiti', 'se more→se mora', 'in in→in'];
let miss = want.filter(w => !flat.includes(w));
console.log('znane napake najdene:', want.length - miss.length + '/' + want.length, miss.length ? '| manjka: ' + miss.join(', ') : '');
// c) prikaz za prave odgovore
const real2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests', 'real.json'), 'utf8'));
for (const r of real2.slice(0, 9)) {
  const L = checkLang(r.text, false);
  console.log('Q' + r.n + ' (' + r.note + '): ' + L.total + ' opozoril');
  L.groups.forEach(g => console.log('   ' + g.title + ': ' + g.items.map(i => i.from + ' → ' + i.to).join(' ; ')));
}
console.log('--- 8) pravopis s slovenskim slovarjem ---');
const vm = require('vm'), zlib = require('zlib');
const spellSrc = fs.readFileSync(path.join(dir, 'spell.js'), 'utf8');
const sctx = { window: {}, TextDecoder, console };
vm.createContext(sctx); vm.runInContext(spellSrc, sctx);
const unz = b64 => zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8');
const t0 = Date.now();
setSpell(sctx.window.__nspell(unz(sctx.window.SPELL_DATA.aff), unz(sctx.window.SPELL_DATA.dic)));
console.log('slovar naložen v', Date.now() - t0, 'ms');
// a) pravilni vzorci
let fp2 = 0;
for (const q of QS) {
  const txt = q.model.map(p => p.replace(/\*\*/g, '').replace(/^• /, '')).join(' ');
  const L = checkLang(txt, true);
  if (L.total > 1) { fp2 += L.total; console.log('LAŽNO opozorilo (slovar) pri vpr.', q.n, L.groups.map(g => g.title + ': ' + g.items.map(i => i.from + '→' + i.to).join(', ')).join(' | ')); }
}
console.log('lažna opozorila na pravilnih vzorcih (slovar):', fp2);
// b) znane napake
const known = { pomebno: 'pomembno', vrednsoti: 'vrednosti', ljudji: 'ljudje', eletrika: 'elektrika', trgovniah: 'trgovinah', zakonistost: 'zakonitost', ekonomskiga: 'ekonomskega', kolko: 'koliko', prmer: 'primer', zmanka: 'zmanjka', oportunetnimi: 'oportunitetnimi' };
const sentence = 'Moj odgovor je ' + Object.keys(known).join(' in ') + ' tukaj.';
const Lk = checkLang(sentence, true);
const typos = Lk.groups.filter(g => g.k === 'typo').flatMap(g => g.items);
let found = 0;
const missK = [];
for (const [w, c] of Object.entries(known)) {
  const it = typos.find(i => i.from === w);
  if (it && it.to.toLowerCase().includes(c)) found++; else missK.push(w + (it ? '(' + it.to + ')' : ''));
}
console.log('pravopisne napake najdene s pravim popravkom:', found + '/' + Object.keys(known).length, missK.length ? '| manjka: ' + missK.join(', ') : '');
// c) šumniki: vklopljeno / izklopljeno
const dtxt = 'Podjetje mora placati stroskov in zivljenju ni lahko, ce hoces, mores in prevec.';
const dOn = checkLang(dtxt, true).groups.filter(g => g.k === 'diac').flatMap(g => g.items.map(i => i.from + '→' + i.to));
const dOff = checkLang(dtxt, false).groups.filter(g => g.k === 'diac').length;
console.log('šumniki (vklop):', dOn.join(', '), '| ob izklopu skupin:', dOff);
// d) prikaz za prave odgovore
for (const r of real2.slice(0, 9)) {
  const L = checkLang(r.text, true);
  console.log('Q' + r.n + ' (' + r.note + '): ' + L.total + ' opozoril');
  L.groups.forEach(g => console.log('   ' + g.title + ' [' + g.items.length + ']: ' + g.items.slice(0, 10).map(i => i.from + ' → ' + i.to).join(' ; ')));
}