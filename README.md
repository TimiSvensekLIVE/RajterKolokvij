# EKP kolokvij: vadba

Majhna spletna igrica za vadbo pred kolokvijem iz **Ekonomike in podjetništva**.
Postavlja vprašanja s kolokvija, ti odgovarjaš po svoje, program pa odgovor oceni v odstotkih in pokaže, kaj je manjkalo.

Brez nameščanja, brez strežnika, brez interneta: dovolj je ena datoteka (`index.html`).

## Zagon

- **Lokalno:** dvoklik na `index.html` (odpre se v brskalniku).
- **Na spletu (GitHub Pages):** repozitorij → *Settings* → *Pages* → *Build and deployment* → *Deploy from a branch* → veja `main`, mapa `/ (root)` → *Save*. Po minuti je igra na `https://<uporabnik>.github.io/<repozitorij>/`.

## Kako deluje

1. Izbereš način: vsa vprašanja po vrsti, 10 naključnih, posamezna tema ali ponovitev slabih odgovorov (pod 70 %).
2. Napišeš odgovor s svojimi besedami.
3. **Preveri odgovor** (ali Ctrl+Enter) pokaže:
   - odstotek in besedno oceno (Odlično, Dobro, Delno, Šibko, Premalo),
   - razčlenitev po merilih (✓ pokrito, ~ delno, ✗ manjka) s točkami,
   - kazni za napačne trditve (npr. »pod pragom rentabilnosti je dobiček«),
   - vzorčni odgovor.
4. Gumb **Kopiraj za Claude** skopira vprašanje, tvoj odgovor in referenco. Prilepiš ga v pogovor z Claudom ali drugim pomočnikom za natančnejši pregled.

Rezultati se shranjujejo v brskalniku (`localStorage`), nikamor se ne pošiljajo.

### Pravila ocenjevanja

Ocena je kombinacija meril in vsebinske pokritosti vzorčnega odgovora. Vse velja za vsa vprašanja.

- **Merila:** vsako vprašanje ima 4 do 6 meril z utežmi. Merilo je izpolnjeno, če odgovor vsebuje ustrezne ključne pojme (koreni besed, zato ujame različne sklone in oblike).
- **Tipkarske napake:** daljše besede (7 ali več črk) se pred ocenjevanjem samodejno popravijo na najbližjo besedo iz vprašanj in odgovorov (npr. »oportunitveni« → »oportunitetni«, »ekonosko« → »ekonomsko«). Šumniki niso potrebni.
- **Sopomenke:** izrazi, ki pomenijo isto (npr. »izgubim«, »odrečem se« za »odpovem se«; »firma« za »podjetje«), se prepoznajo.
- **Delne točke:** pri merilih z več deli (npr. »primarne = nujne«) in pri naštevanju (npr. kazalniki uspešnosti) se točke dodelijo sorazmerno.
- **Vsebinska pokritost:** primerja se, koliko značilnih besed vzorčnega odgovora je v tvojem odgovoru. Če je pokritost visoka, ocena ne more biti nižja kot po merilih in se lahko dvigne.
- **Prepisano vprašanje ne šteje:** deli, ki so besedno prepisani iz vprašanja (5 ali več besed zapored), se pred ocenjevanjem odstranijo.
- **Primer in mnenje** štejeta le, če je odgovor tudi vsebinsko pokrit.
- **Kazni** za napačne trditve (npr. »pod pragom rentabilnosti je dobiček«).
- Odgovor z *manj kot 12 besedami* dobi polovico točk.
- **Delne točke za posredno povedano misel:** če je misel povedana le posredno (npr. »mora vedeti, koliko prihodka ima« namesto »sredstva so omejena«), dobiš polovico točk za to merilo.
- **Zgornja meja glede na vsebino vzorca:** zelo visoko oceno dobi le odgovor, ki se vsebinsko približa vzorcu (100 % pri pokritosti vsaj približno 33 %). Lasten primer ocene ne zmanjša bistveno.
- **Zlepljeni »ne« + glagol** (»nemore«, »nevem«) in »ne potrebne« se pred ocenjevanjem popravijo, da merila ne spregledajo besed.- **Omejitev:** program išče ključne pojme in ne razume pomena. Če nekaj pravilno povemo povsem drugače, lahko izgubi točko. Je orientacija, ne uradna ocena. Za natančnejši pregled uporabi gumb *Kopiraj za Claude*.
### Pravopis in slovnica

