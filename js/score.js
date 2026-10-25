(function () {
    const MEDAL_TYPES = {
        OK: { key: 'medaglia_ok', file: 'assets/Punteggio/MEDAGLIA_OK.png', title: 'OK', color: '#cd7f32', minScoreRatio: 0.5 },
        BUONO: { key: 'medaglia_buono', file: 'assets/Punteggio/MedagliaBUONO.png', title: 'BUONO!', color: '#c0c0c0', minScoreRatio: 0.8 },
        PERFETTO: { key: 'medaglia_perfetto', file: 'assets/Punteggio/MEDAGLIAPERFETTO.png', title: 'PERFETTO!', color: '#ffd700', minScoreRatio: 1.1 },
        SUPER: { key: 'medaglia_super', file: 'assets/Punteggio/MedagliaSUPER.png', title: 'SUPER!', color: '#9b59b6', minScoreRatio: 1.4 }
    };

    function calculateMedal(score, targetScore) {
        const target = targetScore || 100;
        const ratio = score / target;
        if (ratio >= MEDAL_TYPES.SUPER.minScoreRatio) return MEDAL_TYPES.SUPER;
        if (ratio >= MEDAL_TYPES.PERFETTO.minScoreRatio) return MEDAL_TYPES.PERFETTO;
        if (ratio >= MEDAL_TYPES.BUONO.minScoreRatio) return MEDAL_TYPES.BUONO;
        return MEDAL_TYPES.OK;
    }

    class LevelSummaryScene extends Phaser.Scene {
        constructor() { 
            super({ key: 'LevelSummary' }); 
        }

        init(data) {
            let calculatedRent = data.rent || 50;
            

            if (window.PriceSystem) {
                const tempPriceSys = new window.PriceSystem(this);
                tempPriceSys.updateInflation(data.level || 1);
                calculatedRent = tempPriceSys.getRentPrice(50);
            }

            const earned = data.earned || 0;
            const wastePenalty = data.wastePenalty || 0;
            

            let briscolaBonus = 0;
            try {
                const raw = localStorage.getItem('waitress_briscola_state');
                if (raw) {
                    const state = JSON.parse(raw);
                    if (state.completed && state.rewardGiven) {
                        briscolaBonus = 20;
                    }
                }
            } catch(e) {}

            const totalEarned = earned + briscolaBonus;
            const net = Math.max(0, totalEarned - calculatedRent - wastePenalty);

            this.levelData = {
                score: data.score || 0,
                earned: earned,
                rent: calculatedRent,
                net: net,
                served: data.served || 0,
                target: data.target || 10,
                lives: data.lives || 3,
                level: data.level || 1,
                waste: data.waste || 0,
                wastePenalty: wastePenalty
            };

            this.briscolaBonus = briscolaBonus;
        }

        preload() {
            Object.values(MEDAL_TYPES).forEach(medal => {
                if (!this.textures.exists(medal.key)) {
                    this.load.image(medal.key, medal.file);
                }
            });
        }

        create() {
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;

            const bg = this.add.graphics();
            bg.fillStyle(0x000000, 0.75);
            bg.fillRect(0, 0, width, height);

            const panelWidth = Math.min(width * 0.85, 480);
            const panelHeight = Math.min(height * 0.8, 580);
            const panelX = width / 2 - panelWidth / 2;
            const panelY = height / 2 - panelHeight / 2;

            const panel = this.add.graphics();
            panel.fillStyle(0x2a1a0a, 0.95);
            panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 16);
            panel.lineStyle(4, 0xe67e22, 1);
            panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 16);

            const totalEarned = this.levelData.earned + this.briscolaBonus;
            const targetScore = this.levelData.target * 15;
            const medal = calculateMedal(totalEarned, targetScore);

            this.add.text(width / 2, panelY + 40, `LIVELLO ${this.levelData.level} COMPLETATO!`, {
                fontSize: '24px', fontStyle: 'bold', fill: '#f39c12', align: 'center'
            }).setOrigin(0.5);

            const medalY = panelY + 120;
            if (this.textures.exists(medal.key)) {
                const medalImg = this.add.image(width / 2, medalY, medal.key);
                const maxDimension = 110;
                const scale = Math.min(maxDimension / medalImg.width, maxDimension / medalImg.height);
                medalImg.setScale(scale);
            } else {
                this.add.text(width / 2, medalY, '🏅', {
                    fontSize: '80px', align: 'center'
                }).setOrigin(0.5);
            }

            this.add.text(width / 2, panelY + 190, medal.title, {
                fontSize: '28px', fontStyle: 'bold', fill: medal.color, align: 'center'
            }).setOrigin(0.5);

            const statsY = panelY + 240;
            const spacing = 30;

            const stats = [
                { label: 'Clienti Serviti:', value: `${this.levelData.served} / ${this.levelData.target}`, color: '#2ecc71' },
                { label: 'Incassi totali:', value: `${this.levelData.earned} €`, color: '#2ecc71' },
                { label: 'Affitto (con inflazione):', value: `- ${this.levelData.rent} €`, color: '#e74c3c' },
                { label: 'Spreco cibo:', value: `- ${this.levelData.wastePenalty} €`, color: '#e74c3c' },
                { label: 'Saldo netto:', value: `${this.levelData.net} €`, color: '#2ecc71' },
                { label: 'Vite Rimaste:', value: '❤️'.repeat(Math.max(0, this.levelData.lives)), color: '#e74c3c' }
            ];

            if (this.briscolaBonus > 0) {
                stats.push({ label: '🃏 Bonus Briscola:', value: `+ ${this.briscolaBonus} €`, color: '#f1c40f' });
            }

            stats.forEach((stat, index) => {
                const y = statsY + (index * spacing);
                this.add.text(width / 2 - 140, y, stat.label, { 
                    fontSize: '17px', fill: '#ecf0f1', align: 'left' 
                }).setOrigin(0, 0.5);
                this.add.text(width / 2 + 140, y, stat.value, { 
                    fontSize: '17px', fontStyle: 'bold', fill: stat.color, align: 'right' 
                }).setOrigin(1, 0.5);
            });

            const btnY = panelY + panelHeight - 50;

            this.createButton(width / 2 - 80, btnY, 'PROSEGUI', '#2ecc71', () => {
                if (this.briscolaBonus > 0) {
                    try {
                        const raw = localStorage.getItem('waitress_briscola_state');
                        if (raw) {
                            const state = JSON.parse(raw);
                            state.rewardGiven = false;
                            localStorage.setItem('waitress_briscola_state', JSON.stringify(state));
                        }
                    } catch(e) {}
                }

                window.GAME.score = this.levelData.net;

                const saveData = {
                    score: window.GAME.score,
                    level: window.GAME.level + 1,
                    customersServed: 0,
                    lives: 3,
                    dirtyPlates: 0,
                    settings: window.GAME.settings,
                    housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : [],
                    restaurantPurchased: window.RESTAURANT_STATE ? window.RESTAURANT_STATE.purchased : []
                };
                localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

                if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
                    window.SaveManager.saveGame(saveData);
                }
                
                if (window.HouseScene && !this.scene.get('House')) {
                    this.scene.add('House', window.HouseScene, true);
                } else {
                    this.scene.start('House');
                }
            });

            this.createButton(width / 2 + 80, btnY, 'MENU', '#e74c3c', () => {
                if (this.briscolaBonus > 0) {
                    try {
                        const raw = localStorage.getItem('waitress_briscola_state');
                        if (raw) {
                            const state = JSON.parse(raw);
                            state.rewardGiven = false;
                            localStorage.setItem('waitress_briscola_state', JSON.stringify(state));
                        }
                    } catch(e) {}
                }
                window.GAME.score = this.levelData.net;
                this.scene.start('Menu');
            });
        }

        createButton(x, y, text, color, callback) {
            const btn = this.add.container(x, y);
            const bg = this.add.graphics();
            bg.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
            bg.fillRoundedRect(-70, -20, 140, 40, 8);
            const txt = this.add.text(0, 0, text, { fontSize: '12px', fontStyle: 'bold', fill: '#ffffff' }).setOrigin(0.5);
            btn.add([bg, txt]);
            btn.setSize(140, 40);
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => { btn.setAlpha(0.85); btn.setScale(1.02); });
            btn.on('pointerout', () => { btn.setAlpha(1); btn.setScale(1); });
            btn.on('pointerdown', callback);
        }
    }

    window.LevelSummaryScene = LevelSummaryScene;
})();