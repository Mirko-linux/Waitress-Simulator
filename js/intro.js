class IntroScene extends Phaser.Scene {
    constructor() {
        super('Intro');
    }

    preload() {
        if (!this.textures.exists('floor_sala')) {
            this.load.image('floor_sala', 'assets/ambiente/1.png');
        }
        if (!this.textures.exists('floor_cucina')) {
            this.load.image('floor_cucina', 'assets/ambiente/2.png');
        }
        if (!this.textures.exists('wall')) {
            this.load.image('wall', 'assets/ambiente/3.png');
        }

        if (!this.textures.exists('cameriera_avanti')) {
            this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
        }

        if (!this.textures.exists('calogero_avanti')) {
            this.load.image('calogero_avanti', 'assets/NPC/Calogero/Calogero_Avanti.png');
        }

        if (!this.textures.exists('uomo_affari_avanti')) {
            this.load.image('uomo_affari_avanti', "assets/NPC/Uomo d'Affari/Uomod'Affari_Avanti.png");
        }
        if (!this.textures.exists('uomo_affari_destra')) {
            this.load.image('uomo_affari_destra', "assets/NPC/Uomo d'Affari/Uomod'Affari_Destra.png");
        }

        if (!this.textures.exists('uomo_affari_2_avanti')) {
            this.load.image('uomo_affari_2_avanti', "assets/NPC/Secondo Uomo d'Affari/SecondoUomo_Avanti.png");
        }
        if (!this.textures.exists('uomo_affari_2_sinistra')) {
            this.load.image('uomo_affari_2_sinistra', "assets/NPC/Secondo Uomo d'Affari/SecondoUomo_Sinistra.png");
        }
        if (!this.textures.exists('uomo_affari_2_destra')) {
            this.load.image('uomo_affari_2_destra', "assets/NPC/Secondo Uomo d'Affari/SecondoUomo_Destra.png");
        }

        this.load.image('bubble_dialog', 'assets/UI/bubble_dialog.png');
    }

    create() {
        const W = 800, H = 600;

        this.isCutscene = true;
        this.cameras.main.setBackgroundColor('#342016');
        this.input.keyboard.enabled = true;

        if (this.textures.exists('floor_sala')) {
            for (let x = 0; x < W; x += 32) {
                for (let y = 0; y < H; y += 32) {
                    this.add.image(x + 16, y + 16, 'floor_sala')
                        .setDisplaySize(32, 32).setTint(0xb09a79).setDepth(0);
                }
            }
        }

        const morningLight = this.add.rectangle(400, 300, W, H, 0xe5a65a, 0.12).setDepth(1);
        const window = this.add.rectangle(400, 115, 260, 115, 0x9bc9d1).setStrokeStyle(8, 0x573a29).setDepth(2);
        this.add.rectangle(400, 115, 7, 108, 0x573a29).setDepth(3);
        this.add.rectangle(400, 115, 250, 7, 0x573a29).setDepth(3);
        this.add.rectangle(400, 425, 470, 62, 0x633a23).setStrokeStyle(4, 0x321c13).setDepth(8);
        this.add.rectangle(400, 390, 470, 12, 0x9a6037).setDepth(9);
        this.door = this.add.rectangle(748, 330, 94, 260, 0x56331f).setStrokeStyle(7, 0x2b1a12).setDepth(5);
        this.add.rectangle(717, 330, 7, 260, 0x2b1a12).setDepth(6);
        this.add.circle(713, 350, 5, 0xe5ba5f).setDepth(7);
        this.add.text(400, 38, 'PALERMO  ·  ORE 7:15', {
            fontSize: '16px', color: '#fff1cf', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(20);

        this.waitress = this.add.image(35, 360, 'cameriera_avanti')
            .setDisplaySize(66, 104).setDepth(10);

        if (this.textures.exists('calogero_avanti')) {
            this.owner = this.add.image(535, 352, 'calogero_avanti')
                .setDisplaySize(78, 112).setDepth(10);
        } else {
            this.owner = this.add.text(535, 352, '👴', { fontSize: '76px' })
                .setOrigin(0.5).setDepth(10);
        }

        this.businessman = this.add.image(730, 350, 'uomo_affari_avanti')
            .setDisplaySize(78, 112).setDepth(11).setVisible(false);

        let secondManTex = 'uomo_affari_2_sinistra';
        if (!this.textures.exists(secondManTex)) {
            if (this.textures.exists('uomo_affari_2_avanti')) secondManTex = 'uomo_affari_2_avanti';
            else if (this.textures.exists('uomo_affari_2_destra')) secondManTex = 'uomo_affari_2_destra';
            else secondManTex = 'uomo_affari_avanti';
        }

        this.businessman2 = this.add.image(755, 350, secondManTex)
            .setDisplaySize(78, 112).setDepth(10).setVisible(false);

        this.key = this.add.text(535, 345, '🔑', { fontSize: '24px' })
            .setOrigin(0.5).setDepth(12).setVisible(false);

        this.cameras.main.setZoom(1.04);
        this.cameras.main.fadeIn(900, 0, 0, 0);

        this.dialogBox = this.add.container(400, 500);
        this.dialogBox.setDepth(100).setAlpha(0);

        if (this.textures.exists('bubble_dialog')) {
            this.bubbleImg = this.add.image(0, 0, 'bubble_dialog')
                .setDisplaySize(700, 220);
            this.dialogBox.add(this.bubbleImg);
        } else {
            this.bubbleImg = this.add.rectangle(0, 0, 700, 220, 0xfef9e7)
                .setStrokeStyle(3, 0x000000);
            this.dialogBox.add(this.bubbleImg);
        }

        this.nameText = this.add.text(-320, -80, '', {
            fontSize: '20px',
            color: '#d27d2d',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5);
        this.dialogBox.add(this.nameText);

        this.dialogText = this.add.text(0, -10, '', {
            fontSize: '18px',
            color: '#2c1a11',
            fontFamily: 'Fredoka',
            align: 'center',
            wordWrap: { width: 620 },
            lineSpacing: 6
        }).setOrigin(0.5);
        this.dialogBox.add(this.dialogText);

        this.arrow = this.add.text(300, 70, '▼', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        this.dialogBox.add(this.arrow);

        this.skipText = this.add.text(770, 22, 'SALTA  Esc', {
            fontSize: '13px', color: '#fff1cf', fontFamily: 'Fredoka'
        }).setOrigin(1, 0).setDepth(101).setInteractive({ useHandCursor: true });
        this.skipText.on('pointerdown', () => this.endCutscene());

        this.tweens.add({
            targets: this.arrow,
            y: 80,
            alpha: 0.4,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.script = [
            { who: 'narrator', name: '', text: 'Palermo, una mattina presto. La cameriera raggiunge il ristorante per iniziare il turno.', hide: true, action: 'arrive' },
            { who: 'waitress', name: 'Cameriera', text: 'Buongiorno, signor Calogero. Sono arrivata!' },
            { who: 'owner', name: 'Signor Calogero', text: 'Buongiorno, ragazza. Temo che oggi non sarà una mattina come le altre.' },
            { who: 'waitress', name: 'Cameriera', text: 'Che cosa è successo? La vedo preoccupato.' },
            { who: 'owner', name: 'Signor Calogero', text: 'Non riesco a pagare il debito. Mi hanno dato tempo fino a stamattina.' },
            { who: 'narrator', name: '', text: 'La porta si spalanca. Due uomini d\'affari entrano nel locale.', hide: true, action: 'enter' },
            { who: 'businessman', name: 'Uomo d\'affari', text: 'Il tempo è scaduto, Calogero. Da oggi il ristorante appartiene a noi!' },
            { who: 'owner', name: 'Signor Calogero', text: 'Vi prego... questo locale è la mia vita. Non potete portarmelo via.' },
            { who: 'businessman2', name: 'Secondo uomo', text: 'Firmi e ci consegni le chiavi. Non ci faccia perdere altro tempo.' },
            { who: 'owner', name: 'Signor Calogero', text: 'Non ho scelta. Ecco le chiavi... prendetevi cura del ristorante.', action: 'handover' },
            { who: 'waitress', name: 'Cameriera', text: 'E io? Ho appena iniziato a lavorare qui!' },
            { who: 'businessman', name: 'Uomo d\'affari', text: 'Tu resterai. Il locale deve continuare a lavorare. E anche tu.' },
            { who: 'narrator', name: '', text: 'Calogero ha perso il ristorante. Ora dovrai lavorare e mettere da parte 15.000€ per riprenderlo.', hide: true, action: 'closing' }
        ];

        this.currentLine = 0;
        this.isTyping = false;
        this.canAdvance = false;
        this.businessmenEntered = false;

        this.input.on('pointerdown', () => this.advance());
        this.input.keyboard.on('keydown-SPACE', event => { event.stopPropagation(); this.advance(); });
        this.input.keyboard.on('keydown-ENTER', event => { event.stopPropagation(); this.advance(); });
        this.input.keyboard.on('keydown-ESC', event => { event.stopPropagation(); this.endCutscene(); });

        this.time.delayedCall(1200, () => {
            this.dialogBox.setAlpha(1);
            this.advance();
        });
    }

    advance() {
        if (this.isTyping) {
            this.dialogText.setText(this.fullText);
            this.isTyping = false;
            this.canAdvance = true;
            this.arrow.setVisible(true);
            return;
        }

        if (!this.canAdvance && this.currentLine > 0) return;

        if (this.currentLine >= this.script.length) {
            this.endCutscene();
            return;
        }

        const line = this.script[this.currentLine];
        this.currentLine++;

        this.nameText.setText(line.name || '');

        if (line.hide) {
            this.nameText.setVisible(false);
            this.bubbleImg.setVisible(false);
        } else {
            this.nameText.setVisible(true);
            this.bubbleImg.setVisible(true);
        }

        this.highlightSpeaker(line.who);
        this.playSceneAction(line.action);

        this.fullText = line.text;
        this.dialogText.setText('');
        this.isTyping = true;
        this.canAdvance = false;
        this.arrow.setVisible(false);

        let charIndex = 0;
        const typingSpeed = 30;

        this.typingTimer = this.time.addEvent({
            delay: typingSpeed,
            callback: () => {
                charIndex++;
                this.dialogText.setText(this.fullText.substring(0, charIndex));

                if (charIndex >= this.fullText.length) {
                    this.typingTimer.remove();
                    this.isTyping = false;
                    this.canAdvance = true;
                    this.arrow.setVisible(true);
                }
            },
            loop: true
        });
    }

    playSceneAction(action) {
        if (action === 'arrive') {
            this.tweens.add({ targets: this.waitress, x: 245, duration: 1500, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: this.cameras.main, zoom: 1.08, duration: 1400, ease: 'Sine.easeInOut' });
        } else if (action === 'enter') {
            if (typeof window.triggerSfx === 'function') window.triggerSfx('alert');
            this.businessmenEntered = true;
            this.businessman.setVisible(true).setAlpha(0);
            this.businessman2.setVisible(true).setAlpha(0);
            this.door.setFillStyle(0x3a2015);
            this.tweens.add({ targets: this.businessman, x: 610, alpha: 1, duration: 900, ease: 'Cubic.easeOut' });
            this.tweens.add({ targets: this.businessman2, x: 690, alpha: 1, duration: 1100, delay: 180, ease: 'Cubic.easeOut' });
            this.tweens.add({ targets: this.cameras.main, zoom: 1.12, duration: 700, yoyo: true, ease: 'Sine.easeInOut' });
        } else if (action === 'handover') {
            this.key.setVisible(true);
            this.tweens.add({
                targets: this.key,
                x: this.businessman.x - 22,
                y: this.businessman.y - 12,
                duration: 900,
                ease: 'Cubic.easeInOut'
            });
            this.tweens.add({ targets: this.owner, x: 515, duration: 500, yoyo: true, ease: 'Sine.easeInOut' });
        } else if (action === 'closing') {
            this.tweens.add({ targets: this.cameras.main, zoom: 1, duration: 900, ease: 'Sine.easeInOut' });
        }
    }

    highlightSpeaker(who) {
        if (this.waitress) this.waitress.setAlpha(0.5);
        if (this.owner) this.owner.setAlpha(0.5);
        if (this.businessman && this.businessmenEntered) this.businessman.setAlpha(who === 'businessman' ? 1 : 0.72);
        if (this.businessman2 && this.businessmenEntered) this.businessman2.setAlpha(who === 'businessman2' ? 1 : 0.62);

        if (who === 'waitress') this.waitress.setAlpha(1);
        if (who === 'owner') this.owner.setAlpha(1);
    }

    endCutscene() {
        if (this._endingCutscene) return;
        this._endingCutscene = true;
        this.input.enabled = false;

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start('Game');
        });
    }
}

window.IntroScene = IntroScene;