Pod oceno je okvir z opozorili, da napake popraviš. Igra ima vgrajen **slovenski slovar** (Hunspell sl_SI, približno 247.000 osnovnih besed), ki se ob zagonu naloži v ozadju (nekaj sekund, nato se rezultat sam osveži).

- **Pravopisne napake:** vsaka beseda se preveri v slovarju. Neznane besede dobijo do 3 predloge (»pomebno → pomembno«, »ljudji → ljudje«, »ekonomskiga → ekonomskega«). Strokovni izrazi iz gradiva (»oportunitetni«, »degresivni«) veljajo za pravilne, lastna imena in kratice se ne označujejo.
- **Šumniki:** program preizkusi vse različice c→č, s→š, z→ž in izbere tiste, ki jih slovar pozna (»placati → plačati«, »hoces → hočeš«). Stikalo v meniju to izklopi.
- **Zapis »ne«:** »nemore → ne more«, »nevem → ne vem«, »naprimer → na primer«, »stem → s tem«, »dokonca → do konca«, »ne potrebne → nepotrebne«.
- **Pogovorni zapisi:** »kupit → kupiti«, »se more → se mora«.
- **Ločila:** manjka vejica pred »ker«, »da«, »ki«, »ampak«, »saj«, »čeprav«; presledek po vejici ali piki; preveč pik; ponovljena beseda.
- **Stavki:** začetek z malo črko, manjka končna pika, velika začetnica po vejici.
- Polje za odgovor ima vključeno tudi brskalnikovo preverjanje črkovanja (`spellcheck`, jezik `sl`).

**Omejitve:** program ne preverja slovničnega ujemanja (npr. »omejene sredstva« namesto »omejena sredstva«), ne ve, ali je beseda pravilna v danem pomenu, in ne zazna vsebinske netočnosti. Pri vejicah oznaka »preveri« pomeni, da pravilo ni vedno enako. Za to uporabi gumb *Kopiraj za Claude*.

### Licence

- Slovar **Hunspell sl_SI** (paket `dictionary-sl`): GPL-3.0 ali LGPL-2.1, glej `src/dictionary-sl.license.txt`. Vgrajen je v stisnjeni obliki v `src/spell.js`.
- **nspell** (preverjanje črkovanja v brskalniku): MIT.
- Igra torej vsebuje delo, ki je pod licenco GPL ali LGPL. Če repozitorij objaviš, ohrani datoteko z licenco.
## Struktura

```
index.html            končna igra (zgrajena, to objaviš)
build.js              sestavi index.html iz src/
test.js               preizkus ocenjevanja (node test.js)
tests/
  battery.json        študentski odgovori s tipkarskimi napakami (pričakovano 60 do 95 %)
  hard.json           pravilni odgovori brez strokovnih izrazov
  real.json           pravi odgovori uporabnika z mojimi ocenami (igra naj bo blizu njih)
src/
  template.html       vmesnik in logika ocenjevanja
  criteria.js         merila in kazni po vprašanjih
  questions.json      vprašanja in vzorčni odgovori
  spell.js            slovar slovenščine (stisnjen) in nspell
  dictionary-sl.license.txt  licenca slovarja
tools/
  make-spell.js       ustvari src/spell.js iz paketov nspell in dictionary-sl (potrebuje npm)
```

## Urejanje

Potrebuješ samo [Node.js](https://nodejs.org) (za sestavljanje; igra sama ga ne potrebuje).

```bash
node build.js    # po vsaki spremembi v src/ ponovno zgradi index.html
node test.js     # vzorčni odgovori visoko, nesmisel in prepisano vprašanje nizko, baterija študentskih odgovorov
```

- **Nova vprašanja:** dodaj objekt v `src/questions.json` (`n`, `topic`, `title`, `question`, `model`) in merila v `src/criteria.js` pod isto številko `n`.
- **Merila:** `c(utež, 'opis', any(...) | all(...) | items(min, ...))`. Vzorci so regularni izrazi in so **brez šumnikov** (besedilo se pred preverjanjem normalizira).
- **Kazni:** objekt `PEN` v `criteria.js`.

## Opomba

Vprašanja in vzorčni odgovori so povzeti iz gradiva predmeta (Class Notebook). Če repozitorij objaviš javno, objaviš tudi to gradivo. Če to ni zaželeno, naj bo repozitorij zaseben.
