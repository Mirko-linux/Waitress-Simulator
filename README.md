# 🍽️ Waitress Simulator  
**Simulatore di Cameriera & Vita Casalinga – 2026**  
Creato da **Mirko Yuri Donato**  
Licenza **MIT**

Waitress Simulator è un videogioco gestionale sviluppato in JavaScript con **Phaser 3**, che combina la vita da cameriera in un ristorante con un sistema di progressione domestica. Il gioco integra un sistema multi‑lingua, NPC modulari, spritesheet animati, audio sintetico e una struttura di scene completa.

---

##  Caratteristiche Principali

###  Gameplay
- Servi clienti con ordini generati dinamicamente.
- Gestisci il vassoio, i piatti sporchi, la pazienza dei clienti e le vite disponibili.
- Sistema di cucina con stazioni dedicate: forno, friggitrice, fornelli, macchina del caffè, spillatore, frigo.
- Sistema casa con oggetti acquistabili che migliorano le statistiche di gioco.

### 🏠 Sistema Casa
Ogni oggetto acquistato modifica parametri di gioco:
- **Letto Comodo** → +20% velocità della cameriera  
- **Smart TV** → +25% pazienza dei clienti  
- **Macchina Espresso** → -45% tempo di lavaggio stoviglie  
- Altri oggetti estetici: divano, tappeto, pianta, TV, ecc.

### 👥 NPC Modulari
Registro NPC definito in `NPC_REGISTRY`, con:
- Tilesheet dedicati (Maria, Elena, Massimo, Francesco)
- NPC emoji (Rosa, Chiara, Sofia)
- Biografie, età, genere, parametri speciali (patienceMultiplier, adoptTrigger)

### 🌐 Multi‑Lingua
Supporto nativo per 14 lingue:
- Italiano, Spagnolo, Francese, Tedesco, Turco, Russo, Giapponese, Polacco, Ungherese, Portoghese, Hindi, Coreano, Cinese, Hawaiano  
Sistema automatico di traduzione tramite `LOCAL_AUTO_TRANSLATIONS`.

### Audio Sintetico
Effetti sonori generati via **Web Audio API**, senza file audio:
- click, pickup, coin, wash, alert, cook, order_placed

### Scene del Gioco
- **PreloadScene** – caricamento asset e tilesheet  
- **MenuScene** – menu principale  
- **SettingsScene** – impostazioni (audio, difficoltà, controlli, lingua)  
- **CreditsScene** – crediti  
- **GameScene** – gameplay principale  
- **GameOverScene** – schermata di sconfitta  
- **LevelSummaryScene** - Punteggio
- **HouseScene** - Cadìsa

---

## Controlli

### COMANDI & TRUCCHI
- **W / A / S / D** → movimento  WASD
- **↑ / ↓ / ← / →** → movimento  FRECCE
- **SPACE** → interazione rapida  
- **H** → torna a casa  
- **SHIFT + K** → trucco: completa il livello  

---

## Installazione & Avvio

1. Scarica o clona il repository.
2. Assicurati di avere un server locale (Phaser richiede ambiente HTTP/HTTPS).
3. Avvia il gioco aprendo `index.html` tramite:
   - Live Server (VS Code)
   - http-server (Node)
   - qualsiasi hosting statico

Il gioco si avvia automaticamente tramite:

```javascript
window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
    window.game = game;
});
