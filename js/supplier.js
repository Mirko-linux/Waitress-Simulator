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

        // ============================================================
        // POSIZIONE DEL PACCO
        // ============================================================
        const entryX = 150;
        const entryY = 500;
        // ============================================================

        // ============================================================
        // CREA IL PACCO CON DIMENSIONE ADEGUATA (VERAMENTE GRANDE)
        // ============================================================
        if (this.scene.textures.exists('pacco')) {
            this.packageSprite = this.scene.add.image(entryX, entryY, 'pacco')
                .setDepth(20)
                .setDisplaySize(80, 80);  // ✅ INGRANDITO: da 50x50 a 80x80
        } else {
            // Fallback: emoji
            this.packageSprite = this.scene.add.text(entryX, entryY, '📦', {
                fontSize: '64px'  // ✅ INGRANDITO: da 48px a 64px
            }).setOrigin(0.5).setDepth(20);
        }
        // ============================================================

        // ============================================================
        // ZONA INTERATTIVA PER IL CLIC (ingrandita)
        // ============================================================
        this.packageInteractZone = this.scene.add.zone(entryX, entryY, 90, 90)  // ✅ INGRANDITO: da 60x60 a 90x90
            .setDepth(19)
            .setInteractive({ useHandCursor: true });

        this.packageInteractZone.on('pointerdown', () => {
            // ✅ RICHIEDE IL CLIC
            const dist = Phaser.Math.Distance.Between(
                this.scene.waitress.x,
                this.scene.waitress.y,
                entryX,
                entryY
            );
            if (dist <= 120) {  // ✅ RAGGIO AUMENTATO: da 100 a 120
                this.pickUpPackage();
            } else {
                this.scene.showFloatingText(entryX, entryY - 50, 'Avvicinati al pacco e clicca!', '#ffd700');
            }
        });
        // ============================================================

        // ============================================================
        // GLOW PIÙ VISIBILE
        // ============================================================
        this.packageGlow = this.scene.add.graphics()
            .setDepth(18)
            .fillStyle(0x3498db, 0.25)
            .fillCircle(entryX, entryY, 60);  // ✅ INGRANDITO: da 40 a 60

        this.scene.tweens.add({
            targets: this.packageGlow,
            alpha: 0.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        // ============================================================

        // ============================================================
        // ANIMAZIONE DI ENTRATA
        // ============================================================
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
        // ============================================================

        this.packageSpawned = true;

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(entryX, entryY - 50, '📦 Pacco consegnato! Clicca per ritirare', '#3498db');
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

        // ✅ ANIMAZIONE DI RACCOLTA
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
        // ✅ MOSTRA L'HINT QUANDO IL GIOCATORE È VICINO AL PACCO
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