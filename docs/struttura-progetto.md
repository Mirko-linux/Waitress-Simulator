# Struttura del progetto

Questa guida descrive tutti i file sorgente di **Waitress Simulator**, spiegando a cosa serve ciascuno e quale parte del gioco gestisce. Sono esclusi la cartella `assets/` (immagini e audio) e i file presenti nel `.gitignore` (`scripts/` e `AGENTS.md`).

Il gioco è un gestionale 2D realizzato con **Phaser 3**, scritto interamente in JavaScript e eseguito nel browser senza build: basta un server web locale che servi `index.html`.

---

## Radice del progetto

| File | Ruolo |
| --- | --- |
| `index.html` | Unico punto di ingresso. Contiene la schermata di caricamento, il contenitore `#game-container`, i riferimenti CDN a Phaser 3 e canvas-confetti e, soprattutto, l'ordine di caricamento degli script. L'ordine è importante: i file che definiscono scene e sistemi devono essere caricati prima di `js/game.js`, che li raccoglie e avvia Phaser. |
| `README.md` | Presentazione del progetto: caratteristiche, requisiti, istruzioni di esecuzione e note sui dialoghi. |
| `LICENSE` | Licenza MIT del codice sorgente. |
| `LICENSE-CC-BY` | Licenza applicata ai contenuti grafici e audio della cartella `assets/`. |
| `.gitignore` | Esclude dal repository la cartella `scripts/` e il file `AGENTS.md`. |

### Ordine di caricamento degli script

`index.html` carica, nell'ordine: `tutorial.js`, `radio.js`, `SaveManager.js`, `SaveMenu.js`, `clan_dialog.js`, `bootstrap.js`, `bathroom.js`, `briscola.js`, `lang.js`, `score.js`, `ai.js`, `ending.js`, `NewPlayer.js`, `credits.js`, `mail.js`, `house.js`, `tilemap.js`, `kitchen.js`, `missions.js`, `supplier.js`, `story.js`, `sponsor.js`, `crime.js`, `phone.js`, `arcade.js`, `intro.js` e infine `game.js`.

I primi file registrano classi e sistemi globali (`window.HouseScene`, `window.MissionSystem`, `window.KitchenSystem`, ecc.). `game.js` crea l'elenco delle scene, monta la configurazione di Phaser e avvia il gioco.

---

## `css/`

| File | Ruolo |
| --- | --- |
| `style.css` | Foglio di stile della pagina: sfondo scuro, contenitore di gioco 800×600 centrato, schermata di caricamento con barra di avanzamento animata e regole responsive per schermi piccoli. Non gestisce l'interfaccia interna del gioco, che è disegnata da Phaser. |

---

## `docs/`

| File | Contenuto |
| --- | --- |
| `casa.md` | Descrizione della casa della cameriera: punto di partenza, letto, computer, mobili acquistabili e funzione del sonno. |
| `clienti.md` | Regole sui clienti: pazienza, sintonia, bisogno del bagno e schede dei clienti storici del gioco. |
| `telefono.md` | Scheda introduttiva del telefono di sala, con l'immagine del dispositivo. È un documento breve. |
| `struttura-progetto.md` | Questo file: mappa completa dei file e delle responsabilità del progetto. |

---

## `js/` — nucleo del gioco

### `game.js`

È il cuore del progetto e il file più grande. Contiene:

- la configurazione globale `CONFIG` (dimensioni 800×600, velocità della cameriera, pazienza dei clienti, piatti, vassoio, ordini);
- `FOOD_TEXTURES`, la mappa tra nomi dei piatti e texture;
- `NPC_REGISTRY`, che espone i personaggi definiti in `ai.js`;
- lo stato globale `GAME` (denaro, livello, vite, piatti sporchi, sospetto, modalità arcade, impostazioni);
- gli helper del sistema vite `getMaxLivesForDifficulty`, `getMaxLives` e `clampLives`, esposti su `window`;
- `SynthAudio` e `triggerSfx`, per gli effetti sonori sintetizzati quando manca un file audio;
- le scene `Preload`, `Menu`, `Settings`, `Game` e `GameOver`;
- l'elenco finale delle scene, che include anche quelle registrate dagli altri file, e l'avvio di Phaser.

La scena `Game` gestisce il ristorante: mappa, cameriera, tavoli, clienti, presa comandi, servizio, lavaggio piatti, HUD, pausa, generazione dei clienti, fine giornata e game over. Include anche i sistemi di sospetto e scomparto nascosto.

