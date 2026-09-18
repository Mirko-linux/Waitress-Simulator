class SaveMenu {
    constructor(scene) {
        this.scene = scene;
        this.overlay = null;
        this.buttons = [];
    }

    async showMenu() {
        if (this.overlay) { this.overlay.destroy(); this.overlay = null; }
        this.buttons.forEach(b => b.destroy());
        this.buttons = [];

        let hasSave = false;
        let isSaveValid = true;

        try {
            const raw = localStorage.getItem('waitress_save_data');
            if (raw) {
                hasSave = true;
                const parsed = JSON.parse(raw);
                // Se esiste una firma, verificala.
                // Se NON esiste la firma, considera il save valido
                // (compatibilità con vecchi salvataggi pre-firma).
                if (parsed && parsed.sig) {
                    isSaveValid = window.SaveManager.verifySave(parsed);
                } else {
                    isSaveValid = true;
                }
            }
        } catch(e) { hasSave = false; }

        this.overlay = this.scene.add.rectangle(400, 300, 620, 380, 0x110906, 0.9);
        this.overlay.setStrokeStyle(2, 0xd27d2d);
        this.overlay.setDepth(200);

        const title = this.scene.add.text(400, 130, "💾 MENU SALVATAGGIO", {
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

        if (hasSave) {
            createBtn(200, "▶ CONTINUA PARTITA", 0x27ae60, async () => {
                try {
                    const raw = localStorage.getItem('waitress_save_data');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        const loadedData = parsed.data || parsed;
                        Object.assign(GAME, loadedData);

                        if (!isSaveValid) {
                            // Save manomesso: segnala come cheater
                            GAME.isCheater = true;
                            // Flag persistente che sopravvive ai restart della scena
                            localStorage.setItem('waitress_cheater_flag', 'true');
                        } else {
                            // Save valido: pulisci SEMPRE il flag cheater
                            GAME.isCheater = false;
                            localStorage.removeItem('waitress_cheater_flag');
                        }

                        localStorage.setItem('waitress_tutorial_done', 'true');
                        this.closeMenu();
                        this.scene.scene.start('Game');
                    }
                } catch (e) {}
            });
            createBtn(270, "🔄 NUOVA PARTITA", 0xe74c3c, () => {
                this.closeMenu();
                this.newGame();
            });
        } else {
            createBtn(200, "🔄 NUOVA PARTITA", 0xe74c3c, () => {
                this.closeMenu();
                this.newGame();
            });
        }

        createBtn(340, "⬇️ ESPORTA BACKUP", 0x2980b9, async () => {
            await window.SaveManager.exportBackup();
        });
        createBtn(410, "⬆️ IMPORTA BACKUP", 0x8e44ad, () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const result = await window.SaveManager.importBackup(file);
                        if (result && result.cheater) {
                            // Fai finta che vada tutto bene: il flag è già settato
                            alert("✅ Backup importato con successo!");
                        } else {
                            alert("✅ Backup importato con successo!");
                        }
                        this.closeMenu();
                        this.scene.scene.restart();
                    } catch (error) {
                        alert(`❌ Errore: ${error}`);
                    }
                }
            };
            input.click();
        });
    }

    closeMenu() {
        if (this.overlay) { this.overlay.destroy(); this.overlay = null; }
        this.buttons.forEach(b => b.destroy());
        this.buttons = [];
    }

    async newGame() {
        await window.SaveManager.deleteSave();
        GAME.score = 0;
        GAME.level = 1;
        GAME.customersServed = 0;
        GAME.isCheater = false;
        localStorage.removeItem('waitress_cheater_flag');
        if (window.HOUSE_STATE) window.HOUSE_STATE.purchased = [];
        localStorage.removeItem('waitress_save_data');

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
            this.scene.scene.start('Game');
        });
        createSmallBtn(520, 330, "❌ NO", 0xe74c3c, () => {
            localStorage.setItem('waitress_tutorial_done', 'true');
            GAME.level = 1;
            GAME.customersTarget = 6 + GAME.level * 4;
            this.scene.scene.start('Game');
        });
    }
}

window.SaveMenu = SaveMenu;