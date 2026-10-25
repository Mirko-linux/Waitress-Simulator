class SaveMenu {
    constructor(scene) {
        this.scene = scene;
        this.overlay = null;
        this.buttons = [];
        this.aiStatusLabel = null;
    }

    async showMenu() {
        if (this.overlay) { this.overlay.destroy(); this.overlay = null; }
        this.buttons.forEach(b => b.destroy());
        this.buttons = [];
        this.aiStatusLabel = null;

        let hasSave = false;
        let isSaveValid = true;

        try {
            const raw = localStorage.getItem('waitress_save_data');
            if (raw) {
                const parsed = JSON.parse(raw);
                const data = parsed.data || parsed;
                if (data && typeof data.level === 'number' && data.level > 0) {
                    hasSave = true;
                    if (parsed && parsed.sig) {
                        isSaveValid = window.SaveManager.verifySave(parsed);
                    } else {
                        isSaveValid = true;
                    }
                }
            }
        } catch(e) { hasSave = false; }

        let aiStatusText = '';
        let aiStatusColor = '#888888';

        try {
            const rawRef = localStorage.getItem('waitress_ai_model_ref');
            if (rawRef) {
                const ref = JSON.parse(rawRef);
                const isCached = await window.SaveManager.isAIModelCached(ref.id);
                if (isCached) {
                    aiStatusText = '✅ IA pronta (modello in cache locale)';
                    aiStatusColor = '#2ecc71';
                } else {
                    aiStatusText = '⚠️ IA in cache assente (verrà riscaricata)';
                    aiStatusColor = '#f39c12';
                }
            } else {
                aiStatusText = 'ℹ️ IA non ancora scaricata';
                aiStatusColor = '#95a5a6';
            }
        } catch (e) {
            aiStatusText = '⚠️ Impossibile verificare lo stato IA';
            aiStatusColor = '#f39c12';
        }

        this.overlay = this.scene.add.rectangle(400, 300, 620, 420, 0x110906, 0.9);
        this.overlay.setStrokeStyle(2, 0xd27d2d);
        this.overlay.setDepth(200);

        const title = this.scene.add.text(400, 115, "💾 MENU SALVATAGGIO", {
            fontSize: '28px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(201);
        this.buttons.push(title);

        const createBtn = (y, text, color, callback) => {
            const btn = this.scene.add.rectangle(400, y, 280, 44, color);
            btn.setStrokeStyle(2, 0xffd700);
            btn.setDepth(201);
            btn.setInteractive({ useHandCursor: true });
            const txt = this.scene.add.text(400, y, text, {
                fontSize: '16px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(202);
            this.buttons.push(btn, txt);
            btn.on('pointerdown', () => { triggerSfx('click'); callback(); });
            btn.on('pointerover', () => btn.setFillStyle(0xe59866));
            btn.on('pointerout', () => btn.setFillStyle(color));
        };

        let nextY = 175;

        if (hasSave) {
            createBtn(nextY, "▶ CONTINUA PARTITA", 0x27ae60, async () => {
                try {
                    const raw = localStorage.getItem('waitress_save_data');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        const loadedData = parsed.data || parsed;
                        Object.assign(GAME, loadedData);

                        if (typeof GAME.suspicion !== 'number') GAME.suspicion = 0;

                        if (!isSaveValid) {
                            GAME.isCheater = true;
                            localStorage.setItem('waitress_cheater_flag', 'true');
                        } else {
                            GAME.isCheater = false;
                            localStorage.removeItem('waitress_cheater_flag');
                        }

                        if (loadedData.housePurchased && window.HOUSE_STATE) {
                            window.HOUSE_STATE.purchased = loadedData.housePurchased;
                        }
                        if (loadedData.settings) {
                            GAME.settings = { ...GAME.settings, ...loadedData.settings };
                        }

                        localStorage.setItem('waitress_tutorial_done', 'true');
                        this.closeMenu();
                        this.scene.scene.start('Game');
                    }
                } catch (e) {}
            });
            nextY += 60;
            createBtn(nextY, "🔄 NUOVA PARTITA", 0xe74c3c, () => {
                this.showNewGameConfirmation();
            });
            nextY += 60;
        } else {
            createBtn(nextY, "🔄 NUOVA PARTITA", 0xe74c3c, () => {
                this.closeMenu();
                this.newGame();
            });
            nextY += 60;
        }

        createBtn(nextY, "⬇️ ESPORTA BACKUP", 0x2980b9, async () => {
            await window.SaveManager.exportBackup();
        });
        nextY += 60;

        createBtn(nextY, "⬆️ IMPORTA BACKUP", 0x8e44ad, () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const text = await file.text();
                        const result = await window.SaveManager.importBackup(text);

                        if (!result || result.success !== true) {
                            const errorMsg = result && result.error ? result.error : 'Firma non valida';
                            alert(`❌ Importazione rifiutata:\n${errorMsg}`);
                            return;
                        }

                        GAME.isCheater = false;
                        localStorage.removeItem('waitress_cheater_flag');
                        alert("✅ Backup importato con successo!");
                        this.closeMenu();
                        this.scene.scene.restart();
                    } catch (error) {
                        alert(`❌ Importazione rifiutata:\n${error.message || error}`);
                    }
                }
            };
            input.click();
        });

        if (aiStatusText) {
            this.aiStatusLabel = this.scene.add.text(400, nextY + 45, aiStatusText, {
                fontSize: '11px',
                color: aiStatusColor,
                fontFamily: 'Fredoka',
                align: 'center'
            }).setOrigin(0.5).setDepth(201);
            this.buttons.push(this.aiStatusLabel);
        }
    }

    closeMenu() {
        if (this.overlay) { this.overlay.destroy(); this.overlay = null; }
        this.buttons.forEach(b => b.destroy());
        this.buttons = [];
        this.aiStatusLabel = null;
    }

    showNewGameConfirmation() {
        const confirmationItems = [];
        const backdrop = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.65)
            .setInteractive()
            .setDepth(209);
        confirmationItems.push(backdrop);

        const confirmation = this.scene.add.rectangle(400, 300, 520, 220, 0x221111, 0.98)
            .setStrokeStyle(2, 0xe74c3c)
            .setDepth(210);
        confirmationItems.push(confirmation);

        const title = this.scene.add.text(400, 235, '⚠️ SOVRASCRIVERE IL SALVATAGGIO?', {
            fontSize: '20px', color: '#ff6b6b', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(211);
        confirmationItems.push(title);

        const message = this.scene.add.text(400, 280,
            'La partita salvata verrà eliminata e non potrà essere recuperata.', {
            fontSize: '14px', color: '#ffffff', align: 'center',
            wordWrap: { width: 440 }, fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(211);
        confirmationItems.push(message);

        const closeConfirmation = () => {
            confirmationItems.forEach(item => item.destroy());
        };

        const createConfirmationButton = (x, text, color, callback) => {
            const button = this.scene.add.rectangle(x, 355, 190, 44, color)
                .setDepth(211)
                .setInteractive({ useHandCursor: true });
            const label = this.scene.add.text(x, 355, text, {
                fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(212);
            confirmationItems.push(button, label);
            button.on('pointerdown', () => {
                triggerSfx('click');
                closeConfirmation();
                callback();
            });
            button.on('pointerover', () => button.setFillStyle(0xe59866));
            button.on('pointerout', () => button.setFillStyle(color));
        };

        createConfirmationButton(295, 'SÌ, NUOVA PARTITA', 0xe74c3c, () => {
            this.closeMenu();
            this.newGame();
        });
        createConfirmationButton(505, 'ANNULLA', 0x555555, () => {});
    }

    async newGame() {
        await window.SaveManager.deleteSave();
        localStorage.removeItem('waitress_save_data');
        localStorage.removeItem('waitress_crime_data');
        localStorage.removeItem('waitress_story_data');
        localStorage.removeItem('waitress_quest_data');


        localStorage.removeItem('waitress_identity_created');
        localStorage.removeItem('waitress_nickname');
        localStorage.removeItem('waitress_birth_day');
        localStorage.removeItem('waitress_birth_month');
        localStorage.removeItem('waitress_birth_year');

        await window.SaveManager.clearNPCMemories();

        GAME.score = 0;
        GAME.level = 1;
        GAME.customersServed = 0;
        GAME.isCheater = false;
        GAME.suspicion = 0;
        GAME.dirtyPlates = 0;
        GAME.lives = 3;
        GAME.carriedOrders = [];
        localStorage.removeItem('waitress_cheater_flag');
        if (window.HOUSE_STATE) window.HOUSE_STATE.purchased = [];

        const overlay = this.scene.add.rectangle(400, 300, 500, 200, 0x221111, 0.95);
        overlay.setStrokeStyle(2, 0xd27d2d);
        overlay.setDepth(210);

        const title = this.scene.add.text(400, 230, "👋 NUOVA CAMERIERA!", {
            fontSize: '22px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(211);

        const desc = this.scene.add.text(400, 270, "Prima di iniziare, vuoi seguire il tutorial?", {
            fontSize: '14px', color: '#e0d5c1', align: 'center', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(211);

        const createSmallBtn = (x, y, text, color, callback) => {
            const btn = this.scene.add.rectangle(x, y, 140, 44, color);
            btn.setDepth(211).setInteractive({ useHandCursor: true });
            const txt = this.scene.add.text(x, y, text, { fontSize: '16px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(212);
            btn.on('pointerdown', () => {
                triggerSfx('click');
                callback();
                overlay.destroy(); title.destroy(); desc.destroy(); btn.destroy(); txt.destroy();
            });
            btn.on('pointerover', () => btn.setFillStyle(0xe59866));
            btn.on('pointerout', () => btn.setFillStyle(color));
        };

        createSmallBtn(280, 330, "✅ SÌ", 0x27ae60, () => {
            localStorage.setItem('waitress_tutorial_done', 'false');
            window.FORCE_TUTORIAL = true;
            window.START_TUTORIAL_DIRECTLY = true;
            this.scene.scene.start('NewPlayer');
        });
        createSmallBtn(520, 330, "❌ NO", 0xe74c3c, () => {
            localStorage.setItem('waitress_tutorial_done', 'true');
            window.FORCE_TUTORIAL = false;
            GAME.level = 1;
            GAME.customersTarget = 6 + GAME.level * 4;
            this.scene.scene.start('NewPlayer');
        });
    }
}

window.SaveMenu = SaveMenu;