`Preload` carica le texture e gli audio usati dal ristorante e il file `json/missions.json`. `Menu` offre le voci Gioca, Arcade, Impostazioni e Crediti. `Settings` gestisce suono, difficoltà (che determina le vite), lingua e dialogo AI, salvando le preferenze nel salvataggio. `GameOver` mostra il riepilogo della sconfitta e riporta la partita al giorno 1 con le vite al massimo, conservando denaro e arredi.

### `lang.js`

Sistema di localizzazione. Contiene i dizionari delle lingue supportate, le traduzioni automatiche, la funzione globale `t()` usata da tutte le scene, `switchLanguage`, `getCurrentLang` e la persistenza della lingua scelta in `waitress_game_lang`.

### `SaveManager.js`

Gestione dei salvataggi. Usa IndexedDB (database `WaitressSimulatorDB`, archivio `gameSave`) e mantiene una copia in `localStorage` sotto `waitress_save_data`. I dati sono incapsulati in un pacchetto `{ id, timestamp, data, sig }`, dove `sig` è un hash di integrità che permette di riconoscere salvataggi manomessi. Offre anche esportazione e importazione di backup, cancellazione del salvataggio e salvataggio/ripristino delle memorie degli NPC.

### `SaveMenu.js`

Menu di salvataggio mostrato quando si preme Gioca. Permette di continuare una partita, iniziarne una nuova (con scelta del tutorial), importare o esportare un backup e cancellare i dati. Il reset di una nuova partita azzera denaro, livello, vite, missioni e stato narrativo, senza toccare le impostazioni.

### `score.js`

Definisce `LevelSummaryScene`, il riepilogo di fine giornata. Calcola il punteggio, l'affitto, le penalità per gli sprechi e il bonus Briscola, assegna una medaglia (OK, BUONO, PERFETTO, SUPER), mostra le statistiche e le vite rimaste, salva i progressi con le vite correnti e porta il giocatore alla casa.

### `house.js`

Definisce `HouseScene`, la casa della cameriera. Gestisce la mappa dell'appartamento, l'HUD, il letto, la macchinetta del caffè, il computer e i mobili. Dal computer si aprono calendario, statistiche, potenziamenti, contatti, negozio IVEA, Hidden Vault e dichiarazione delle tasse. Dormire recupera tutte le vite e fa avanzare il giorno; il caffè costa 1 € e restituisce una vita (una volta al giorno). Contiene anche il calendario che mappa i giorni di gioco su date reali a partire da luglio 2026.

### `tutorial.js`

Definisce `TutorialSystem`, il tutorial guidato del primo giorno: introduce tavoli, comande, cucina, servizio e lavaggio piatti con suggerimenti a schermo e un cliente dedicato.

### `intro.js`

Definisce `IntroScene`, il prologo narrativo a dialoghi che introduce la cameriera, il ristorante e il contesto palermitano.

### `ending.js`

Definisce `EndingScene`, il finale che si sblocca raggiungendo l'obiettivo economico di 15.000 €.

### `credits.js`

Definisce `CreditsScene`, i titoli di coda scorrevoli, la schermata di vittoria e la funzione di riavvio completo della partita, che ripulisce i salvataggi e le chiavi di stato.

### `NewPlayer.js`

Definisce `NewPlayerScene`, la creazione della cameriera: nome, compleanno e generazione del codice fiscale. Salva l'identità e prosegue verso il prologo o direttamente al gioco.

### `tilemap.js`

Definisce `TilemapSystem`, che costruisce la griglia del ristorante (25×19 tile), sceglie i pavimenti per sala, cucina e bagno, crea i muri con collisioni e converte coordinate schermo/griglia.

### `kitchen.js`

Definisce `KitchenSystem`, la cucina: postazioni di lavoro, coda di cottura, cuoco NPC, bancone di passaggio, guasti e incendi, intervento del tecnico e dei pompieri.

### `bathroom.js`

Definisce `BathroomSystem`, il bagno del ristorante: crescita del bisogno dei clienti, coda, occupazione della toilette, blocco della pazienza e suono dello scarico.

### `phone.js`

Definisce `PhoneSystem`, il telefono di sala: chiamate promozionali e di Marco, menu rapido per contattare fornitore, tecnico e pompieri, suoneria e gestione delle chiamate.

### `supplier.js`

Definisce `SupplierSystem`, le consegne del fornitore: arrivo dei pacchi, ritiro, stoccaggio del cibo e ricarica delle scorte.

### `mail.js`

Definisce `MailSystem`, la posta e la burocrazia: ordini IVEA con consegna a due giorni, spese deducibili, scadenze fiscali, calcolo di IRPEF, addizionali e acconti, dichiarazione dei redditi in stile 730 e relative sanzioni.

### `radio.js`

Definisce `RadioSystem`: acquisto e posizionamento della radio, caricamento di brani locali, playlist, volume e collegamento alla storia e alle consegne.

