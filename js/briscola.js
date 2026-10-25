(function() {
    const BRISCOLA_CONFIG = {
        missionDay: 11,
        npcName: 'Nipote di Rosa',
        npcTextures: {
            up: 'Nipote_Rosa_Dietro',
            down: 'Nipote_Rosa_Avanti',
            left: 'Nipote_Rosa_Sinistra',
            right: 'Nipote_Rosa_Destra'
        },
        rewardMoney: 200,
        rewardRelationship: 40,
        abandonTimeoutMs: 5000,
        suits: ['bastoni', 'coppe', 'denari', 'spade'],
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        suitNames: {
            'bastoni': 'Bastoni',
            'coppe': 'Coppe',
            'denari': 'Denari',
            'spade': 'Spade'
        }
    };

    const CARD_POINTS = {
        '1': 11, '3': 10, '10': 4, '9': 3, '8': 2,
        '7': 0, '6': 0, '5': 0, '4': 0, '2': 0
    };

    const CARD_STRENGTH = {
        '1': 10, '3': 9, '10': 8, '9': 7, '8': 6,
        '7': 5, '6': 4, '5': 3, '4': 2, '2': 1
    };

    const VALUE_LABEL = {
        '1': 'A', '2': '2', '3': '3', '4': '4', '5': '5',
        '6': '6', '7': '7', '8': 'F', '9': 'C', '10': 'R'
    };

    const SUIT_SYMBOL = {
        'bastoni': '♣',
        'coppe': '♥',
        'denari': '♦',
        'spade': '♠'
    };

    const SUIT_COLOR = {
        'bastoni': 0x2E7D32,
        'coppe': 0xC62828,
        'denari': 0xF9A825,
        'spade': 0x1565C0
    };

    const CARD_W = 80;
    const CARD_H = 120;

    const NIPOTE_DIALOG_LINES = [
        { speaker: 'Nipote di Rosa', emoji: '👦', text: "Ascolti, signorina. Non ho tempo per le belle maniere." },
        { speaker: 'Nipote di Rosa', emoji: '👦', text: "Mia nonna si è giocata la pensione a briscola contro un vecchio lupo di carte." },
        { speaker: 'Nipote di Rosa', emoji: '😟', text: "Stasera tornano qui, al ristorante. E se lei non li batte, quei soldi non li rivediamo più." },
        { speaker: 'Nipote di Rosa', emoji: '🃏', text: "Io non ci so giocare. Lei invece ha la faccia giusta. Si sieda al tavolo e vinca." },
        { speaker: 'Nipote di Rosa', emoji: '🙏', text: "Salvi la pensione di mia nonna. E le dico una cosa: se ci riesce, se ne ricorderanno tutti." }
    ];

    const FINAL_CUTSCENE_SCRIPT = [
        { who: 'narrator', text: "L'anziano si alza dal tavolo, sorridendo. Ha perso, ma con onore." },
        { who: 'anziano', name: 'Anziano', text: "Complimenti, signorina. Non vedevo una briscola giocata così da anni." },
        { who: 'anziano', name: 'Anziano', text: "Ha vinto lei, ha vinto la partita. Ecco a te, Rosa: i tuoi 200€, fino all'ultimo centesimo.", action: 'give_money' },
        { who: 'rosa', name: 'Rosa', text: "Oh, Signore... grazie al cielo! Grazie, cara, grazie davvero!" },
        { who: 'narrator', text: "Improvvisamente, la porta del ristorante si spalanca. L'Uomo d'Affari entra furioso.", action: 'enter_boss' },
        { who: 'boss', name: "Uomo d'Affari", text: "COSA sta succedendo qui?! Lei è in servizio! Chi le ha dato il permesso di sedersi ai tavoli?!" },
        { who: 'boss', name: "Uomo d'Affari", text: "Questa è una vergogna. La licenzio. Immediatamente. Fuori dal mio ristorante!" },
        { who: 'rosa', name: 'Rosa', text: "Un momento! Lei non deve licenziare nessuno. Questa ragazza mi ha salvato la pensione.", action: 'rosa_intervenes' },
        { who: 'rosa', name: 'Rosa', text: "Ha affrontato quel vecchio imbroglione e ha vinto. Per me. Per una cliente. È questo che vuole da una cameriera?" },
        { who: 'boss', name: "Uomo d'Affari", text: "...Tsk. Per questa volta te la sei cavata. Ma che non si ripeta: qui si lavora, non si gioca.", action: 'boss_leaves' },
        { who: 'anziano', name: 'Anziano', text: "Buona serata a tutti. E complimenti ancora, signorina.", action: 'anziano_leaves' },
        { who: 'rosa', name: 'Rosa', text: "Che Dio ti benedica, cara. Te lo meriti tutto.", action: 'rosa_leaves' },
        { who: 'narrator', text: "La giornata si conclude. Il ristorante torna in silenzio.", action: 'end_scene' }
    ];




    class BriscolaDialogScene extends Phaser.Scene {
        constructor() {
            super('BriscolaDialog');
            this.currentLine = 0;
            this.dialogContainer = null;
            this.isClosing = false;
            this._typeTimer = null;
            this.lines = [];
            this.onComplete = null;
            this.defaultSpeakerName = 'Nipote di Rosa';
            this.defaultSpeakerEmoji = '👦';
        }

        init(data) {
            this.lines = data.lines || NIPOTE_DIALOG_LINES;
            this.onComplete = data.onComplete || null;
            this.defaultSpeakerName = data.speakerName || 'Nipote di Rosa';
            this.defaultSpeakerEmoji = data.speakerEmoji || '👦';
            this.currentLine = 0;
            this.isClosing = false;
            this._typeTimer = null;
        }

        create() {
            this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6).setDepth(1);
            this.dialogContainer = this.add.container(400, 480).setDepth(100);

            const dialogBg = this.add.rectangle(0, 0, 720, 180, 0x110906, 0.98)
                .setStrokeStyle(3, 0xffd700);

            this.speakerText = this.add.text(-340, -70, this.defaultSpeakerName, {
                fontSize: '16px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5);

            this.emojiText = this.add.text(320, -70, this.defaultSpeakerEmoji, {
                fontSize: '28px'
            }).setOrigin(1, 0.5);

            this.dialogText = this.add.text(-340, 0, '', {
                fontSize: '15px', color: '#ffffff', fontFamily: 'Fredoka',
                wordWrap: { width: 660 }, lineSpacing: 6
            }).setOrigin(0, 0.5);

            const hintText = this.add.text(340, 70, '▶ CLICCA PER CONTINUARE', {
                fontSize: '11px', color: '#ffd700', fontStyle: 'italic', fontFamily: 'Fredoka'
            }).setOrigin(1, 0.5);

            this.tweens.add({
                targets: hintText, alpha: 0.3, duration: 800, yoyo: true, repeat: -1
            });

            this.dialogContainer.add([dialogBg, this.speakerText, this.emojiText, this.dialogText, hintText]);
            this.dialogContainer.setScale(0.9).setAlpha(0);

            this.tweens.add({
                targets: this.dialogContainer,
                scaleX: 1, scaleY: 1, alpha: 1,
                duration: 400, ease: 'Back.easeOut'
            });

            this.input.on('pointerdown', () => { if (!this.isClosing) this.nextLine(); });
            this.input.keyboard.on('keydown-SPACE', () => { if (!this.isClosing) this.nextLine(); });
            this.input.keyboard.on('keydown-ENTER', () => { if (!this.isClosing) this.nextLine(); });

            this.showLine(0);
        }

        showLine(index) {
            if (index >= this.lines.length) {
                this.closeDialog();
                return;
            }

            const line = this.lines[index];

            if (this.speakerText) this.speakerText.setText(line.speaker || this.defaultSpeakerName);
            if (this.emojiText) this.emojiText.setText(line.emoji || this.defaultSpeakerEmoji);

            this.dialogText.setText('');
            let charIndex = 0;

            if (this._typeTimer) {
                this._typeTimer.remove();
                this._typeTimer = null;
            }

            const timer = this.time.addEvent({
                delay: 20,
                callback: () => {
                    if (this.isClosing) {
                        if (timer && timer.remove) timer.remove();
                        if (this._typeTimer === timer) this._typeTimer = null;
                        return;
                    }
                    charIndex++;
                    this.dialogText.setText(line.text.substring(0, charIndex));
                    if (charIndex >= line.text.length) {
                        if (timer && timer.remove) timer.remove();
                        if (this._typeTimer === timer) this._typeTimer = null;
                    }
                },
                loop: true
            });

            this._typeTimer = timer;
        }

        nextLine() {
            if (this.isClosing) return;

            if (this._typeTimer) {
                const timer = this._typeTimer;
                this._typeTimer = null;
                if (timer.remove) timer.remove();

                const line = this.lines[this.currentLine];
                if (line) this.dialogText.setText(line.text);

                this.currentLine++;
                if (this.currentLine >= this.lines.length) {
                    this.closeDialog();
                } else {
                    this.showLine(this.currentLine);
                }
                return;
            }

            this.currentLine++;
            if (this.currentLine >= this.lines.length) {
                this.closeDialog();
            } else {
                this.showLine(this.currentLine);
            }
        }

        closeDialog() {
            if (this.isClosing) return;
            this.isClosing = true;

            if (this._typeTimer) {
                this._typeTimer.remove();
                this._typeTimer = null;
            }

            this.tweens.add({
                targets: this.dialogContainer,
                alpha: 0, scaleX: 0.9, scaleY: 0.9,
                duration: 400, ease: 'Back.easeIn',
                onComplete: () => {
                    if (typeof this.onComplete === 'function') this.onComplete();
                    this.scene.stop();
                }
            });
        }
    }




    class BriscolaFinalCutsceneScene extends Phaser.Scene {
        constructor() {
            super('BriscolaFinalCutscene');
            this.currentLine = 0;
            this.isTyping = false;
            this.canAdvance = false;
            this.fullText = '';
            this.onComplete = null;
        }

        init(data) {
            this.onComplete = data.onComplete || null;
            this.currentLine = 0;
            this.isTyping = false;
            this.canAdvance = false;
        }

        preload() {
            if (!this.textures.exists('floor_sala')) this.load.image('floor_sala', 'assets/ambiente/1.png');
            if (!this.textures.exists('bubble_dialog')) this.load.image('bubble_dialog', 'assets/UI/bubbles/bubble_dialog.png');
            if (!this.textures.exists('cameriera_avanti')) this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
            if (!this.textures.exists('Anziano_Carte')) this.load.image('Anziano_Carte', 'assets/NPC/Anziano_Carte/Anziano_Carte_Avanti.png');
            if (!this.textures.exists('Rosa_Avanti')) this.load.image('Rosa_Avanti', 'assets/NPC/Rosa/Rosa_Avanti.png');
            if (!this.textures.exists('Uomo_Affari_Avanti')) this.load.image('Uomo_Affari_Avanti', 'assets/NPC/Uomo d\'Affari/Uomod\'Affari_Avanti.png');
        }

        create() {
            const W = 800, H = 600;
            this.cameras.main.setBackgroundColor('#342016');
            this.input.keyboard.enabled = true;

            if (this.textures.exists('floor_sala')) {
                for (let x = 0; x < W; x += 32) {
                    for (let y = 0; y < H; y += 32) {
                        this.add.image(x + 16, y + 16, 'floor_sala').setDisplaySize(32, 32).setTint(0xb09a79).setDepth(0);
                    }
                }
            } else {
                this.add.rectangle(400, 300, W, H, 0x2c1a11).setDepth(0);
            }

            const yPos = 360;
            
            this.waitress = this.add.image(280, yPos + 20, 'cameriera_avanti').setDisplaySize(66, 104).setDepth(10);
            if (!this.textures.exists('cameriera_avanti')) {
                this.waitress.setVisible(false);
                this.waitress = this.add.text(280, yPos + 20, '👩‍🍳', { fontSize: '50px' }).setOrigin(0.5).setDepth(10);
            }

            this.anziano = this.add.image(400, yPos - 10, 'Anziano_Carte').setDisplaySize(78, 112).setDepth(10);
            if (!this.textures.exists('Anziano_Carte')) {
                this.anziano.setVisible(false);
                this.anziano = this.add.text(400, yPos - 10, '🧓', { fontSize: '60px' }).setOrigin(0.5).setDepth(10);
            }

            this.rosa = this.add.image(480, yPos + 20, 'Rosa_Avanti').setDisplaySize(66, 104).setDepth(10);
            if (!this.textures.exists('Rosa_Avanti')) {
                this.rosa.setVisible(false);
                this.rosa = this.add.text(480, yPos + 20, '👵', { fontSize: '55px' }).setOrigin(0.5).setDepth(10);
            }

            this.boss = this.add.image(730, yPos, 'Uomo_Affari_Avanti').setDisplaySize(78, 112).setDepth(11).setVisible(false);
            if (!this.textures.exists('Uomo_Affari_Avanti')) {
                this.boss.setVisible(false);
                this.boss = this.add.text(730, yPos, '🕴️', { fontSize: '60px' }).setOrigin(0.5).setDepth(11).setVisible(false);
            }

            this.door = this.add.rectangle(748, 330, 94, 260, 0x56331f).setStrokeStyle(7, 0x2b1a12).setDepth(5);

            this.dialogBox = this.add.container(400, 500).setDepth(100).setAlpha(0);

            if (this.textures.exists('bubble_dialog')) {
                this.bubbleImg = this.add.image(0, 0, 'bubble_dialog').setDisplaySize(700, 220);
                this.dialogBox.add(this.bubbleImg);
            } else {
                this.bubbleImg = this.add.rectangle(0, 0, 700, 220, 0xfef9e7).setStrokeStyle(3, 0x000000);
                this.dialogBox.add(this.bubbleImg);
            }

            this.nameText = this.add.text(-320, -80, '', {
                fontSize: '20px', color: '#d27d2d', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5);
            this.dialogBox.add(this.nameText);

            this.dialogText = this.add.text(0, -10, '', {
                fontSize: '18px', color: '#2c1a11', fontFamily: 'Fredoka', align: 'center',
                wordWrap: { width: 620 }, lineSpacing: 6
            }).setOrigin(0.5);
            this.dialogBox.add(this.dialogText);

            this.arrow = this.add.text(300, 70, '▼', {
                fontSize: '24px', color: '#000000'
            }).setOrigin(0.5);
            this.dialogBox.add(this.arrow);

            this.tweens.add({
                targets: this.arrow, y: 80, alpha: 0.4, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });

            this.input.on('pointerdown', () => this.advance());
            this.input.keyboard.on('keydown-SPACE', (e) => { e.stopPropagation(); this.advance(); });
            this.input.keyboard.on('keydown-ENTER', (e) => { e.stopPropagation(); this.advance(); });

            this.time.delayedCall(500, () => {
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

            if (this.currentLine >= FINAL_CUTSCENE_SCRIPT.length) {
                this.endCutscene();
                return;
            }

            const line = FINAL_CUTSCENE_SCRIPT[this.currentLine];
            this.currentLine++;

            this.nameText.setText(line.name || '');

            if (line.who === 'narrator') {
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
            this.typingTimer = this.time.addEvent({
                delay: 30,
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
            if (action === 'give_money') {
                if (typeof window.triggerSfx === 'function') window.triggerSfx('coin');
                this.tweens.add({
                    targets: this.anziano, x: this.anziano.x - 20, duration: 500, yoyo: true, ease: 'Sine.easeInOut'
                });
                const money = this.add.text(this.anziano.x, this.anziano.y - 40, '💶', { fontSize: '32px' }).setOrigin(0.5).setDepth(20);
                this.tweens.add({
                    targets: money, x: this.rosa.x, y: this.rosa.y - 40, alpha: 0, duration: 1000,
                    onComplete: () => money.destroy()
                });
            } else if (action === 'enter_boss') {
                if (typeof window.triggerSfx === 'function') window.triggerSfx('alert');
                this.door.setFillStyle(0x3a2015);
                this.boss.setVisible(true).setAlpha(0);
                this.tweens.add({ targets: this.boss, x: 600, alpha: 1, duration: 800, ease: 'Cubic.easeOut' });
                this.tweens.add({ targets: this.cameras.main, zoom: 1.08, duration: 500, yoyo: true, ease: 'Sine.easeInOut' });
            } else if (action === 'rosa_intervenes') {
                this.tweens.add({
                    targets: this.rosa, x: this.rosa.x - 40, duration: 300, ease: 'Cubic.easeOut'
                });
                this.tweens.add({ targets: this.cameras.main, zoom: 1.05, duration: 400, yoyo: true });
            } else if (action === 'boss_leaves') {
                this.tweens.add({ targets: this.boss, x: 800, alpha: 0, duration: 800, ease: 'Cubic.easeIn' });
            } else if (action === 'anziano_leaves') {
                this.tweens.add({ targets: this.anziano, x: 0, alpha: 0, duration: 800, ease: 'Cubic.easeIn' });
            } else if (action === 'rosa_leaves') {
                this.tweens.add({ targets: this.rosa, x: 0, alpha: 0, duration: 800, ease: 'Cubic.easeIn' });
            } else if (action === 'end_scene') {
                this.cameras.main.fadeOut(800, 0, 0, 0);
            }
        }

        highlightSpeaker(who) {
            if (this.waitress && this.waitress.setAlpha) this.waitress.setAlpha(0.5);
            if (this.anziano && this.anziano.setAlpha) this.anziano.setAlpha(0.5);
            if (this.rosa && this.rosa.setAlpha) this.rosa.setAlpha(0.5);
            if (this.boss && this.boss.active && this.boss.setAlpha) this.boss.setAlpha(0.5);

            if (who === 'waitress' && this.waitress && this.waitress.setAlpha) this.waitress.setAlpha(1);
            if (who === 'anziano' && this.anziano && this.anziano.setAlpha) this.anziano.setAlpha(1);
            if (who === 'rosa' && this.rosa && this.rosa.setAlpha) this.rosa.setAlpha(1);
            if (who === 'boss' && this.boss && this.boss.active && this.boss.setAlpha) this.boss.setAlpha(1);
        }

        endCutscene() {
            if (this._endingCutscene) return;
            this._endingCutscene = true;
            this.input.enabled = false;

            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                if (typeof this.onComplete === 'function') this.onComplete();
                this.scene.stop();
            });
        }
    }




    class BriscolaWagerScene extends Phaser.Scene {
        constructor() {
            super('BriscolaWager');
        }

        init(data) {
            this.bankroll = Math.max(0, Math.floor(data.bankroll || 0));
            this.onComplete = data.onComplete || null;
            this.difficulty = 'media';
            this.stake = Math.min(100, this.bankroll);
            this.isEditingStake = false;
            this.stakeInputBuffer = '';
            this.finished = false;
        }

        create() {
            this.add.rectangle(400, 300, 800, 600, 0x000000, 0.82).setDepth(1);
            this.add.rectangle(400, 300, 620, 510, 0x1a100b, 0.99)
                .setStrokeStyle(3, 0xffd700).setDepth(2);
            this.add.text(400, 72, 'BRISCOLA CON L’ANZIANO', {
                fontSize: '27px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(3);
            this.add.text(400, 111, 'Scegli la difficoltà e la puntata', {
                fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(3);

            this.createDifficultyButton(210, 'facile', 'FACILE', 'Puntata massima: 200€');
            this.createDifficultyButton(400, 'media', 'MEDIA', 'Puntata massima: 500€');
            this.createDifficultyButton(590, 'difficile', 'DIFFICILE', 'Senza limite di puntata');

            this.add.text(400, 260, 'PUNTATA (€)', {
                fontSize: '17px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(3);

            this.stakeField = this.add.rectangle(400, 310, 210, 58, 0x2a1a11)
                .setStrokeStyle(2, 0xd27d2d).setDepth(3)
                .setInteractive({ useHandCursor: true });
            this.stakeText = this.add.text(400, 310, '', {
                fontSize: '25px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(4);
            this.stakeField.on('pointerdown', () => {
                this.isEditingStake = true;
                this.stakeInputBuffer = '';
                this.updateStakeDisplay();
            });

            this.createActionButton(280, 310, '−10', () => this.adjustStake(-10));
            this.createActionButton(520, 310, '+10', () => this.adjustStake(10));
            this.createActionButton(280, 368, '−100', () => this.adjustStake(-100));
            this.createActionButton(520, 368, '+100', () => this.adjustStake(100));
            this.createActionButton(400, 368, 'MASSIMA', () => {
                this.stake = this.getStakeLimit();
                this.isEditingStake = false;
                this.updateStakeDisplay();
            }, 130);

            this.bankrollText = this.add.text(400, 415, '', {
                fontSize: '13px', color: '#e0d5c1', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(3);
            this.add.text(400, 444, 'Clicca l’importo e digita una cifra, oppure usa i pulsanti.', {
                fontSize: '11px', color: '#b9aa9a', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(3);

            this.createActionButton(290, 500, 'INDIETRO', () => this.finish(null), 150);
            this.startButton = this.createActionButton(510, 500, 'GIOCA', () => {
                const limit = this.getStakeLimit();
                if (this.stake < 1 || this.stake > limit) return;
                this.finish({ difficulty: this.difficulty, stake: this.stake });
            }, 150);

            this.input.keyboard.on('keydown', event => this.handleStakeInput(event));
            this.updateDifficultyButtons();
            this.updateStakeDisplay();
        }

        createDifficultyButton(x, difficulty, label, description) {
            const button = this.add.rectangle(x, 190, 170, 94, 0x332015)
                .setStrokeStyle(2, 0x8d6b48).setDepth(3)
                .setInteractive({ useHandCursor: true });
            this.add.text(x, 173, label, {
                fontSize: '16px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(4);
            this.add.text(x, 201, description, {
                fontSize: '10px', color: '#e0d5c1', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(4);
            button.on('pointerdown', () => {
                this.difficulty = difficulty;
                this.isEditingStake = false;
                this.stakeInputBuffer = '';
                this.updateDifficultyButtons();
                this.updateStakeDisplay();
            });
            this.difficultyButtons = this.difficultyButtons || {};
            this.difficultyButtons[difficulty] = button;
        }

        createActionButton(x, y, label, callback, width = 70) {
            const button = this.add.rectangle(x, y, width, 42, 0x8b451f)
                .setStrokeStyle(2, 0xd27d2d).setDepth(3)
                .setInteractive({ useHandCursor: true });
            const text = this.add.text(x, y, label, {
                fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(4);
            button.on('pointerover', () => button.setFillStyle(0xa85d2a));
            button.on('pointerout', () => button.setFillStyle(0x8b451f));
            button.on('pointerdown', callback);
            return { button, text };
        }

        getStakeLimit() {
            const limits = { facile: 200, media: 500, difficile: Infinity };
            return Math.min(this.bankroll, limits[this.difficulty]);
        }

        adjustStake(amount) {
            this.stake = Math.min(this.getStakeLimit(), Math.max(0, this.stake + amount));
            this.isEditingStake = false;
            this.updateStakeDisplay();
        }

        handleStakeInput(event) {
            if (!this.isEditingStake) return;
            if (/^\d$/.test(event.key)) {
                this.stakeInputBuffer += event.key;
                const next = Number(this.stakeInputBuffer);
                this.stake = Math.min(this.getStakeLimit(), next);
                this.updateStakeDisplay();
            } else if (event.key === 'Backspace') {
                this.stakeInputBuffer = this.stakeInputBuffer.slice(0, -1);
                this.stake = this.stakeInputBuffer ? Number(this.stakeInputBuffer) : 0;
                this.updateStakeDisplay();
            } else if (event.key === 'Enter') {
                this.isEditingStake = false;
                this.stakeInputBuffer = '';
                this.updateStakeDisplay();
            }
        }

        updateDifficultyButtons() {
            Object.keys(this.difficultyButtons || {}).forEach(difficulty => {
                const color = difficulty === this.difficulty ? 0x62401f : 0x332015;
                const stroke = difficulty === this.difficulty ? 0xffd700 : 0x8d6b48;
                this.difficultyButtons[difficulty].setFillStyle(color).setStrokeStyle(2, stroke);
            });
        }

        updateStakeDisplay() {
            const limit = this.getStakeLimit();
            this.stake = Math.min(limit, Math.max(0, Math.floor(Number(this.stake) || 0)));
            this.stakeText.setText(`${this.isEditingStake ? '✎ ' : ''}${this.stake}€`);
            this.bankrollText.setText(
                this.bankroll > 0
                    ? `Disponibili: ${this.bankroll}€ · Puntata massima selezionabile: ${limit}€`
                    : 'Non hai ancora denaro disponibile per puntare.'
            );
            const canPlay = this.stake > 0 && this.stake <= limit;
            this.startButton.button.setAlpha(canPlay ? 1 : 0.45);
            this.startButton.button.input.enabled = canPlay;
        }

        finish(selection) {
            if (this.finished) return;
            this.finished = true;
            if (typeof this.onComplete === 'function') this.onComplete(selection);
            this.scene.stop();
        }
    }




    class BriscolaGameScene extends Phaser.Scene {
        constructor() {
            super('BriscolaGame');
            this.deck = [];
            this.playerHand = [];
            this.opponentHand = [];
            this.playerPlayed = null;
            this.opponentPlayed = null;
            this.briscolaCard = null;
            this.briscolaSuit = null;
            this.playerScore = 0;
            this.opponentScore = 0;
            this.roundActive = false;
            this.onComplete = null;
            this.messageText = null;
            this.playerScoreText = null;
            this.opponentScoreText = null;
            this.briscolaText = null;
            this.briscolaCardSprite = null;
            this.deckCountText = null;
            this.playerHandContainer = null;
            this.opponentHandContainer = null;
            this.playAreaContainer = null;
            this.spacing = 85;
            this.dealer = 'player';
            this.firstPlayer = 'player';
            this.lastTrickWinner = null;
            this.gameEnded = false;
            this.resolving = false;
        }

        init(data) {
            this.onComplete = data.onComplete || null;
            this.difficulty = data.difficulty || 'media';
            this.deck = [];
            this.playerHand = [];
            this.opponentHand = [];
            this.playerPlayed = null;
            this.opponentPlayed = null;
            this.briscolaCard = null;
            this.briscolaSuit = null;
            this.playerScore = 0;
            this.opponentScore = 0;
            this.roundActive = false;
            this.gameEnded = false;
            this.resolving = false;
            this.lastTrickWinner = null;
            this.dealer = Math.random() < 0.5 ? 'player' : 'opponent';
            this.firstPlayer = this.dealer === 'player' ? 'opponent' : 'player';
        }

        preload() {
            BRISCOLA_CONFIG.suits.forEach(suit => {
                BRISCOLA_CONFIG.values.forEach(value => {
                    const key = `${suit}_${value}`;
                    const path = `assets/carte/${suit}/${value}.png`;
                    if (!this.textures.exists(key)) this.load.image(key, path);
                });
            });
            if (!this.textures.exists('Carta_Retro')) {
                this.load.image('Carta_Retro', 'assets/carte/Carta_Retro.png');
            }
        }

        createCardSprite(x, y, textureKey, angle = 0) {
            const container = this.add.container(x, y);
            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.35);
            shadow.fillRoundedRect(-CARD_W / 2 + 3, -CARD_H / 2 + 3, CARD_W, CARD_H, 6);
            container.add(shadow);
            const cardImg = this.add.image(0, 0, textureKey);
            const scaleX = CARD_W / cardImg.width;
            const scaleY = CARD_H / cardImg.height;
            cardImg.setScale(scaleX, scaleY);
            container.add(cardImg);
            container.setAngle(angle);
            return container;
        }

        createCardFallback(x, y, card, angle = 0) {
            const container = this.add.container(x, y);
            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.35);
            shadow.fillRoundedRect(-CARD_W / 2 + 3, -CARD_H / 2 + 3, CARD_W, CARD_H, 6);
            container.add(shadow);
            const bg = this.add.graphics();
            bg.fillStyle(0xFFFFFF, 1);
            bg.fillRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 6);
            bg.lineStyle(2, 0x333333, 1);
            bg.strokeRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 6);
            container.add(bg);
            const color = SUIT_COLOR[card.suit] || 0x000000;
            const valueLabel = this.add.text(-CARD_W / 2 + 8, -CARD_H / 2 + 6, VALUE_LABEL[card.value] || card.value, {
                fontSize: '22px', color: '#' + color.toString(16).padStart(6, '0'), fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0, 0);
            container.add(valueLabel);
            const symbol = this.add.text(0, 0, SUIT_SYMBOL[card.suit] || '?', {
                fontSize: '44px', color: '#' + color.toString(16).padStart(6, '0')
            }).setOrigin(0.5);
            container.add(symbol);
            container.setAngle(angle);
            return container;
        }

        createCardBack(x, y, angle = 0) {
            const container = this.add.container(x, y);
            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.35);
            shadow.fillRoundedRect(-CARD_W / 2 + 3, -CARD_H / 2 + 3, CARD_W, CARD_H, 6);
            container.add(shadow);
            if (this.textures.exists('Carta_Retro')) {
                const cardImg = this.add.image(0, 0, 'Carta_Retro');
                const scaleX = CARD_W / cardImg.width;
                const scaleY = CARD_H / cardImg.height;
                cardImg.setScale(scaleX, scaleY);
                container.add(cardImg);
            } else {
                const bg = this.add.graphics();
                bg.fillStyle(0x8B1A1A, 1);
                bg.fillRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 6);
                bg.lineStyle(2, 0xFFD700, 1);
                bg.strokeRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 6);
                bg.lineStyle(1.5, 0xFFD700, 0.6);
                bg.strokeRoundedRect(-CARD_W / 2 + 6, -CARD_H / 2 + 6, CARD_W - 12, CARD_H - 12, 4);
                container.add(bg);
                const pattern = this.add.text(0, 0, '✦', { fontSize: '36px', color: '#FFD700' }).setOrigin(0.5);
                container.add(pattern);
            }
            container.setAngle(angle);
            return container;
        }

        create() {
            this.gameEnded = false;
            this.resolving = false;
            this.createTableBackground();
            this.createDeckVisual();
            this.createBriscolaVisual();
            this.createOpponentBadge();
            this.createPlayerBadge();
            this.createPlayArea();
            this.createHandsContainers();
            this.createMessageText();
            this.setupDeck();
            this.dealCards();
            this.setupBriscola();
            this.renderHands();
            this.updateDeckCount();
            this.messageText.setText('Tocca a te!');
            this.startTurn();
        }

        createTableBackground() {
            const bg = this.add.graphics().setDepth(0);
            bg.fillStyle(0x1B3A2A, 1);
            bg.fillRect(0, 0, 800, 600);
            bg.fillStyle(0x163122, 1);
            bg.fillCircle(400, 300, 280);
            bg.lineStyle(2, 0x0F2418, 0.6);
            bg.strokeCircle(400, 300, 280);
            bg.strokeCircle(400, 300, 260);
            bg.fillStyle(0x000000, 0.25);
            bg.fillRect(0, 0, 800, 30);
            bg.fillRect(0, 570, 800, 30);
            bg.fillRect(0, 0, 30, 600);
            bg.fillRect(770, 0, 30, 600);
        }

        createDeckVisual() {
            const deckX = 80;
            const deckY = 300;
            this.deckStackGroup = this.add.group();
            for (let i = 4; i >= 0; i--) {
                const backContainer = this.createCardBack(deckX + i * 2, deckY + i * 2);
                backContainer.setDepth(15);
                this.deckStackGroup.add(backContainer);
            }
            this.deckCountText = this.add.text(deckX, deckY - CARD_H / 2 - 22, '0', {
                fontSize: '18px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka', backgroundColor: '#000000aa', padding: { x: 12, y: 4 }
            }).setOrigin(0.5).setDepth(20);
        }

        createBriscolaVisual() {
            const brisX = 140;
            const brisY = 300;
            this.briscolaContainer = this.add.container(brisX, brisY).setDepth(11);
            this.briscolaText = this.add.text(400, 140, 'Briscola: ?', {
                fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka', backgroundColor: '#000000aa', padding: { x: 12, y: 4 }
            }).setOrigin(0.5).setDepth(12);
        }

        createOpponentBadge() {
            const x = 400, y = 35;
            const bg = this.add.graphics().setDepth(20);
            bg.fillStyle(0x000000, 0.55);
            bg.fillRoundedRect(x - 50, y - 20, 100, 40, 20);
            bg.lineStyle(2, 0xFFFFFF, 0.3);
            bg.strokeRoundedRect(x - 50, y - 20, 100, 40, 20);
            this.opponentScoreText = this.add.text(x, y, '0', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(21);
            this.add.text(x, y - 24, 'Avversario', { fontSize: '11px', color: '#FFD8A8', fontStyle: 'bold', fontFamily: 'Fredoka', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(21);
        }

        createPlayerBadge() {
            const x = 400, y = 565;
            const bg = this.add.graphics().setDepth(20);
            bg.fillStyle(0x000000, 0.55);
            bg.fillRoundedRect(x - 50, y - 20, 100, 40, 20);
            bg.lineStyle(2, 0xFFFFFF, 0.3);
            bg.strokeRoundedRect(x - 50, y - 20, 100, 40, 20);
            this.playerScoreText = this.add.text(x, y, '0', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(21);
            this.add.text(x, y + 24, 'Tu', { fontSize: '11px', color: '#A8FFD8', fontStyle: 'bold', fontFamily: 'Fredoka', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(21);
        }

        createPlayArea() {
            this.playAreaContainer = this.add.container(400, 300).setDepth(10);
        }

        createHandsContainers() {
            this.opponentHandContainer = this.add.container(400, 100).setDepth(10);
            this.playerHandContainer = this.add.container(400, 460).setDepth(10);
        }

        createMessageText() {
            this.messageText = this.add.text(400, 300, '', { fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5).setDepth(50);
        }

        setupDeck() {
            this.deck = [];
            BRISCOLA_CONFIG.suits.forEach(suit => {
                BRISCOLA_CONFIG.values.forEach(value => {
                    this.deck.push({ suit, value, key: `${suit}_${value}` });
                });
            });
            Phaser.Utils.Array.Shuffle(this.deck);
        }

        dealCards() {
            for (let i = 0; i < 3; i++) {
                this.playerHand.push(this.deck.pop());
                this.opponentHand.push(this.deck.pop());
            }
        }

        setupBriscola() {
            const briscolaCard = this.deck.pop();
            this.briscolaSuit = briscolaCard.suit;
            this.briscolaCard = briscolaCard;
            this.deck.unshift(briscolaCard);
            if (this.briscolaCardSprite) this.briscolaCardSprite.destroy();
            this.briscolaCardSprite = this.textures.exists(briscolaCard.key)
                ? this.createCardSprite(0, 0, briscolaCard.key, 90)
                : this.createCardFallback(0, 0, briscolaCard, 90);
            this.briscolaContainer.removeAll(true);
            this.briscolaContainer.add(this.briscolaCardSprite);
            if (this.briscolaText) this.briscolaText.setText(`Briscola: ${BRISCOLA_CONFIG.suitNames[this.briscolaSuit]}`);
        }

        updateDeckCount() {
            if (this.deckCountText && this.deckCountText.active) this.deckCountText.setText(String(this.deck.length));
            if (this.deck.length <= 1 && this.deckStackGroup) this.deckStackGroup.clear(true, true);
        }

        renderHands() {
            if (this.playerHandContainer) this.playerHandContainer.removeAll(true);
            if (this.opponentHandContainer) this.opponentHandContainer.removeAll(true);
            this.playerHand.forEach((card, index) => {
                const total = this.playerHand.length;
                const baseX = (index - (total - 1) / 2) * this.spacing;
                const baseY = 0;
                const angle = (index - (total - 1) / 2) * 3;
                const cardContainer = this.textures.exists(card.key) ? this.createCardSprite(baseX, baseY, card.key, angle) : this.createCardFallback(baseX, baseY, card, angle);
                cardContainer.setSize(CARD_W, CARD_H);
                cardContainer.setInteractive(new Phaser.Geom.Rectangle(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H), Phaser.Geom.Rectangle.Contains);
                cardContainer.input.cursor = 'pointer';
                cardContainer.on('pointerover', () => {
                    if (this.roundActive && !this.gameEnded && !this.resolving) {
                        cardContainer.setScale(1.08); cardContainer.setY(baseY - 15); cardContainer.setDepth(50);
                    }
                });
                cardContainer.on('pointerout', () => { cardContainer.setScale(1); cardContainer.setY(baseY); cardContainer.setDepth(0); });
                cardContainer.on('pointerdown', () => this.playCard(index));
                this.playerHandContainer.add(cardContainer);
            });
            this.opponentHand.forEach((card, index) => {
                const total = this.opponentHand.length;
                const x = (index - (total - 1) / 2) * this.spacing;
                const angle = (index - (total - 1) / 2) * 3;
                const backContainer = this.createCardBack(x, 0, angle);
                this.opponentHandContainer.add(backContainer);
            });
        }

        startTurn() {
            if (this.gameEnded) return;
            if (this.playerHand.length === 0 && this.opponentHand.length === 0) { this.endGame(); return; }
            this.roundActive = true;
            if (this.firstPlayer === 'opponent') {
                this.messageText.setText("L'avversario sta pensando..."); this.messageText.setColor('#FFD8A8');
                this.time.delayedCall(800, () => { if (!this.gameEnded && !this.resolving) this.opponentPlayFirst(); });
            } else {
                this.messageText.setText('Tocca a te!'); this.messageText.setColor('#A8FFD8');
            }
        }

        playCard(index) {
            if (!this.roundActive || this.gameEnded || this.resolving) return;
            if (this.firstPlayer !== 'player' && !this.opponentPlayed) return;
            if (index < 0 || index >= this.playerHand.length) return;
            this.roundActive = false;
            const card = this.playerHand.splice(index, 1)[0];
            this.playerPlayed = card;
            this.renderHands();
            this.showPlayedCard(card, 'player');
            if (this.firstPlayer === 'player') {
                this.time.delayedCall(600, () => { if (!this.gameEnded && !this.resolving) this.opponentRespond(); });
            } else {
                this.time.delayedCall(600, () => { if (!this.gameEnded && !this.resolving) this.resolveRound(); });
            }
        }

        opponentPlayFirst() {
            if (this.gameEnded || this.resolving) return;
            if (this.opponentHand.length === 0 && this.playerHand.length === 0) { this.endGame(); return; }
            if (this.opponentHand.length === 0) { this.resolveRound(); return; }
            const card = this.chooseOpponentCard(true);
            if (!card) { this.resolveRound(); return; }
            this.opponentPlayed = card;
            this.renderHands();
            this.showPlayedCard(card, 'opponent');
            this.messageText.setText('Tocca a te!'); this.messageText.setColor('#A8FFD8');
            this.roundActive = true;
        }

        opponentRespond() {
            if (this.gameEnded || this.resolving) return;
            if (this.opponentHand.length === 0) { this.resolveRound(); return; }
            const card = this.chooseOpponentCard(false);
            if (!card) { this.resolveRound(); return; }
            this.opponentPlayed = card;
            this.renderHands();
            this.showPlayedCard(card, 'opponent');
            this.time.delayedCall(600, () => { if (!this.gameEnded && !this.resolving) this.resolveRound(); });
        }

        chooseOpponentCard(isFirst) {
            const hand = this.opponentHand;
            if (hand.length === 0) return null;
            if (this.difficulty === 'facile') {
                return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
            }
            if (this.difficulty === 'difficile') {
                return this.chooseHardOpponentCard(isFirst);
            }
            if (isFirst) {
                const briscole = hand.filter(c => c.suit === this.briscolaSuit);
                const nonBriscole = hand.filter(c => c.suit !== this.briscolaSuit);
                const lisci = nonBriscole.filter(c => CARD_POINTS[c.value] === 0);
                if (lisci.length > 0) {
                    const bestLiscio = lisci.reduce((a, b) => CARD_STRENGTH[a.value] > CARD_STRENGTH[b.value] ? a : b);
                    return hand.splice(hand.indexOf(bestLiscio), 1)[0];
                }
                if (nonBriscole.length > 0) {
                    const lowestNonBriscola = nonBriscole.reduce((a, b) => CARD_STRENGTH[a.value] < CARD_STRENGTH[b.value] ? a : b);
                    return hand.splice(hand.indexOf(lowestNonBriscola), 1)[0];
                }
                if (briscole.length > 0) {
                    const lowestBriscola = briscole.reduce((a, b) => CARD_STRENGTH[a.value] < CARD_STRENGTH[b.value] ? a : b);
                    return hand.splice(hand.indexOf(lowestBriscola), 1)[0];
                }
                return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
            }
            const playerCard = this.playerPlayed;
            if (!playerCard) return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
            const winningCards = hand.filter(c => this.cardBeats(playerCard, c));
            const losingCards = hand.filter(c => !this.cardBeats(playerCard, c));
            if (winningCards.length > 0) {
                const bestWinner = winningCards.reduce((a, b) => {
                    const pointsA = CARD_POINTS[a.value]; const pointsB = CARD_POINTS[b.value];
                    if (pointsA !== pointsB) return pointsA < pointsB ? a : b;
                    return CARD_STRENGTH[a.value] < CARD_STRENGTH[b.value] ? a : b;
                });
                const playerPoints = CARD_POINTS[playerCard.value];
                if (playerPoints > 0 || playerCard.suit === this.briscolaSuit || this.deck.length < 10) return hand.splice(hand.indexOf(bestWinner), 1)[0];
                if (CARD_POINTS[bestWinner.value] === 0 && winningCards.length > 1) {
                    const nonScoringWinner = winningCards.find(c => CARD_POINTS[c.value] === 0);
                    if (nonScoringWinner) return hand.splice(hand.indexOf(nonScoringWinner), 1)[0];
                }
                return hand.splice(hand.indexOf(bestWinner), 1)[0];
            }
            if (losingCards.length > 0) {
                const scoringLoss = losingCards.filter(c => CARD_POINTS[c.value] > 0);
                if (scoringLoss.length > 0 && this.deck.length > 5) {
                    const worstScoring = scoringLoss.reduce((a, b) => CARD_STRENGTH[a.value] < CARD_STRENGTH[b.value] ? a : b);
                    return hand.splice(hand.indexOf(worstScoring), 1)[0];
                }
                const lisciLoss = losingCards.filter(c => CARD_POINTS[c.value] === 0);
                const pool = lisciLoss.length > 0 ? lisciLoss : losingCards;
                const worst = pool.reduce((a, b) => CARD_STRENGTH[a.value] < CARD_STRENGTH[b.value] ? a : b);
                return hand.splice(hand.indexOf(worst), 1)[0];
            }
            return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
        }

        chooseHardOpponentCard(isFirst) {
            const hand = this.opponentHand;
            const cost = card =>
                CARD_POINTS[card.value] * 12 +
                CARD_STRENGTH[card.value] * 2 +
                (card.suit === this.briscolaSuit ? 50 : 0);
            const cheapest = cards => cards.reduce((best, card) => cost(card) < cost(best) ? card : best);

            if (isFirst) {
                const safeCards = hand.filter(card =>
                    card.suit !== this.briscolaSuit && CARD_POINTS[card.value] === 0
                );
                const nonBriscole = hand.filter(card => card.suit !== this.briscolaSuit);
                const card = safeCards.length > 0
                    ? cheapest(safeCards)
                    : nonBriscole.length > 0 ? cheapest(nonBriscole) : cheapest(hand);
                return hand.splice(hand.indexOf(card), 1)[0];
            }

            const playerCard = this.playerPlayed;
            if (!playerCard) return hand.splice(Math.floor(Math.random() * hand.length), 1)[0];
            const winningCards = hand.filter(card => this.cardBeats(playerCard, card));
            const losingCards = hand.filter(card => !this.cardBeats(playerCard, card));
            const playerCardIsValuable =
                CARD_POINTS[playerCard.value] >= 3 ||
                playerCard.suit === this.briscolaSuit ||
                this.deck.length <= 3;

            if (winningCards.length > 0 && (playerCardIsValuable || losingCards.length === 0)) {
                const winner = cheapest(winningCards);
                return hand.splice(hand.indexOf(winner), 1)[0];
            }
            if (losingCards.length > 0) {
                const loser = cheapest(losingCards);
                return hand.splice(hand.indexOf(loser), 1)[0];
            }
            const winner = cheapest(winningCards);
            return hand.splice(hand.indexOf(winner), 1)[0];
        }

        cardBeats(leader, responder) {
            const isBriscolaLeader = leader.suit === this.briscolaSuit;
            const isBriscolaResponder = responder.suit === this.briscolaSuit;
            if (isBriscolaResponder && !isBriscolaLeader) return true;
            if (!isBriscolaResponder && isBriscolaLeader) return false;
            if (isBriscolaLeader && isBriscolaResponder) return CARD_STRENGTH[responder.value] > CARD_STRENGTH[leader.value];
            if (responder.suit === leader.suit) return CARD_STRENGTH[responder.value] > CARD_STRENGTH[leader.value];
            return false;
        }

        showPlayedCard(card, owner) {
            const startY = owner === 'player' ? 120 : -120;
            const targetY = owner === 'player' ? 30 : -30;
            const targetX = owner === 'player' ? 25 : -25;
            const angle = owner === 'player' ? 4 : -4;
            const cardContainer = this.textures.exists(card.key) ? this.createCardSprite(targetX, startY, card.key, 0) : this.createCardFallback(targetX, startY, card, 0);
            cardContainer.setScale(0.8);
            this.playAreaContainer.add(cardContainer);
            this.tweens.add({
                targets: cardContainer, y: targetY, angle: angle, scaleX: 1, scaleY: 1, duration: 220, ease: 'Quad.easeOut'
            });
        }

        resolveRound() {
            if (this.resolving || this.gameEnded) return;
            if (!this.playerPlayed || !this.opponentPlayed) { this.resolving = false; return; }
            this.resolving = true; this.roundActive = false;
            const playerIsLeader = this.firstPlayer === 'player';
            const leaderCard = playerIsLeader ? this.playerPlayed : this.opponentPlayed;
            const responderCard = playerIsLeader ? this.opponentPlayed : this.playerPlayed;
            const responderWins = this.cardBeats(leaderCard, responderCard);
            const playerWins = playerIsLeader ? !responderWins : responderWins;
            const points = CARD_POINTS[this.playerPlayed.value] + CARD_POINTS[this.opponentPlayed.value];
            if (playerWins) {
                this.playerScore += points; this.lastTrickWinner = 'player';
                this.messageText.setText(`Hai vinto la mano! +${points}`); this.messageText.setColor('#A8FFD8');
                this.firstPlayer = 'player';
            } else {
                this.opponentScore += points; this.lastTrickWinner = 'opponent';
                this.messageText.setText(`Avversario vince! +${points}`); this.messageText.setColor('#FFD8A8');
                this.firstPlayer = 'opponent';
            }
            this.playerScoreText.setText(String(this.playerScore));
            this.opponentScoreText.setText(String(this.opponentScore));
            this.time.delayedCall(1200, () => {
                const targetY = playerWins ? 300 : -300;
                this.tweens.add({
                    targets: this.playAreaContainer, y: 300 + targetY, alpha: 0, duration: 300, ease: 'Power2',
                    onComplete: () => {
                        this.playAreaContainer.setY(300); this.playAreaContainer.setAlpha(1); this.clearPlayArea();
                        this.playerPlayed = null; this.opponentPlayed = null; this.resolving = false;
                        if (this.playerHand.length === 0 && this.opponentHand.length === 0 && this.deck.length === 0) { this.endGame(); return; }
                        if (this.playerHand.length < 3 || this.opponentHand.length < 3) this.drawCards();
                        this.renderHands(); this.updateDeckCount();
                        if (!this.gameEnded) this.startTurn();
                    }
                });
            });
        }

        clearPlayArea() {
            if (this.playAreaContainer) this.playAreaContainer.removeAll(true);
        }

        drawCards() {
            if (this.deck.length === 0) return;
            const drawerFirst = this.lastTrickWinner === 'player' ? 'player' : 'opponent';
            const order = drawerFirst === 'player' ? ['player', 'opponent'] : ['opponent', 'player'];
            order.forEach(who => {
                if (this.deck.length === 0) return;
                if (who === 'player') {
                    while (this.playerHand.length < 3 && this.deck.length > 0) { const c = this.deck.pop(); if (c) this.playerHand.push(c); }
                } else if (who === 'opponent') {
                    while (this.opponentHand.length < 3 && this.deck.length > 0) { const c = this.deck.pop(); if (c) this.opponentHand.push(c); }
                }
            });
            if (this.deck.length === 0 && this.briscolaContainer) this.briscolaContainer.setVisible(false);
        }

        endGame() {
            if (this.gameEnded) return;
            this.gameEnded = true; this.roundActive = false;
            let result = 'draw'; let message = ''; let color = '#FFD700';
            if (this.playerScore >= 61) { result = 'win'; message = 'HAI VINTO!'; color = '#A8FFD8'; }
            else if (this.opponentScore >= 61) { result = 'loss'; message = 'HAI PERSO...'; color = '#FF8888'; }
            else if (this.playerScore === 60 && this.opponentScore === 60) { result = 'draw'; message = 'PAREGGIO'; color = '#FFD700'; }
            else if (this.playerScore > this.opponentScore) { result = 'win'; message = 'HAI VINTO!'; color = '#A8FFD8'; }
            else if (this.playerScore < this.opponentScore) { result = 'loss'; message = 'HAI PERSO...'; color = '#FF8888'; }
            const playerWins = result === 'win';
            this.messageText.setText(`${message}   ${this.playerScore} - ${this.opponentScore}`);
            this.messageText.setColor(color); this.messageText.setFontSize(22); this.messageText.setAlign('center'); this.messageText.setDepth(200);
            this.time.delayedCall(2500, () => {
                if (typeof this.onComplete === 'function') this.onComplete(playerWins, result, this.playerScore, this.opponentScore);
                this.scene.stop();
            });
        }
    }




    class BriscolaMissionFailedScene extends Phaser.Scene {
        constructor() { super('BriscolaMissionFailed'); }
        init(data) { this.playerScore = data.playerScore || 0; this.opponentScore = data.opponentScore || 0; this.onComplete = data.onComplete || null; }
        create() {
            this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85).setDepth(1);
            this.add.rectangle(400, 300, 480, 280, 0x1a0202, 0.98).setStrokeStyle(3, 0xe74c3c).setDepth(2);
            this.add.text(400, 200, 'MISSIONE FALLITA', { fontSize: '30px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(3);
            this.add.text(400, 260, `Punteggio finale: ${this.playerScore} - ${this.opponentScore}`, { fontSize: '18px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(3);
            this.add.text(400, 305, 'Nessuna vita persa. Puoi riprovare.', { fontSize: '13px', color: '#e0d5c1', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(3);
            const btn = this.add.rectangle(400, 385, 240, 44, 0xd27d2d).setStrokeStyle(2, 0xffd700).setDepth(3).setInteractive({ useHandCursor: true });
            this.add.text(400, 385, 'CONTINUA', { fontSize: '16px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(4);
            btn.on('pointerover', () => btn.setFillStyle(0xe59866));
            btn.on('pointerout', () => btn.setFillStyle(0xd27d2d));
            btn.on('pointerdown', () => { if (typeof this.onComplete === 'function') this.onComplete(); this.scene.stop(); });
        }
    }




    class BriscolaSystem {
        constructor(scene) {
            this.scene = scene;
            this.state = this.loadState();
            this.npc = null;
            this.npcTimer = null;
            this.abandonTimer = null;
            this.dialogShown = false;
            this.dialogOpen = false;
            this.missionComplete = false;
            this.missionFailed = false;
            this.missionStarted = false;
            this.pendingBriscola = false;
            this.briscolaRunning = false;
            this.levelCompleteOriginal = null;
            this.levelCompleteHooked = false;
            this.casualRunning = false;
            this.casualStake = 0;
            this.casualDifficulty = 'media';
            this.casualSpawned = false; 
            this.casualEntryTimer = null;
            this.casualTableGraphic = null;
            this.casualTableLabel = null;

            const currentDay = (window.GAME && typeof window.GAME.level === 'number') ? window.GAME.level : 0;
            if (this.state.day === BRISCOLA_CONFIG.missionDay && this.state.phase === 'waiting_briscola' && currentDay === BRISCOLA_CONFIG.missionDay) {
                this.pendingBriscola = true;
            } else if (this.state.phase === 'waiting_briscola' && currentDay !== BRISCOLA_CONFIG.missionDay) {
                this.state.phase = 'idle'; this.state.day = 0; this.saveState(); this.pendingBriscola = false;
            }
            this.installLevelCompleteHook();
        }

        showScheduledNPC() {
            const gameDay = window.GAME && window.GAME.level;
            if (!Number.isInteger(gameDay) || gameDay < 1 || !CALENDAR_CONFIG) return;
            const weekday = new Date(CALENDAR_CONFIG.startYear, CALENDAR_CONFIG.startMonth, gameDay).getDay();
            if (weekday !== 1 && weekday !== 5) return;
            if (this.missionStarted || this.casualRunning || this.casualSpawned) return;
            

            const target = (window.GAME && window.GAME.customersTarget) ? window.GAME.customersTarget : 0;
            const served = (window.GAME && window.GAME.customersServed) ? window.GAME.customersServed : 0;
            if (served < target * 0.5) return;

            this.casualSpawned = true;
            
            const startX = 240, startY = 592;
            const targetX = 100, targetY = 200;


            this.casualTableGraphic = this.scene.add.rectangle(100, 230, 70, 45, 0x5c2c16)
                .setStrokeStyle(2, 0xd27d2d).setDepth(200);
            this.casualTableLabel = this.scene.add.text(100, 195, 'Tav. Carte', {
                fontSize: '10px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(201);

            this.npc = {
                name: 'Anziano_Carte',
                x: startX,
                y: startY,
                sprite: null,
                shadow: null,
                bubble: null,
                speed: 75,
                movementData: {
                    waypoints: [
                        { x: startX, y: startY },
                        { x: 120, y: 400 },
                        { x: 100, y: targetY }
                    ],
                    currentWaypoint: 1,
                    destination: { x: 120, y: 400 },
                    movementComplete: false
                },
                isWalking: true,
                isLeaving: false,
                isDead: false,
                isEmoji: false,
                arrived: false,
                isCasual: true
            };


            const npcConfig = NPC_REGISTRY.Anziano_Carte || {};
            this.npc.shadow = this.scene.add.ellipse(startX, startY + 10, 20, 5, 0x000000, 0.25).setDepth(startY - 1);
            
            if (this.scene.textures.exists(npcConfig.textureDown)) {
                this.npc.sprite = this.scene.add.image(startX, startY, npcConfig.textureDown)
                    .setDisplaySize(48, 48).setDepth(startY);
            } else {
                this.npc.sprite = this.scene.add.text(startX, startY, '🧓', {
                    fontSize: '32px'
                }).setOrigin(0.5).setDepth(startY);
                this.npc.isEmoji = true;
            }

            if (this.scene.textures.exists('bubble_cash')) {
                this.npc.bubble = this.scene.add.image(startX, startY - 46, 'bubble_cash')
                    .setDisplaySize(36, 36).setOrigin(0.5).setDepth(startY + 10).setVisible(false);
            } else {
                this.npc.bubble = this.scene.add.text(startX, startY - 46, '💶', {
                    fontSize: '25px'
                }).setOrigin(0.5).setDepth(startY + 10).setVisible(false);
            }

            const handleClick = (pointer, localX, localY, event) => {
                if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
                this.interactWithNPC();
            };
            
            this.npc.sprite.setInteractive({ useHandCursor: true });
            this.npc.bubble.setInteractive({ useHandCursor: true });
            this.npc.sprite.on('pointerdown', handleClick);
            this.npc.bubble.on('pointerdown', handleClick);
        }

        openCasualWagerMenu() {
            if (!this.npc || !this.npc.isCasual || this.casualRunning || !this.scene.gameActive) return;
            if (this.scene.isPhoneActive) return;

            if (!this.scene.isWithinInteractionRange(this.npc.x, this.npc.y)) {
                this.scene.showFloatingText(this.npc.x, this.npc.y - 40, 'Avvicinati all’anziano!', '#ffd700');
                return;
            }

            if (!this.scene.scene.get('BriscolaWager')) {
                this.scene.scene.add('BriscolaWager', BriscolaWagerScene, false);
            }
            

            const bankroll = Math.max(0, Math.floor(Number(window.GAME.score) || 0));
            
            this.scene.scene.launch('BriscolaWager', {
                bankroll,
                onComplete: selection => {
                    if (this.scene.scene.isPaused()) this.scene.scene.resume();
                    if (!selection) return;
                    this.casualStake = selection.stake;
                    this.casualDifficulty = selection.difficulty;
                    this.casualRunning = true;
                    this.startCasualMatch();
                }
            });
            this.scene.scene.pause();
        }

        startCasualMatch() {

            if (this.scene.sound.get('colonna_sonora')) this.scene.sound.get('colonna_sonora').pause();
            if (!this.scene.sound.get('tarantella') && this.scene.cache.audio.exists('tarantella')) {
                this.tarantellaSound = this.scene.sound.add('tarantella', { volume: 0.4, loop: true }); 
                this.tarantellaSound.play();
            } else if (this.scene.sound.get('tarantella')) { 
                this.scene.sound.get('tarantella').play(); 
            }

            if (!this.scene.scene.get('BriscolaGame')) {
                this.scene.scene.add('BriscolaGame', BriscolaGameScene, false);
            }
            this.scene.scene.launch('BriscolaGame', {
                difficulty: this.casualDifficulty,
                onComplete: (playerWins, result, playerScore, opponentScore) => {
                    this.onCasualMatchComplete(result);
                }
            });
            this.scene.scene.pause();
        }

        onCasualMatchComplete(result) {
            this.casualRunning = false;
            if (this.scene.scene.isPaused()) this.scene.scene.resume();


            if (this.scene.sound.get('tarantella')) this.scene.sound.get('tarantella').stop();
            if (this.scene.sound.get('colonna_sonora')) this.scene.sound.get('colonna_sonora').resume();

            if (result === 'win') {
                this.scene.levelEarnings += this.casualStake;
                this.scene.showFloatingText(400, 300, `Hai vinto ${this.casualStake}€!`, '#ffd700');
            } else if (result === 'loss') {
                this.scene.levelEarnings = Math.max(0, this.scene.levelEarnings - this.casualStake);
                this.scene.showFloatingText(400, 300, `Hai perso ${this.casualStake}€`, '#ff6666');
            } else {
                this.scene.showFloatingText(400, 300, 'Pareggio: puntata restituita', '#ffd700');
            }

            this.scene.time.delayedCall(700, () => this.scene.levelComplete());
        }

        loadState() {
            try {
                const raw = localStorage.getItem('waitress_briscola_state');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') {
                        return { completed: !!parsed.completed, failed: !!parsed.failed, day: Number(parsed.day || 0), rewardGiven: !!parsed.rewardGiven, phase: parsed.phase || 'idle' };
                    }
                }
            } catch (e) {}
            return { completed: false, failed: false, day: 0, rewardGiven: false, phase: 'idle' };
        }

        saveState() { try { localStorage.setItem('waitress_briscola_state', JSON.stringify(this.state)); } catch (e) {} }

        isAvailable(currentDay) {
            if (currentDay !== BRISCOLA_CONFIG.missionDay) return false;
            if (this.state.completed) return false;
            if (this.state.failed) return false;
            if (this.state.phase !== 'idle') return false;
            return true;
        }

        installLevelCompleteHook() {
            if (this.levelCompleteHooked || !this.scene || typeof this.scene.levelComplete !== 'function') return;
            this.levelCompleteOriginal = this.scene.levelComplete.bind(this.scene);
            this.scene.levelComplete = () => {
                const currentDay = (window.GAME && typeof window.GAME.level === 'number') ? window.GAME.level : 0;
                if (this.pendingBriscola && currentDay === BRISCOLA_CONFIG.missionDay && !this.briscolaRunning && !this.missionComplete && !this.missionFailed) {
                    this.briscolaRunning = true; this.startBriscolaGame(); return;
                }
                if (this.pendingBriscola && currentDay !== BRISCOLA_CONFIG.missionDay) {
                    this.pendingBriscola = false; this.state.phase = 'idle'; this.state.day = 0; this.saveState();
                }
                this.levelCompleteOriginal();
            };
            this.levelCompleteHooked = true;
        }

        startMission() {
            if (this.missionStarted || this.npc || this.dialogOpen || this.pendingBriscola || this.briscolaRunning) return;
            if (!this.isAvailable(BRISCOLA_CONFIG.missionDay)) return;
            if (!this.scene || !this.scene.sys) return;
            this.missionStarted = true; this.dialogShown = false; this.dialogOpen = false; this.missionComplete = false; this.missionFailed = false;
            this.state.day = BRISCOLA_CONFIG.missionDay; this.state.phase = 'npc_active'; this.saveState();
            this.scene.sponsorBlocksCustomers = true;
            if (this.scene.spawnEvent) { this.scene.spawnEvent.remove(); this.scene.spawnEvent = null; }
            if (typeof this.scene.cleanupCustomers === 'function') this.scene.cleanupCustomers();
            this.scene.time.delayedCall(350, () => {
                if (this.missionStarted && !this.npc && !this.dialogShown) this.spawnNPC();
            });
        }

        spawnNPC() {
            if (this.npc || !this.missionStarted || this.dialogShown) return;
            const entryX = 240, entryY = 592, targetX = 175, targetY = 540;
            this.npc = {
                name: BRISCOLA_CONFIG.npcName, sprite: null, shadow: null, bubble: null, speed: 75,
                movementData: { waypoints: [{ x: entryX, y: entryY }, { x: 210, y: 565 }, { x: targetX, y: targetY }], currentWaypoint: 1, destination: { x: 210, y: 565 }, movementComplete: false },
                x: entryX, y: entryY, isWalking: true, isLeaving: false, isDead: false, isEmoji: false, arrived: false
            };
            const textureDown = BRISCOLA_CONFIG.npcTextures.down;
            this.npc.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
            if (this.scene.textures.exists(textureDown)) {
                this.npc.sprite = this.scene.add.image(entryX, entryY, textureDown).setDisplaySize(45, 45).setDepth(entryY);
            } else {
                this.npc.sprite = this.scene.add.text(entryX, entryY, '👦', { fontSize: '32px' }).setOrigin(0.5).setDepth(entryY); this.npc.isEmoji = true;
            }
            if (this.scene.textures.exists('bubble_mission')) {
                this.npc.bubble = this.scene.add.image(entryX, entryY - 48, 'bubble_mission').setDisplaySize(36, 36).setOrigin(0.5).setDepth(entryY + 10);
            } else {
                this.npc.bubble = this.scene.add.text(entryX, entryY - 48, '❗', { fontSize: '26px' }).setOrigin(0.5).setDepth(entryY + 10);
            }
            this.npc.sprite.setInteractive({ useHandCursor: true });
            this.npc.bubble.setInteractive({ useHandCursor: true });
            const openDialog = pointer => {
                if (pointer && pointer.event && typeof pointer.event.stopPropagation === 'function') pointer.event.stopPropagation();
                this.interactWithNPC();
            };
            this.npc.sprite.on('pointerdown', openDialog);
            this.npc.bubble.on('pointerdown', openDialog);
        }

        update(delta) {
            if (!this.npc || !this.npc.sprite) {
                if (!this.casualSpawned && !this.missionStarted && !this.casualRunning) {
                    this.showScheduledNPC();
                }
                return;
            }
            if (this.npc.movementData && !this.npc.movementData.movementComplete) this.updateNPCMovement(delta);
            if (this.npc.shadow) { this.npc.shadow.x = this.npc.sprite.x; this.npc.shadow.y = this.npc.sprite.y + 10; this.npc.shadow.setDepth(this.npc.sprite.y - 1); }
            if (this.npc.bubble && !this.npc.isLeaving && this.npc.bubble.visible) { this.npc.bubble.x = this.npc.sprite.x; this.npc.bubble.y = this.npc.sprite.y - 48; this.npc.bubble.setDepth(this.npc.sprite.y + 10); }
            if (this.npc.isLeaving && this.npc.movementData && this.npc.movementData.movementComplete) this.cleanupNPC();
        }

        updateNPCMovement(delta) {
            if (!this.npc || !this.npc.sprite || !this.npc.movementData) return;
            const data = this.npc.movementData;
            if (data.movementComplete) return;
            const dx = data.destination.x - this.npc.sprite.x;
            const dy = data.destination.y - this.npc.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= 3) {
                this.npc.sprite.x = data.destination.x; this.npc.sprite.y = data.destination.y;
                if (data.waypoints && data.currentWaypoint < data.waypoints.length - 1) {
                    data.currentWaypoint++; data.destination = data.waypoints[data.currentWaypoint]; return;
                }
                data.movementComplete = true; this.npc.isWalking = false;
                if (!this.npc.isLeaving) {
                    this.npc.arrived = true;
                    if (this.npc.isCasual && this.npc.bubble) {
                        this.npc.bubble.setVisible(true);
                        this.scene.tweens.add({
                            targets: this.npc.bubble, y: this.npc.bubble.y - 8, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
                        });
                    } else {
                        this.onNPCArrived();
                    }
                }
                return;
            }
            const speed = this.npc.speed || 75;
            const step = Math.min(distance, speed * (delta / 1000));
            const ratio = step / distance;
            this.npc.sprite.x += dx * ratio; this.npc.sprite.y += dy * ratio;
            this.npc.x = this.npc.sprite.x; this.npc.y = this.npc.sprite.y;
            this.npc.sprite.setDepth(this.npc.sprite.y);
            

            if (!this.npc.isEmoji) {
                const config = NPC_REGISTRY[this.npc.name] || {};
                const up = config.textureUp || BRISCOLA_CONFIG.npcTextures.up;
                const down = config.textureDown || BRISCOLA_CONFIG.npcTextures.down;
                const left = config.textureLeft || BRISCOLA_CONFIG.npcTextures.left;
                const right = config.textureRight || BRISCOLA_CONFIG.npcTextures.right;

                if (Math.abs(dx) > Math.abs(dy)) this.npc.sprite.setTexture(dx > 0 ? right : left);
                else this.npc.sprite.setTexture(dy > 0 ? down : up);
            }
        }

        onNPCArrived() {
            if (this.dialogShown || this.dialogOpen || !this.npc) return;
            this.npc.arrived = true;
            this.abandonTimer = this.scene.time.delayedCall(BRISCOLA_CONFIG.abandonTimeoutMs, () => {
                this.abandonTimer = null;
                if (this.dialogShown || this.dialogOpen || !this.npc) return;
                this.ignoreMission();
            });
        }

        interactWithNPC() {
            if (this.npc && this.npc.isCasual) {
                if (this.dialogOpen || this.casualRunning) return;
                this.openCasualWagerMenu();
                return;
            }
            if (!this.npc || !this.npc.arrived || this.dialogShown || this.dialogOpen) return;
            this.dialogShown = true; this.dialogOpen = true;
            if (this.npcTimer) { this.npcTimer.remove(); this.npcTimer = null; }
            if (this.abandonTimer) { this.abandonTimer.remove(); this.abandonTimer = null; }
            if (this.npc.sprite) this.npc.sprite.disableInteractive();
            if (this.npc.bubble) this.npc.bubble.disableInteractive();
            this.showDialog();
        }

        showDialog() {
            if (!this.scene.scene.get('BriscolaDialog')) this.scene.scene.add('BriscolaDialog', BriscolaDialogScene, false);
            this.scene.scene.launch('BriscolaDialog', {
                lines: NIPOTE_DIALOG_LINES, speakerName: BRISCOLA_CONFIG.npcName, speakerEmoji: '👦',
                onComplete: () => this.afterDialog()
            });
            this.scene.scene.pause();
        }

        afterDialog() {
            if (!this.missionStarted) return;
            this.dialogOpen = false; this.pendingBriscola = true;
            this.state.day = BRISCOLA_CONFIG.missionDay; this.state.phase = 'waiting_briscola'; this.saveState();
            if (this.scene.scene.isPaused()) this.scene.scene.resume();
            this.leaveNPC(() => {
                this.missionStarted = false; this.scene.sponsorBlocksCustomers = false;
                if (typeof this.scene.startSpawning === 'function') this.scene.startSpawning();
            });
        }

        ignoreMission() {
            if (this.abandonTimer) { this.abandonTimer.remove(); this.abandonTimer = null; }
            this.missionFailed = true; this.state.failed = false; this.state.phase = 'idle'; this.state.day = 0; this.saveState();
            this.pendingBriscola = false; this.missionStarted = false; this.dialogOpen = false;
            this.scene.sponsorBlocksCustomers = false;
            if (this.npc) this.leaveNPC(() => {});
            else { if (this.scene.gameActive && typeof this.scene.startSpawning === 'function') this.scene.startSpawning(); }
        }

        leaveNPC(onComplete) {
            if (!this.npc) { if (typeof onComplete === 'function') onComplete(); return; }
            if (this.npcTimer) { this.npcTimer.remove(); this.npcTimer = null; }
            if (this.abandonTimer) { this.abandonTimer.remove(); this.abandonTimer = null; }
            if (this.npc.sprite) this.npc.sprite.disableInteractive();
            if (this.npc.bubble) this.npc.bubble.disableInteractive();
            const startX = this.npc.sprite ? this.npc.sprite.x : 175;
            const startY = this.npc.sprite ? this.npc.sprite.y : 540;
            const exitWaypoints = [{ x: startX, y: startY }, { x: 210, y: 565 }, { x: 240, y: 592 }];
            this.npc.movementData = { waypoints: exitWaypoints, currentWaypoint: 1, destination: exitWaypoints[1], movementComplete: false };
            this.npc.isLeaving = true; this.npc.isWalking = true; this.npc.speed = 85;
            this.npc.onLeaveComplete = onComplete || null;
        }

        cleanupNPC() {
            if (this.npcTimer) { this.npcTimer.remove(); this.npcTimer = null; }
            if (this.abandonTimer) { this.abandonTimer.remove(); this.abandonTimer = null; }
            if (!this.npc) return;
            const callback = this.npc.onLeaveComplete;
            if (this.npc.sprite) this.npc.sprite.destroy();
            if (this.npc.shadow) this.npc.shadow.destroy();
            if (this.npc.bubble) this.npc.bubble.destroy();
            
            if (this.casualTableGraphic) { this.casualTableGraphic.destroy(); this.casualTableGraphic = null; }
            if (this.casualTableLabel) { this.casualTableLabel.destroy(); this.casualTableLabel = null; }

            this.npc = null;
            this.casualSpawned = false;
            if (typeof callback === 'function') callback();
        }

        startBriscolaGame() {
            if (this.briscolaRunning && !this.pendingBriscola) return;
            if (this.missionComplete || this.missionFailed) return;
            const currentDay = (window.GAME && typeof window.GAME.level === 'number') ? window.GAME.level : 0;
            if (currentDay !== BRISCOLA_CONFIG.missionDay) {
                this.pendingBriscola = false; this.state.phase = 'idle'; this.state.day = 0; this.saveState(); this.briscolaRunning = false; return;
            }
            this.pendingBriscola = false;
            if (this.scene.sound.get('colonna_sonora')) this.scene.sound.get('colonna_sonora').pause();
            if (!this.scene.sound.get('tarantella') && this.scene.cache.audio.exists('tarantella')) {
                this.tarantellaSound = this.scene.sound.add('tarantella', { volume: 0.4, loop: true }); this.tarantellaSound.play();
            } else if (this.scene.sound.get('tarantella')) { this.scene.sound.get('tarantella').play(); }
            if (!this.scene.scene.get('BriscolaGame')) this.scene.scene.add('BriscolaGame', BriscolaGameScene, false);
            this.scene.scene.launch('BriscolaGame', {
                onComplete: (playerWins, result, playerScore, opponentScore) => { this.onBriscolaComplete(playerWins, result, playerScore, opponentScore); }
            });
            this.scene.scene.pause();
        }

        onBriscolaComplete(playerWins, result, playerScore, opponentScore) {
            this.briscolaRunning = false;
            if (this.scene.scene.isPaused()) this.scene.scene.resume();
            if (playerWins) {
                this.missionComplete = true; this.missionFailed = false;
                this.state.completed = true; this.state.failed = false; this.state.rewardGiven = true; this.state.phase = 'completed'; this.saveState();
                if (window.GAME) window.GAME.score += BRISCOLA_CONFIG.rewardMoney;
                let relationships = {};
                try { relationships = JSON.parse(localStorage.getItem('waitress_npc_relationships') || '{}'); } catch (e) {}
                relationships.Rosa = Math.min(100, (relationships.Rosa || 50) + BRISCOLA_CONFIG.rewardRelationship);
                localStorage.setItem('waitress_npc_relationships', JSON.stringify(relationships));
                this.scene.time.delayedCall(400, () => this.showFinalCutscene());
                return;
            }
            this.missionFailed = true; this.missionComplete = false;
            this.state.failed = true; this.state.completed = false; this.state.phase = 'failed'; this.saveState();
            this.showMissionFailedScreen(playerScore, opponentScore);
        }

        showMissionFailedScreen(playerScore, opponentScore) {
            if (!this.scene.scene.get('BriscolaMissionFailed')) this.scene.scene.add('BriscolaMissionFailed', BriscolaMissionFailedScene, false);
            this.scene.scene.launch('BriscolaMissionFailed', {
                playerScore, opponentScore,
                onComplete: () => { if (this.scene.scene.isPaused()) this.scene.scene.resume(); this.continueAfterBriscola(); }
            });
            this.scene.scene.pause();
        }

        showFinalCutscene() {
            if (!this.scene.scene.get('BriscolaFinalCutscene')) {
                this.scene.scene.add('BriscolaFinalCutscene', BriscolaFinalCutsceneScene, false);
            }
            this.scene.scene.launch('BriscolaFinalCutscene', {
                onComplete: () => {
                    if (this.scene.scene.isPaused()) this.scene.scene.resume();
                    this.scene.showFloatingText(400, 350, `+${BRISCOLA_CONFIG.rewardMoney}€ e +${BRISCOLA_CONFIG.rewardRelationship} Sintonia con Rosa`, '#ffd700');
                    this.continueAfterBriscola();
                }
            });
            this.scene.scene.pause();
        }

        continueAfterBriscola() {
            this.pendingBriscola = false; this.briscolaRunning = false;
            if (this.scene.sound.get('tarantella')) this.scene.sound.get('tarantella').stop();
            if (this.scene.sound.get('colonna_sonora')) this.scene.sound.get('colonna_sonora').resume();
            if (this.scene.scene.isPaused()) this.scene.scene.resume();
            this.scene.sponsorBlocksCustomers = false;
            if (typeof this.levelCompleteOriginal === 'function') { this.levelCompleteOriginal(); return; }
            if (typeof this.scene.levelComplete === 'function') this.scene.levelComplete();
        }
    }

    window.BriscolaDialogScene = BriscolaDialogScene;
    window.BriscolaFinalCutsceneScene = BriscolaFinalCutsceneScene;
    window.BriscolaGameScene = BriscolaGameScene;
    window.BriscolaWagerScene = BriscolaWagerScene;
    window.BriscolaSystem = BriscolaSystem;
    window.BriscolaMissionFailedScene = BriscolaMissionFailedScene;
})();