class CrimeSystem {
    constructor(scene) {
        this.scene = scene;

        this.hasAcceptedClanMission = false;
        this.clanMissionCompleted = false;
        this.clanBetrayed = false;
        this.hasClanSheet = false;
        this.inventory = [];

        this.hasPoison = false;
        this.hasFakePOS = false;

        this.suspicionLevel = 0;
        this.hasVPN = false;
        this.hasSecretCompartment = false;
        this._compartmentOpen = false;

        this.poisonCost = 150;
        this.posCost = 250;
        this.vpnCost = 200;
        this.secretCompartmentCost = 300;

        this.arrestCount = 0;
        this.posUsageCount = 0;
        this.darkWebAccessCount = 0;

        this.clanMemberSprite = null;
        this.clanMemberShadow = null;
        this.clanMemberActive = false;
        this.clanSheetCode = null;
        this.clanSheetExpiry = 0;
        this.clanSecondTaskActive = false;

        this._inspectionActive = false;
        this._inspectionPolice = null;
        this._inspectionTimer = null;

        this._fleeingDuringInspection = false;
        this._fleeZone = null;
        this._escapeAttempted = false;
        this._isPlayerDown = false;

        this.poisonedCustomerName = null;
        this.poisoningHappened = false;
        this._isPoisonInvestigation = false;
        this.missionTargetName = null;

        this.loadCrimeData();
        this.syncSuspicionToGame();
        this.createInventorySlot();
        this.createSuspicionBar();
    }

    syncSuspicionToGame() {
        if (window.GAME) {
            window.GAME.suspicion = this.suspicionLevel;
        }
    }

