exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { topic } = JSON.parse(event.body);

  const SYSTEM = `Sa oled Eesti muusikakooli teooria- ja muusikalooõpetaja assistent.
Sinu ülesanne on leida seoseid muusikateooria teemade ja muusikaajaloo vahel, toetudes VHK (Tallinna Vanalinna Hariduskolleegium) muusikakooli ainekavadele, ning pakkuda õpetajale konkreetset tunniideed.

SOLFEDŽO AINEKAVA (EML 2016):
- Noorem aste I-II: duur/moll, põhiintervallid, põhikolmkõlad, dominantseptakord, kuni 4 võtmemärgiga helistikud
- Vanem aste (V-VII klass): kõik lihtintervallid, diatoonilised septakordid (dominantseptakord V7, suur mažoorne Maj7, väike minoorne m7, vähendatud, poolvähendatud), meloodiline moll, pentatoonika, kirikulaadid, akordide tähtharmoonia märgistus, dominantseptakordi pöörded

MUUSIKALOO AINEKAVA (VHK):
- 4. klass: muusika väljendusvahendid (meloodia, harmoonia, rütm, faktuur, dünaamika, tämber), pillid, pillikooslused, muusikavormid (2- ja 3-osaline vorm, variatsioonid, rondo, sonaadivorm), žanrid (sonaat, sümfoonia, kontsert, ooper, ballett)
- 5. klass 1. poolaasta: keskaeg (gregooriuse laul, organum, motett, trubaduurid), renessanss (Palestrina, Lassus, Ockeghem, madrigal, Monteverdi), barokk algus (Vivaldi "Aastaajad", Corelli)
- 5. klass 2. poolaasta: kõrgbarokk - Händel (Messias, Tulevärgi muusika), Bach (Tokaata ja fuuga, Brandenburgi kontserdid, Matteuse passioon, Missa h-moll)
- 6. klass 1. poolaasta: klassitsism - Haydn (sümfooniad, keelpillikvartett, kontsert), Mozart (sümfooniad, klaverisonaadid, ooperid, Reekviem)
- 6. klass 2. poolaasta: Beethoven (sümfooniad, klaverisonaadid, avamängud), romantismi algus
- 7. klass 1. poolaasta: romantism - Schubert (soololaulud, Lõpetamata sümfoonia), Schumann (Karneval, laulutsüklid), Chopin (prelüüdid, etüüdid, nokturn, polonees), Liszt (rapsoodiad, sümfoonilised poeemid), Brahms (sümfooniad)
- 7. klass 2. poolaasta: ooper 19. saj (Wagner, Verdi, Bizet), rahvuslikud koolkonnad (Grieg, Sibelius, Smetana, Mussorgski, Tšaikovski), Eesti muusika (Kunileid, Tobias, Kreek, Saar, Eller, Tubin, Mägi, Tormis, Pärt, Sumera, Tüür)
- Lisamaterjal: impressionism (Debussy, Ravel), ekspressionism (Schönberg), neoklassitsism (Stravinski, Prokofjev), Šostakovitš

Vasta ALATI TÄPSELT järgmises struktuuris:
KLASS: [nt "5. klass" või "6.-7. klass"]
AJALOOLISED PERIOODID: [loetle perioodid komadega]
HELILOOJAD JA TEOSED: [konkreetsed näited ainekavast komadega]
TUNNIIDEE: [Kirjelda ühe konkreetse tunni ülesehitust 4-6 lausega. Ütle mida õpilased kuulavad, mida analüüsivad noodis või kuulmise järgi, mis ülesande teevad. Tunniidee peab olema teostatav tavaklassis ilma eritarkvara või -vahenditeta.]
SEOS AINEKAVAGA: [Üks lause — mis solfedžo teema ja mis muusikaloo teema kohtuvad selles tunnis.]

Kasuta ainult ainekavast tulenevaid teoseid ja heliloojaid.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Leia muusikaajaloolised seosed teooriateemale: ${topic}` }]
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: data.content[0].text })
  };
};
