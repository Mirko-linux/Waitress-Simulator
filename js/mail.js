class MailSystem {
    constructor(scene) {
        this.scene = scene;

        this.TAX_PERIOD_DAYS = 7;
        this.IRPEF_BRACKETS = [
            { limit: 28000, rate: 0.23 },
            { limit: 50000, rate: 0.35 },
            { limit: Infinity, rate: 0.43 }
        ];

        this.ADDIZIONALE_REGIONALE = 0.0123;
        this.ADDIZIONALE_COMUNALE = 0.008;
        this.RITENUTE_ACCONTO_DEFAULT = 500;

        this.lastDeclarationDay = 0;
        this.totalDeclaredIncome = 0;
        this.totalRealIncome = 0;
        this.taxEvasionTotal = 0;
        this.declarations = [];
        this.auditCount = 0;

        this.hasLetter = false;
        this.letterRead = false;
        this.letterDelivered = false;
        this.knowsHowToDeclare = false;

        this.iveaFlyerDelivered = false;
        this.iveaFlyerRead = false;
        this.knowsIveaExists = true;

        this.overdueDays = 0;
        this.auditTriggered = false;
        this.auditInProgress = false;
        this.scheduledAuditDay = null;

        this.letterSprite = null;
        this.letterZone = null;
        this.letterGlow = null;
        this.mailboxSprite = null;

        this.iveaFlyerSprite = null;
        this.iveaFlyerZone = null;
        this.iveaFlyerGlow = null;

        this.iveaDeliveries = [];

        this.loadMailData();
        this.loadIveaDeliveries();
    }

    loadMailData() {
        const saved = localStorage.getItem('waitress_mail_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.lastDeclarationDay = data.lastDeclarationDay || 0;
                this.totalDeclaredIncome = data.totalDeclaredIncome || 0;
                this.totalRealIncome = data.totalRealIncome || 0;
                this.taxEvasionTotal = data.taxEvasionTotal || 0;
                this.declarations = data.declarations || [];
                this.auditCount = data.auditCount || 0;
                this.hasLetter = data.hasLetter || false;
                this.letterRead = data.letterRead || false;
                this.letterDelivered = data.letterDelivered || false;
                this.knowsHowToDeclare = data.knowsHowToDeclare || false;
                this.iveaFlyerDelivered = data.iveaFlyerDelivered || false;
                this.iveaFlyerRead = data.iveaFlyerRead || false;
                this.knowsIveaExists = true;
                this.overdueDays = data.overdueDays || 0;
                this.auditTriggered = data.auditTriggered || false;
                this.scheduledAuditDay = data.scheduledAuditDay || null;
            } catch (e) {}
        }
    }

    saveMailData() {
        localStorage.setItem('waitress_mail_data', JSON.stringify({
            lastDeclarationDay: this.lastDeclarationDay,
            totalDeclaredIncome: this.totalDeclaredIncome,
            totalRealIncome: this.totalRealIncome,
            taxEvasionTotal: this.taxEvasionTotal,
            declarations: this.declarations,
            auditCount: this.auditCount,
            hasLetter: this.hasLetter,
            letterRead: this.letterRead,
            letterDelivered: this.letterDelivered,
            knowsHowToDeclare: this.knowsHowToDeclare,
            iveaFlyerDelivered: this.iveaFlyerDelivered,
            iveaFlyerRead: this.iveaFlyerRead,
            knowsIveaExists: true,
            overdueDays: this.overdueDays,
            auditTriggered: this.auditTriggered,
            scheduledAuditDay: this.scheduledAuditDay
        }));
    }

    loadIveaDeliveries() {
        try {
            const raw = localStorage.getItem('waitress_ivea_deliveries_v2');
            this.iveaDeliveries = raw ? JSON.parse(raw) : [];
        } catch (e) {
            this.iveaDeliveries = [];
        }
    }

    saveIveaDeliveries() {
        localStorage.setItem('waitress_ivea_deliveries_v2',
            JSON.stringify(this.iveaDeliveries || []));
    }

    queueIveaDelivery(item) {
        this.loadIveaDeliveries();

        const currentDay = this.getCurrentDay();
        const deliveryDay = currentDay + 2;

        const delivery = {
            id: item.id,
            name: item.name,
            emoji: item.emoji || '📦',
            price: item.price || 0,
            target: item.target || 'house',
            orderDay: currentDay,
            deliveryDay: deliveryDay,
            timestamp: Date.now()
        };

        this.iveaDeliveries.push(delivery);
        this.saveIveaDeliveries();

        if (this.scene && this.scene.showFloatingText) {
            this.scene.showFloatingText(400, 250,
                `📦 Ordine confermato! Consegna: Giorno ${deliveryDay}`,
                '#2ecc71');
        }

        return delivery;
    }

    getIveaDeliveriesFor(target) {
        this.loadIveaDeliveries();
        return (this.iveaDeliveries || []).filter(d => d.target === target);
    }

    getReadyDeliveries(target) {
        const currentDay = this.getCurrentDay();
        return this.getIveaDeliveriesFor(target).filter(d => currentDay >= d.deliveryDay);
    }

    consumeDelivery(delivery) {
        this.loadIveaDeliveries();
        this.iveaDeliveries = (this.iveaDeliveries || []).filter(
            d => !(d.id === delivery.id && d.orderDay === delivery.orderDay)
        );
        this.saveIveaDeliveries();
    }

    getCurrentDay() {
        return (window.GAME && window.GAME.level) ? window.GAME.level : 1;
    }

    getPriceCatalog() {
        return {
            
            notebook: 300,
            ads: 500,
            cards: 150,
            wifi: 500,
            internetwork: 500,
            'amica di tutti': 800,
            shopping: 1000,
            
            wardrobe: 120,
            coffee_machine: 140,
            display_case: 180,
            calendar: 100,
            house_plant: 30,
            house_radio: 75,
            crib: 200,
            double_bed: 350,
            alarm_system: 300,
            desk: 100,
            bookshelf: 200,
            modem: 300,
            
            resto_tv: 1500,
            resto_radio: 120,
            resto_plant: 50,
            smoke_detector: 250
        };
    }

    getDeductibleExpenses() {
        const catalog = this.getPriceCatalog();
        const expenses = [];

        
        try {
            const upgrades = JSON.parse(localStorage.getItem('waitress_house_upgrades') || '{}');
            Object.entries(upgrades).forEach(([id, lvl]) => {
                const base = catalog[id];
                if (!base || !lvl) return;
                let total = 0;
                for (let i = 0; i < lvl; i++) {
                    total += Math.floor(base * (1 + i * 0.2));
                }
                if (total > 0) {
                    const pretty = id.charAt(0).toUpperCase() + id.slice(1);
                    expenses.push({
                        id: `upg_${id}`,
                        label: `Potenziamento: ${pretty} (Lv.${lvl})`,
                        amount: total,
                        category: 'upgrade'
                    });
                }
            });
        } catch (e) {}

        
        try {
            const house = JSON.parse(localStorage.getItem('waitress_house_data') || '{}');
            (house.purchased || []).forEach(id => {
                const price = catalog[id];
                if (price) {
                    expenses.push({
                        id: `ivea_house_${id}`,
                        label: `Arredo casa: ${id}`,
                        amount: price,
                        category: 'ivea_house'
                    });
                }
            });
        } catch (e) {}

        
        try {
            const sd = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
            const data = sd.data || sd;
            (data.restaurantPurchased || []).forEach(entry => {
                const id = (typeof entry === 'string') ? entry : entry.id;
                const price = catalog[id];
                if (price) {
                    expenses.push({
                        id: `ivea_resto_${id}`,
                        label: `Arredo ristorante: ${id}`,
                        amount: price,
                        category: 'ivea_resto'
                    });
                }
            });
        } catch (e) {}

        
        try {
            const house = JSON.parse(localStorage.getItem('waitress_house_data') || '{}');
            if ((house.totalRentPaid || 0) > 0) {
                expenses.push({
                    id: 'rent_paid',
                    label: 'Canone di locazione pagato',
                    amount: house.totalRentPaid,
                    category: 'rent'
                });
            }
        } catch (e) {}

        return expenses;
    }

    playerActuallyOwns(expenseId) {
        const parts = String(expenseId).split('_');
        const kind = parts[0];

        if (kind === 'upg') {
            const realId = parts.slice(1).join('_');
            const upg = JSON.parse(localStorage.getItem('waitress_house_upgrades') || '{}');
            return (upg[realId] || 0) > 0;
        }

        if (kind === 'ivea' && parts[1] === 'house') {
            const itemId = parts.slice(2).join('_');
            const h = JSON.parse(localStorage.getItem('waitress_house_data') || '{}');
            return (h.purchased || []).includes(itemId);
        }

        if (kind === 'ivea' && parts[1] === 'resto') {
            const itemId = parts.slice(2).join('_');
            const sd = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
            const d = sd.data || sd;
            const list = d.restaurantPurchased || [];
            return list.some(entry => (typeof entry === 'string' ? entry : entry.id) === itemId);
        }

        if (kind === 'rent' && parts[1] === 'paid') {
            const h = JSON.parse(localStorage.getItem('waitress_house_data') || '{}');
            return (h.totalRentPaid || 0) > 0;
        }

        return false;
    }

    
    
    

    isDeclarationDue() {
        const currentDay = this.getCurrentDay();
        return (currentDay - this.lastDeclarationDay) >= this.TAX_PERIOD_DAYS;
    }

    getDaysOverdue() {
        const currentDay = this.getCurrentDay();
        const deadline = this.lastDeclarationDay + this.TAX_PERIOD_DAYS;
        return Math.max(0, currentDay - deadline);
    }

    getRealIncome() {
        const baseIncome = (window.GAME && window.GAME.score) ? window.GAME.score : 0;
        const illegalIncome = this.getIllegalIncome();
        return baseIncome + illegalIncome;
    }

    getIllegalIncome() {
        let illegal = 0;
        if (this.scene && this.scene.crime) {
            if (this.scene.crime.posUsageCount > 0) {
                illegal += this.scene.crime.posUsageCount * 100;
            }
            if (this.scene.crime.clanMissionCompleted) {
                illegal += 500;
            }
        }
        return illegal;
    }

    calculateIRPEFLorda(income) {
        let tax = 0;
        let previousLimit = 0;

        for (const bracket of this.IRPEF_BRACKETS) {
            if (income <= previousLimit) break;
            const taxableInBracket = Math.min(income, bracket.limit) - previousLimit;
            tax += taxableInBracket * bracket.rate;
            previousLimit = bracket.limit;
        }

        return Math.floor(tax);
    }

    calculateDetrazioni(income) {
        let detrazione = 0;

        if (income <= 15000) {
            detrazione = 1910;
        } else if (income <= 28000) {
            detrazione = 1910 * (28000 - income) / 13000;
        }

        if (window.HOUSE_STATE && Array.isArray(window.HOUSE_STATE.purchased)) {
            if (window.HOUSE_STATE.purchased.includes('double_bed')) {
                detrazione += 950;
            }
            if (window.HOUSE_STATE.purchased.includes('crib')) {
                detrazione += 950;
            }
        }

        if (window.GAME && window.GAME.hasRentContract) {
            detrazione += 300;
        }

        return Math.floor(detrazione);
    }

    calculateAddizionali(income) {
        const regionale = Math.floor(income * this.ADDIZIONALE_REGIONALE);
        const comunale = Math.floor(income * this.ADDIZIONALE_COMUNALE);
        return { regionale, comunale, totale: regionale + comunale };
    }

    /**
     * @param {number} declaredIncome
     * @param {number} oneriExtra  detrazioni aggiuntive da oneri scaricati
     * @param {boolean} applyAcconto  aggiunge acconto IRPEF 50% anno successivo
     */
    calculateDeclaration(declaredIncome, oneriExtra = 0, applyAcconto = false) {
        const irpefLorda = this.calculateIRPEFLorda(declaredIncome);
        const detrazioni = this.calculateDetrazioni(declaredIncome) + Math.max(0, oneriExtra);
        const irpefNetta = Math.max(0, irpefLorda - detrazioni);
        const addizionali = this.calculateAddizionali(declaredIncome);
        const totaleDovuto = irpefNetta + addizionali.totale;
        const ritenute = this.RITENUTE_ACCONTO_DEFAULT;
        const saldo = totaleDovuto - ritenute;

        const acconto = applyAcconto && saldo > 0 ? Math.floor(saldo * 0.5) : 0;

        return {
            redditoDichiarato: declaredIncome,
            irpefLorda,
            detrazioni,
            irpefNetta,
            addizionaleRegionale: addizionali.regionale,
            addizionaleComunale: addizionali.comunale,
            totaleDovuto,
            ritenute,
            saldo,
            acconto,
            credito: saldo < 0 ? Math.abs(saldo) : 0,
            debito: saldo > 0 ? saldo : 0
        };
    }

    
    
    

    spawnMailbox() {
        if (this.mailboxSprite) return;
        if (!this.scene.add || !this.scene.player) return;

        const x = 320;
        const y = 555;

        this.mailboxSprite = this.scene.add.text(x, y, '📮', {
            fontSize: '30px'
        }).setOrigin(0.5).setDepth(15);
    }

    deliverIveaFlyer() {
        if (this.iveaFlyerDelivered) return;
        if (!this.scene.add || !this.scene.player) return;

        this.iveaFlyerDelivered = true;
        this.saveMailData();

        this.showMailNotification('📬', '#ffda1a', 'HAI RICEVUTO DELLA POSTA');

        const x = 350;
        const y = 545;

        this.iveaFlyerGlow = this.scene.add.graphics()
            .setDepth(19)
            .fillStyle(0x0051ba, 0.25)
            .fillCircle(x, y, 22);

        this.scene.tweens.add({
            targets: this.iveaFlyerGlow,
            alpha: 0.05,
            duration: 900,
            yoyo: true,
            repeat: -1
        });

        this.iveaFlyerSprite = this.scene.add.text(x, y, '📰', {
            fontSize: '24px'
        }).setOrigin(0.5).setDepth(20);

        this.scene.tweens.add({
            targets: this.iveaFlyerSprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 700,
            yoyo: true,
            repeat: -1
        });

        this.iveaFlyerZone = this.scene.add.zone(x, y, 50, 50)
            .setDepth(21)
            .setInteractive({ useHandCursor: true });

        this.iveaFlyerZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(
                this.scene.player.x, this.scene.player.y, x, y
            );
            if (dist <= 90) this.openIveaFlyer();
        });
    }

    openIveaFlyer() {
        if (this.iveaFlyerSprite) { this.iveaFlyerSprite.destroy(); this.iveaFlyerSprite = null; }
        if (this.iveaFlyerZone) { this.iveaFlyerZone.destroy(); this.iveaFlyerZone = null; }
        if (this.iveaFlyerGlow) { this.iveaFlyerGlow.destroy(); this.iveaFlyerGlow = null; }

        this.iveaFlyerRead = true;
        this.knowsIveaExists = true;
        this.saveMailData();

        const container = this.scene.add.container(400, 300).setDepth(4500).setScrollFactor(0);

        const bg = this.scene.add.rectangle(0, 0, 500, 420, 0x0051ba, 0.98)
            .setStrokeStyle(3, 0xffda1a);

        const header = this.scene.add.text(0, -180, 'IVEA', {
            fontSize: '48px', color: '#ffda1a', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const subheader = this.scene.add.text(0, -130, 'Arredamento per Casa & Ristorante', {
            fontSize: '14px', color: '#ffffff', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const line = this.scene.add.rectangle(0, -100, 420, 2, 0xffda1a);

        const body = this.scene.add.text(0, 20,
            '🛋️ ARREDA LA TUA CASA\n' +
            '🍽️ ALLESTISCI IL TUO RISTORANTE\n\n' +
            'Visita il nostro sito web:\n' +
            '🔍 Cerca "IVEA" su Gugol\n\n' +
            'Oppure usa il computer di casa\n' +
            'per accedere al nostro catalogo online.',
            {
                fontSize: '15px', color: '#ffffff', align: 'center',
                fontFamily: 'Fredoka', lineSpacing: 6
            }
        ).setOrigin(0.5);

        const footer = this.scene.add.text(0, 140,
            '📦 Consegna a domicilio in 48h\n' +
            '💳 Pagamento alla consegna\n' +
            '⭐ Sconti per clienti fedeltà',
            {
                fontSize: '11px', color: '#ffda1a', align: 'center',
                fontFamily: 'Fredoka', fontStyle: 'italic', lineSpacing: 4
            }
        ).setOrigin(0.5);

        const closeBtn = this.scene.add.text(220, -180, '✖', {
            fontSize: '24px', color: '#ffffff', fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            container.destroy();
            this.scene.showFloatingText(400, 200,
                '💡 Cerca "IVEA" su Gugol al computer!', '#ffda1a');
        });

        container.add([bg, header, subheader, line, body, footer, closeBtn]);
    }

    deliverLetter() {
        if (this.letterDelivered) return;
        if (!this.scene.add || !this.scene.player) return;

        this.letterDelivered = true;
        this.hasLetter = true;
        this.saveMailData();

        this.showMailNotification('📬', '#ffd700', 'HAI RICEVUTO DELLA POSTA');

        const x = 320;
        const y = 545;

        this.letterGlow = this.scene.add.graphics()
            .setDepth(19)
            .fillStyle(0xffd700, 0.25)
            .fillCircle(x, y, 22);

        this.scene.tweens.add({
            targets: this.letterGlow,
            alpha: 0.05, duration: 900, yoyo: true, repeat: -1
        });

        this.letterSprite = this.scene.add.text(x, y, '✉️', {
            fontSize: '22px'
        }).setOrigin(0.5).setDepth(20);

        this.scene.tweens.add({
            targets: this.letterSprite,
            scaleX: 1.2, scaleY: 1.2, duration: 700, yoyo: true, repeat: -1
        });

        this.letterZone = this.scene.add.zone(x, y, 50, 50)
            .setDepth(21)
            .setInteractive({ useHandCursor: true });

        this.letterZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(
                this.scene.player.x, this.scene.player.y, x, y
            );
            if (dist <= 90) this.openLetter();
        });
    }

    showMailNotification(icon, color, message) {
        const container = this.scene.add.container(400, 120).setDepth(4500).setScrollFactor(0);

        const bg = this.scene.add.rectangle(0, 0, 320, 60, 0x110906, 0.98)
            .setStrokeStyle(2, color);

        const iconTxt = this.scene.add.text(-130, 0, icon, { fontSize: '28px' }).setOrigin(0.5);

        const text = this.scene.add.text(10, 0, message, {
            fontSize: '15px', color: color, fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        container.add([bg, iconTxt, text]);
        container.setScale(0.5).setAlpha(0);

        this.scene.tweens.add({
            targets: container,
            scaleX: 1, scaleY: 1, alpha: 1,
            duration: 400, ease: 'Back.easeOut'
        });

        this.scene.time.delayedCall(4000, () => {
            this.scene.tweens.add({
                targets: container, alpha: 0, y: 80, duration: 600,
                onComplete: () => container.destroy()
            });
        });

        if (window.triggerSfx) window.triggerSfx('coin');
    }

    openLetter() {
        if (this.letterSprite) { this.letterSprite.destroy(); this.letterSprite = null; }
        if (this.letterZone) { this.letterZone.destroy(); this.letterZone = null; }
        if (this.letterGlow) { this.letterGlow.destroy(); this.letterGlow = null; }

        this.letterRead = true;
        this.knowsHowToDeclare = true;
        this.saveMailData();

        const container = this.scene.add.container(400, 300).setDepth(4500).setScrollFactor(0);

        const bg = this.scene.add.rectangle(0, 0, 480, 400, 0xfef9e7, 0.98)
            .setStrokeStyle(2, 0xd27d2d);

        const header = this.scene.add.text(0, -170, 'AGENZIA DELLE USCITE', {
            fontSize: '18px', color: '#2c3e50', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const subheader = this.scene.add.text(0, -145, 'Direzione Provinciale di Palermo', {
            fontSize: '11px', color: '#7f8c8d', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const line = this.scene.add.rectangle(0, -120, 420, 1, 0xd27d2d);

        const body = this.scene.add.text(0, 10,
            'Gentile contribuente,\n\n' +
            'le ricordiamo che la dichiarazione\n' +
            'dei redditi va presentata entro\n' +
            'i termini di legge.\n\n' +
            'La preghiamo di provvedere\n' +
            'tramite il portale telematico\n' +
            'o presso un ufficio autorizzato.\n\n' +
            'Cordiali saluti.',
            {
                fontSize: '13px', color: '#2c3e50', align: 'center',
                fontFamily: 'Fredoka', lineSpacing: 4
            }
        ).setOrigin(0.5);

        const footer = this.scene.add.text(0, 160,
            'Il Direttore\nDott. G. Rossi',
            {
                fontSize: '11px', color: '#7f8c8d', align: 'center',
                fontFamily: 'Fredoka', fontStyle: 'italic'
            }
        ).setOrigin(0.5);

        const closeBtn = this.scene.add.text(200, -170, '✖', {
            fontSize: '24px', color: '#e74c3c', fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            container.destroy();
            this.scene.showFloatingText(400, 200,
                '💡 Forse dovresti controllare il computer...', '#f39c12');
        });

        container.add([bg, header, subheader, line, body, footer, closeBtn]);
    }

    
    
    

    checkDeadline() {
        const overdue = this.getDaysOverdue();

        if (overdue > 0) {
            this.overdueDays = overdue;
            if (overdue >= 3 && !this.auditTriggered) {
                this.auditTriggered = true;
                this.saveMailData();
                this.triggerAudit();
            }
        }

        
        if (this.scheduledAuditDay !== null) {
            const currentDay = this.getCurrentDay();
            if (currentDay >= this.scheduledAuditDay && !this.auditInProgress) {
                this.scheduledAuditDay = null;
                this.saveMailData();
                this.triggerAudit();
            }
        }
    }

    scheduleAudit(day) {
        this.scheduledAuditDay = day;
        this.saveMailData();
    }

    triggerAudit() {
        if (this.auditInProgress) return;
        this.auditInProgress = true;

        if (!this.scene.crime) {
            this.auditInProgress = false;
            return;
        }

        this.auditCount++;
        this.saveMailData();
        this.scene.crime.spawnInspectionPolice(true);
    }

    
    
    

    generateCF() {
        const nickname = (localStorage.getItem('waitress_nickname') || 'Cameriera')
            .toUpperCase().replace(/[^A-Z]/g, '');
        const consonants = nickname.replace(/[AEIOU]/g, '');
        const vowels = nickname.replace(/[^AEIOU]/g, '');
        const surname = (consonants + vowels + 'XXX').slice(0, 3);

        const consonants2 = 'MRN';
        const name = (consonants2 + 'XXX').slice(0, 3);

        const year = String(85).padStart(2, '0');
        const monthLetters = 'ABCDEHLMPRST';
        const month = monthLetters[7]; 
        const day = '01';
        const comune = 'G273'; 
        const control = 'Z';

        return `${surname}${name}${year}${month}${day}${comune}${control}`;
    }

    
    
    

    openDeclarationUI() {
        
        this._declState = {
            step: 1,
            declaredIncome: this.getRealIncome(),
            claimed: {},          
            detrazioniClaimed: [], 
            calc: null,
            protocollo: null,
            f24: null
        };

        this._declContainer = this.scene.add.container(0, 0)
            .setDepth(350).setScrollFactor(0);

        this._declInputs = [];

        this.renderDeclarationStep();
    }

    _clearDeclarationInputs() {
        if (this._declInputs) {
            this._declInputs.forEach(input => {
                if (input && input.parentNode) input.parentNode.removeChild(input);
            });
        }
        this._declInputs = [];
    }

    _destroyDeclarationUI() {
        this._clearDeclarationInputs();
        if (this._declContainer) {
            this._declContainer.destroy();
            this._declContainer = null;
        }
        this._declState = null;
    }

    _createHtmlInput(value, canvasX, canvasY, width, numeric) {
        const input = document.createElement('input');
        if (numeric) {
            input.type = 'number';
            input.min = '0';
            input.max = '999999';
        }
        input.value = String(value);

        Object.assign(input.style, {
            position: 'absolute',
            background: '#1a0a04',
            color: '#ffd700',
            border: '2px solid #d27d2d',
            borderRadius: '6px',
            padding: '4px',
            fontFamily: 'Fredoka',
            fontSize: '14px',
            zIndex: '1000',
            textAlign: 'center'
        });

        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (numeric && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
            }
        });
        input.addEventListener('keyup', (e) => e.stopPropagation());
        input.addEventListener('keypress', (e) => e.stopPropagation());
        input.addEventListener('wheel', (e) => {
            e.stopPropagation();
            if (numeric) e.preventDefault();
        }, { passive: false });
        input.addEventListener('focus', () => { this.scene.isTyping = true; });
        input.addEventListener('blur', () => { this.scene.isTyping = false; });

        const gameContainer = document.getElementById('game-container') || document.body;
        gameContainer.appendChild(input);

        const canvas = this.scene.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / 800;
        const scaleY = rect.height / 600;
        input.style.left = `${(canvasX * scaleX) + rect.left}px`;
        input.style.top = `${(canvasY * scaleY) + rect.top}px`;
        input.style.width = `${width * scaleX}px`;
        input.style.height = `${28 * scaleY}px`;

        this._declInputs.push(input);
        return input;
    }

    renderDeclarationStep() {
        if (!this._declState) return;

        
        this._clearDeclarationInputs();
        this._declContainer.removeAll(true);

        const step = this._declState.step;
        const container = this._declContainer;

        
        const bg = this.scene.add.rectangle(400, 300, 680, 560, 0x110906, 0.98)
            .setStrokeStyle(2, 0xd27d2d);
        container.add(bg);

        const headerText = {
            1: '📋 DATI CONTRIBUENTE',
            2: '📊 QUADRI A/B/C — REDDITI',
            3: '📊 QUADRO E — ONERI E DETRAZIONI',
            4: '📝 RIEPILOGO E FIRMA',
            5: '📤 INVIO TELEMATICO'
        }[step];

        container.add(this.scene.add.text(400, 50, headerText, {
            fontSize: '20px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5));

        
        const stepLabels = ['1. Dati', '2. Redditi', '3. Oneri', '4. Firma', '5. Invio'];
        stepLabels.forEach((label, i) => {
            const x = 160 + i * 120;
            const active = (i + 1) === step;
            const done = (i + 1) < step;
            container.add(this.scene.add.text(x, 78, label, {
                fontSize: '10px',
                color: active ? '#ffd700' : (done ? '#2ecc71' : '#666666'),
                fontStyle: active ? 'bold' : 'normal',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5));
        });

        if (step === 1) this._renderStep1(container);
        else if (step === 2) this._renderStep2(container);
        else if (step === 3) this._renderStep3(container);
        else if (step === 4) this._renderStep4(container);
        else if (step === 5) this._renderStep5(container);
    }

    _renderStep1(container) {
        const cf = this.generateCF();
        const nickname = localStorage.getItem('waitress_nickname') || 'Cameriera';
        const currentDay = this.getCurrentDay();

        const fields = [
            ['Codice Fiscale', cf],
            ['Nome', nickname],
            ['Residenza', 'Palermo (PA)'],
            ['Periodo d\'imposta', `Giorno 1 → Giorno ${currentDay}`],
            ['Anno d\'imposta', String(new Date().getFullYear() - 1)]
        ];

        fields.forEach((f, i) => {
            const y = 130 + i * 32;
            container.add(this.scene.add.text(140, y, f[0] + ':', {
                fontSize: '13px', color: '#aaaaaa', fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5));
            container.add(this.scene.add.text(660, y, f[1], {
                fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(1, 0.5));
        });

        container.add(this.scene.add.text(400, 330,
            'Puoi accettare il 730 precompilato\n' +
            'oppure compilare manualmente i quadri.',
            {
                fontSize: '12px', color: '#cccccc', align: 'center',
                fontFamily: 'Fredoka', lineSpacing: 4
            }
        ).setOrigin(0.5));

        const precompBtn = this.scene.add.rectangle(250, 400, 220, 42, 0x27ae60)
            .setStrokeStyle(1.5, 0xffffff).setInteractive({ useHandCursor: true });
        const precompTxt = this.scene.add.text(250, 400, '✅ ACCETTA PRECOMPILATO', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const manualBtn = this.scene.add.rectangle(550, 400, 220, 42, 0xd27d2d)
            .setStrokeStyle(1.5, 0xffd700).setInteractive({ useHandCursor: true });
        const manualTxt = this.scene.add.text(550, 400, '📝 COMPILA MANUALMENTE', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        
        precompBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this._declState.declaredIncome = this.getRealIncome();
            this._declState.step = 2;
            this.renderDeclarationStep();
        });

        manualBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this._declState.declaredIncome = 0;
            this._declState.step = 2;
            this.renderDeclarationStep();
        });

        container.add([precompBtn, precompTxt, manualBtn, manualTxt]);

        this._renderCloseButton(container);
    }

    
    _renderStep2(container) {
        const legalIncome = Math.max(0, this.getRealIncome() - this.getIllegalIncome());
        const illegalIncome = this.getIllegalIncome();

        container.add(this.scene.add.text(400, 120, 'QUADRO A — Redditi da lavoro', {
            fontSize: '13px', color: '#2ecc71', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5));

        container.add(this.scene.add.text(160, 155, 'Reddito lordo dichiarato:', {
            fontSize: '13px', color: '#ffffff', fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5));

        container.add(this.scene.add.text(500, 155, '€', {
            fontSize: '14px', color: '#ffd700', fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5));

        const incomeInput = this._createHtmlInput(
            this._declState.declaredIncome,
            525, 145, 160, true
        );

        incomeInput.addEventListener('input', () => {
            const v = Math.max(0, parseInt(incomeInput.value) || 0);
            this._declState.declaredIncome = v;
        });

        
        container.add(this.scene.add.text(400, 200,
            `Redditi percepiti nel periodo: € ${legalIncome}`,
            { fontSize: '11px', color: '#aaaaaa', fontFamily: 'Fredoka' }
        ).setOrigin(0.5));

        container.add(this.scene.add.text(400, 235, 'QUADRO C — Redditi diversi', {
            fontSize: '13px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5));

        container.add(this.scene.add.text(400, 265,
            illegalIncome > 0
                ? `Compensi occasionali: € ${illegalIncome}`
                : 'Nessun reddito diverso dichiarato',
            { fontSize: '12px', color: illegalIncome > 0 ? '#f39c12' : '#666666', fontFamily: 'Fredoka' }
        ).setOrigin(0.5));

        container.add(this.scene.add.text(400, 330,
            '⚠️ La dichiarazione è resa sotto la propria responsabilità.\n' +
            'Dichiarare meno del dovuto comporta sanzioni.',
            {
                fontSize: '11px', color: '#f39c12', align: 'center',
                fontFamily: 'Fredoka', lineSpacing: 4
            }
        ).setOrigin(0.5));

        this._renderNavButtons(container, { back: 1, next: 3 });
        this._renderCloseButton(container);
    }

    
    _renderStep3(container) {
        container.add(this.scene.add.text(400, 105, 'ONERI DEDUCIBILI — SPESE SOSTENUTE', {
            fontSize: '12px', color: '#3498db', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5));

        
        const baseDetrazioni = this.calculateDetrazioni(this._declState.declaredIncome);

        const legitY = 130;
        container.add(this.scene.add.rectangle(400, legitY + 10, 600, 40, 0x1a2a1a)
            .setStrokeStyle(1, 0x2ecc71));
        container.add(this.scene.add.text(140, legitY, '✅ Detrazioni spettanti (automatiche)', {
            fontSize: '12px', color: '#2ecc71', fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5));
        container.add(this.scene.add.text(660, legitY, `- ${baseDetrazioni} €`, {
            fontSize: '13px', color: '#2ecc71', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(1, 0.5));

        
        const expenses = this.getDeductibleExpenses();

        const listTop = 175;
        const rowH = 26;
        const maxRows = 9;
        const visible = expenses.slice(0, maxRows);

        if (visible.length === 0) {
            container.add(this.scene.add.text(400, listTop + 60,
                'Nessuna spesa deducibile registrata nel periodo.',
                { fontSize: '12px', color: '#666666', fontFamily: 'Fredoka' }
            ).setOrigin(0.5));
        } else {
            visible.forEach((exp, i) => {
                const y = listTop + i * rowH;
                const checked = !!this._declState.claimed[exp.id];

                const rowBg = this.scene.add.rectangle(400, y, 600, rowH - 3,
                    checked ? 0x1a3a1a : 0x1a1a1a).setStrokeStyle(1,
                    checked ? 0x2ecc71 : 0x333333);

                const box = this.scene.add.rectangle(120, y, 16, 16,
                    checked ? 0x27ae60 : 0x333333)
                    .setStrokeStyle(1, checked ? 0xffffff : 0x666666)
                    .setInteractive({ useHandCursor: true });

                const checkMark = checked
                    ? this.scene.add.text(120, y, '✓', {
                        fontSize: '12px', color: '#ffffff', fontStyle: 'bold'
                    }).setOrigin(0.5)
                    : null;

                const label = this.scene.add.text(140, y, exp.label, {
                    fontSize: '11px', color: '#ffffff', fontFamily: 'Fredoka'
                }).setOrigin(0, 0.5);

                const amount = this.scene.add.text(660, y, `- ${exp.amount} €`, {
                    fontSize: '12px', color: '#ffd700', fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }).setOrigin(1, 0.5);

                container.add([rowBg, box, label, amount]);
                if (checkMark) container.add(checkMark);

                const toggle = () => {
                    this._declState.claimed[exp.id] = !this._declState.claimed[exp.id];
                    if (window.triggerSfx) window.triggerSfx('click');
                    this.renderDeclarationStep();
                };

                box.on('pointerdown', toggle);
                label.setInteractive({ useHandCursor: true }).on('pointerdown', toggle);
            });
        }

        if (expenses.length > maxRows) {
            container.add(this.scene.add.text(400, listTop + maxRows * rowH + 5,
                `... e altre ${expenses.length - maxRows} voci`,
                { fontSize: '10px', color: '#666666', fontFamily: 'Fredoka' }
            ).setOrigin(0.5));
        }

        
        const totalClaimed = this._computeClaimedTotal();
        const capOneri = Math.floor(this._declState.declaredIncome * 0.19);
        const ammessi = Math.min(totalClaimed, capOneri);

        container.add(this.scene.add.text(400, 470,
            `Oneri spuntati: € ${totalClaimed}  ·  Ammessi (plafond 19%): € ${ammessi}`,
            { fontSize: '11px', color: '#aaaaaa', fontFamily: 'Fredoka' }
        ).setOrigin(0.5));

        this._renderNavButtons(container, { back: 2, next: 4 });
        this._renderCloseButton(container);
    }

    _computeClaimedTotal() {
        const expenses = this.getDeductibleExpenses();
        let total = 0;
        expenses.forEach(e => {
            if (this._declState.claimed[e.id]) total += e.amount;
        });
        return total;
    }

    
    _renderStep4(container) {
        const expenses = this.getDeductibleExpenses();
        const claimedList = expenses.filter(e => this._declState.claimed[e.id]);
        const totalClaimed = claimedList.reduce((s, e) => s + e.amount, 0);
        const capOneri = Math.floor(this._declState.declaredIncome * 0.19);
        const oneriAmmessi = Math.min(totalClaimed, capOneri);

        container.add(this.scene.add.text(400, 110, 'RIEPILOGO DICHIARAZIONE', {
            fontSize: '14px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5));

        const lines = [
            ['Quadro A — Reddito dichiarato', `€ ${this._declState.declaredIncome}`],
            ['Detrazioni automatiche', `- € ${this.calculateDetrazioni(this._declState.declaredIncome)}`],
            ['Oneri deducibili ammessi', `- € ${oneriAmmessi}`]
        ];

        lines.forEach((l, i) => {
            const y = 150 + i * 28;
            container.add(this.scene.add.text(140, y, l[0], {
                fontSize: '13px', color: '#cccccc', fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5));
            container.add(this.scene.add.text(660, y, l[1], {
                fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(1, 0.5));
        });

        
        this._declState.responsibilityChecked =
            this._declState.responsibilityChecked || false;

        const respBg = this.scene.add.rectangle(400, 260, 600, 56, 0x1a1a1a)
            .setStrokeStyle(1, 0x444444);

        const respBox = this.scene.add.rectangle(140, 260, 18, 18,
            this._declState.responsibilityChecked ? 0x27ae60 : 0x333333)
            .setStrokeStyle(1.5, this._declState.responsibilityChecked ? 0xffffff : 0x666666)
            .setInteractive({ useHandCursor: true });

        const respMark = this._declState.responsibilityChecked
            ? this.scene.add.text(140, 260, '✓', {
                fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5)
            : null;

        const respTxt = this.scene.add.text(160, 252,
            'Dichiaro, sotto la mia responsabilità, che i dati sopra\n' +
            'sono veritieri (art. 1 D.L. 44/2023).',
            {
                fontSize: '11px', color: '#ffffff', fontFamily: 'Fredoka',
                lineSpacing: 3
            }
        ).setOrigin(0, 0.5);

        container.add([respBg, respBox, respTxt]);
        if (respMark) container.add(respMark);

        const toggleResp = () => {
            this._declState.responsibilityChecked =
                !this._declState.responsibilityChecked;
            if (window.triggerSfx) window.triggerSfx('click');
            this.renderDeclarationStep();
        };
        respBox.on('pointerdown', toggleResp);
        respTxt.setInteractive({ useHandCursor: true }).on('pointerdown', toggleResp);

        
        const canSign = this._declState.responsibilityChecked;
        const signColor = canSign ? 0x27ae60 : 0x444444;

        const signBtn = this.scene.add.rectangle(400, 360, 280, 46, signColor)
            .setStrokeStyle(2, canSign ? 0xffffff : 0x666666);
        const signTxt = this.scene.add.text(400, 360, '🖋️ FIRMA E INVIA', {
            fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        if (canSign) {
            signBtn.setInteractive({ useHandCursor: true });
            signBtn.on('pointerdown', () => {
                if (window.triggerSfx) window.triggerSfx('coin');
                this._declState.step = 5;
                this.renderDeclarationStep();
            });
        }

        container.add([signBtn, signTxt]);

        
        const backBtn = this.scene.add.rectangle(160, 440, 130, 34, 0x7f1d1d)
            .setStrokeStyle(1.5, 0xe74c3c).setInteractive({ useHandCursor: true });
        const backTxt = this.scene.add.text(160, 440, '◀ Indietro', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        backBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this._declState.step = 3;
            this.renderDeclarationStep();
        });

        const skipBtn = this.scene.add.rectangle(640, 440, 130, 34, 0x333333)
            .setStrokeStyle(1.5, 0x666666).setInteractive({ useHandCursor: true });
        const skipTxt = this.scene.add.text(640, 440, '⏳ Rimanda', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        skipBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this._destroyDeclarationUI();
            this.scene.showFloatingText(400, 250,
                '📅 Hai rimandato la dichiarazione...', '#f39c12');
        });

        container.add([backBtn, backTxt, skipBtn, skipTxt]);

        this._renderCloseButton(container);
    }

    
    _renderStep5(container) {
        
        const expenses = this.getDeductibleExpenses();
        const claimedList = expenses.filter(e => this._declState.claimed[e.id]);
        const totalClaimed = claimedList.reduce((s, e) => s + e.amount, 0);
        const capOneri = Math.floor(this._declState.declaredIncome * 0.19);
        const oneriAmmessi = Math.min(totalClaimed, capOneri);

        const isFirstDecl = this.declarations.length === 0;
        const calc = this.calculateDeclaration(
            this._declState.declaredIncome,
            oneriAmmessi,
            !isFirstDecl
        );

        
        const inRitardo = this.getDaysOverdue() > 0;
        let totaleDovuto = calc.totaleDovuto + calc.acconto;
        if (inRitardo) {
            totaleDovuto = Math.floor(totaleDovuto * 1.03);
        }

        const protocollo = `730/${new Date().getFullYear()}/${
            Math.random().toString(36).slice(2, 11).toUpperCase()
        }`;

        this._declState.calc = { ...calc, totaleDovuto, oneriAmmessi, claimedList, inRitardo, protocollo };

        
        const statusTxt = this.scene.add.text(400, 250,
            '📤 Invio in corso...', {
            fontSize: '18px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        container.add(statusTxt);

        const spinner = this.scene.add.text(400, 300, '⏳', {
            fontSize: '32px'
        }).setOrigin(0.5);
        container.add(spinner);

        this.scene.tweens.add({
            targets: spinner,
            angle: 360,
            duration: 1200,
            repeat: -1
        });

        this.scene.time.delayedCall(1400, () => {
            if (!this._declContainer) return;
            statusTxt.setText('⏳ Elaborazione...');
        });

        this.scene.time.delayedCall(2800, () => {
            if (!this._declContainer) return;
            spinner.destroy();
            statusTxt.destroy();
            this._showF24Receipt(container);
        });
    }

    _showF24Receipt(container) {
        const calc = this._declState.calc;
        const saldo = calc.saldo + calc.acconto;
        const saldoSegno = saldo > 0 ? 'a debito' : (saldo < 0 ? 'a credito' : 'zero');
        const saldoAssoluto = Math.abs(saldo);

        
        container.add(this.scene.add.text(400, 105, '📄 RICEVUTA DI PRESENTAZIONE', {
            fontSize: '15px', color: '#2ecc71', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5));

        const receiptBox = this.scene.add.rectangle(400, 290, 620, 330, 0x0a0a0a)
            .setStrokeStyle(1.5, 0x2ecc71);
        container.add(receiptBox);

        const rows = [
            ['Modello', '730/' + new Date().getFullYear()],
            ['Protocollo', calc.protocollo],
            ['Data invio', new Date().toLocaleString('it-IT')],
            ['', ''],
            ['IRPEF lorda', `€ ${calc.irpefLorda}`],
            ['Detrazioni', `- € ${calc.detrazioni}`],
            ['IRPEF netta', `€ ${calc.irpefNetta}`],
            ['Add. regionale', `€ ${calc.addizionaleRegionale}`],
            ['Add. comunale', `€ ${calc.addizionaleComunale}`],
            ['Ritenute', `- € ${calc.ritenute}`],
            ['', ''],
            ['SALDO', `${saldo > 0 ? '+' : (saldo < 0 ? '-' : '')} € ${saldoAssoluto}`]
        ];

        if (calc.acconto > 0) {
            rows.push(['Acconto IRPEF anno succ.', `€ ${calc.acconto}`]);
        }
        if (calc.inRitardo) {
            rows.push(['Ravvedimento (3%)', 'applicato']);
        }

        rows.forEach((r, i) => {
            const y = 160 + i * 20;
            if (r[0] === '') return;
            const isSaldo = r[0] === 'SALDO';
            container.add(this.scene.add.text(180, y, r[0], {
                fontSize: isSaldo ? '13px' : '11px',
                color: isSaldo ? '#ffd700' : '#cccccc',
                fontStyle: isSaldo ? 'bold' : 'normal',
                fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5));
            container.add(this.scene.add.text(620, y, r[1], {
                fontSize: isSaldo ? '13px' : '11px',
                color: isSaldo ? (saldo > 0 ? '#e74c3c' : '#2ecc71') : '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(1, 0.5));
        });

        
        const evasion = Math.max(0, this.getRealIncome() - this._declState.declaredIncome);
        const evasionPct = this.getRealIncome() > 0 ? (evasion / this.getRealIncome()) * 100 : 0;

        if (evasionPct > 50) {
            container.add(this.scene.add.text(400, 440,
                'Dichiarazione acquisita. Sarà oggetto di controlli\n' +
                'automatici ai sensi del D.L. 269/2023.',
                {
                    fontSize: '10px', color: '#f39c12', align: 'center',
                    fontFamily: 'Fredoka', lineSpacing: 3
                }
            ).setOrigin(0.5));
        }

        
        const okBtn = this.scene.add.rectangle(400, 510, 180, 40, 0x27ae60)
            .setStrokeStyle(1.5, 0xffffff).setInteractive({ useHandCursor: true });
        const okTxt = this.scene.add.text(400, 510, '✅ OK', {
            fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        okBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('coin');

            const claimedList = calc.claimedList || [];
            const oneriAmmessi = calc.oneriAmmessi || 0;
            const inRitardo = calc.inRitardo || false;
            const totaleDovuto = calc.totaleDovuto;

            
            this._destroyDeclarationUI();

            this._commitDeclaration(
                this._lastDeclaredIncome || 0,
                claimedList,
                oneriAmmessi,
                inRitardo,
                totaleDovuto
            );
        });

        container.add([okBtn, okTxt]);
    }

    
    _renderNavButtons(container, { back, next }) {
        const backBtn = this.scene.add.rectangle(160, 470, 150, 36, 0x7f1d1d)
            .setStrokeStyle(1.5, 0xe74c3c).setInteractive({ useHandCursor: true });
        const backTxt = this.scene.add.text(160, 470, '◀ Indietro', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const nextBtn = this.scene.add.rectangle(640, 470, 150, 36, 0x27ae60)
            .setStrokeStyle(1.5, 0xffffff).setInteractive({ useHandCursor: true });
        const nextTxt = this.scene.add.text(640, 470, 'Avanti ▶', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        backBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            
            this._captureStepState();
            this._declState.step = back;
            this.renderDeclarationStep();
        });

        nextBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this._captureStepState();
            this._declState.step = next;
            this.renderDeclarationStep();
        });

        container.add([backBtn, backTxt, nextBtn, nextTxt]);
    }

    _captureStepState() {
        
        if (this._declInputs && this._declInputs.length > 0) {
            const numInput = this._declInputs.find(i => i.type === 'number');
            if (numInput) {
                const v = Math.max(0, parseInt(numInput.value) || 0);
                this._declState.declaredIncome = v;
                this._lastDeclaredIncome = v;
            }
        } else {
            this._lastDeclaredIncome = this._declState.declaredIncome;
        }
    }

    _renderCloseButton(container) {
        const closeBtn = this.scene.add.text(670, 65, '✖', {
            fontSize: '26px', color: '#e74c3c', fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this._destroyDeclarationUI();
            this.scene.showFloatingText(400, 250,
                '📅 Dichiarazione annullata.', '#f39c12');
        });

        container.add(closeBtn);
    }

    
    
    

    _commitDeclaration(declaredIncome, claimedList, oneriAmmessi, inRitardo, totaleDovuto) {
        const realIncome = this.getRealIncome();
        const evasion = Math.max(0, realIncome - declaredIncome);
        const evasionPct = realIncome > 0 ? (evasion / realIncome) * 100 : 0;

        
        
        if (evasionPct > 30 && this.scene.crime) {
            const susp = Math.floor(evasionPct * 0.8);
            if (susp > 0) this.scene.crime.addSuspicion(susp, 'tax_evasion');
        }

        
        const falseDetrazioni = (claimedList || []).filter(
            d => !this.playerActuallyOwns(d.id)
        );
        if (falseDetrazioni.length > 0 && this.scene.crime) {
            this.scene.crime.addSuspicion(15 * falseDetrazioni.length, 'fraud');
        }

        
        if (evasionPct > 50 && this.scene.crime) {
            const scheduledDay = this.getCurrentDay() + Phaser.Math.Between(1, 3);
            this.scheduleAudit(scheduledDay);
        }

        
        const score = window.GAME.score || 0;
        if (score >= totaleDovuto) {
            window.GAME.score -= totaleDovuto;
        } else {
            window.GAME.score = 0;
        }

        
        try {
            const sd = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
            if (sd.data) sd.data.score = window.GAME.score;
            else sd.score = window.GAME.score;
            localStorage.setItem('waitress_save_data', JSON.stringify(sd));
        } catch (e) {}

        if (this.scene && this.scene.updateHouseHUD) {
            this.scene.updateHouseHUD();
        }

        
        this.totalDeclaredIncome += declaredIncome;
        this.totalRealIncome += realIncome;
        this.taxEvasionTotal += evasion;
        this.lastDeclarationDay = this.getCurrentDay();
        this.overdueDays = 0;
        this.auditTriggered = false;

        this.declarations.push({
            day: this.getCurrentDay(),
            declared: declaredIncome,
            real: realIncome,
            evasion: evasion,
            taxes: totaleDovuto,
            oneriAmmessi: oneriAmmessi,
            falseDetrazioni: falseDetrazioni.length,
            inRitardo: !!inRitardo,
            timestamp: Date.now()
        });

        this.saveMailData();

        
        this.showAuditResult(
            '✅ Dichiarazione acquisita. Protocollo generato.',
            '#2ecc71'
        );

        if (falseDetrazioni.length > 0) {
            this.scene.time.delayedCall(1200, () => {
                this.showAuditResult(
                    '⚠️ Alcuni oneri risultano non documentabili.',
                    '#f39c12'
                );
            });
        }
    }

    
    submitDeclaration(declaredIncome) {
        this._commitDeclaration(declaredIncome, [], 0, this.getDaysOverdue() > 0, 0);
    }

    showAuditResult(text, color) {
        const txt = this.scene.add.text(400, 250, text, {
            fontSize: '16px', color: color, fontStyle: 'bold', fontFamily: 'Fredoka',
            backgroundColor: '#000000cc', padding: { x: 16, y: 10 }
        }).setOrigin(0.5).setDepth(4500).setScrollFactor(0);

        this.scene.tweens.add({
            targets: txt, alpha: 0, y: 200, duration: 4000, ease: 'Cubic.easeIn',
            onComplete: () => txt.destroy()
        });
    }
}

window.MailSystem = MailSystem;