### `crime.js`

Definisce `CrimeSystem`: mercato illegale, acquisto di oggetti pericolosi, livello di sospetto, ispezioni della Guardia di Finanza, scomparto nascosto, arresto e relative conseguenze.

### `sponsor.js`

Definisce `SponsorSystem` e `MoroniDialogScene`: la missione di sponsorizzazione con Moroni, la consegna delle casse di birra e i dialoghi dedicati.

### `story.js`

Definisce `StorySystem`: stato narrativo della partita (locale in vendita dal terzo giorno, obiettivo dei 15.000 €, clan, teppisti, adozione di Ludovica) e relativi eventi.

### `missions.js`

Definisce `MissionSystem`: legge il catalogo da `json/missions.json` (con fallback interno), gestisce missione attiva, completate e fallite, applica le regole di esclusività e verifica le condizioni di attivazione per giorno, denaro e relazione con gli NPC.

### `briscola.js`

Definisce il gioco di carte siciliano: `BriscolaSystem`, la scena di dialogo, la scelta della puntata, la partita vera e propria, la cutscene finale e la schermata di missione fallita. È legato alla missione di Rosa e alle ricompense in denaro.

### `clan_dialog.js`

Definisce `ClanDialogScene`, i dialoghi a scelta con il clan, con risposte multiple e conseguenze sulla storia.

### `ai.js`

Definisce il cervello dei personaggi: `NPC_CONFIG` (schede, personalità, texture e preferenze dei clienti), `LiveNewsManager` (notizie di contorno), `NPCMemory` (memoria locale delle conversazioni), `NPCManager` (relazioni e sintonia) e `AIDialogueManager` (dialoghi pre-generati, regole grammaticali, fallback inline e generazione asincrona tramite WebLLM/WebGPU). Carica `json/grammar_rules.json` e `json/npc_dialogues.json`.

### `arcade.js`

Definisce la modalità arcade: difficoltà, vite per difficoltà, tempi di pazienza e lavaggio, intervalli di generazione, stock del cibo, telefoni, punteggi progressivi e modalità infinita. Espone `ARCADE.applyConfig`, `save`, `load` e `reset`, usati dal menu e dalla scena di gioco.

### `bootstrap.js`

Piccolo script di avvio che sblocca l'AudioContext al primo clic o tocco dell'utente, requisito dei browser moderni per riprodurre l'audio.

---

## `json/`

| File | Ruolo |
| --- | --- |
| `missions.json` | Catalogo delle missioni (primarie e secondarie) con tipo, esclusività e condizioni di attivazione. Viene caricato in `Preload` e letto da `MissionSystem`. |
| `grammar_rules.json` | Regole e correzioni grammaticali usate da `AIDialogueManager` per rendere più naturali le risposte generate. |
| `npc_dialogues.json` | Database dei dialoghi pronti all'uso, letto da `ai.js`. Attualmente è vuoto: in questo caso il gioco usa i fallback definiti direttamente in `js/ai.js` e non si blocca. |
| `dialogue_templates.json` | Template autoriali dei dialoghi per personaggio e intento. Non viene letto dal gioco: serve come base di lavoro per rigenerare il database dei dialoghi. |

---

## Sistema delle vite

Le regole sono centralizzate in `js/game.js` e usate da tutte le scene:

- **Facile**: 4 vite massime.
- **Normale**: 3 vite massime.
- **Difficile**: 2 vite massime.

Il massimo si ottiene con `getMaxLives()`, che legge la difficoltà salvata nelle impostazioni; `clampLives()` impedisce che le vite superino il massimo o scendano sotto zero.

Le vite **non vengono più ripristinate alla fine di una giornata**: il riepilogo e il salvataggio conservano il valore corrente. Si recuperano solo in tre modi:

1. **Dormire** nel letto della casa: ripristina tutte le vite, ma fa avanzare il giorno e quindi si perde una giornata di lavoro.
2. **Bere il caffè** in casa: costa 1 € e restituisce una sola vita, una volta al giorno. Se le vite sono già al massimo viene dato uno sprint per il turno successivo.
3. **Eventi di reset** previsti dal gioco, come il game over, l'arresto o l'inizio di una nuova partita.

Quando le vite arrivano a **0** scatta il **game over**: la partita riparte dal **livello 1** con le vite al massimo, mantenendo denaro, arredi e potenziamenti. L'HUD mostra esattamente le vite correnti, senza cuori aggiuntivi.

---

## File rimossi

- `js/quest.js`: vecchio sistema delle missioni, sostituito da `js/missions.js` e `json/missions.json`.
- `js/price.js`: modulo di inflazione mai incluso in `index.html`; i prezzi e l'affitto usano i valori base definiti nel gioco.
