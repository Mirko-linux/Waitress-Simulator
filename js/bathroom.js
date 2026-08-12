class BathroomSystem {
    constructor(scene) {
        this.scene = scene;
        
        // --- IMPOSTAZIONI DI GIOCO ---
        this.baseIncrementRate = 0.40; // Aumentato: si riempie in circa 5 secondi
        this.femaleMultiplier = 1.8;   // Le donne vanno in bagno quasi il doppio più veloce
        
        // --- COORDINATE DEL BAGNO ---
        this.bathroomX = 620;
        this.bathroomY = 440;
        this.bathroomWidth = 150;
        this.bathroomHeight = 130;
        
        // Punto in cui il cliente sparisce e riappare dopo
        this.entryX = this.bathroomX - 6;    
        this.entryY = this.bathroomY + 65;   
        this.wcX = this.bathroomX + 95;
        this.wcY = this.bathroomY + 60;

        // --- STATO DEL BAGNO ---
        this.bathroomOccupied = false;
        this.occupiedText = null;
        this.customersInQueue = [];
        this.currentCustomerInBathroom = null;
        
        this.createBathroomGraphics();
        this.setupDebugging(); // Per vedere in console quando vanno in bagno
    }

    setupDebugging() {
        // Se vuoi vedere i messaggi nella console del browser, togli il commento qui sotto
        // console.log("🚻 BathroomSystem: Caricato con successo!");
    }

    createBathroomGraphics() {
        const scene = this.scene;
        
        // --- PAVIMENTO ---
        const floorBg = scene.add.rectangle(
            this.bathroomX + 75, 
            this.bathroomY + 65, 
            this.bathroomWidth, 
            this.bathroomHeight, 
            0x2c3e50, 0.9
        );
        floorBg.setDepth(0); 
        floorBg.setStrokeStyle(2, 0x1a252f);
        
        // --- PIASTRELLE ---
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
        
        // --- MURI ---
        const leftWallTop = scene.add.rectangle(this.bathroomX - 6, this.bathroomY + 25, 12, 45, 0x1a252f).setDepth(2);
        const leftWallBottom = scene.add.rectangle(this.bathroomX - 6, this.bathroomY + 105, 12, 50, 0x1a252f).setDepth(2);
        const rightWall = scene.add.rectangle(this.bathroomX + this.bathroomWidth + 6, this.bathroomY + 65, 12, this.bathroomHeight, 0x1a252f).setDepth(2);
        const topWall = scene.add.rectangle(this.bathroomX + 75, this.bathroomY - 6, this.bathroomWidth, 12, 0x1a252f).setDepth(2);
        const bottomWall = scene.add.rectangle(this.bathroomX + 75, this.bathroomY + this.bathroomHeight + 6, this.bathroomWidth, 12, 0x1a252f).setDepth(2);

        // --- PORTA ---
        const doorFrame = scene.add.rectangle(this.entryX + 6, this.entryY + 2, 38, 54, 0x2c3e50).setDepth(3);
        doorFrame.setStrokeStyle(2, 0x7f8c8d);
        const handle = scene.add.rectangle(this.entryX + 12, this.entryY + 2, 4, 10, 0xf1c40f).setDepth(4);
        const doorSign = scene.add.text(this.entryX + 6, this.entryY - 20, '🚻 INGRESSO', {
            fontSize: '10px', color: '#1abc9c', fontStyle: 'bold', fontFamily: 'Fredoka',
            backgroundColor: '#110906', padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(4);

        // --- WC ---
        const cubicle = scene.add.rectangle(this.wcX, this.wcY, 55, 65, 0x3d2518).setDepth(3);
        cubicle.setStrokeStyle(2, 0x5c2c16);
        const toilet = scene.add.text(this.wcX, this.wcY, '🚽', { fontSize: '40px' }).setOrigin(0.5).setDepth(4);
        const tp = scene.add.text(this.wcX + 20, this.wcY - 15, '🧻', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);
        
        // --- CARTELLI ---
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

        // Scansiona tutti i clienti attivi
        this.scene.customers.forEach(customer => {
            // Se è morto, in bagno o nel tutorial, salta
            if (!customer || customer.isDead || customer.isInBathroom || this.scene.tutorialActive) return;

            // --- GARANTISCI CHE bladder SIA INIZIALIZZATO ---
            if (customer.bladder === undefined || customer.bladder === null) {
                customer.bladder = 0;
            }

            // Calcola la velocità di riempimento
            let rate = this.baseIncrementRate;
            if (customer.gender === 'female') rate *= this.femaleMultiplier;

            customer.bladder += rate * deltaSec;
            customer.bladder = Math.min(customer.bladder, 100);

            // Aggiorna l'icona del water sopra la testa (se supera il 40%)
            this.updateBathroomBubble(customer);

            // --- CONTROLLO SOGLIA (FORZATO AL 60%) ---
            if (customer.bladder >= 60) {
                this.goToBathroom(customer);
            }
        });

        // Controlla se c'è qualcuno in coda che può entrare
        this.processQueue();
    }

    updateBathroomBubble(customer) {
        if (customer.bladder > 40 && !customer.bubbleIcon) {
            customer.bubbleIcon = this.scene.add.text(
                customer.x, customer.y - 45, '🚽', { fontSize: '26px' }
            ).setOrigin(0.5).setDepth(15);
            // Aggiungi un piccolo effetto di rimbalzo
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
        // Se il bagno è occupato, metti in coda
        if (this.bathroomOccupied) {
            if (!this.customersInQueue.includes(customer)) {
                this.customersInQueue.push(customer);
                // Penalità leggera per l'attesa
                customer.patience = Math.max(0, customer.patience - 2);
            }
            return;
        }

        // --- FORZA L'INGRESSO ---
        this.bathroomOccupied = true;
        this.currentCustomerInBathroom = customer;
        customer.isInBathroom = true;
        this.occupiedText.setVisible(true);
        
        // Rimuovi l'icona del water
        if (customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }

        // Salva la posizione originale per farlo tornare dopo
        const originalX = customer.x;
        const originalY = customer.y;

        // --- FASE 1: CAMMINA VERSO L'INGRESSO ---
        this.scene.tweens.add({
            targets: customer,
            x: this.entryX,    
            y: this.entryY,
            duration: 300,
            ease: 'Quad.easeIn',
            onComplete: () => {
                // --- FASE 2: ENTRA E SCOMPARE ---
                customer.x = this.wcX;
                customer.y = this.wcY;
                
                // Nascondi tutti i suoi elementi grafici
                if (customer.sprite) customer.sprite.setVisible(false);
                if (customer.emoji) customer.emoji.setVisible(false);
                if (customer.shadow) customer.shadow.setVisible(false);
                if (customer.orderBubble) customer.orderBubble.setVisible(false);
                if (customer.chatBubble) customer.chatBubble.setVisible(false);
                
                // Metti IN PAUSA il timer della pazienza (così non muore mentre è in bagno!)
                if (customer.timerEvent) customer.timerEvent.paused = true;

                // Tempo che ci mette in bagno (tra 2 e 4 secondi)
                const stayTime = Phaser.Math.Between(2000, 4000);

                this.scene.time.delayedCall(stayTime, () => {
                    // --- FASE 3: ESCE E TORNA AL TAVOLO ---
                    this.bathroomOccupied = false;
                    this.occupiedText.setVisible(false);
                    this.currentCustomerInBathroom = null;
                    
                    customer.isInBathroom = false;
                    customer.bladder = 0; // Vescica svuotata!
                    
                    // Riprendi il timer della pazienza
                    if (customer.timerEvent) customer.timerEvent.paused = false;

                    // Rendi visibili i grafici
                    if (customer.sprite) customer.sprite.setVisible(true);
                    if (customer.emoji) customer.emoji.setVisible(true);
                    if (customer.shadow) customer.shadow.setVisible(true);
                    if (customer.orderBubble) customer.orderBubble.setVisible(true);
                    if (customer.chatBubble) customer.chatBubble.setVisible(true);

                    // Torna al tavolo
                    this.scene.tweens.add({
                        targets: customer,
                        x: originalX,
                        y: originalY,
                        duration: 300,
                        ease: 'Quad.easeOut'
                    });

                    // Controlla se c'è qualcuno in coda
                    this.processQueue();
                });
            }
        });
    }

    processQueue() {
        if (!this.bathroomOccupied && this.customersInQueue.length > 0) {
            const nextCustomer = this.customersInQueue.shift();
            if (nextCustomer && !nextCustomer.isDead) {
                this.goToBathroom(nextCustomer);
            }
        }
    }

    reset() {
        this.bathroomOccupied = false;
        this.currentCustomerInBathroom = null;
        this.customersInQueue = [];
        if (this.occupiedText) this.occupiedText.setVisible(false);
        
        // Resetta la vescica di tutti i clienti attivi per evitare bug
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
console.log('🚻 BathroomSystem: Versione infallibile caricata!');