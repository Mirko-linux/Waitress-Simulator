// supplier.js - Sistema Fornitore Completo

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

        // Posizione dell'entrata (in basso a sinistra)
        const entryX = 140;
        const entryY = 540;

        // ============================================================
        // CREA IL PACCO CON DIMENSIONE RIDOTTA
        // ============================================================
        if (this.scene.textures.exists('pacco')) {
            this.packageSprite = this.scene.add.image(entryX, entryY, 'pacco')
                .setDepth(20)
                .setDisplaySize(28, 28);  // RIDOTTO: 28x28 invece di 40x40
        } else {
            // Fallback: emoji più piccola
            this.packageSprite = this.scene.add.text(entryX, entryY, '📦', {
                fontSize: '28px'  // RIDOTTO: da 40px a 28px
            }).setOrigin(0.5).setDepth(20);
        }

        // Crea una zona interattiva per il pacco (più piccola)
        this.packageInteractZone = this.scene.add.zone(entryX, entryY, 32, 32)  // RIDOTTO: da 50x50 a 32x32
            .setDepth(19)
            .setInteractive({ useHandCursor: true });

        this.packageInteractZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(
                this.scene.waitress.x,
                this.scene.waitress.y,
                entryX,
                entryY
            );
            if (dist <= 80) {
                this.pickUpPackage();
            } else {
                this.scene.showFloatingText(entryX, entryY - 40, 'Avvicinati al pacco!', '#ffd700');
            }
        });

        // Glow più piccolo
        this.packageGlow = this.scene.add.graphics()
            .setDepth(18)
            .fillStyle(0x3498db, 0.15)
            .fillCircle(entryX, entryY, 22);  // RIDOTTO: da 30 a 22

        this.scene.tweens.add({
            targets: this.packageGlow,
            alpha: 0.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Anima il pacco (entra dalla porta)
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
            this.scene.showFloatingText(entryX, entryY - 50, '📦 Pacco consegnato!', '#3498db');
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
            if (dist <= 50) {
                if (!this._hintShown) {
                    this.scene.showFloatingText(
                        this.packageInteractZone.x,
                        this.packageInteractZone.y - 50,
                        '📦 Clicca per raccogliere!',
                        '#3498db'
                    );
                    this._hintShown = true;
                }
            } else {
                this._hintShown = false;
            }
        } else {
            this._hintShown = false;
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
    }
}

window.SupplierSystem = SupplierSystem;