

const creditLines = [
    "WAITRESS SIMULATOR",
    "Un'avventura gestionale unica nel suo genere",
    "=========================================",
    "",
    "PRODUCER & DIRECTORIAL TEAM",
    "=========================================",
    "Direzione Creativa & Lead Design",
    "Mirko Donato",
    "",
    "Progettazione Architettura Software",
    "Mirko Donato",
    "",
    "STUDIO DI SVILUPPO",
    "=========================================",
    "Prodotto da",
    "Grand Epic Games Studio",
    "",
    " DIPARTIMENTO ENGINE & CORE PROGRAMMING",
    "=========================================",
    "Architettura di Gioco: HTML5 Game Loop Engine",
    "Framework Grafico: Phaser 3 Rendering Engine",
    "Linguaggio di Programmazione: JavaScript ECMAScript 2026+",
    "Gestione Canvas & Canvas2D Context: HTML5 Canvas API",
    "Accelerazione Hardware Grafica: WebGL / WebGPU Render Pipeline",
    "Sistema Salvataggi Locali: IndexedDB Storage & LocalStorage System",
    "Gestione Dipendenze & Moduli: ESM.sh / jsDelivr CDN Network",
    "",
    " DIPARTIMENTO INTELLIGENZA ARTIFICIALE",
    "=========================================",
    "Integrazione Modelli LLM Locali: WebLLM Framework",
    "Infrastruttura di Inferenza AI: MLC-AI Project",
    "Compilazione e Modelli: WebAssembly (WASM) Execution",
    "Generazione Dialoghi Dinamici NPC: Procedural Prompt Architecture",
    "",
    " DIPARTIMENTO AUDIO & SOUND DESIGN",
    "=========================================",
    "Engine Audio: Web Audio API Synthesizer Engine",
    "Elaborazione del Suono: Real-time Audio Oscillators",
    "Riproduzione Multitraccia: HTML5 Audio Buffer Streamer",
    "Sound Design & Mastering Effects: Mirko Donato",
    "",
    " DIPARTIMENTO GRAFICA & ASSETS VISUALI",
    "=========================================",
    "Mappatura Ambienti: Tilemap System & Generazione Procedurale",
    "Rendering Personaggi & NPC: Dynamic Unicode Sprites & Custom Pixel Art",
    "Disegno Interfaccia & HUD: Interactive Phaser GameObjects UI",
    "Tipografia & Caratteri: Fredoka (Google Fonts Project)",
    "",
    " STRUMENTI DI SVILUPPO & HARDWARE",
    "=========================================",
    "Ambiente di Sviluppo Integrato: VS Code / Web IDE",
    "Controllo Versione & Modifiche: Git Engine",
    "Testing e Debugging: Chromium Web Developer Tools",
    "Browser Target: Chrome, Firefox, Safari, Edge Support",
    "",
    " REPARTO LOCALIZZAZIONE & TRADUZIONI",
    "=========================================",
    "Pianificazione Supporto Multilingua",
    "Localizzazione Globale per le seguenti lingue:",
    "",
    "• Italiano (Lingua Madre / Originale)",
    "• Spagnolo (Español)",
    "• Francese (Français)",
    "• Tedesco (Deutsch)",
    "• Turco (Türkçe)",
    "• Russo (Русский)",
    "• Giapponese (日本語)",
    "• Polacco (Polski)",
    "• Ungherese (Magyar)",
    "• Portoghese (Português)",
    "• Hindi (हिन्दी)",
    "• Coreano (한국어)",
    "• Cinese (中文)",
    "• Arabo (العربية)",
    "• Hawaiiano (ʻŌlelo Hawaiʻi)",
    "• Montenegrino (Crnogorski)",
    "• Curdo (Kurdî)",
    "",
    " QUALITÀ & BETA TESTING",
    "=========================================",
    "Lead Quality Assurance Tester",
    "Mirko Donato",
    "",
    " ISPIRAZIONI E RINGRAZIAMENTI SPECIALI",
    "=========================================",
    "Alla Open Source Web Games Community",
    "Agli sviluppatori di Phaser 3 Framework",
    "Ai creatori dei modelli AI WebLLM/MLC-AI",
    "A chiunque abbia speso anche solo 5 minuti per giocare!",
    "",
    " STATISTICHE DI SVILUPPO",
    "=========================================",
    "Migliaia di righe di codice scritte",
    "Innumerevoli tazzine di caffè consumate",
    "Centinaia di bug trovati e sconfitti",
    "",
    " LICENZA & NOTE LEGALI",
    "=========================================",
    "Waitress Simulator © 2026 Mirko Donato",
    "Software Open Source rilasciato sotto Licenza MIT.",
    "Liberamente modificabile, distribuibile e riutilizzabile.",
    "",
    "Nessun cliente o cameriere virtuale è stato maltrattato",
    "durante lo sviluppo di questo videogioco.",
    "",
    "=========================================",
    "",
    "GRAZIE PER AVER GIOCATO!",
    "Mirko Donato",
    "",
    "❤️",
    "",
    "FINE",
    "",
    ""
];

