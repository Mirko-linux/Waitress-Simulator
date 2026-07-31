// ============================================
// THE WAITRESS - Sistema Punteggio & Medaglie
// Modulo Fine Livello (Score & Summary)
// ============================================

(function () {
    // 1. DEFINIZIONE CRITERI MEDAGLIE E VALUTAZIONE
    const MEDAL_TYPES = {
        OK: {
            key: 'medaglia_ok',
            file: 'assets/Punteggio/MEDAGLIA_OK.png',
            title: 'OK',
            color: '#cd7f32',
            minScoreRatio: 0.5
        },
        BUONO: {
            key: 'medaglia_buono',
            file: 'assets/Punteggio/MedagliaBUONO.png',
            title: 'BUONO!',
            color: '#c0c0c0',
            minScoreRatio: 0.8
        },
        PERFETTO: {
            key: 'medaglia_perfetto',
            file: 'assets/Punteggio/MEDAGLIAPERFETTO.png',
            title: 'PERFETTO!',
            color: '#ffd700',
            minScoreRatio: 1.1
        },
        SUPER: {
            key: 'medaglia_super',
            file: 'assets/Punteggio/MedagliaSUPER.png',
            title: 'SUPER!',
            color: '#9b59b6',
            minScoreRatio: 1.4
        }
    };

    /**
     * Calcola quale medaglia assegnare al giocatore
     */
    function calculateMedal(score, targetScore) {
        const target = targetScore || 100;
        const ratio = score / target;

        if (ratio >= MEDAL_TYPES.SUPER.minScoreRatio) return MEDAL_TYPES.SUPER;
        if (ratio >= MEDAL_TYPES.PERFETTO.minScoreRatio) return MEDAL_TYPES.PERFETTO;
        if (ratio >= MEDAL_TYPES.BUONO.minScoreRatio) return MEDAL_TYPES.BUONO;
        return MEDAL_TYPES.OK;
    }

    // 2. SCENA PHASER: SCENA DI RIEPILOGO LIVELLO
    class LevelSummaryScene extends Phaser.Scene {
        constructor() {
            super({ key: 'LevelSummary' });
        }

        init(data) {
            this.levelData = {
                score: data.score || 0,
                served: data.served || 0,
                target: data.target || 10,
                lives: data.lives || 3,
                level: data.level || 1
            };
        }

        preload() {
            // Caricamento assets delle medaglie dalla cartella assets/Punteggio/
            Object.values(MEDAL_TYPES).forEach(medal => {
                if (!this.textures.exists(medal.key)) {
                    this.load.image(medal.key, medal.file);
                }
            });
        }

        create() {
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;

            // SFONDO SEMI-TRASPARENTE
            const bg = this.add.graphics();
            bg.fillStyle(0x000000, 0.75);
            bg.fillRect(0, 0, width, height);

            // PANNELLO CENTRALE
            const panelWidth = Math.min(width * 0.85, 480);
            const panelHeight = Math.min(height * 0.8, 520);
            const panelX = width / 2 - panelWidth / 2;
            const panelY = height / 2 - panelHeight / 2;

            const panel = this.add.graphics();
            panel.fillStyle(0x2a1a0a, 0.95);
            panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 16);
            panel.lineStyle(4, 0xe67e22, 1);
            panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 16);

            // CALCOLO MEDAGLIA
            const targetScore = this.levelData.target * 15;
            const medal = calculateMedal(this.levelData.score, targetScore);

            // TITOLO
            this.add.text(width / 2, panelY + 40, `LIVELLO ${this.levelData.level} COMPLETATO!`, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#f39c12',
                align: 'center'
            }).setOrigin(0.5);

            // IMMAGINE ASSET MEDAGLIA (Proporzioni corrette senza schiacciamento)
            const medalY = panelY + 120;
            if (this.textures.exists(medal.key)) {
                const medalImg = this.add.image(width / 2, medalY, medal.key);
                
                // Mantiene le proporzioni originali adattandole a una dimensione massima
                const maxDimension = 110;
                const scale = Math.min(maxDimension / medalImg.width, maxDimension / medalImg.height);
                medalImg.setScale(scale);
            }

            // TESTO MEDAGLIA (Mostra SOLO il titolo es. "SUPER!", senza "Medaglia: ")
            this.add.text(width / 2, panelY + 190, medal.title, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '28px',
                fontStyle: 'bold',
                fill: medal.color,
                align: 'center'
            }).setOrigin(0.5);

            // STATISTICHE (Invariate)
            const statsY = panelY + 250;
            const spacing = 32;

            const stats = [
                { label: 'Clienti Serviti:', value: `${this.levelData.served} / ${this.levelData.target}` },
                { label: 'Punteggio Finale:', value: `${this.levelData.score} PT` },
                { label: 'Vite Rimaste:', value: '❤️'.repeat(Math.max(0, this.levelData.lives)) }
            ];

            stats.forEach((stat, index) => {
                const y = statsY + (index * spacing);
                
                this.add.text(width / 2 - 130, y, stat.label, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '18px',
                    fill: '#ecf0f1',
                    align: 'left'
                }).setOrigin(0, 0.5);

                this.add.text(width / 2 + 130, y, stat.value, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '18px',
                    fontStyle: 'bold',
                    fill: '#2ecc71',
                    align: 'right'
                }).setOrigin(1, 0.5);
            });

            // PULSANTI (Invariati)
            const btnY = panelY + panelHeight - 50;

            this.createButton(width / 2 - 80, btnY, 'PROSSIMO LIVELLO', '#27ae60', () => {
                if (window.GAME) {
                    window.GAME.level++;
                    window.GAME.customersTarget += 2;
                }
                this.scene.start('GameScene');
            });

            this.createButton(width / 2 + 80, btnY, 'MENU PRINCIPALE', '#e74c3c', () => {
                this.scene.start('Menu');
            });
        }

        createButton(x, y, text, color, callback) {
            const btn = this.add.container(x, y);

            const bg = this.add.graphics();
            bg.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
            bg.fillRoundedRect(-70, -20, 140, 40, 8);

            const txt = this.add.text(0, 0, text, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                fontStyle: 'bold',
                fill: '#ffffff'
            }).setOrigin(0.5);

            btn.add([bg, txt]);
            btn.setSize(140, 40);
            btn.setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => {
                btn.setAlpha(0.85);
                btn.setScale(1.02);
            });

            btn.on('pointerout', () => {
                btn.setAlpha(1);
                btn.setScale(1);
            });

            btn.on('pointerdown', callback);
        }
    }

    // 3. REGISTRAZIONE E INTEGRAZIONE GLOBALE
    window.LevelSummaryScene = LevelSummaryScene;

    window.handleLevelComplete = function (score, servedCount) {
        const gameInstance = Phaser.GAMES ? Phaser.GAMES[0] : null;

        if (gameInstance) {
            const currentScene = gameInstance.scene.getScenes(true)[0];
            if (currentScene) {
                if (!currentScene.scene.get('LevelSummary')) {
                    currentScene.scene.add('LevelSummary', LevelSummaryScene, false);
                }

                currentScene.scene.start('LevelSummary', {
                    score: score,
                    served: servedCount,
                    target: window.GAME ? window.GAME.customersTarget : 10,
                    lives: window.GAME ? window.GAME.lives : 3,
                    level: window.GAME ? window.GAME.level : 1
                });
            }
        }
    };
})();