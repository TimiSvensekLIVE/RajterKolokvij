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

- Vsako vprašanje ima 4 do 6 meril z utežmi. Merilo je izpolnjeno, če odgovor vsebuje ustrezne ključne pojme (iskanje ne razlikuje velikih črk in šumnikov).
- Pri merilih, kjer je treba našteti več stvari (npr. kazalniki uspešnosti), se točke dodelijo sorazmerno.
- Merila »primer« in »lastno mnenje« štejejo le, če je odgovor tudi vsebinsko pokrit.
- Odgovor s *manj kot 12 besedami* dobi polovico točk.
- **Omejitev:** program išče ključne pojme, ne razume pomena. Če nekaj pravilno povemo z drugimi besedami, lahko izgubi točko. Je orientacija, ne uradna ocena.

## Struktura

```
index.html            končna igra (zgrajena, to objaviš)
build.js              sestavi index.html iz src/
test.js               preizkus ocenjevanja (node test.js)
src/
  template.html       vmesnik in logika ocenjevanja
  criteria.js         merila in kazni po vprašanjih
  questions.json      vprašanja in vzorčni odgovori
```

## Urejanje

Potrebuješ samo [Node.js](https://nodejs.org) (za sestavljanje; igra sama ga ne potrebuje).

```bash
node build.js    # po vsaki spremembi v src/ ponovno zgradi index.html
node test.js     # preveri, da vzorčni odgovori dobijo visoko oceno, nesmisel pa nizko
```

- **Nova vprašanja:** dodaj objekt v `src/questions.json` (`n`, `topic`, `title`, `question`, `model`) in merila v `src/criteria.js` pod isto številko `n`.
- **Merila:** `c(utež, 'opis', any(...) | all(...) | items(min, ...))`. Vzorci so regularni izrazi in so **brez šumnikov** (besedilo se pred preverjanjem normalizira).
- **Kazni:** objekt `PEN` v `criteria.js`.

## Opomba

Vprašanja in vzorčni odgovori so povzeti iz gradiva predmeta (Class Notebook). Če repozitorij objaviš javno, objaviš tudi to gradivo. Če to ni zaželeno, naj bo repozitorij zaseben.
