const fs = require('fs'), zlib = require('zlib'), vm = require('vm');
const bundle = fs.readFileSync('bundle.js', 'utf8');
const aff = fs.readFileSync('node_modules/dictionary-sl/index.aff');
const dic = fs.readFileSync('node_modules/dictionary-sl/index.dic');
const gz = b => zlib.gzipSync(b, {level: 9}).toString('base64');
const affB = gz(aff), dicB = gz(dic);
const out = '// Slovar slovenščine (Hunspell sl_SI, GPL-3.0 ali LGPL-2.1) in nspell (MIT). Ustvarjeno z orodjem make-spell.js\n' +
  bundle + '\nwindow.SPELL_DATA = {aff: "' + affB + '", dic: "' + dicB + '"};\n';
fs.writeFileSync('spell.js', out);
console.log('spell.js:', out.length, 'znakov; aff gz b64', affB.length, ' dic gz b64', dicB.length);
// preizkus v "brskalniškem" okolju brez Buffer/require
const ctx = {window: {}, TextDecoder, console};
vm.createContext(ctx);
vm.runInContext(out, ctx);
const dec = b64 => zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8');
const sp = ctx.window.__nspell(dec(ctx.window.SPELL_DATA.aff), dec(ctx.window.SPELL_DATA.dic));
console.log('v sandboxu:', sp.correct('ekonomika'), sp.correct('pomebno'), sp.suggest('pomebno').slice(0, 2));