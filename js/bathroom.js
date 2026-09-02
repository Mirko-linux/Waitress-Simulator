class BathroomSystem {
    constructor(scene) {
        this.scene = scene;
        
        // --- IMPOSTAZIONI DI GIOCO ---
        this.baseIncrementRate = 0.40; 
        this.femaleMultiplier = 1.8;   
        
        // --- COORDINATE DEL BAGNO ---
        this.bathroomX = 620;
        this.bathroomY = 440;
        this.bathroomWidth = 150;
        this.bathroomHeight = 130;
        
        this.entryX = this.bathroomX - 6;    
        this.entryY = this.bathroomY + 65;   
        this.wcX = this.bathroomX + 95;
        this.wcY = this.bathroomY + 60;

        // --- STATO DEL BAGNO ---
        this.bathroomOccupied = false;
        this.occupiedText = null;
        this.customersInQueue = [];
        this.currentCustomerInBathroom = null;
        
        // --- AUDIO SCARICO ---
        this.flushSound = null;
        
        this.createBathroomGraphics();
        this.setupAudio();
    }

    setupAudio() {
        if (this.scene.cache.audio.exists('scarico')) {
            this.flushSound = this.scene.sound.add('scarico');
        } else {
            console.warn("Audio 'scarico' non trovato. Il bagno funzionerà senza suono.");
            this.flushSound = null;
        }
    }

    createBathroomGraphics() {
        const scene = this.scene;
        
        const floorBg = scene.add.rectangle(
            this.bathroomX + 75, 
            this.bathroomY + 65, 
            this.bathroomWidth, 
            this.bathroomHeight, 
            0x2c3e50, 0.9
        );
        floorBg.setDepth(0); 
        floorBg.setStrokeStyle(2, 0x1a252f);
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const color = (i + j) % 2 === 0 ? 0x34495e : 0x2c3e50;
                const tile = scene.add.rectangle(
                    this.bathroomX + 20 + i * 35, 
                    this.bathroomY + 20 + j * 30, 
                    32, 28, 
                    color
                );
                tile.setDepth(1);
            }
        }
        
        const leftWallTop = scene.add.rectangle(this.bathroomX - 6, this.bathroomY + 25, 12, 45, 0x1a252f).setDepth(2);
        const leftWallBottom = scene.add.rectangle(this.bathroomX - 6, this.bathroomY + 105, 12, 50, 0x1a252f).setDepth(2);
        const rightWall = scene.add.rectangle(this.bathroomX + this.bathroomWidth + 6, this.bathroomY + 65, 12, this.bathroomHeight, 0x1a252f).setDepth(2);
        const topWall = scene.add.rectangle(this.bathroomX + 75, this.bathroomY - 6, this.bathroomWidth, 12, 0x1a252f).setDepth(2);
        const bottomWall = scene.add.rectangle(this.bathroomX + 75, this.bathroomY + this.bathroomHeight + 6, this.bathroomWidth, 12, 0x1a252f).setDepth(2);

        const doorFrame = scene.add.rectangle(this.entryX + 6, this.entryY + 2, 38, 54, 0x2c3e50).setDepth(3);
        doorFrame.setStrokeStyle(2, 0x7f8c8d);
        const handle = scene.add.rectangle(this.entryX + 12, this.entryY + 2, 4, 10, 0xf1c40f).setDepth(4);
        const doorSign = scene.add.text(this.entryX + 6, this.entryY - 20, '🚻 INGRESSO', {
            fontSize: '10px', color: '#1abc9c', fontStyle: 'bold', fontFamily: 'Fredoka',
            backgroundColor: '#110906', padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(4);

        const cubicle = scene.add.rectangle(this.wcX, this.wcY, 55, 65, 0x3d2518).setDepth(3);
        cubicle.setStrokeStyle(2, 0x5c2c16);
        const toilet = scene.add.text(this.wcX, this.wcY, '🚽', { fontSize: '40px' }).setOrigin(0.5).setDepth(4);
        const tp = scene.add.text(this.wcX + 20, this.wcY - 15, '🧻', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);
        
        const sign = scene.add.text(this.bathroomX + 75, this.bathroomY - 20, '🚻 WC', {
            fontSize: '16px', color: '#1abc9c', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(4);
        
        this.occupiedText = scene.add.text(this.bathroomX + 75, this.bathroomY + 25, '🔴 OCCUPATO', {
            fontSize: '12px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka', 
            backgroundColor: '#110906', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5).setVisible(false);
    }

    update(time, delta) {
        if (!this.scene || !this.scene.gameActive) return;
        const deltaSec = delta / 1000;

        // Scansiona i clienti NON in bagno
        this.scene.customers.forEach(customer => {
            if (!customer || customer.isDead || customer.isInBathroom || this.scene.tutorialActive) return;

            // --- BUG FIX 2: UN CLIENTE CHE STA MANGIANDO NON VA IN BAGNO ---
            if (customer.table && customer.table.status === 'mangia') return;

            if (customer.bladder === undefined || customer.bladder === null) {
                customer.bladder = 0;
            }

            let rate = this.baseIncrementRate;
            if (customer.gender === 'female') rate *= this.femaleMultiplier;

            customer.bladder += rate * deltaSec;
            customer.bladder = Math.min(customer.bladder, 100);

            this.updateBathroomBubble(customer);

            // --- CONTROLLO SOGLIA (60%) ---
            if (customer.bladder >= 60) {
                this.goToBathroom(customer);
            }
        });

        this.processQueue();
    }

    // --- BUG FIX 1: MUOVI LA GRAFICA, NON SOLO L'OGGETTO ---
    moveCustomerGraphics(customer, targetX, targetY, duration, onComplete) {
        // Muove TUTTE le parti grafiche del cliente insieme
        const targets = [];
        
        if (customer.emoji) targets.push(customer.emoji);
        if (customer.sprite) targets.push(customer.sprite);
        if (customer.shadow) targets.push(customer.shadow);
        
        // Se non ci sono elementi grafici (cliente eliminato), esci
        if (targets.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        this.scene.tweens.add({
            targets: targets,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                // Aggiorna anche le coordinate logiche
                customer.x = targetX;
                customer.y = targetY;
                if (onComplete) onComplete();
            }
        });
    }

    updateBathroomBubble(customer) {
        if (customer.bladder > 40 && !customer.bubbleIcon) {
            customer.bubbleIcon = this.scene.add.text(
                customer.x, customer.y - 45, '🚽', { fontSize: '26px' }
            ).setOrigin(0.5).setDepth(15);
            this.scene.tweens.add({
                targets: customer.bubbleIcon,
                y: customer.y - 55,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else if (customer.bladder <= 40 && customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }
    }

    goToBathroom(customer) {
        if (customer.isInBathroom || customer.isDead) return;
        if (customer.table && customer.table.status === 'mangia') return; // Non mandare chi mangia

        // Se il bagno è occupato, mettilo in coda
        if (this.bathroomOccupied) {
            if (!this.customersInQueue.includes(customer)) {
                this.customersInQueue.push(customer);
            }
            return;
        }

        // Occupa il bagno
        this.bathroomOccupied = true;
        this.currentCustomerInBathroom = customer;
        customer.isInBathroom = true;
        this.occupiedText.setVisible(true);
        
        // Rimuovi l'icona del water
        if (customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }

        // Salva posizione originale
        const originalX = customer.x;
        const originalY = customer.y;

        // --- FASE 1: MUOVI LA GRAFICA VERSO L'INGRESSO ---
        this.moveCustomerGraphics(customer, this.entryX, this.entryY, 300, () => {
            // --- FASE 2: ENTRA E SCOMPARE ---
            customer.x = this.wcX;
            customer.y = this.wcY;

            // Nascondi i grafici
            if (customer.sprite) customer.sprite.setVisible(false);
            if (customer.emoji) customer.emoji.setVisible(false);
            if (customer.shadow) customer.shadow.setVisible(false);
            if (customer.orderBubble) customer.orderBubble.setVisible(false);
            if (customer.chatBubble) customer.chatBubble.setVisible(false);
            
            // METTI IN PAUSA IL TIMER
            if (customer.timerEvent) customer.timerEvent.paused = true;

            // AUDIO SCARICO
            if (this.flushSound) {
                this.flushSound.play();
            }

            // Tempo in bagno
            const stayTime = Phaser.Math.Between(2000, 4000);

            this.scene.time.delayedCall(stayTime, () => {
                // --- BUG FIX 3: CONTROLLA CHE IL CLIENTE SIA ANCORA VIVO ---
                if (!customer || customer.isDead) {
                    // Il cliente è stato eliminato: libera il bagno
                    this.bathroomOccupied = false;
                    this.occupiedText.setVisible(false);
                    this.currentCustomerInBathroom = null;
                    this.processQueue();
                    return;
                }

                // --- FASE 3: ESCE E TORNA AL TAVOLO ---
                this.bathroomOccupied = false;
                this.occupiedText.setVisible(false);
                this.currentCustomerInBathroom = null;
                
                customer.isInBathroom = false;
                customer.bladder = 0; 
                
                // Riprendi il timer
                if (customer.timerEvent) customer.timerEvent.paused = false;

                // Rendi visibili i grafici
                if (customer.sprite) customer.sprite.setVisible(true);
                if (customer.emoji) customer.emoji.setVisible(true);
                if (customer.shadow) customer.shadow.setVisible(true);
                if (customer.orderBubble) customer.orderBubble.setVisible(true);
                if (customer.chatBubble) customer.chatBubble.setVisible(true);

                // Torna al tavolo (muovendo la grafica)
                this.moveCustomerGraphics(customer, originalX, originalY, 300, () => {
                    // Controlla la coda
                    this.processQueue();
                });
            });
        });
    }

    // --- BUG FIX 4: RIMUOVI IL CLIENTE DALLA CODA ---
    removeCustomerFromQueue(customer) {
        const index = this.customersInQueue.indexOf(customer);
        if (index > -1) {
            this.customersInQueue.splice(index, 1);
        }
    }

    processQueue() {
        if (!this.bathroomOccupied && this.customersInQueue.length > 0) {
            const nextCustomer = this.customersInQueue.shift();
            if (nextCustomer && !nextCustomer.isDead && !nextCustomer.isInBathroom) {
                this.goToBathroom(nextCustomer);
            }
        }
    }

    reset() {
        this.bathroomOccupied = false;
        this.currentCustomerInBathroom = null;
        this.customersInQueue = [];
        if (this.occupiedText) this.occupiedText.setVisible(false);
        
        if (this.scene) {
            this.scene.customers.forEach(c => {
                if (c && !c.isDead) {
                    c.isInBathroom = false;
                    if (c.timerEvent) c.timerEvent.paused = false;
                }
            });
        }
    }
}
window.BathroomSystem = BathroomSystem;