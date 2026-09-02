

class CreditsScene extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0502'); 

        
        
        
        

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
        const textHeight = 30; 
        const startY = 700;    
        const speed = 1.2;    

        let currentY = startY;
        let textObjects = [];

        creditLines.forEach((line, index) => {
            
            let color = '#ecf0f1';
            let fontSize = '18px';
            let fontStyle = 'normal';

            if (line.includes('=')) {
                color = '#d27d2d'; 
                fontSize = '14px';
            } else if (line.includes('THE WAITRESS')) {
                color = '#ffd700'; 
                fontSize = '32px';
                fontStyle = 'bold';
            } else if (line.includes('SVILUPPO') || line.includes('TECNOLOGIE') || line.includes('GRAFICA')) {
                color = '#ffd700';
                fontSize = '22px';
                fontStyle = 'bold';
            } else if (line === 'FINE' || line === 'GRAZIE PER AVER GIOCATO!') {
                color = '#2ecc71'; 
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

        
        
        

        
        let elapsedTime = 0;
        const totalDuration = textObjects.length * 100; 

        
        this.cameras.main.fadeIn(1500, 0, 0, 0);

        
        this.creditTexts = textObjects;
        this.scrollSpeed = speed;
        this.startY = startY;
        this.textHeight = textHeight;

        
        
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

        
        this.creditsFinished = false;
        this.finishTimer = null;
    }

    update() {
        
        if (this.creditTexts) {
            let allOutOfScreen = true;

            this.creditTexts.forEach((textObj, index) => {
                if (textObj.active) {
                    textObj.y -= this.scrollSpeed;
                    
                    
                    if (textObj.y < 650 && textObj.y > 500) {
                        textObj.setAlpha(Math.min(1, (650 - textObj.y) / 150));
                    } else if (textObj.y < 500) {
                        textObj.setAlpha(1);
                    } else if (textObj.y > 650) {
                        textObj.setAlpha(0);
                    }

                    
                    if (textObj.y > -50) {
                        allOutOfScreen = false;
                    }
                }
            });

            
            if (allOutOfScreen && !this.creditsFinished) {
                this.creditsFinished = true;
                this.finishTimer = this.time.delayedCall(2000, () => {
                    this.endCredits();
                });
            }
        }
    }

    endCredits() {
        
        

        
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1200, () => {
            this.scene.start('Menu');
        });
    }
}


if (typeof window.CreditsScene === 'undefined') {
    window.CreditsScene = CreditsScene;
}