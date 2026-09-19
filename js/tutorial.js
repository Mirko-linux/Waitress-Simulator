// ============================================
// TUTORIAL SYSTEM - VERSIONE COMPLETA FUNZIONANTE
// ============================================

class TutorialSystem {
    constructor(scene) {
        this.scene = scene;
        this.isActive = true;
        this.tutorialCustomer = null;
        this.tutorialStep = 0;
        this.welcomeContainer = null;
        this.welcomeBg = null;
        this.tutorialPanel = null;
        this.arrowGraphic = null;
        this.finishTimer = null;
        this.completed = false;
        this._arrivalTimer = null;

        if (window._tutorialStarting) {
            console.warn("⚠️ Tutorial già in avvio, skip");
            this.skipTutorial();
            return;
        }
        window._tutorialStarting = true;

        this.scene.gameActive = true;
        this.scene.tutorialActive = true;
        if (this.scene.spawnEvent) {
            this.scene.spawnEvent.remove();
            this.scene.spawnEvent = null;
        }

        this.createWelcomeScreen();
    }

    // ==========================================
    // 1. SCHERMATA BENVENUTO
    // ==========================================
    createWelcomeScreen() {
        const scene = this.scene;

        this.welcomeBg = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.85)
            .setDepth(998)
            .setInteractive();

        this.welcomeContainer = scene.add.container(400, 300).setDepth(999);

        const bg = scene.add.rectangle(0, 0, 540, 340, 0x110906, 0.98);
        bg.setStrokeStyle(2, 0xd27d2d);

