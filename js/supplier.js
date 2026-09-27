class SupplierSystem {
    constructor(scene) {
        this.scene = scene;
        this.foodStock = 15;
        this.packageSpawned = false;
        this.packageSprite = null;
        this.packageInteractZone = null;
        this.packageGlow = null;
        this._lowStockWarningShown = false;
        this._hintShown = false;
        this.costPerUnit = 0.50;
        this.totalCost = 7.50;
        this.externalPackageSpawned = false;
        this.externalPackageSprite = null;
        this.externalPackageZone = null;
        this.externalPackageGlow = null;

        this.createStockUI();
        this.updateStock();
    }

    createStockUI() {
        if (this.stockText) {
            this.stockText.destroy();
        }
        this.stockText = this.scene.add.text(20, 50, `📦 Scorte: ${this.foodStock}`, {
            fontSize: '14px',
            color: '#ffd700',
            fontFamily: 'Fredoka',
            fontStyle: 'bold'
        }).setDepth(100).setScrollFactor(0);
    }

    updateStock() {
        if (!this.stockText) return;
        this.stockText.setText(`📦 Scorte: ${this.foodStock}`);

        if (this.foodStock <= 0) {
            this.stockText.setColor('#ff4444');
        } else if (this.foodStock <= 3) {
            this.stockText.setColor('#ffaa00');
        } else {
            this.stockText.setColor('#ffd700');
        }
    }

    consumeFood(amount = 1) {
        if (this.foodStock <= 0) {
            this.showLowStockWarning();
            return false;
        }

        this.foodStock = Math.max(0, this.foodStock - amount);
        this.updateStock();

        if (this.foodStock <= 3) {
            this.showLowStockWarning();
        }

        return true;
    }

    showLowStockWarning() {
        if (!this._lowStockWarningShown && this.scene && this.scene.showFloatingText) {
            this.scene.showFloatingText(
                400,
                140,
                '📦 SCORTE BASSE! Chiama il fornitore dal telefono!',
                '#ffaa00'
            );
            this._lowStockWarningShown = true;
        }

        if (this.scene) {
            this.scene.time.delayedCall(5000, () => {
                this._lowStockWarningShown = false;
            });
        }
    }

    spawnPackage() {
        if (this.packageSpawned) {
            if (this.scene && this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 200, '📦 C\'è già un pacco in sala!', '#ffaa00');
            }
            return false;
        }

        const entryX = 150;
        const entryY = 500;

        if (this.scene.textures.exists('pacco')) {
            this.packageSprite = this.scene.add.image(entryX, entryY, 'pacco')
                .setDepth(20)
                .setDisplaySize(80, 80);
        } else {
            this.packageSprite = this.scene.add.text(entryX, entryY, '📦', {
                fontSize: '64px'
            }).setOrigin(0.5).setDepth(20);
        }

        this.packageInteractZone = this.scene.add.zone(entryX, entryY, 90, 90)
            .setDepth(19)
            .setInteractive({ useHandCursor: true });

        this.packageInteractZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(
                this.scene.waitress.x,
                this.scene.waitress.y,
                entryX,
                entryY
            );
            if (dist <= 120) {
                this.pickUpPackage();
            } else {
                this.scene.showFloatingText(entryX, entryY - 50, 'Avvicinati al pacco e clicca!', '#ffd700');
            }
        });

        this.packageGlow = this.scene.add.graphics()
            .setDepth(18)
            .fillStyle(0x3498db, 0.25)
            .fillCircle(entryX, entryY, 60);

        this.scene.tweens.add({
            targets: this.packageGlow,
            alpha: 0.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.packageSprite.setScale(0.3);
        this.packageSprite.y = 580;

        this.scene.tweens.add({
            targets: this.packageSprite,
            y: entryY,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.packageSpawned = true;

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(entryX, entryY - 50, '📦 Pacco consegnato! Clicca per ritirare', '#3498db');
        }

        return true;
    }

    spawnExternalPackage(itemData) {
        if (this.externalPackageSpawned) {
            return false;
        }

        const entryX = 150;
        const entryY = 500;

        if (this.scene.textures.exists('pacco')) {
            this.externalPackageSprite = this.scene.add.image(entryX, entryY, 'pacco')
                .setDepth(20)
                .setDisplaySize(80, 80);
        } else {
            this.externalPackageSprite = this.scene.add.text(entryX, entryY, '📦', {
                fontSize: '64px'
            }).setOrigin(0.5).setDepth(20);
        }

        this.externalPackageZone = this.scene.add.zone(entryX, entryY, 90, 90)
            .setDepth(19)
            .setInteractive({ useHandCursor: true });

        this.externalPackageZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(
                this.scene.waitress.x,
                this.scene.waitress.y,
                entryX,
                entryY
            );
            if (dist <= 120) {
                this.pickUpExternalPackage(itemData);
            } else {
                this.scene.showFloatingText(entryX, entryY - 50, 'Avvicinati al pacco e clicca!', '#ffd700');
            }
        });

        this.externalPackageGlow = this.scene.add.graphics()
            .setDepth(18)
            .fillStyle(0xf39c12, 0.25)
            .fillCircle(entryX, entryY, 60);

        this.scene.tweens.add({
            targets: this.externalPackageGlow,
            alpha: 0.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.externalPackageSprite.setScale(0.3);
        this.externalPackageSprite.y = 580;

        this.scene.tweens.add({
            targets: this.externalPackageSprite,
            y: entryY,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.externalPackageSpawned = true;

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(entryX, entryY - 50, `📦 Consegna: ${itemData.name}!`, '#f39c12');
        }

        return true;
    }

    pickUpExternalPackage(itemData) {
        if (!this.externalPackageSpawned || !this.externalPackageSprite) {
            return false;
        }

        if (this.externalPackageSprite) {
            this.scene.tweens.add({
                targets: this.externalPackageSprite,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 300,
                ease: 'Back.easeIn',
                onComplete: () => {
                    this.externalPackageSprite.destroy();
                    this.externalPackageSprite = null;
                }
            });
        }

        if (this.externalPackageZone) {
            this.externalPackageZone.destroy();
            this.externalPackageZone = null;
        }
        if (this.externalPackageGlow) {
            this.externalPackageGlow.destroy();
            this.externalPackageGlow = null;
        }

        this.externalPackageSpawned = false;

        if (window.HOUSE_STATE && !window.HOUSE_STATE.purchased.includes(itemData.id)) {
            window.HOUSE_STATE.purchased.push(itemData.id);
        }

        try {
            const saveData = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
            if (saveData.data) {
                saveData.data.housePurchased = window.HOUSE_STATE.purchased;
            } else {
                saveData.housePurchased = window.HOUSE_STATE.purchased;
            }
            localStorage.setItem('waitress_save_data', JSON.stringify(saveData));
        } catch(e) {}

        try {
            const customPositions = JSON.parse(localStorage.getItem('waitress_ivea_positions') || '{}');
            if (itemData.x !== undefined && itemData.y !== undefined) {
                customPositions[itemData.id] = { x: itemData.x, y: itemData.y };
                localStorage.setItem('waitress_ivea_positions', JSON.stringify(customPositions));
            }
        } catch(e) {}

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(400, 300, `✅ ${itemData.name} installato!`, '#2ecc71');
        }

        if (this.scene.triggerSfx) {
            this.scene.triggerSfx('coin');
        }

        return true;
    }

    pickUpPackage() {
        if (!this.packageSpawned || !this.packageSprite) {
            return false;
        }

        if (window.GAME && window.GAME.score < this.totalCost) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(
                    400,
                    200,
                    `💰 Non hai abbastanza soldi! (${this.totalCost}€ necessari)`,
                    '#ff4444'
                );
            }
            return false;
        }

        if (window.GAME) {
            window.GAME.score -= this.totalCost;
            if (this.scene.updateHUD) {
                this.scene.updateHUD();
            }
        }

        if (this.packageSprite) {
            this.scene.tweens.add({
                targets: this.packageSprite,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 300,
                ease: 'Back.easeIn',
                onComplete: () => {
                    this.packageSprite.destroy();
                    this.packageSprite = null;
                }
            });
        }

        if (this.packageInteractZone) {
            this.packageInteractZone.destroy();
            this.packageInteractZone = null;
        }
        if (this.packageGlow) {
            this.packageGlow.destroy();
            this.packageGlow = null;
        }

        this.packageSpawned = false;

        this.foodStock = 15;
        this.updateStock();

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(400, 300, `📦 Scorte rifornite! -${this.totalCost}€`, '#2ecc71');
        }

        if (this.scene.triggerSfx) {
            this.scene.triggerSfx('coin');
        }

        return true;
    }

    update() {
        if (this.packageSpawned && this.packageInteractZone && this.scene.waitress) {
            const dist = Phaser.Math.Distance.Between(
                this.scene.waitress.x,
                this.scene.waitress.y,
                this.packageInteractZone.x,
                this.packageInteractZone.y
            );
            if (dist <= 100 && !this._hintShown) {
                this.scene.showFloatingText(
                    this.packageInteractZone.x,
                    this.packageInteractZone.y - 70,
                    '👆 CLICCA SUL PACCO per ritirarlo!',
                    '#3498db'
                );
                this._hintShown = true;
            } else if (dist > 100) {
                this._hintShown = false;
            }
        } else {
            this._hintShown = false;
        }

        this.checkExternalDeliveries();
    }

    checkExternalDeliveries() {
        if (this.externalPackageSpawned) return;

        let deliveries = [];
        try {
            deliveries = JSON.parse(localStorage.getItem('waitress_ivea_deliveries') || '[]');
        } catch(e) {
            return;
        }

        const now = Date.now();
        const restaurantDeliveries = deliveries.filter(d => d.target === 'restaurant');

        for (const delivery of restaurantDeliveries) {
            const elapsed = now - delivery.orderTime;
            if (elapsed >= delivery.deliveryTime) {
                const remaining = deliveries.filter(d => d.orderTime !== delivery.orderTime);
                localStorage.setItem('waitress_ivea_deliveries', JSON.stringify(remaining));

                this.spawnExternalPackage({
                    id: delivery.id,
                    name: delivery.name,
                    emoji: delivery.emoji || '📦',
                    x: delivery.x,
                    y: delivery.y
                });
                break;
            }
        }
    }

    destroy() {
        if (this.stockText) {
            this.stockText.destroy();
            this.stockText = null;
        }
        if (this.packageSprite) {
            this.packageSprite.destroy();
            this.packageSprite = null;
        }
        if (this.packageInteractZone) {
            this.packageInteractZone.destroy();
            this.packageInteractZone = null;
        }
        if (this.packageGlow) {
            this.packageGlow.destroy();
            this.packageGlow = null;
        }
        if (this.externalPackageSprite) {
            this.externalPackageSprite.destroy();
            this.externalPackageSprite = null;
        }
        if (this.externalPackageZone) {
            this.externalPackageZone.destroy();
            this.externalPackageZone = null;
        }
        if (this.externalPackageGlow) {
            this.externalPackageGlow.destroy();
            this.externalPackageGlow = null;
        }
    }
}

window.SupplierSystem = SupplierSystem;