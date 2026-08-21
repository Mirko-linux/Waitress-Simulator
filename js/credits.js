// credits.js - Titoli di Coda Epici e Tecnici

class CreditsScene extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0502'); // Sfondo nero scuro

        // --- 1. MUSICA EPICA DI FONDO (opzionale) ---
        // Se hai un file audio, decommenta queste righe e metti il nome del file
        // this.music = this.sound.add('credits_music', { volume: 0.3, loop: false });
        // this.music.play();

        // --- 2. CREA IL TESTO SCORREVOLE ---
        // Tutto il testo dei crediti. Puoi mettere ciò che vuoi qui dentro.
        const creditLines = [
            "🎮 THE WAITRESS - IL GIOCO",
            "Un'avventura gestionale creata con passione",
            "=========================================",
            "",
            "👨‍💻 SVILUPPO & DESIGN",
            "Mirko Yuri Donato",
            "",
            "🛠️ TECNOLOGIE UTILIZZATE",
            "=========================================",
            "Motor: Phaser 3 (HTML5 Game Framework)",
            "Linguaggio: JavaScript (ES6+)",
            "Backend: WebLLM / MLC-AI (Intelligenza Artificiale)",
            "WebGPU / Web Assembly (Modelli LLM locali)",
            "Web Audio API (Sintesi audio in tempo reale)",
            "Canvas 2D / WebGL (Rendering grafico)",
            "LocalStorage / IndexedDB (Salvataggio progressi)",
            "ESM.sh / jsDelivr (CDN per moduli JS)",
            "Pixel Art: Sprites personalizzate (32x32)",
            "Framework UI: Phaser.GameObjects",
            "",
            "🎵 AUDIO E MUSICA",
            "=========================================",
            "Sound Design: Mirko Yuri Donato",
            "Musica Epica: (Compositore) - [Se vuoi mettere autore]",
            "Effetti Sonori: Generati con Web Audio API (Oscillatori)",
            "Radio Locale: Riproduzione file MP3/WAV locali",
            "",
            "📜 GRAFICA E ASSET",
            "=========================================",
            "Ambiente Ristorante: Tilemap System (Generazione procedurale)",
            "NPC, Clienti e Cameriera: Emoji Unicode e Pixel Art custom",
            "Cibo e Bevande: Icone personalizzate",
            "Font: Fredoka (Google Fonts)",
            "Interfaccia Utente: HUD dinamico e responsivo",
            "",
            "💡 ISPIRAZIONI E RINGRAZIAMENTI",
            "=========================================",
            "Alla community di Phaser 3",
            "A tutti i tester e amici che hanno giocato",
            "Ai clienti del ristorante (anche quelli arrabbiati)",
            "A Ludovica (la bambina del gioco)",
            "A Elena (la mamma coraggiosa)",
            "Al vecchio proprietario scappato a Dubai",
            "",
            "🌍 LINGUE SUPPORTATE",
            "Italiano, Spagnolo, Francese, Tedesco, Turco,",
            "Russo, Giapponese, Polacco, Ungherese, Portoghese,",
            "Hindi, Coreano, Cinese, Arabo, Hawaiiano,",
            "Montenegrino, Curdo",
            "",
            "🎮 COME GIOCARE",
            "=========================================",
            "WASD / Frecce: Muovi la cameriera",
            "SPAZIO: Interagisci con il tavolo più vicino",
            "H: Vai a casa (cheat)",
            "Shift + K: Completa il livello (cheat)",
            "Shift + E: Sintonia al 100% con Elena (cheat)",
            "Shift + M: Ottieni 15.000€ (cheat)",
            "",
            "🏆 OBIETTIVO FINALE",
            "Raccogli 15.000€ e riacquista il ristorante!",
            "",
            "=========================================",
            "",
            "GRAZIE PER AVER GIOCATO!",
            "Mirko Yuri Donato - 2026",
            "",
            "❤️",
            "",
            "FINE",
            "",
            ""
        ];

        // --- 3. IMPOSTAZIONI DI SCORRIMENTO ---
        const textHeight = 30; // Altezza di ogni riga
        const startY = 700;    // Parte da sotto lo schermo
        const speed = 1.2;    // Velocità di scorrimento (più basso = più lento)

        let currentY = startY;
        let textObjects = [];

        // Crea tutte le righe di testo
        creditLines.forEach((line, index) => {
            // Formatta il testo: le righe con "=" sono titoli, le righe vuote sono spazi
            let color = '#ecf0f1';
            let fontSize = '18px';
            let fontStyle = 'normal';

            if (line.includes('=')) {
                color = '#d27d2d'; // Colore arancione per i separatori
                fontSize = '14px';
            } else if (line.includes('THE WAITRESS')) {
                color = '#ffd700'; // Oro per il titolo
                fontSize = '32px';
                fontStyle = 'bold';
            } else if (line.includes('SVILUPPO') || line.includes('TECNOLOGIE') || line.includes('GRAFICA')) {
                color = '#ffd700';
                fontSize = '22px';
                fontStyle = 'bold';
            } else if (line === 'FINE' || line === 'GRAZIE PER AVER GIOCATO!') {
                color = '#2ecc71'; // Verde per la fine
                fontSize = '28px';
                fontStyle = 'bold';
            }

            const textObj = this.add.text(400, currentY, line, {
                fontSize: fontSize,
                color: color,
                fontFamily: 'Fredoka',
                fontStyle: fontStyle,
                align: 'center'
            }).setOrigin(0.5).setDepth(10).setAlpha(0);

            textObjects.push(textObj);
            currentY += textHeight;
        });

        // --- 4. ANIMAZIONE DI SCORRIMENTO ---
        // Invece di usare un tween su ogni oggetto, usiamo un update che li sposta tutti insieme.
        // Appena il primo oggetto esce dallo schermo, lo rimuoviamo.

        // Variabile per tenere traccia del tempo di esecuzione
        let elapsedTime = 0;
        const totalDuration = textObjects.length * 100; // Durata totale in frame

        // Aggiungi un effetto "fade in" per i primi secondi
        this.cameras.main.fadeIn(1500, 0, 0, 0);

        // Memorizza i testi e la loro posizione per l'update
        this.creditTexts = textObjects;
        this.scrollSpeed = speed;
        this.startY = startY;
        this.textHeight = textHeight;

        // --- 5. PULSANTE PER SKIPPARE (opzionale) ---
        // Se il giocatore si stanca, può cliccare per andare al menu
        const skipBtn = this.add.text(750, 550, '⏩ SALTA', {
            fontSize: '14px',
            color: '#555555',
            fontFamily: 'Fredoka'
        }).setDepth(20).setInteractive({ useHandCursor: true });

        skipBtn.on('pointerover', () => skipBtn.setColor('#ffffff'));
        skipBtn.on('pointerout', () => skipBtn.setColor('#555555'));
        skipBtn.on('pointerdown', () => {
            this.endCredits();
        });

        // Variabile per sapere se i crediti sono finiti
        this.creditsFinished = false;
        this.finishTimer = null;
    }

    update() {
        // Sposta tutti i testi verso l'alto
        if (this.creditTexts) {
            let allOutOfScreen = true;

            this.creditTexts.forEach((textObj, index) => {
                if (textObj.active) {
                    textObj.y -= this.scrollSpeed;
                    
                    // Fade in quando entra dallo schermo
                    if (textObj.y < 650 && textObj.y > 500) {
                        textObj.setAlpha(Math.min(1, (650 - textObj.y) / 150));
                    } else if (textObj.y < 500) {
                        textObj.setAlpha(1);
                    } else if (textObj.y > 650) {
                        textObj.setAlpha(0);
                    }

                    // Se il testo è ancora visibile
                    if (textObj.y > -50) {
                        allOutOfScreen = false;
                    }
                }
            });

            // Se tutti i testi sono usciti dallo schermo, finisci i crediti
            if (allOutOfScreen && !this.creditsFinished) {
                this.creditsFinished = true;
                this.finishTimer = this.time.delayedCall(2000, () => {
                    this.endCredits();
                });
            }
        }
    }

    endCredits() {
        // Ferma la musica se c'è
        // if (this.music) this.music.stop();

        // Torna al menu
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1200, () => {
            this.scene.start('Menu');
        });
    }
}

// Registra la scena se non è già presente
if (typeof window.CreditsScene === 'undefined') {
    window.CreditsScene = CreditsScene;
}