        const title = scene.add.text(0, -115, '👋 NUOVA CAMERIERA!', {
            fontSize: '26px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const desc = scene.add.text(0, -40,
            'Vuoi seguire il tutorial?\nSimuleremo una partita reale passo-passo.',
            {
                fontSize: '15px', color: '#ffffff', fontFamily: 'Fredoka',
                align: 'center', wordWrap: { width: 460 }, lineSpacing: 6
            }
        ).setOrigin(0.5);

        const btnYesBg = scene.add.rectangle(-95, 70, 170, 52, 0x2ecc71)
            .setStrokeStyle(2, 0x27ae60).setInteractive({ useHandCursor: true });
        const btnYesTxt = scene.add.text(-95, 70, '✅ SÌ', {
            fontSize: '18px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const btnNoBg = scene.add.rectangle(95, 70, 170, 52, 0xe74c3c)
            .setStrokeStyle(2, 0xc0392b).setInteractive({ useHandCursor: true });
        const btnNoTxt = scene.add.text(95, 70, '❌ NO', {
            fontSize: '18px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        btnYesBg.on('pointerover', () => btnYesBg.setFillStyle(0x27ae60));
        btnYesBg.on('pointerout', () => btnYesBg.setFillStyle(0x2ecc71));
        btnNoBg.on('pointerover', () => btnNoBg.setFillStyle(0xc0392b));
        btnNoBg.on('pointerout', () => btnNoBg.setFillStyle(0xe74c3c));

        btnYesBg.on('pointerdown', () => {
            triggerSfx('click');
            this.destroyWelcomeScreen();
            this.startTutorialGameplay();
        });

        btnNoBg.on('pointerdown', () => {
            triggerSfx('click');
            this.destroyWelcomeScreen();
            this.skipTutorial();
        });

        this.welcomeContainer.add([bg, title, desc, btnYesBg, btnYesTxt, btnNoBg, btnNoTxt]);
    }

    destroyWelcomeScreen() {
        if (this.welcomeBg) { this.welcomeBg.destroy(); this.welcomeBg = null; }
        if (this.welcomeContainer) { this.welcomeContainer.destroy(); this.welcomeContainer = null; }
        window._tutorialStarting = false;
    }

    // ==========================================
    // 2. SKIP
    // ==========================================
    skipTutorial() {
        localStorage.setItem('waitress_tutorial_done', 'true');
        this.cleanup();
        this.scene.tutorialActive = false;
        this.scene.tutorial = null;
        this.scene.tutorialStepTarget = null;

        window.GAME.level = 1;
        window.GAME.customersTarget = 6 + window.GAME.level * 4;
        this.scene.gameActive = true;
        this.scene.startSpawning();
    }

    // ==========================================
    // 3. AVVIA TUTORIAL
    // ==========================================
    startTutorialGameplay() {
        this.tutorialStep = 1;
        this.spawnTutorialCustomer();
        this.updateTutorialPanel();
        this.scene.gameActive = true;
    }

    // ==========================================
    // 4. CREA CLIENTE
    // ==========================================
    spawnTutorialCustomer() {
        const scene = this.scene;
        const table = scene.tables.find(t => t.id === 1);
        if (!table) return;

        table.reserved = true;
        table.occupied = true;
        table._seatedCustomer = null;
        table._activeOrder = null;
        table.status = 'in_arrivo';
        table.dirty = false;

        let customer = null;
        try {
            customer = scene.generateFallbackCustomer();
        } catch (e) {
            console.error("❌ generateFallbackCustomer errore:", e);
            return;
        }
        if (!customer) return;

        customer.name = 'Marco';
        customer.order = 'Pizza';
        customer.emojiChar = '👨';
        customer.table = table;
        customer.x = 240;
        customer.y = 592;
        customer.isDead = false;
        customer.patienceMultiplier = 0;
        customer.patience = 100;
        customer.bringsChild = false;

        table.customer = customer;
        scene.createCustomerGraphics(customer);
        scene.customers.push(customer);
        this.tutorialCustomer = customer;
        scene.moveCustomerToTable(customer);

        this._arrivalTimer = scene.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                if (!this.tutorialCustomer || this.tutorialCustomer.isDead) {
                    if (this._arrivalTimer) { this._arrivalTimer.remove(); this._arrivalTimer = null; }
                    return;
                }
                const c = this.tutorialCustomer;
                if (c.movementData && c.movementData.movementComplete) {
                    if (this._arrivalTimer) { this._arrivalTimer.remove(); this._arrivalTimer = null; }
                    table.status = 'ordinazione_pronta';
                    table.reserved = false;
                    table.occupied = true;
                    table._seatedCustomer = c;
                    if (c.bubble && c.bubble.active) {
                        c.bubble.setTexture('bubble_order');
                        c.bubble.setVisible(true);
                    }
                }
            }
        });

        scene.time.delayedCall(6000, () => {
            if (!this.tutorialCustomer || this.tutorialCustomer.isDead) return;
            const c = this.tutorialCustomer;
            if (!c.movementData || !c.movementData.movementComplete) {
                const seat = { x: table.x, y: table.y + 50 };
                if (c.sprite) { c.sprite.x = seat.x; c.sprite.y = seat.y; }
                if (c.emoji) { c.emoji.x = seat.x; c.emoji.y = seat.y; }
                if (c.shadow) { c.shadow.x = seat.x; c.shadow.y = seat.y + 10; }
                if (c.bubble) { c.bubble.x = seat.x; c.bubble.y = seat.y - 30; }
                c.x = seat.x; c.y = seat.y;
                if (c.movementData) c.movementData.movementComplete = true;
                table.status = 'ordinazione_pronta';
                table.reserved = false;
                table.occupied = true;
                table._seatedCustomer = c;
                if (c.bubble && c.bubble.active) {
                    c.bubble.setTexture('bubble_order');
                    c.bubble.setVisible(true);
                }
            }
        });
    }

    // ==========================================
    // 5. PANNELLO TUTORIAL
    // ==========================================
    updateTutorialPanel() {
        if (this.tutorialPanel) { this.tutorialPanel.destroy(); this.tutorialPanel = null; }
        if (this.arrowGraphic) { this.arrowGraphic.destroy(); this.arrowGraphic = null; }
        if (this.finishTimer) { this.finishTimer.remove(); this.finishTimer = null; }

        const scene = this.scene;

        const steps = [
            {},
            {
                title: '📋 STEP 1/6 — PRENDI L\'ORDINE',
                desc: 'Avvicinati al TAVOLO 1 con WASD\ne clicca sul cliente (o premi SPAZIO).',
                target: 'take_order'
            },
            {
                title: '📝 STEP 2/6 — PORTA LA COMANDA',
                desc: 'Vai al PASS PIATTI (zona a destra)\ne clicca per consegnare la comanda allo chef.',
                target: 'counter_order'
            },
            {
                title: '🍕 STEP 3/6 — RITIRA IL CIBO',
                desc: 'Il cuoco ha preparato la pizza!\nClicca di nuovo sul PASS PIATTI per ritirarla.',
                target: 'counter_pickup'
            },
            {
                title: '🍽️ STEP 4/6 — SERVI IL CLIENTE',
                desc: 'Torna al TAVOLO 1 e clicca sul cliente\nper servirgli la pizza calda.',
                target: 'serve_food'
            },
            {
                title: '🧹 STEP 5/6 — PULISCI IL TAVOLO',
                desc: 'Clicca sul TAVOLO 1 per raccogliere il piatto sporco,\npoi portalo al LAVELLO (in basso a sinistra).',
                target: 'clear_table'
            },
            {
                title: '🎉 STEP 6/6 — TUTORIAL COMPLETATO!',
                desc: 'Ottimo lavoro! Il gioco inizierà tra 2 secondi...',
                target: 'finish'
            }
        ];

        const current = steps[this.tutorialStep];
        if (!current) return;

        this.tutorialPanel = scene.add.container(400, 480).setDepth(999);

        const bg = scene.add.rectangle(0, 0, 660, 115, 0x110906, 0.96);
        bg.setStrokeStyle(2, 0xd27d2d);

        const title = scene.add.text(0, -35, current.title, {
            fontSize: '17px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const desc = scene.add.text(0, 12, current.desc, {
            fontSize: '13px', color: '#ffffff', fontFamily: 'Fredoka',
            align: 'center', wordWrap: { width: 620 }, lineSpacing: 4
        }).setOrigin(0.5);

        this.tutorialPanel.add([bg, title, desc]);

        this.scene.tutorialStepTarget = current.target || null;

        // Freccia
        if (current.target && this.tutorialStep < 6) {
            let tx = 0, ty = 0;

            if (current.target === 'take_order' || current.target === 'serve_food' || current.target === 'clear_table') {
                // Frecce verso il tavolo 1
                if (this.tutorialCustomer && this.tutorialCustomer.table) {
                    tx = this.tutorialCustomer.table.x;
                    ty = this.tutorialCustomer.table.y + 30;
                } else {
                    const t1 = scene.tables.find(t => t.id === 1);
                    if (t1) { tx = t1.x; ty = t1.y + 30; }
                }
            } else if (current.target === 'counter_order' || current.target === 'counter_pickup') {
                tx = 595;
                ty = 400;
            }

            if (tx || ty) this.drawArrow(tx, ty);
        }

        if (this.tutorialStep === 6) {
            this.finishTimer = this.scene.time.delayedCall(2200, () => this.finishTutorial());
        }
    }

    drawArrow(x, y) {
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        this.arrowGraphic = this.scene.add.graphics().setDepth(15);
        this.arrowGraphic.fillStyle(0xffd700, 1);
        this.arrowGraphic.fillTriangle(x - 14, y - 70, x + 14, y - 70, x, y - 38);
        this.arrowGraphic.fillRect(x - 3, y - 92, 6, 32);
        this.scene.tweens.add({
            targets: this.arrowGraphic,
            alpha: 0.5, y: '+=8',
            duration: 500, yoyo: true, repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // ==========================================
    // 6. AVANZA STEP
    // ==========================================
    progressStep() {
        if (this.completed) return;
        if (this.tutorialStep >= 6) {
            this.finishTutorial();
            return;
        }

        this.tutorialStep++;
        triggerSfx('coin');

        if (this.tutorialStep === 3) {
            this.forceKitchenComplete();
        }

        if (this.tutorialStep === 5) {
            // Entriamo nello step 5: il cliente è andato via, il tavolo è sporco
            this.forceTableDirty();
        }

        this.updateTutorialPanel();
    }

    // Forza la cucina a completare subito l'ordine della pizza
    forceKitchenComplete() {
        const scene = this.scene;
        if (!scene.kitchen) return;

        const arrays = ['orders', 'activeOrders', 'cookingOrders', 'queue', 'pendingOrders', 'dishes', 'items'];
        arrays.forEach(name => {
            if (Array.isArray(scene.kitchen[name])) {
                scene.kitchen[name].forEach(order => {
                    if (order) {
                        if (typeof order.remaining === 'number') order.remaining = 0;
                        if (typeof order.timeLeft === 'number') order.timeLeft = 0;
                        if (typeof order.progress === 'number') order.progress = 1;
                        if (typeof order.cookTime === 'number') order.cookTime = 0;
                        if (typeof order.timer === 'number') order.timer = 0;
                    }
                });
            }
        });

        if (typeof scene.kitchen.cookingTime !== 'undefined') scene.kitchen.cookingTime = 0;
    }

    // Forza il tavolo 1 ad essere sporco e rimuove il cliente
    forceTableDirty() {
        const scene = this.scene;
        const table = (this.tutorialCustomer && this.tutorialCustomer.table)
            ? this.tutorialCustomer.table
            : scene.tables.find(t => t.id === 1);
        if (!table) return;

        table.dirty = true;
        table.status = 'piatto_sporco';

        if (!table.dirtySprite && scene.textures.exists('Piatto Sporco')) {
            table.dirtySprite = scene.add.image(table.x, table.y + 15, 'Piatto Sporco')
                .setDisplaySize(32, 32)
                .setDepth(table.y + 1);
        } else if (!table.dirtySprite && !table.dirtyLabel) {
            table.dirtyLabel = scene.add.text(table.x, table.y + 15, '🍽️ SPORCO', {
                fontSize: '8px', color: '#e67e22', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(table.y + 1);
        }

        if (this.tutorialCustomer) {
            try {
                scene.removeCustomer(this.tutorialCustomer);
            } catch (e) {
                const c = this.tutorialCustomer;
                ['emoji', 'sprite', 'shadow', 'bubble', 'patienceBar', 'patienceBg', 'childGraphic'].forEach(k => {
                    if (c[k] && c[k].destroy) { try { c[k].destroy(); } catch(e){} }
                });
                const idx = scene.customers.indexOf(c);
                if (idx > -1) scene.customers.splice(idx, 1);
            }
            this.tutorialCustomer = null;
        }
    }

    // ==========================================
    // 7. FINE TUTORIAL
    // ==========================================
    finishTutorial() {
        if (this.completed) return;
        this.completed = true;

        if (this.finishTimer) { this.finishTimer.remove(); this.finishTimer = null; }

        this.cleanup();

        this.scene.tutorialActive = false;
        this.scene.tutorial = null;
        this.scene.tutorialStepTarget = null;
        window._tutorialStarting = false;

        localStorage.setItem('waitress_tutorial_done', 'true');

        window.GAME.level = 1;
        window.GAME.customersServed = 0;
        window.GAME.customersTarget = 6 + window.GAME.level * 4;
        window.GAME.lives = 3;
        window.GAME.dirtyPlates = 0;
        window.GAME.carriedOrder = null;

        if (this.scene.waitressState) this.scene.waitressState.tray = [];
        if (this.scene.ordersTaken !== undefined) this.scene.ordersTaken = 0;

        this.scene.tables.forEach(t => {
            t.occupied = false;
            t.reserved = false;
            t.customer = null;
            t._seatedCustomer = null;
            t._activeOrder = null;
            t.status = 'libero';
            t.dirty = false;
            if (t.dirtySprite) { t.dirtySprite.destroy(); t.dirtySprite = null; }
            if (t.dirtyLabel) { t.dirtyLabel.destroy(); t.dirtyLabel = null; }
        });

        if (this.scene.customers && this.scene.customers.length > 0) {
            [...this.scene.customers].forEach(c => {
                try { this.scene.removeCustomer(c); } catch(e) {}
            });
        }

        this.scene.updateHUD();
        this.scene.updateNotepadUI(false);

        this.scene.gameActive = true;
        this.scene.startSpawning();
    }

    // ==========================================
    // 8. CLEANUP
    // ==========================================
    cleanup() {
        if (this._arrivalTimer) { this._arrivalTimer.remove(); this._arrivalTimer = null; }
        if (this.tutorialPanel) { this.tutorialPanel.destroy(); this.tutorialPanel = null; }
        if (this.arrowGraphic) { this.arrowGraphic.destroy(); this.arrowGraphic = null; }

        if (this.tutorialCustomer) {
            try {
                this.scene.removeCustomer(this.tutorialCustomer);
            } catch (e) {
                const c = this.tutorialCustomer;
                ['emoji', 'sprite', 'shadow', 'bubble', 'patienceBar', 'patienceBg', 'childGraphic'].forEach(k => {
                    if (c[k] && c[k].destroy) { try { c[k].destroy(); } catch(e){} }
                });
                if (c.table) {
                    c.table.occupied = false;
                    c.table.customer = null;
                    c.table.status = 'libero';
                }
                const idx = this.scene.customers.indexOf(c);
                if (idx > -1) this.scene.customers.splice(idx, 1);
            }
            this.tutorialCustomer = null;
        }
    }
}

window.TutorialSystem = TutorialSystem;