class CreditsScene extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    create() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        this.cameras.main.setBackgroundColor('#0a0503');


        const bg = this.add.graphics();
        bg.fillStyle(0x1a0a04, 0.55);
        for (let i = 0; i < W; i += 40) {
            bg.fillRect(i, 0, 20, H);
        }
        bg.setDepth(0);


        const vignette = this.add.graphics();
        vignette.fillStyle(0x000000, 0.35);
        vignette.fillRect(0, 0, W, 80);
        vignette.fillRect(0, H - 80, W, 80);
        vignette.setDepth(1);


        this.creditsContainer = this.add.container(W / 2, H + 40);
        this.creditsContainer.setDepth(10);

        let yOffset = 0;
        const lineHeight = 26;
        const sectionGap = 14;

        creditLines.forEach((line) => {
            let fontSize = '16px';
            let color = '#e0d5c1';
            let fontStyle = 'normal';
            let extraGap = 0;

            const trimmed = line.trim();

            if (trimmed.startsWith('===')) {
                color = '#d27d2d';
                fontSize = '13px';
                extraGap = 2;
            } else if (
                trimmed.startsWith('🎮') ||
                trimmed.startsWith('🎬') ||
                trimmed.startsWith('🏢') ||
                trimmed.startsWith('💻') ||
                trimmed.startsWith('🤖') ||
                trimmed.startsWith('🎵') ||
                trimmed.startsWith('🎨') ||
                trimmed.startsWith('🛠️') ||
                trimmed.startsWith('🌍') ||
                trimmed.startsWith('🧪') ||
                trimmed.startsWith('💡') ||
                trimmed.startsWith('📊') ||
                trimmed.startsWith('📜')
            ) {
                color = '#ffd700';
                fontSize = '18px';
                fontStyle = 'bold';
                extraGap = 8;
            } else if (trimmed.startsWith('•')) {
                color = '#a0d8ef';
                fontSize = '14px';
            } else if (trimmed === 'GRAZIE PER AVER GIOCATO!') {
                color = '#ffd700';
                fontSize = '26px';
                fontStyle = 'bold';
                extraGap = 12;
            } else if (trimmed === 'FINE') {
                color = '#e74c3c';
                fontSize = '22px';
                fontStyle = 'bold';
                extraGap = 10;
            } else if (trimmed === '❤️') {
                color = '#ff4757';
                fontSize = '30px';
                extraGap = 6;
            } else if (trimmed === '') {

                yOffset += lineHeight * 0.5;
                return;
            }

            const text = this.add.text(0, yOffset, line, {
                fontSize: fontSize,
                color: color,
                fontStyle: fontStyle,
                fontFamily: 'Fredoka',
                align: 'center'
            }).setOrigin(0.5, 0);

            this.creditsContainer.add(text);
            yOffset += lineHeight + extraGap + sectionGap;
        });


        const totalHeight = yOffset + 120;


        const skipBg = this.add.rectangle(W - 70, 28, 110, 32, 0x000000, 0.7)
            .setStrokeStyle(1.5, 0xd27d2d)
            .setDepth(500)
            .setInteractive({ useHandCursor: true });

        const skipTxt = this.add.text(W - 70, 28, 'SALTA ▶', {
            fontSize: '13px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(501);

        skipBg.on('pointerover', () => skipBg.setFillStyle(0xd27d2d, 0.5));
        skipBg.on('pointerout', () => skipBg.setFillStyle(0x000000, 0.7));
        skipBg.on('pointerdown', () => {
            this.skipCredits(totalHeight);
        });

        this._skipBg = skipBg;
        this._skipTxt = skipTxt;



        const scrollSpeed = 45;
        const scrollDuration = (totalHeight / scrollSpeed) * 1000;

        this.scrollTween = this.tweens.add({
            targets: this.creditsContainer,
            y: -totalHeight,
            duration: scrollDuration,
            ease: 'Linear',
            onComplete: () => {
                this.showEndButtons();
            }
        });


        this.input.keyboard.on('keydown-ESC', () => this.skipCredits(totalHeight));
        this.input.keyboard.on('keydown-SPACE', () => this.skipCredits(totalHeight));
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this._endShown) {
                this.scene.start('Menu');
            } else {
                this.skipCredits(totalHeight);
            }
        });


        this.cameras.main.fadeIn(800, 0, 0, 0);
    }

    skipCredits(totalHeight) {
        if (this._endShown) return;

        if (this.scrollTween) {
            this.scrollTween.stop();
            this.scrollTween = null;
        }

        this.creditsContainer.y = -totalHeight;
        this.showEndButtons();
    }

    showEndButtons() {
        if (this._endShown) return;
        this._endShown = true;

        const W = this.cameras.main.width;
        const H = this.cameras.main.height;


        if (this._skipBg) {
            this._skipBg.destroy();
            this._skipBg = null;
        }
        if (this._skipTxt) {
            this._skipTxt.destroy();
            this._skipTxt = null;
        }


        const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0)
            .setDepth(900);

        this.tweens.add({
            targets: overlay,
            fillAlpha: 0.78,
            duration: 600,
            ease: 'Sine.easeOut'
        });


        const titleTxt = this.add.text(W / 2, H / 2 - 130, 'HAI VINTO', {
            fontSize: '46px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(901).setAlpha(0);

        this.tweens.add({
            targets: titleTxt,
            alpha: 1,
            y: H / 2 - 140,
            duration: 900,
            delay: 200,
            ease: 'Cubic.easeOut'
        });


        const finalScore = (window.GAME && typeof window.GAME.finalScore === 'number')
            ? window.GAME.finalScore
            : (window.GAME && window.GAME.score) || 0;

        const statsTxt = this.add.text(
            W / 2,
            H / 2 - 70,
            `Hai completato l'avventura!\nSaldo finale: ${finalScore}€`,
            {
                fontSize: '16px',
                color: '#e0d5c1',
                fontFamily: 'Fredoka',
                align: 'center',
                lineSpacing: 6
            }
        ).setOrigin(0.5).setDepth(901).setAlpha(0);

        this.tweens.add({
            targets: statsTxt,
            alpha: 1,
            duration: 700,
            delay: 600
        });


        const replayBg = this.add.rectangle(W / 2, H / 2 + 20, 300, 48, 0x27ae60)
            .setStrokeStyle(2, 0xffffff)
            .setDepth(901)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0);

        const replayTxt = this.add.text(W / 2, H / 2 + 20, 'GIOCA ANCORA', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(902).setAlpha(0);

        replayBg.on('pointerover', () => replayBg.setFillStyle(0x2ecc71));
        replayBg.on('pointerout', () => replayBg.setFillStyle(0x27ae60));
        replayBg.on('pointerdown', () => {
            this.restartGame();
        });


        const menuBg = this.add.rectangle(W / 2, H / 2 + 85, 300, 48, 0xd27d2d)
            .setStrokeStyle(2, 0xffd700)
            .setDepth(901)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0);

        const menuTxt = this.add.text(W / 2, H / 2 + 85, 'TORNA AL MENU', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(902).setAlpha(0);

        menuBg.on('pointerover', () => menuBg.setFillStyle(0xe59866));
        menuBg.on('pointerout', () => menuBg.setFillStyle(0xd27d2d));
        menuBg.on('pointerdown', () => {
            this.scene.start('Menu');
        });


        this.tweens.add({
            targets: [replayBg, replayTxt, menuBg, menuTxt],
            alpha: 1,
            duration: 600,
            delay: 1000,
            ease: 'Sine.easeOut'
        });
    }

    restartGame() {

        localStorage.removeItem('waitress_save_data');
        localStorage.removeItem('waitress_ending_seen');
        localStorage.removeItem('waitress_story_completed');
        localStorage.removeItem('waitress_tutorial_done');
        localStorage.removeItem('waitress_intro_seen');
        localStorage.removeItem('waitress_replay_day');
        localStorage.removeItem('waitress_original_day');
        localStorage.removeItem('waitress_cheater_flag');
        localStorage.removeItem('waitress_score_history');
        localStorage.removeItem('waitress_sponsor_state');
        localStorage.removeItem('waitress_missions_data');
        localStorage.removeItem('waitress_briscola_state');


        if (window.GAME) {
            window.GAME.score = 0;
            window.GAME.level = 1;
            window.GAME.customersServed = 0;
            window.GAME.customersTarget = 10;
            window.GAME.lives = typeof window.getMaxLives === 'function' ? window.getMaxLives() : 3;
            window.GAME.dirtyPlates = 0;
            window.GAME.carriedOrders = [];
            window.GAME.isCheater = false;
            window.GAME.hasWon = false;
            window.GAME.finalScore = 0;
        }

        if (window.HOUSE_STATE) {
            window.HOUSE_STATE.purchased = [];
        }
        if (window.RESTAURANT_STATE) {
            window.RESTAURANT_STATE.purchased = [];
        }


        this.scene.start('Menu');
    }
}

window.CreditsScene = CreditsScene;