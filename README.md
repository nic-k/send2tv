# send2tv

Een Chrome-extensie die de huidige pagina (bijvoorbeeld een YouTube-video) met één klik naar je **Android TV** stuurt via **Home Assistant**. De tv opent de link zelf in de YouTube-app. Het is dus geen cast: je computer hoeft niet online te blijven.

## Hoe werkt het

```
Chrome-extensie ──POST──▶ Home Assistant webhook ──▶ remote.turn_on ──▶ Android TV opent de link
```

De extensie stuurt de URL naar een webhook in Home Assistant. Een automation geeft die URL als deep link door aan de [Android TV Remote-integratie](https://www.home-assistant.io/integrations/androidtv_remote/), waarna Android de juiste app kiest.

## Vereisten

- Home Assistant met de integratie **Android TV Remote** ingesteld voor je tv
- Een adres waarop Home Assistant bereikbaar is (Nabu Casa-URL, eigen https-adres of een lokaal adres zoals `http://192.168.1.x:8123`)
- Google Chrome of een andere Chromium-browser

## Installatie

### 1. Automation in Home Assistant

1. Ga naar **Instellingen → Automatiseringen en scènes → Automatisering aanmaken → Nieuwe automatisering**.
2. Klik rechtsboven op de drie puntjes (⋮) en kies **Bewerken in YAML**.
3. Plak de inhoud van [`home-assistant/automation.yaml`](home-assistant/automation.yaml) en pas twee dingen aan:
   - `webhook_id`: kies een lange, willekeurige tekst.
   - `remote.jouw_tv`: de entity-ID van je tv (te vinden onder **Instellingen → Apparaten en diensten → Android TV Remote**).
4. Sla de automation op.

Je webhook-URL wordt nu:

```
https://JOUW-HA-ADRES/api/webhook/JOUW-WEBHOOK-ID
```

> [!WARNING]
> De webhook-ID werkt als wachtwoord. Deel hem niet en commit hem niet in een publieke repository.

### 2. Chrome-extensie

1. Download deze repository (**Code → Download ZIP**) en pak hem uit, of kloon hem met `git clone`.
2. Open `chrome://extensions` en zet rechtsboven **Ontwikkelaarsmodus** aan.
3. Klik op **Uitgepakte extensie laden** en kies de map [`extension`](extension). Verwijder of verplaats de map daarna niet, want Chrome leest de extensie vanaf die plek.
4. De instellingenpagina opent vanzelf. Plak je volledige webhook-URL en klik op **Opslaan**.
5. Kies **Toestaan** wanneer Chrome toestemming vraagt om dit adres aan te roepen.
6. Pin de extensie via de puzzelstuk-knop in de werkbalk.

## Gebruik

- **Huidige pagina versturen:** open een video op youtube.com en klik op het extensie-icoon.
- **Link versturen zonder te openen:** rechtsklik op een link en kies **Stuur naar tv**.
- Het icoon toont kort een ✓ (gelukt) of een ✗ (mislukt).

## Problemen oplossen

| Probleem | Oplossing |
|---|---|
| ✗ op het icoon | Controleer de webhook-URL in de instellingen en of de automation is opgeslagen en aanstaat. |
| ✓ maar de tv doet niets | Bekijk de trace van de automation in Home Assistant en controleer of `remote.jouw_tv` de juiste entity is. |
| Tv staat uit | Niet elk merk kan via het netwerk worden aangezet. Zet de tv eerst aan. |
| Instellingen kwijt na opnieuw laden | Open de extensie-instellingen en sla de webhook-URL opnieuw op. |
| Link opent in de verkeerde app | Gebruik de standaard `youtube.com/watch?v=...`-link. Voor een specifieke app (bijvoorbeeld YouTube Music) is extra configuratie nodig, bijvoorbeeld via een intent-URI of de ADB-integratie. |

## Privacy en veiligheid

- De extensie stuurt de URL van de pagina waarop je klikt, en alleen dan, naar de webhook die jij hebt ingesteld. Er worden geen andere gegevens verzameld of naar derden gestuurd.
- De webhook-URL wordt opgeslagen in `chrome.storage.sync` en synchroniseert dus met je Google-account als Chrome-synchronisatie aanstaat.
- De extensie vraagt alleen toestemming voor het adres dat je zelf invult.

## Structuur

```
.
├── extension/          Chrome-extensie (Manifest V3)
│   ├── manifest.json
│   ├── background.js
│   ├── options.html
│   ├── options.js
│   └── icons/
└── home-assistant/
    └── automation.yaml
```

## Licentie

Voeg hier een licentie toe, bijvoorbeeld [MIT](https://choosealicense.com/licenses/mit/).
