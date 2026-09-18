class RadioSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentAudio = null;
        this.isPlaying = false;
        this.audioBuffer = null;
        this.patienceBonus = 0.15;
        this.isPurchased = false;
        this.isPlaced = false;
        this.radioSprite = null;
        this.canPlace = false;
        this.ghostSprite = null;
        this.deliveryPending = false;
        this.packageSprite = null;
        this.packageGlow = null;
        this.packageInteractZone = null;

        this.createRadioUI();
        this.setupFileInput();
        this.checkPurchasedState();
        this.setupDeliveryCheck();
        this.setupPlacementPreview();
    }

    createRadioUI() {
        this.radioBtn = this.scene.add.text(700, 550, '📻 Radio', {
            fontSize: '16px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            backgroundColor: '#000000',
            padding: { x: 12, y: 6 },
            stroke: '#d27d2d',
            strokeThickness: 2
        })
        .setInteractive({ useHandCursor: true })
        .setDepth(200)
        .setScrollFactor(0)
        .setVisible(false);

        this.statusText = this.scene.add.text(700, 530, '', {
            fontSize: '10px',
            color: '#cccccc',
            fontFamily: 'Fredoka'
        })
        .setDepth(201)
        .setScrollFactor(0);

        this.radioBtn.on('pointerdown', () => this.toggleRadio());
        this.radioBtn.on('pointerover', () => this.radioBtn.setStyle({ color: '#ffffff' }));
        this.radioBtn.on('pointerout', () => this.radioBtn.setStyle({ color: '#ffd700' }));
    }

    setupFileInput() {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'audio/mp3, audio/wav, audio/ogg, audio/flac';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);
        this.fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) this.loadAndPlayMusic(file);
        });
    }

    setupDeliveryCheck() {
        if (!this.scene.story) return;
        const currentDay = this.scene.story.storyState ? this.scene.story.storyState.currentDay : null;
        const deliveryDay = this.scene.story.storyState ? this.scene.story.storyState.radioDeliveryDay : null;
        if (deliveryDay && currentDay && currentDay >= deliveryDay) {
            this.deliveryPending = true;
        }
    }

    checkPurchasedState() {
        const savedRadio = localStorage.getItem('waitress_radio_state');
        if (savedRadio) {
            try {
                const state = JSON.parse(savedRadio);
                this.isPurchased = state.isPurchased;
                this.isPlaced = state.isPlaced;
                this.deliveryPending = state.deliveryPending;
                if (this.isPlaced && state.x && state.y) this.createPlacedRadio(state.x, state.y);
            } catch(e) {}
        }
    }

    saveState() {
        const state = {
            isPurchased: this.isPurchased,
            isPlaced: this.isPlaced,
            deliveryPending: this.deliveryPending,
            x: this.radioSprite ? this.radioSprite.x : null,
            y: this.radioSprite ? this.radioSprite.y : null
        };
        localStorage.setItem('waitress_radio_state', JSON.stringify(state));
    }

    purchaseRadio() {
        if (this.isPurchased) return;
        this.isPurchased = true;
        this.deliveryPending = true;
        this.radioBtn.setVisible(false);
        this.saveState();
    }

    completeDelivery() {
        this.deliveryPending = false;
        this.canPlace = true;
        this.radioBtn.setVisible(true);
        this.showPlacementHint();
    }

    showPlacementHint() {
        const hint = this.scene.add.text(400, 250, '📻 Radio consegnata!\nClicca sulla mappa per posizionarla', {
            fontSize: '16px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(150).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: hint,
            alpha: 0,
            delay: 2500,
            duration: 500,
            onComplete: () => hint.destroy()
        });
    }

    setupPlacementPreview() {
        this.scene.input.on('pointermove', (pointer) => {
            if (!this.canPlace || this.isPlaced) return;
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
            if (!this.ghostSprite) {
                if (this.scene.textures.exists('radio')) {
                    this.ghostSprite = this.scene.add.image(worldPoint.x, worldPoint.y, 'radio').setAlpha(0.6);
                } else {
                    this.ghostSprite = this.scene.add.text(worldPoint.x, worldPoint.y, '📻', {fontSize: '24px'}).setAlpha(0.6);
                }
            }
            this.ghostSprite.x = worldPoint.x;
            this.ghostSprite.y = worldPoint.y;
        });

        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.canPlace || this.isPlaced) return;
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
            if (worldPoint.x < 40 || worldPoint.x > 760 || worldPoint.y < 60 || worldPoint.y > 560) return;
            this.placeRadio(worldPoint.x, worldPoint.y);
        });
    }

    placeRadio(x, y) {
        if (this.ghostSprite) {
            this.ghostSprite.destroy();
            this.ghostSprite = null;
        }
        this.createPlacedRadio(x, y);
        this.isPlaced = true;
        this.canPlace = false;
        this.radioBtn.setVisible(true);
        this.saveState();
    }

    createPlacedRadio(x, y) {
        if (this.radioSprite) return;
        
        if (this.scene.textures.exists('radio')) {
            this.radioSprite = this.scene.add.image(x, y, 'radio').setDepth(y).setDisplaySize(30, 30);
        } else {
            this.radioSprite = this.scene.add.text(x, y, '📻', {fontSize: '24px'}).setOrigin(0.5).setDepth(y);
        }
        
        this.radioSprite.setInteractive({ useHandCursor: true });
        this.radioSprite.on('pointerdown', () => {
            this.toggleRadio();
            this.radioBtn.setPosition(this.radioSprite.x, this.radioSprite.y - 40);
            this.statusText.setPosition(this.radioSprite.x, this.radioSprite.y - 55);
        });
    }

    async loadAndPlayMusic(file) {
        if (this.isPlaying) this.stopMusic();
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioContext = this.scene.sound.context;
            this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            if (audioContext.state === 'suspended') await audioContext.resume();

            const source = audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.loop = true;
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.start(0);

            this.currentAudio = { source, gainNode };
            this.isPlaying = true;
            this.radioBtn.setText('⏹️ Ferma Radio');
            this.statusText.setText(`🎵 Ora: ${file.name.substring(0, 20)}...`);
            this.applyPatienceBonus();
        } catch (error) {
            this.statusText.setText('❌ Errore formato audio');
            this.isPlaying = false;
        }
    }

    toggleRadio() {
        if (!this.isPurchased) {
            this.statusText.setText('❌ Radio non acquistata');
            return;
        }
        if (!this.isPlaced) {
            this.statusText.setText('❌ Radio non posizionata');
            return;
        }
        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.fileInput.click();
        }
    }

    stopMusic() {
        if (this.currentAudio) {
            try { this.currentAudio.source.stop(); } catch (e) {}
            this.currentAudio = null;
            this.audioBuffer = null;
        }
        this.isPlaying = false;
        this.radioBtn.setText('📻 Radio');
        this.statusText.setText('');
        this.removePatienceBonus();
    }

    applyPatienceBonus() {
        if (!this.scene.customers) return;
        this.scene.customers.forEach(c => {
            if (!c.isDead && c.patienceMultiplier) {
                c.patienceMultiplier = Math.max(0.3, c.patienceMultiplier - this.patienceBonus);
            }
        });
    }

    removePatienceBonus() {
        if (!this.scene.customers) return;
        this.scene.customers.forEach(c => {
            if (!c.isDead && c.patienceMultiplier) {
                const npcConfig = window.NPC_REGISTRY[c.name] || {};
                c.patienceMultiplier = npcConfig.patienceMultiplier || 1.0;
            }
        });
    }

    setPendingRadioDelivery() {
        if (!this.isPurchased) return;
        this.deliveryPending = true;
        this.saveState();
    }

    getDeliveryDay() {
        if (!this.scene.story || !this.scene.story.storyState) return null;
        return this.scene.story.storyState.radioDeliveryDay;
    }

    setDeliveryDay(day) {
        if (!this.scene.story || !this.scene.story.storyState) return;
        this.scene.story.storyState.radioDeliveryDay = day;
    }

    update() {
        if (this.canPlace && this.ghostSprite) {
            const pointer = this.scene.input.activePointer;
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main);
            this.ghostSprite.x = worldPoint.x;
            this.ghostSprite.y = worldPoint.y;
        }

        if (this.deliveryPending && !this.packageSprite) {
            this.spawnPackage();
        }
    }

    spawnPackage() {
        const entryX = 150;
        const entryY = 500;

        if (this.scene.textures.exists('pacco')) {
            this.packageSprite = this.scene.add.image(entryX, entryY, 'pacco').setDepth(20).setDisplaySize(80, 80);
        } else {
            this.packageSprite = this.scene.add.text(entryX, entryY, '📦', {fontSize: '64px'}).setOrigin(0.5).setDepth(20);
        }

        this.packageInteractZone = this.scene.add.zone(entryX, entryY, 90, 90).setDepth(19).setInteractive({ useHandCursor: true });
        this.packageInteractZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(this.scene.waitress.x, this.scene.waitress.y, entryX, entryY);
            if (dist <= 120) {
                this.pickUpPackage();
            } else {
                this.scene.showFloatingText(entryX, entryY - 50, 'Avvicinati al pacco!', '#ffd700');
            }
        });

        this.packageGlow = this.scene.add.graphics().setDepth(18).fillStyle(0x3498db, 0.25).fillCircle(entryX, entryY, 60);
        this.scene.tweens.add({ targets: this.packageGlow, alpha: 0.05, duration: 800, yoyo: true, repeat: -1 });

        this.packageSprite.setScale(0.3);
        this.packageSprite.y = 580;
        this.scene.tweens.add({ targets: this.packageSprite, y: entryY, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back.easeOut' });
    }

    pickUpPackage() {
        if (this.packageSprite) {
            this.scene.tweens.add({ targets: this.packageSprite, scaleX: 0, scaleY: 0, alpha: 0, duration: 300, ease: 'Back.easeIn', onComplete: () => {
                this.packageSprite.destroy();
                this.packageSprite = null;
            }});
        }
        if (this.packageInteractZone) {
            this.packageInteractZone.destroy();
            this.packageInteractZone = null;
        }
        if (this.packageGlow) {
            this.packageGlow.destroy();
            this.packageGlow = null;
        }
        this.deliveryPending = false;
        this.completeDelivery();
        this.saveState();
    }

    setupAudioEvents() {
        this.scene.events.on('shutdown', () => {
            if (this.isPlaying) this.stopMusic();
            if (this.fileInput && this.fileInput.parentNode) this.fileInput.parentNode.removeChild(this.fileInput);
        });
    }

    destroy() {
        if (this.radioBtn) this.radioBtn.destroy();
        if (this.statusText) this.statusText.destroy();
        if (this.radioSprite) this.radioSprite.destroy();
        if (this.ghostSprite) this.ghostSprite.destroy();
    }
}

window.RadioSystem = RadioSystem;