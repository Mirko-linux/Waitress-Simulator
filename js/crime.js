class CrimeSystem {
    constructor(scene) {
        this.scene = scene;
        
        // --- STATO ---
        this.hasAcceptedClanMission = false;
        this.clanMissionCompleted = false;
        this.hasClanSheet = false;
        this.inventory = [];
        
        // --- OGGETTI ILLEGALI ---
        this.hasPoison = false;
        this.hasFakePOS = false;
        
        // --- SOSPETTO ---
        this.suspicionLevel = 0;
        this.hasVPN = false;
        this.hasSecretCompartment = false;
        
        // --- COSTI ---
        this.poisonCost = 150;
        this.posCost = 250;
        this.vpnCost = 200;
        this.secretCompartmentCost = 300;
        
        this.loadCrimeData();
        this.createInventorySlot();
    }
    
    loadCrimeData() {
        const saved = localStorage.getItem('waitress_crime_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.hasAcceptedClanMission = data.hasAcceptedClanMission || false;
                this.clanMissionCompleted = data.clanMissionCompleted || false;
                this.hasClanSheet = data.hasClanSheet || false;
                this.inventory = data.inventory || [];
                this.hasPoison = data.hasPoison || false;
                this.hasFakePOS = data.hasFakePOS || false;
                this.suspicionLevel = data.suspicionLevel || 0;
                this.hasVPN = data.hasVPN || false;
                this.hasSecretCompartment = data.hasSecretCompartment || false;
            } catch(e) {}
        }
    }
    
    saveCrimeData() {
        localStorage.setItem('waitress_crime_data', JSON.stringify({
            hasAcceptedClanMission: this.hasAcceptedClanMission,
            clanMissionCompleted: this.clanMissionCompleted,
            hasClanSheet: this.hasClanSheet,
            inventory: this.inventory,
            hasPoison: this.hasPoison,
            hasFakePOS: this.hasFakePOS,
            suspicionLevel: this.suspicionLevel,
            hasVPN: this.hasVPN,
            hasSecretCompartment: this.hasSecretCompartment
        }));
    }
    
    createInventorySlot() {
        // Slot inventario in basso a destra (sopra la radio)
        this.inventorySlotBg = this.scene.add.rectangle(750, 530, 40, 40, 0x222222, 0.9).setDepth(100).setStrokeStyle(2, 0xd27d2d).setScrollFactor(0);
        this.inventorySlotText = this.scene.add.text(750, 530, '📦', { fontSize: '20px' }).setOrigin(0.5).setDepth(101).setScrollFactor(0);
        this.inventorySlotBg.setInteractive({ useHandCursor: true });
        this.inventorySlotBg.on('pointerdown', () => this.openInventory());
    }
    
    openInventory() {
        if (this.inventory.length === 0) return;
        
        const item = this.inventory[0];
        if (item === 'clan_sheet') {
            this.scene.showFloatingText(750, 500, '📄 Foglio del clan', '#ffd700');
            this.showClanSheet();
        } else if (item === 'poison') {
            this.scene.showFloatingText(750, 500, '🧪 Veleno', '#e74c3c');
        } else if (item === 'fake_pos') {
            this.scene.showFloatingText(750, 500, '💳 POS contraffatto', '#e74c3c');
        }
    }
    
    showClanSheet() {
        // Mostra un pannello con il sito da aprire su Gugol
        const container = this.scene.add.container(400, 300).setDepth(300).setScrollFactor(0);
        const bg = this.scene.add.rectangle(0, 0, 400, 250, 0x110906, 0.95).setStrokeStyle(2, 0xe74c3c);
        const title = this.scene.add.text(0, -80, '📄 FOGLIO SEGRETO', { fontSize: '20px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const site = this.scene.add.text(0, 0, '🔗 hiddenvault.com', { fontSize: '18px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const hint = this.scene.add.text(0, 50, 'Apri questo sito su Gugol...', { fontSize: '14px', color: '#aaaaaa', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const close = this.scene.add.text(150, -100, '✖', { fontSize: '24px', color: '#e74c3c' }).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => container.destroy());
        container.add([bg, title, site, hint, close]);
    }
    
    // --- CHIAMATA DEL CLAN ---
    triggerClanCall() {
        // Solo se il giocatore ha raggiunto un certo livello e non ha ancora completato la missione
        if (this.clanMissionCompleted || this.hasAcceptedClanMission) return;
        if (this.scene.phone) {
            this.scene.phone.triggerCall('clan');
        }
    }
    
    acceptClanMission() {
        this.hasAcceptedClanMission = true;
        this.saveCrimeData();
        
        // Teleporta un membro del clan nel ristorante
        const clanMember = this.scene.add.text(400, 300, '🧔‍♂️', { fontSize: '36px' }).setDepth(10);
        this.scene.time.delayedCall(2000, () => {
            clanMember.destroy();
            
            // Dà il foglio al giocatore
            this.inventory.push('clan_sheet');
            this.hasClanSheet = true;
            this.saveCrimeData();
            
            this.scene.showFloatingText(400, 300, '📄 Il clan ti ha lasciato un foglio', '#ffd700');
        });
    }
    
    // --- DARK WEB (HIDDENVAULT) ---
    openHiddenVault() {
        const container = this.scene.add.container(400, 300).setDepth(300).setScrollFactor(0);
        const bg = this.scene.add.rectangle(0, 0, 500, 350, 0x0a0a0a, 0.98).setStrokeStyle(2, 0x00ff00);
        const title = this.scene.add.text(0, -120, '🌐 HIDDENVAULT', { fontSize: '28px', color: '#00ff00', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const subtitle = this.scene.add.text(0, -80, 'Dark Web Marketplace', { fontSize: '14px', color: '#00aa00', fontFamily: 'Fredoka' }).setOrigin(0.5);
        
        // Oggetti disponibili
        const items = [
            { id: 'poison', name: '🧪 Veleno (non letale)', price: 150, desc: 'Avvelena un piatto senza uccidere' },
            { id: 'fake_pos', name: '💳 POS Contraffatto', price: 250, desc: 'Aumenta le entrate del 20%' },
            { id: 'vpn', name: '🔒 VPN', price: 200, desc: 'Riduce il sospetto del dark web del 50%' },
            { id: 'compartment', name: '📦 Scomparto Segreto', price: 300, desc: 'Nasconde oggetti illegali' }
        ];
        
        items.forEach((item, i) => {
            const yPos = -20 + i * 50;
            const itemBg = this.scene.add.rectangle(0, yPos, 450, 40, 0x1a1a1a).setStrokeStyle(1, 0x00ff00);
            const itemText = this.scene.add.text(-200, yPos, `${item.name} - ${item.price}€`, { fontSize: '14px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
            const buyBtn = this.scene.add.rectangle(180, yPos, 60, 30, 0x00aa00).setInteractive({ useHandCursor: true });
            const buyText = this.scene.add.text(180, yPos, 'Compra', { fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
            
            buyBtn.on('pointerdown', () => {
                if (window.GAME.score >= item.price) {
                    window.GAME.score -= item.price;
                    this.inventory.push(item.id);
                    if (item.id === 'poison') this.hasPoison = true;
                    if (item.id === 'fake_pos') this.hasFakePOS = true;
                    if (item.id === 'vpn') this.hasVPN = true;
                    if (item.id === 'compartment') this.hasSecretCompartment = true;
                    this.saveCrimeData();
                    this.scene.showFloatingText(400, 500, `✅ Comprato: ${item.name}`, '#2ecc71');
                } else {
                    this.scene.showFloatingText(400, 500, '❌ Soldi insufficienti', '#e74c3c');
                }
            });
            
            container.add([itemBg, itemText, buyBtn, buyText]);
        });
        
        const close = this.scene.add.text(200, -140, '✖', { fontSize: '24px', color: '#00ff00' }).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => container.destroy());
        container.add([bg, title, subtitle, close]);
    }
    
    // --- AVVELENA PIATTO ---
    poisonDish() {
        if (!this.hasPoison) return;
        if (this.scene.waitressState.tray.length !== 1) {
            this.scene.showFloatingText(400, 300, '⚠️ Il vassoio deve avere solo 1 piatto', '#ff4444');
            return;
        }
        
        const food = this.scene.waitressState.tray[0].food;
        this.scene.waitressState.tray[0].poisoned = true;
        this.hasPoison = false;
        this.inventory = this.inventory.filter(i => i !== 'poison');
        this.saveCrimeData();
        
        this.scene.showFloatingText(400, 300, '🧪 Piatto avvelenato!', '#e74c3c');
        this.scene.showFloatingText(400, 250, '⚠️ Il cliente si sentirà male...', '#ff4444');
    }
    
    // --- AGGIUNGI SOSPETTO ---
    addSuspicion(amount) {
        this.suspicionLevel = Math.min(100, this.suspicionLevel + amount);
        this.saveCrimeData();
        
        if (this.suspicionLevel >= 100) {
            this.triggerInspection();
        }
    }
    
    triggerInspection() {
        this.scene.showFloatingText(400, 300, '🕵️ ISPETTORE IN ARRIVO!', '#ff0000');
        this.scene.time.delayedCall(2000, () => {
            if (this.hasPoison || this.hasFakePOS) {
                this.scene.showFloatingText(400, 250, '🚨 TROVATI OGGETTI ILLEGALI!', '#ff0000');
                window.GAME.score -= 500;
                this.scene.time.delayedCall(2000, () => {
                    this.scene.scene.start('GameOver');
                });
            } else {
                this.scene.showFloatingText(400, 250, '✅ Nessun oggetto illegale', '#2ecc71');
                this.suspicionLevel = 0;
                this.saveCrimeData();
            }
        });
    }
}

window.CrimeSystem = CrimeSystem;