    loadCrimeData() {
        const saved = localStorage.getItem('waitress_crime_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.hasAcceptedClanMission = data.hasAcceptedClanMission || false;
                this.clanMissionCompleted = data.clanMissionCompleted || false;
                this.clanBetrayed = data.clanBetrayed || false;
                this.hasClanSheet = data.hasClanSheet || false;
                this.inventory = data.inventory || [];
                this.hasPoison = data.hasPoison || false;
                this.hasFakePOS = data.hasFakePOS || false;
                this.suspicionLevel = data.suspicionLevel || 0;
                this.hasVPN = data.hasVPN || false;
                this.hasSecretCompartment = data.hasSecretCompartment || false;
                this._compartmentOpen = data._compartmentOpen || false;
                this.arrestCount = data.arrestCount || 0;
                this.posUsageCount = data.posUsageCount || 0;
                this.darkWebAccessCount = data.darkWebAccessCount || 0;
                this.clanSheetCode = data.clanSheetCode || null;
                this.clanSheetExpiry = data.clanSheetExpiry || 0;
                this.clanSecondTaskActive = data.clanSecondTaskActive || false;
                this.poisonedCustomerName = data.poisonedCustomerName || null;
                this.poisoningHappened = data.poisoningHappened || false;
                this.missionTargetName = data.missionTargetName || null;
            } catch(e) {}
        }
    }

    saveCrimeData() {
        localStorage.setItem('waitress_crime_data', JSON.stringify({
            hasAcceptedClanMission: this.hasAcceptedClanMission,
            clanMissionCompleted: this.clanMissionCompleted,
            clanBetrayed: this.clanBetrayed,
            hasClanSheet: this.hasClanSheet,
            inventory: this.inventory,
            hasPoison: this.hasPoison,
            hasFakePOS: this.hasFakePOS,
            suspicionLevel: this.suspicionLevel,
            hasVPN: this.hasVPN,
            hasSecretCompartment: this.hasSecretCompartment,
            _compartmentOpen: this._compartmentOpen,
            arrestCount: this.arrestCount,
            posUsageCount: this.posUsageCount,
            darkWebAccessCount: this.darkWebAccessCount,
            clanSheetCode: this.clanSheetCode,
            clanSheetExpiry: this.clanSheetExpiry,
            clanSecondTaskActive: this.clanSecondTaskActive,
            poisonedCustomerName: this.poisonedCustomerName,
            poisoningHappened: this.poisoningHappened,
            missionTargetName: this.missionTargetName
        }));
        this.updateInventoryUI();
    }

    resetCrimeData() {
        localStorage.removeItem('waitress_crime_data');
        this.hasAcceptedClanMission = false;
        this.clanMissionCompleted = false;
        this.clanBetrayed = false;
        this.hasClanSheet = false;
        this.inventory = [];
        this.hasPoison = false;
        this.hasFakePOS = false;
        this.suspicionLevel = 0;
        this.hasVPN = false;
        this.hasSecretCompartment = false;
        this._compartmentOpen = false;
        this.arrestCount = 0;
        this.posUsageCount = 0;
        this.darkWebAccessCount = 0;
        this.clanSheetCode = null;
        this.clanSheetExpiry = 0;
        this.clanSecondTaskActive = false;
        this.poisonedCustomerName = null;
        this.poisoningHappened = false;
        this.missionTargetName = null;
        this.syncSuspicionToGame();
        this.updateInventoryUI();
    }

    createInventorySlot() {
        this.inventorySlotBg = this.scene.add.rectangle(750, 530, 44, 44, 0x222222, 0.9).setDepth(100).setStrokeStyle(2, 0xd27d2d).setScrollFactor(0);
        this.inventorySlotText = this.scene.add.text(750, 530, '📦', { fontSize: '22px' }).setOrigin(0.5).setDepth(101).setScrollFactor(0);
        
        this.inventoryBadge = this.scene.add.circle(766, 516, 6, 0xe74c3c).setDepth(103).setScrollFactor(0).setVisible(false);

        this.inventorySlotBg.setInteractive({ useHandCursor: true });
        this.inventorySlotBg.on('pointerdown', () => this.openInventory());

        this.secretCompartmentSprite = this.scene.add.image(750, 530, 'scomparto_nascosto')
            .setDepth(102)
            .setScrollFactor(0)
            .setDisplaySize(40, 40)
            .setVisible(this.hasSecretCompartment)
            .setInteractive({ useHandCursor: true });

        this.secretCompartmentSprite.on('pointerdown', (pointer, localX, localY, event) => {
            if (event && typeof event.stopPropagation === 'function') event.stopPropagation();

            if (this._compartmentOpen) {
                this._compartmentOpen = false;
                this.secretCompartmentSprite.setTexture('scomparto_nascosto');
                this.scene.showFloatingText(750, 500, '🔒 Scomparto richiuso', '#2ecc71');
            } else {
                this._compartmentOpen = true;
                this.secretCompartmentSprite.setTexture('scomparto_aperto');
                this.scene.showFloatingText(750, 500, '🔓 Scomparto aperto!', '#ffd700');
            }
            this.saveCrimeData();
        });

        this.updateInventoryUI();
    }

    updateInventoryUI() {
        if (!this.inventoryBadge) return;
        
        if (this.secretCompartmentSprite) {
            this.secretCompartmentSprite.setVisible(Boolean(this.hasSecretCompartment));
        }

        const itemCount = this.inventory.length;
        if (itemCount > 0 || this.hasPoison || this.hasFakePOS || this.hasClanSheet) {
            this.inventoryBadge.setVisible(true);
            this.inventorySlotBg.setStrokeStyle(2, 0xffd700);
        } else {
            this.inventoryBadge.setVisible(false);
            this.inventorySlotBg.setStrokeStyle(2, 0xd27d2d);
        }
    }

    createSuspicionBar() {
        this.suspicionBarBg = this.scene.add.rectangle(400, 590, 300, 12, 0x000000, 0.7).setDepth(100).setScrollFactor(0).setStrokeStyle(1, 0x666666);
        this.suspicionBarFill = this.scene.add.rectangle(250, 590, 0, 8, 0x2ecc71).setOrigin(0, 0.5).setDepth(101).setScrollFactor(0);
        this.suspicionText = this.scene.add.text(400, 590, '🔍 SOSPETTO 0%', {
            fontSize: '10px', color: '#ffffff', fontFamily: 'Fredoka', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(102).setScrollFactor(0);

        this.updateSuspicionBar();
    }

    updateSuspicionBar() {
        if (!this.suspicionBarFill) return;

        const pct = this.suspicionLevel / 100;
        this.suspicionBarFill.width = 300 * pct;

        let color = 0x2ecc71;
        if (this.suspicionLevel >= 70) color = 0xe74c3c;
        else if (this.suspicionLevel >= 40) color = 0xf39c12;

        this.suspicionBarFill.setFillStyle(color);

        if (this.suspicionText) {
            this.suspicionText.setText(`🔍 SOSPETTO ${Math.floor(this.suspicionLevel)}%`);
        }
    }

    addSuspicion(amount, source) {
        if (this._inspectionActive) return;

        let finalAmount = amount;

        if (this.hasVPN && source === 'darkweb') {
            finalAmount = amount * 0.5;
        }

        this.suspicionLevel = Math.min(100, this.suspicionLevel + finalAmount);
        this.syncSuspicionToGame();
        this.saveCrimeData();
        this.updateSuspicionBar();

        if (this.suspicionLevel >= 100) {
            this.triggerInspection();
        }
    }

    reduceSuspicion(amount) {
        this.suspicionLevel = Math.max(0, this.suspicionLevel - amount);
        this.syncSuspicionToGame();
        this.saveCrimeData();
        this.updateSuspicionBar();
    }

    getRecidivismMultiplier() {
        if (this.arrestCount === 0) return 1.0;
        if (this.arrestCount === 1) return 1.5;
        if (this.arrestCount === 2) return 2.0;
        return 2.5;
    }

    triggerInspection() {
        if (this._inspectionActive) return;
        this._inspectionActive = true;

        if (this.scene.spawnEvent) {
            this.scene.spawnEvent.paused = true;
        }

        this.spawnInspectionPolice();
    }

    spawnInspectionPolice() {
        const playerObj = this.scene.waitress || this.scene.player || { x: 400, y: 300 };

        const police = {
            name: 'Poliziotto',
            hasDirectionalTextures: true,
            textureUp: 'Poliziotto_Dietro',
            textureDown: 'Poliziotto_Avanti',
            textureLeft: 'Poliziotto_Sinistra',
            textureRight: 'Poliziotto_Destra',
            x: 240,
            y: 592,
            sprite: null,
            shadow: null,
            speed: 90,
            movementData: null,
            isInspection: true
        };

        if (!this.scene.textures.exists('Poliziotto_Avanti')) {
            police.shadow = this.scene.add.ellipse(police.x, police.y + 10, 20, 5, 0x000000, 0.25).setDepth(police.y - 1);
            police.sprite = this.scene.add.text(police.x, police.y, '👮', {
                fontSize: '32px'
            }).setOrigin(0.5).setDepth(police.y);
            police.isEmoji = true;
        } else {
            police.shadow = this.scene.add.ellipse(police.x, police.y + 10, 20, 5, 0x000000, 0.25).setDepth(police.y - 1);
            police.sprite = this.scene.add.image(police.x, police.y, police.textureDown)
                .setDisplaySize(45, 45)
                .setDepth(police.y);
        }

        const targetX = playerObj.x;
        const targetY = playerObj.y;
        const waypoints = [
            { x: 240, y: 592 },
            { x: 240, y: 500 },
            { x: targetX, y: targetY }
        ];

        police.movementData = {
            waypoints: waypoints,
            currentWaypoint: 1,
            destination: waypoints[1],
            movementComplete: false
        };

        this._inspectionPolice = police;
        this._fleeingDuringInspection = false;
        this._escapeAttempted = false;

        this.createFleeZone();

        if (this._inspectionTimer) this._inspectionTimer.remove();
        this._inspectionTimer = this.scene.time.addEvent({
            delay: 16,
            callback: () => {
                this.updateInspectionPolice(16);
                this.checkFleeAttempt();
            },
            loop: true
        });

        if (window.triggerSfx) window.triggerSfx('alert');
    }

    createFleeZone() {
        const fleeX = 240;
        const fleeY = 560;

        this._fleeZone = this.scene.add.rectangle(fleeX, fleeY, 100, 60, 0xff0000, 0.15)
            .setDepth(50)
            .setStrokeStyle(2, 0xff0000, 0.5);

        const warnText = this.scene.add.text(fleeX, fleeY - 45, '⚠️ NON FUGGIRE!', {
            fontSize: '11px',
            color: '#ff0000',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(51);

        this.scene.tweens.add({
            targets: warnText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this._fleeZone.warnText = warnText;
    }

    checkFleeAttempt() {
        if (!this._inspectionActive || this._fleeingDuringInspection || this._isPlayerDown) return;
        if (!this.scene.waitress) return;

        const player = this.scene.waitress;
        const dist = Phaser.Math.Distance.Between(player.x, player.y, 240, 560);

        if (dist <= 60) {
            this.triggerEscapeAttempt();
        }
    }

    triggerEscapeAttempt() {
        if (this._fleeingDuringInspection) return;
        this._fleeingDuringInspection = true;
        this._isPlayerDown = true;

        if (this.scene.waitress && this.scene.waitress.body) {
            this.scene.waitress.body.setVelocity(0, 0);
            if (typeof this.scene.waitress.body.stop === 'function') {
                this.scene.waitress.body.stop();
            }
            this.scene.waitress.body.enable = false;
        }

        this.playGunshotSound();
        this.setWaitressDownTexture();

        const flash = this.scene.add.rectangle(400, 300, 800, 600, 0xff0000, 0.4)
            .setDepth(4000)
            .setScrollFactor(0);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 600,
            onComplete: () => flash.destroy()
        });

        this.scene.cameras.main.shake(400, 0.02);

        const downText = this.scene.add.text(400, 250, '💥 FERMO! NON FUGGIRE!', {
            fontSize: '28px',
            color: '#ff0000',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(4001).setScrollFactor(0);

        this.scene.tweens.add({
            targets: downText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: downText,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => downText.destroy()
                });
            }
        });

        this.scene.time.delayedCall(3000, () => {
            this.endInspection();
            this.arrest('polizia', 'tentata_fuga', 7);
        });
    }

    playGunshotSound() {
        if (window.GAME && window.GAME.settings && !window.GAME.settings.soundEnabled) return;

        try {
            if (this.scene.sound && this.scene.sound.get('sparo')) {
                this.scene.sound.play('sparo', { volume: 1.0 });
            }
        } catch (e) {}
    }

    setWaitressDownTexture() {
        if (!this.scene.waitress) return;

        if (this.scene.textures.exists('cameriera_prono')) {
            this.scene.waitress.setTexture('cameriera_prono');
            if (typeof this.scene.waitress.setScale === 'function') {
                this.scene.waitress.setScale(0.35);
            }
        }

        if (this.scene.waitressShadow) {
            this.scene.waitressShadow.setDisplaySize(40, 14);
        }
    }

    cleanupFleeZone() {
        if (this._fleeZone) {
            if (this._fleeZone.warnText) {
                this.scene.tweens.killTweensOf(this._fleeZone.warnText);
                this._fleeZone.warnText.destroy();
            }
            this._fleeZone.destroy();
            this._fleeZone = null;
        }
    }

    updateInspectionPolice(delta) {
        const police = this._inspectionPolice;
        if (!police || !police.movementData || !police.sprite) return;
        if (police.movementData.movementComplete) return;

        const playerObj = this.scene.waitress || this.scene.player;
        if (playerObj && police.movementData.waypoints.length === 3) {
            police.movementData.waypoints[2].x = playerObj.x;
            police.movementData.waypoints[2].y = playerObj.y;
        }

        const data = police.movementData;
        const dx = data.destination.x - police.sprite.x;
        const dy = data.destination.y - police.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 6) {
            police.sprite.x = data.destination.x;
            police.sprite.y = data.destination.y;

            if (data.waypoints && data.currentWaypoint < data.waypoints.length - 1) {
                data.currentWaypoint++;
                data.destination = data.waypoints[data.currentWaypoint];
                return;
            }

            data.movementComplete = true;
            if (this._inspectionTimer) this._inspectionTimer.remove();
            this.performInspection();
            return;
        }

        const speed = police.speed || 90;
        const step = Math.min(distance, speed * (delta / 1000));
        const ratio = step / distance;

        police.sprite.x += dx * ratio;
        police.sprite.y += dy * ratio;
        police.sprite.setDepth(police.sprite.y + 10);

        if (police.shadow) {
            police.shadow.x = police.sprite.x;
            police.shadow.y = police.sprite.y + 10;
        }

        if (!police.isEmoji) {
            if (Math.abs(dx) > Math.abs(dy)) {
                police.sprite.setTexture(dx > 0 ? police.textureRight : police.textureLeft);
            } else {
                police.sprite.setTexture(dy > 0 ? police.textureDown : police.textureUp);
            }
        }
    }

    performInspection() {
        const hasIllegalItems = this.hasPoison || this.hasFakePOS || this.inventory.includes('clan_sheet');
        const hiding = this.hasSecretCompartment && !this._compartmentOpen;
        const saveTampered = !!(
            (this.scene && this.scene.isCheater) ||
            (window.GAME && window.GAME.isCheater) ||
            localStorage.getItem('waitress_cheater_flag') === 'true'
        );

        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(400, 250, '🕵️ PERQUISIZIONE IN CORSO...', '#ff0000');
        }

        if (this._isPoisonInvestigation || this.poisoningHappened) {
            this.scene.time.delayedCall(1800, () => {
                if (this._isPlayerDown) return;
                this.investigatePoisoning(hiding);
            });
            return;
        }

        this.scene.time.delayedCall(1800, () => {
            if (this._isPlayerDown) return;

            if (saveTampered) {
                this.endInspection();
                this.arrest('polizia', 'manomissione_file', 5);
                return;
            }

            if (hasIllegalItems && !hiding) {
                if (this.hasFakePOS) {
                    this.endInspection();
                    this.arrest('finanza', 'contraffazione', 3);
                } else if (this.hasPoison) {
                    this.endInspection();
                    this.arrest('polizia', 'detenzione_veleno', 2);
                } else if (this.inventory.includes('clan_sheet')) {
                    this.endInspection();
                    this.arrest('polizia', 'associazione_delinquere', 5);
                } else {
                    this.endInspection();
                    this.arrest('polizia', 'detenzione_illegale', 1);
                }
            } else if (hasIllegalItems && hiding) {
                if (typeof this.scene.showFloatingText === 'function') {
                    this.scene.showFloatingText(400, 250, '✅ Scomparto segreto: nulla trovato', '#2ecc71');
                    this.scene.showFloatingText(400, 280, '😅 "Puoi andare, per stavolta."', '#ffd700');
                }
                this.suspicionLevel = 50;
                this.syncSuspicionToGame();
                this.saveCrimeData();
                this.updateSuspicionBar();
                this.endInspection();
            } else {
                if (typeof this.scene.showFloatingText === 'function') {
                    this.scene.showFloatingText(400, 250, '✅ Nessun oggetto illegale', '#2ecc71');
                    this.scene.showFloatingText(400, 280, '💰 Multa: -100€', '#e74c3c');
                }
                window.GAME.score = Math.max(0, window.GAME.score - 100);
                if (typeof this.scene.updateHUD === 'function') this.scene.updateHUD();
                this.suspicionLevel = 0;
                this.syncSuspicionToGame();
                this.saveCrimeData();
                this.updateSuspicionBar();
                this.endInspection();
            }
        });
    }

    investigatePoisoning(hiding) {
        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(400, 220, '🕵️ "Chi ha avvelenato quel cliente?"', '#ff0000');
        }

        const targetName = this.missionTargetName;
        const poisonedName = this.poisonedCustomerName;
        const missionActive = this.hasAcceptedClanMission && targetName;
        const hitRightTarget = missionActive && targetName === poisonedName;
        const hitWrongTarget = missionActive && targetName && poisonedName && targetName !== poisonedName;
        const noMission = !missionActive;

        this.scene.time.delayedCall(2200, () => {
            if (this._isPlayerDown) return;

            if (hitRightTarget) {
                if (hiding) {
                    if (typeof this.scene.showFloatingText === 'function') {
                        this.scene.showFloatingText(400, 250, '✅ Scomparto vuoto. Veleno non trovato.', '#2ecc71');
                        this.scene.showFloatingText(400, 280, '😎 "Il clan è soddisfatto."', '#ffd700');
                    }
                } else {
                    if (typeof this.scene.showFloatingText === 'function') {
                        this.scene.showFloatingText(400, 250, '⚠️ Veleno trovato, ma il bersaglio era giusto.', '#f39c12');
                        this.scene.showFloatingText(400, 280, '🤝 "Il clan ti copre. Per stavolta."', '#9b59b6');
                    }
                }
                this.onPoisonInvestigationResolved(true);
                return;
            }

            if (hitWrongTarget) {
                if (typeof this.scene.showFloatingText === 'function') {
                    this.scene.showFloatingText(400, 250, '❌ Hai avvelenato la persona sbagliata!', '#ff0000');
                    this.scene.showFloatingText(400, 280, '🚔 "Sei in arresto per avvelenamento."', '#ff0000');
                }
                this.scene.time.delayedCall(1500, () => {
                    this.endInspection();
                    this.arrest('polizia', 'avvelenamento', 6);
                });
                return;
            }

            if (noMission) {
                if (hiding) {
                    if (typeof this.scene.showFloatingText === 'function') {
                        this.scene.showFloatingText(400, 250, '✅ Scomparto segreto: nulla trovato.', '#2ecc71');
                        this.scene.showFloatingText(400, 280, '😅 "Puoi andare."', '#ffd700');
                    }
                    this.onPoisonInvestigationResolved(true);
                } else {
                    if (typeof this.scene.showFloatingText === 'function') {
                        this.scene.showFloatingText(400, 250, '❌ Veleno trovato + cliente avvelenato!', '#ff0000');
                    }
                    this.scene.time.delayedCall(1500, () => {
                        this.endInspection();
                        this.arrest('polizia', 'avvelenamento', 5);
                    });
                }
                return;
            }

            this.onPoisonInvestigationResolved(true);
        });
    }

    onPoisonInvestigationResolved(success) {
        this.poisoningHappened = false;
        this.poisonedCustomerName = null;
        this._isPoisonInvestigation = false;
        this.missionTargetName = null;

        if (this.scene) {
            this.scene.poisonInvestigationActive = false;
            this.scene.poisonedCustomer = null;
        }

        if (success) {
            this.suspicionLevel = 50;
            this.syncSuspicionToGame();
            this.updateSuspicionBar();
        }

        this.saveCrimeData();
        this.endInspection();
    }

    endInspection() {
        this._inspectionActive = false;
        if (this._inspectionTimer) {
            this._inspectionTimer.remove();
            this._inspectionTimer = null;
        }

        this.cleanupFleeZone();

        this._fleeingDuringInspection = false;
        this._escapeAttempted = false;

        if (this.scene.waitress && this.scene.waitress.body && !this._isPlayerDown) {
            this.scene.waitress.body.enable = true;
        }

        if (this._inspectionPolice) {
            const police = this._inspectionPolice;
            if (police.sprite && police.shadow) {
                this.scene.tweens.add({
                    targets: [police.sprite, police.shadow],
                    alpha: 0,
                    duration: 800,
                    onComplete: () => {
                        if (police.sprite) police.sprite.destroy();
                        if (police.shadow) police.shadow.destroy();
                    }
                });
            } else {
                if (police.sprite) police.sprite.destroy();
                if (police.shadow) police.shadow.destroy();
            }
            this._inspectionPolice = null;
        }

        if (this.scene.spawnEvent) {
            this.scene.spawnEvent.paused = false;
        }
    }

    arrest(authority, crimeType, baseDays) {
        this.arrestCount++;
        this.saveCrimeData();

        const multiplier = this.getRecidivismMultiplier();
        const days = Math.ceil(baseDays * multiplier);
        const fine = days * 50;

        this.scene.gameActive = false;
        if (this.scene.physics) this.scene.physics.pause();

        let text;
        if (authority === 'polizia') {
            text = this.getPoliceText(crimeType, days, fine);
        } else {
            text = this.getFinanceText(crimeType, days, fine);
        }

        const arrestText = this.scene.add.text(400, 300, text, {
            fontSize: '15px',
            color: '#ffffff',
            align: 'center',
            fontFamily: 'Fredoka',
            lineSpacing: 6,
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(5000).setAlpha(0);

        this.scene.tweens.add({
            targets: arrestText,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });

        if (window.triggerSfx) window.triggerSfx('alert');

        this.scene.time.delayedCall(5000, () => {
            window.GAME.score = Math.max(0, window.GAME.score - fine);
            window.GAME.level += days;
            window.GAME.lives = 3;
            window.GAME.customersServed = 0;
            window.GAME.dirtyPlates = 0;
            window.GAME.carriedOrder = null;
            window.GAME.customersTarget = 6 + (window.GAME.level * 4);

            this.suspicionLevel = 0;
            this.hasPoison = false;
            this.hasFakePOS = false;
            this.inventory = [];
            this._compartmentOpen = false;
            this.poisonedCustomerName = null;
            this.poisoningHappened = false;
            this._isPoisonInvestigation = false;
            this.missionTargetName = null;
            this.syncSuspicionToGame();
            this.saveCrimeData();

            const saveData = {
                score: window.GAME.score,
                level: window.GAME.level,
                customersServed: 0,
                lives: 3,
                dirtyPlates: 0,
                settings: window.GAME.settings,
                housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : []
            };
            if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
                window.SaveManager.saveGame(saveData);
            } else {
                localStorage.setItem('waitress_save_data', JSON.stringify(saveData));
            }

            window.location.reload();
        });
    }

    getPoliceText(crimeType, days, fine) {
        const texts = {
            'manomissione_file':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Frode Informatica e Alterazione di Dati.\n\n" +
                "Le sue azioni sono state registrate.\n" +
                "Ogni tentativo di manomissione è punito\n" +
                "ai sensi dell'Art. 615-ter C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'avvelenamento':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Lesioni Dolose con Somministrazione\n" +
                "di Sostanze Nocive.\n\n" +
                "Il cliente ha sporto regolare denuncia\n" +
                "presso l'Ufficio di Polizia competente.\n" +
                "Il fatto è punito ai sensi dell'Art. 581 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'detenzione_veleno':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Detenzione di Sostanze Nocive\n" +
                "non autorizzate.\n\n" +
                "Le sostanze sono state sequestrate\n" +
                "e inviate al laboratorio per le analisi.\n" +
                "Il fatto è punito ai sensi dell'Art. 439 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'detenzione_illegale':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Detenzione di Oggetti di Provenienza\n" +
                "Illecita.\n\n" +
                "Gli oggetti sono stati sequestrati\n" +
                "e posti sotto custodia giudiziale.\n" +
                "Il fatto è punito ai sensi dell'Art. 648 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'corruzione':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Corruzione di Pubblico Ufficiale.\n\n" +
                "Le transazioni illecite sono state\n" +
                "tracciate dal sistema informatico.\n" +
                "Il fatto è punito ai sensi dell'Art. 319 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'associazione_delinquere':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Associazione a Delinquere.\n\n" +
                "Le prove sono state acquisite tramite\n" +
                "intercettazioni telefoniche autorizzate.\n" +
                "Il fatto è punito ai sensi dell'Art. 416 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'tentata_fuga':
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Resistenza a Pubblico Ufficiale\n" +
                "con Tentata Fuga.\n\n" +
                "L'agente ha esploso un colpo di\n" +
                "avvertimento per fermare la fuga.\n" +
                "Il fatto è punito ai sensi dell'Art. 337 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo."
        };
        return texts[crimeType] || texts['detenzione_illegale'];
    }

    getFinanceText(crimeType, days, fine) {
        const texts = {
            'frode_fiscale':
                "CORPO DI FINANZA - COMANDO PROVINCIALE\n\n" +
                "Verbale di Contestazione\n\n" +
                "Il contribuente ha utilizzato un POS\n" +
                "contraffatto per evadere le imposte.\n\n" +
                "Le transazioni in nero sono state\n" +
                "tracciate e quantificate.\n" +
                "Il fatto è punito ai sensi del D.Lgs. 74/2000\n" +
                "e dell'Art. 491-bis C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'darkweb':
                "CORPO DI FINANZA - COMANDO PROVINCIALE\n\n" +
                "Verbale di Contestazione\n\n" +
                "Il contribuente è stato tracciato\n" +
                "mentre accedeva a siti illegali.\n\n" +
                "L'indirizzo IP è stato registrato\n" +
                "e associato all'utenza del locale.\n" +
                "Il fatto è punito ai sensi del D.Lgs. 74/2000.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'contraffazione':
                "CORPO DI FINANZA - COMANDO PROVINCIALE\n\n" +
                "Verbale di Contestazione\n\n" +
                "Il contribuente è in possesso di\n" +
                "strumenti di pagamento contraffatti.\n\n" +
                "Il POS è stato sequestrato e inviato\n" +
                "al Reparto Tecnico per le analisi.\n" +
                "Il fatto è punito ai sensi dell'Art. 491-bis C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'evasione_fiscale':
                "CORPO DI FINANZA - COMANDO PROVINCIALE\n\n" +
                "Verbale di Contestazione\n\n" +
                "Il contribuente ha omesso di dichiarare\n" +
                "i corrispettivi delle transazioni.\n\n" +
                "Gli agenti hanno ricostruito\n" +
                "i ricavi non dichiarati.\n" +
                "Il fatto è punito ai sensi del D.Lgs. 74/2000.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'ricettazione':
                "CORPO DI FINANZA - COMANDO PROVINCIALE\n\n" +
                "Verbale di Contestazione\n\n" +
                "Il contribuente è in possesso di\n" +
                "beni di provenienza illecita.\n\n" +
                "I beni sono stati sequestrati ai fini\n" +
                "della confisca obbligatoria.\n" +
                "Il fatto è punito ai sensi dell'Art. 648 C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo.",

            'frode_informatica':
                "CORPO DI FINANZA - COMANDO PROVINCIALE\n\n" +
                "Verbale di Contestazione\n\n" +
                "Il contribuente ha alterato i sistemi\n" +
                "informatici per modificare i dati fiscali.\n\n" +
                "Le prove sono state acquisite tramite\n" +
                "perizia tecnica forense.\n" +
                "Il fatto è punito ai sensi dell'Art. 640-ter C.P.\n\n" +
                `PENA: ${days} GIORNI DI RECLUSIONE\n` +
                `MULTA: ${fine}€\n\n` +
                "La cameriera è in stato di fermo."
        };
        return texts[crimeType] || texts['frode_fiscale'];
    }

    usePOS() {
        if (!this.hasFakePOS) return false;

        this.posUsageCount++;
        this.addSuspicion(25, 'pos');
        this.saveCrimeData();

        const bonus = 100;
        window.GAME.score += bonus;
        if (typeof this.scene.updateHUD === 'function') this.scene.updateHUD();

        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(400, 300, `💳 POS contraffatto: +${bonus}€ in nero`, '#e74c3c');
        }

        if (this.posUsageCount >= 3) {
            this.scene.time.delayedCall(1000, () => {
                this.arrest('finanza', 'frode_fiscale', 5);
            });
        }

        return true;
    }

    openInventory() {
        const hasItems = this.inventory.length > 0 || this.hasPoison || this.hasFakePOS || this.hasClanSheet || this.hasVPN || this.hasSecretCompartment;
        
        if (!hasItems) {
            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(750, 490, '📦 Inventario Vuoto', '#aaaaaa');
            }
            return;
        }

        const container = this.scene.add.container(400, 300).setDepth(300).setScrollFactor(0);
        const bg = this.scene.add.rectangle(0, 0, 400, 320, 0x110906, 0.95).setStrokeStyle(2, 0xd27d2d);
        const title = this.scene.add.text(0, -130, '📦 INVENTARIO ILLEGALE', { fontSize: '20px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

        let yPos = -80;

        if (this.hasClanSheet || this.inventory.includes('clan_sheet')) {
            const clanBtn = this.scene.add.rectangle(0, yPos, 320, 32, 0x2c1a11).setStrokeStyle(1, 0xffd700).setInteractive({ useHandCursor: true });
            const clanTxt = this.scene.add.text(0, yPos, '📄 Foglio del Clan (Clicca per leggere)', { fontSize: '13px', color: '#ffd700', fontFamily: 'Fredoka' }).setOrigin(0.5);
            clanBtn.on('pointerdown', () => { container.destroy(); this.showClanSheet(); });
            container.add([clanBtn, clanTxt]);
            yPos += 40;
        }

        if (this.hasPoison || this.inventory.includes('poison')) {
            const poisonBtn = this.scene.add.rectangle(0, yPos, 320, 32, 0x2c1a11).setStrokeStyle(1, 0xe74c3c).setInteractive({ useHandCursor: true });
            const poisonTxt = this.scene.add.text(0, yPos, '🧪 Veleno - Clicca per applicare al vassoio', { fontSize: '13px', color: '#e74c3c', fontFamily: 'Fredoka' }).setOrigin(0.5);
            poisonBtn.on('pointerdown', () => { container.destroy(); this.poisonDish(); });
            container.add([poisonBtn, poisonTxt]);
            yPos += 40;
        }

        if (this.hasFakePOS || this.inventory.includes('fake_pos')) {
            const posBtn = this.scene.add.rectangle(0, yPos, 320, 32, 0x2c1a11).setStrokeStyle(1, 0xe74c3c).setInteractive({ useHandCursor: true });
            const posTxt = this.scene.add.text(0, yPos, '💳 POS Contraffatto - Clicca per usare', { fontSize: '13px', color: '#e74c3c', fontFamily: 'Fredoka' }).setOrigin(0.5);
            posBtn.on('pointerdown', () => { container.destroy(); this.usePOS(); });
            container.add([posBtn, posTxt]);
            yPos += 40;
        }

        if (this.hasVPN || this.inventory.includes('vpn')) {
            const vpnBg = this.scene.add.rectangle(0, yPos, 320, 32, 0x1a2c11).setStrokeStyle(1, 0x2ecc71);
            const vpnTxt = this.scene.add.text(0, yPos, '🛡️ VPN Attiva (Protezione Dark Web)', { fontSize: '13px', color: '#2ecc71', fontFamily: 'Fredoka' }).setOrigin(0.5);
            container.add([vpnBg, vpnTxt]);
            yPos += 40;
        }

        if (this.hasSecretCompartment || this.inventory.includes('compartment')) {
            const compBg = this.scene.add.rectangle(0, yPos, 320, 32, 0x1a2c11).setStrokeStyle(1, 0x3498db);
            const compTxt = this.scene.add.text(0, yPos, '🗄️ Scomparto Segreto Installato', { fontSize: '13px', color: '#3498db', fontFamily: 'Fredoka' }).setOrigin(0.5);
            container.add([compBg, compTxt]);
            yPos += 40;
        }

        const close = this.scene.add.text(170, -140, '✖', { fontSize: '24px', color: '#e74c3c' }).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => container.destroy());
        container.add([bg, title, close]);
    }

    showClanSheet() {
        const container = this.scene.add.container(400, 300).setDepth(400).setScrollFactor(0);
        const bg = this.scene.add.rectangle(0, 0, 420, 260, 0x110906, 0.98).setStrokeStyle(2, 0xffd700);
        const title = this.scene.add.text(0, -100, '📄 FOGLIO SEGRETO', { fontSize: '20px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const site = this.scene.add.text(0, -40, '🔗 hiddenvault.com', { fontSize: '18px', color: '#00ff00', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const codeLabel = this.scene.add.text(0, 0, `Codice: ${this.clanSheetCode || '------'}`, { fontSize: '14px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const expiry = this.scene.add.text(0, 40, `Scadenza: Giorno ${this.clanSheetExpiry}`, { fontSize: '13px', color: '#ff4444', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const hint = this.scene.add.text(0, 80, 'Apri questo sito su Gugol a casa', { fontSize: '12px', color: '#aaaaaa', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const close = this.scene.add.text(180, -110, '✖', { fontSize: '24px', color: '#e74c3c' }).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => container.destroy());
        container.add([bg, title, site, codeLabel, expiry, hint, close]);
    }

    openHiddenVault() {
        this.darkWebAccessCount++;
        this.addSuspicion(10, 'darkweb');

        const container = this.scene.add.container(400, 300).setDepth(300).setScrollFactor(0);
        const bg = this.scene.add.rectangle(0, 0, 500, 350, 0x0a0a0a, 0.98).setStrokeStyle(2, 0x00ff00);
        const title = this.scene.add.text(0, -120, '🌐 HIDDENVAULT', { fontSize: '28px', color: '#00ff00', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
        const subtitle = this.scene.add.text(0, -80, 'Dark Web Marketplace', { fontSize: '14px', color: '#00aa00', fontFamily: 'Fredoka' }).setOrigin(0.5);

        const items = [
            { id: 'poison', name: 'Veleno', price: 150, desc: 'Avvelena un piatto senza uccidere' },
            { id: 'fake_pos', name: 'POS Contraffatto', price: 250, desc: 'Raddoppia le entrate del giorno' },
            { id: 'vpn', name: 'VPN', price: 200, desc: 'Dimezza il sospetto dal dark web' },
            { id: 'compartment', name: 'Scomparto Segreto', price: 300, desc: 'Nasconde oggetti illegali' }
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
                    
                    if (!this.inventory.includes(item.id)) {
                        this.inventory.push(item.id);
                    }

                    if (item.id === 'poison') { this.hasPoison = true; this.addSuspicion(15, 'darkweb'); }
                    if (item.id === 'fake_pos') { this.hasFakePOS = true; this.addSuspicion(20, 'darkweb'); }
                    if (item.id === 'vpn') this.hasVPN = true;
                    if (item.id === 'compartment') {
                        this.hasSecretCompartment = true;
                        if (this.secretCompartmentSprite) {
                            this.secretCompartmentSprite.setVisible(true);
                        }
                    }
                    this.saveCrimeData();
                    if (typeof this.scene.updateHUD === 'function') this.scene.updateHUD();
                    if (typeof this.scene.showFloatingText === 'function') {
                        this.scene.showFloatingText(400, 500, `✅ Comprato: ${item.name}`, '#2ecc71');
                    }
                } else {
                    if (typeof this.scene.showFloatingText === 'function') {
                        this.scene.showFloatingText(400, 500, '❌ Soldi insufficienti', '#e74c3c');
                    }
                }
            });

            container.add([itemBg, itemText, buyBtn, buyText]);
        });

        const close = this.scene.add.text(200, -140, '✖', { fontSize: '24px', color: '#00ff00' }).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => container.destroy());
        container.add([bg, title, subtitle, close]);
    }

    poisonDish() {
        if (!this.hasPoison && !this.inventory.includes('poison')) return;
        if (!this.scene.waitressState || !this.scene.waitressState.tray || this.scene.waitressState.tray.length !== 1) {
            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(400, 300, '⚠️ Il vassoio deve avere solo 1 piatto', '#ff4444');
            }
            return;
        }

        this.scene.waitressState.tray[0].poisoned = true;
        this.hasPoison = false;
        this.inventory = this.inventory.filter(i => i !== 'poison');

        if (this.hasAcceptedClanMission && this.scene.quest && typeof this.scene.quest.getClanTargetName === 'function') {
            const target = this.scene.quest.getClanTargetName();
            if (target) this.missionTargetName = target;
        }

        this.addSuspicion(40, 'poison');
        this.saveCrimeData();

        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(400, 300, '🧪 Piatto avvelenato!', '#e74c3c');
        }
    }

    triggerClanCall() {
        if (this.clanMissionCompleted || this.hasAcceptedClanMission) return;

        if (this.scene.phone) {
            this.scene.phone.triggerCall('clan');
        } else {
            this.acceptClanMission();
        }
    }

    acceptClanMission() {
        if (this.hasAcceptedClanMission) return;
        this.hasAcceptedClanMission = true;
        this.clanSheetCode = String(Phaser.Math.Between(100000, 999999));
        this.clanSheetExpiry = window.GAME.level + 5;
        this.saveCrimeData();

        this.scene.time.delayedCall(1500, () => {
            this.spawnClanMember();
            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(400, 260, '🧔‍♂️ Un uomo sospetto attende nell\'angolo...', '#ff4444');
                this.scene.showFloatingText(400, 290, '💬 Avvicinati per parlargli', '#ffd700');
            }
        });
    }

    spawnClanMember() {
        if (this.clanMemberSprite) return;
        this.clanMemberActive = true;

        const startX = 240;
        const startY = 580;
        const targetX = 80;
        const targetY = 520;

        if (this.scene.textures.exists('Criminale_Avanti')) {
            this.clanMemberShadow = this.scene.add.ellipse(startX, startY + 10, 22, 6, 0x000000, 0.3).setDepth(startY - 1);
            this.clanMemberSprite = this.scene.add.image(startX, startY, 'Criminale_Avanti')
                .setDisplaySize(45, 45)
                .setDepth(startY)
                .setInteractive({ useHandCursor: true });
        } else {
            this.clanMemberShadow = this.scene.add.ellipse(startX, startY + 10, 22, 6, 0x000000, 0.3).setDepth(startY - 1);
            this.clanMemberSprite = this.scene.add.text(startX, startY, '🧔‍♂️', { fontSize: '32px' })
                .setOrigin(0.5)
                .setDepth(startY)
                .setInteractive({ useHandCursor: true });
        }

        this.scene.tweens.add({
            targets: [this.clanMemberSprite, this.clanMemberShadow],
            x: targetX,
            y: (target) => target === this.clanMemberShadow ? targetY + 10 : targetY,
            duration: 3000,
            ease: 'Linear',
            onUpdate: () => {
                if (this.clanMemberSprite) {
                    this.clanMemberSprite.setDepth(this.clanMemberSprite.y);
                }
            },
            onComplete: () => {
                if (this.clanMemberSprite && this.scene.textures.exists('Criminale_Avanti')) {
                    this.clanMemberSprite.setTexture('Criminale_Avanti');
                }
            }
        });

        this.clanMemberSprite.on('pointerdown', () => {
            const playerObj = this.scene.waitress || this.scene.player || { x: 0, y: 0 };
            const dist = Phaser.Math.Distance.Between(
                playerObj.x,
                playerObj.y,
                this.clanMemberSprite.x,
                this.clanMemberSprite.y
            );
            if (dist <= 80) {
                this.talkToClanMember();
            } else {
                if (typeof this.scene.showFloatingText === 'function') {
                    this.scene.showFloatingText(400, 250, 'Avvicinati all\'uomo nell\'angolo', '#ffd700');
                }
            }
        });
    }

    talkToClanMember() {
        if (this.clanMissionCompleted) {
            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(400, 250, 'Il clan ti ha già pagato.', '#999999');
            }
            return;
        }

        if (!this.hasClanSheet) {
            this.hasClanSheet = true;
            if (!this.inventory.includes('clan_sheet')) {
                this.inventory.push('clan_sheet');
            }
            this.saveCrimeData();
            
            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(400, 250, '📄 Il mafioso ti consegna un foglio con un codice!', '#ffd700');
                this.scene.showFloatingText(400, 280, '💻 Vai a casa e usa hiddenvault.com sul PC', '#3498db');
            }
            
            this.makeClanMemberLeave();
            return;
        }

        const hasBoughtFromDarkWeb = this.darkWebAccessCount > 0;
        if (!hasBoughtFromDarkWeb) {
            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(400, 250, '🧔‍♂️ "Usa quel codice su Hidden Vault prima."', '#ff4444');
            }
            return;
        }

        this.completeClanMission();
    }

    makeClanMemberLeave() {
        if (!this.clanMemberSprite) return;

        const exitX = 240;
        const exitY = 592;

        if (this.scene.textures.exists('Criminale_Destra')) {
            this.clanMemberSprite.setTexture('Criminale_Destra');
        }

        this.scene.tweens.add({
            targets: [this.clanMemberSprite, this.clanMemberShadow],
            x: exitX,
            y: (target) => target === this.clanMemberShadow ? exitY + 10 : exitY,
            duration: 2500,
            ease: 'Linear',
            onComplete: () => {
                if (this.clanMemberSprite) {
                    this.clanMemberSprite.destroy();
                    this.clanMemberSprite = null;
                }
                if (this.clanMemberShadow) {
                    this.clanMemberShadow.destroy();
                    this.clanMemberShadow = null;
                }
                this.clanMemberActive = false;
            }
        });
    }

    completeClanMission() {
        if (this.clanMissionCompleted) return;

        this.clanMissionCompleted = true;
        this.hasAcceptedClanMission = false;
        window.GAME.score += 500;
        if (typeof this.scene.updateHUD === 'function') this.scene.updateHUD();
        this.addSuspicion(10, 'clan');
        this.saveCrimeData();

        if (this.scene.story) {
            this.scene.story.storyState.clanMissionCompleted = true;
            this.scene.story.saveStoryData();
        }

        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(400, 250, '💰 Il clan ti paga: +500€', '#2ecc71');
            this.scene.showFloatingText(400, 280, '⚠️ Ora sei dentro. Non puoi più uscire.', '#ff4444');
        }

        this.makeClanMemberLeave();
    }

    betrayClan() {
        if (!this.hasAcceptedClanMission && !this.clanMissionCompleted) return;

        this.clanBetrayed = true;
        this.hasClanSheet = false;
        this.inventory = this.inventory.filter(i => i !== 'clan_sheet');
        window.GAME.score += 1000;
        if (typeof this.scene.updateHUD === 'function') this.scene.updateHUD();
        this.addSuspicion(50, 'clan');
        this.saveCrimeData();

        if (this.scene.story) {
            this.scene.story.storyState.clanBetrayed = true;
            this.scene.story.saveStoryData();
        }

        if (typeof this.scene.showFloatingText === 'function') {
            this.scene.showFloatingText(400, 250, '📞 Hai chiamato la Polizia: +1000€', '#2ecc71');
            this.scene.showFloatingText(400, 280, '⚠️ Il clan ti darà la caccia.', '#ff4444');
        }
    }
}

window.CrimeSystem = CrimeSystem;