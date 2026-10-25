class EndingScene extends Phaser.Scene {
    constructor() {
        super('Ending');
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
        if (!this.textures.exists('cameriera_destra')) {
            this.load.image('cameriera_destra', 'assets/Cameriera/Cameriera_Destra.png');
        }

        if (!this.textures.exists('calogero_avanti')) {
            this.load.image('calogero_avanti', 'assets/NPC/Calogero/Calogero_Avanti.png');
        }

        if (!this.textures.exists('uomo_affari_avanti')) {
            this.load.image('uomo_affari_avanti', "assets/NPC/Uomo d'Affari/Uomod'Affari_Avanti.png");
        }
        if (!this.textures.exists('uomo_affari_2_avanti')) {
            this.load.image('uomo_affari_2_avanti', "assets/NPC/Secondo Uomo d'Affari/SecondoUomo_Avanti.png");
        }
        if (!this.textures.exists('Poliziotto_Avanti')) {
            this.load.image('Poliziotto_Avanti', 'assets/NPC/Poliziotto/Poliziotto_Avanti.png');
        }
        if (!this.textures.exists('Poliziotto_Destra')) {
            this.load.image('Poliziotto_Destra', 'assets/NPC/Poliziotto/Poliziotto_Destra.png');
        }

        this.load.image('bubble_dialog', 'assets/UI/bubble_dialog.png');
    }

    create() {
        const W = 800, H = 600;

        this.isCutscene = true;
        this.cameras.main.setBackgroundColor('#1a0a04');
        this.input.keyboard.enabled = true;


        if (this.textures.exists('floor_sala')) {
            for (let x = 0; x < W; x += 32) {
                for (let y = 0; y < H; y += 32) {
                    this.add.image(x + 16, y + 16, 'floor_sala')
                        .setDisplaySize(32, 32).setTint(0xd9b88a).setDepth(0);
                }
            }
        }


        const eveningLight = this.add.rectangle(400, 300, W, H, 0xff8844, 0.10).setDepth(1);


        const window = this.add.rectangle(400, 115, 260, 115, 0x6b4a5a).setStrokeStyle(8, 0x573a29).setDepth(2);
        this.add.rectangle(400, 115, 7, 108, 0x573a29).setDepth(3);
        this.add.rectangle(400, 115, 250, 7, 0x573a29).setDepth(3);


        this.add.rectangle(400, 425, 470, 62, 0x633a23).setStrokeStyle(4, 0x321c13).setDepth(8);
        this.add.rectangle(400, 390, 470, 12, 0x9a6037).setDepth(9);


        this.door = this.add.rectangle(748, 330, 94, 260, 0x56331f).setStrokeStyle(7, 0x2b1a12).setDepth(5);
        this.add.rectangle(717, 330, 7, 260, 0x2b1a12).setDepth(6);
        this.add.circle(713, 350, 5, 0xe5ba5f).setDepth(7);


        this.add.text(400, 38, 'PALERMO  ·  ORE 20:45', {
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


        this.businessman = this.add.image(900, 350, 'uomo_affari_avanti')
            .setDisplaySize(78, 112).setDepth(11).setVisible(false);

        this.businessman2 = this.add.image(950, 350, 'uomo_affari_2_avanti')
            .setDisplaySize(78, 112).setDepth(10).setVisible(false);


        this.police1 = this.add.image(900, 340, 'Poliziotto_Avanti')
            .setDisplaySize(78, 112).setDepth(12).setVisible(false);
        this.police2 = this.add.image(960, 340, 'Poliziotto_Destra')
            .setDisplaySize(78, 112).setDepth(12).setVisible(false);


        this.money = this.add.text(535, 345, '💰', { fontSize: '28px' })
            .setOrigin(0.5).setDepth(12).setVisible(false);


        this.handcuffs = this.add.text(650, 340, '⛓️', { fontSize: '22px' })
            .setOrigin(0.5).setDepth(13).setVisible(false);

        this.cameras.main.setZoom(1.04);
        this.cameras.main.fadeIn(1200, 0, 0, 0);


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
            {
                who: 'narrator', name: '',
                text: 'Palermo, sera. La cameriera entra nel ristorante con una borsa piena di soldi.',
                hide: true, action: 'arrive'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'Signor Calogero! Ce l\'ho fatta! Ho messo da parte 15.000€!'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Ragazza... non ci credo. Sei riuscita a guadagnare tutto quel denaro?'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'Sì! Ogni giorno, ogni cliente, ogni mancia. Ho lavorato per riprendere questo posto.'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Sei una donna straordinaria. Ma... temo che gli uomini d\'affari non la prenderanno bene.',
                action: 'showMoney'
            },
            {
                who: 'narrator', name: '',
                text: 'La porta si spalanca. I due uomini d\'affari entrano nel locale.',
                hide: true, action: 'enterBad'
            },
            {
                who: 'businessman', name: 'Uomo d\'affari',
                text: 'Eccola. La cameriera che voleva fare la furba. Quei soldi non basteranno.'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'Come sarebbe a dire? Il debito era di 15.000€! Ho i soldi qui!'
            },
            {
                who: 'businessman2', name: 'Secondo uomo',
                text: 'Il debito è cresciuto. Gli interessi sono al 200%. Ora ci devi 45.000€.'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Ma è usura! Non potete fare questo!'
            },
            {
                who: 'businessman', name: 'Uomo d\'affari',
                text: 'Noi facciamo ciò che vogliamo, vecchio. E tu, ragazza, dacci quei soldi.'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'Non vi darò niente. Questi soldi sono per il Signor Calogero.'
            },
            {
                who: 'narrator', name: '',
                text: 'Improvvisamente, la porta si spalanca di nuovo. Due poliziotti entrano nel locale.',
                hide: true, action: 'enterPolice'
            },
            {
                who: 'police1', name: 'Commissario',
                text: 'Fermi tutti! Siete in arresto per usura, estorsione e associazione a delinquere.'
            },
            {
                who: 'businessman', name: 'Uomo d\'affari',
                text: 'Cosa?! Su quale base? Non avete prove!'
            },
            {
                who: 'police1', name: 'Commissario',
                text: 'Abbiamo registrato tutto. Le minacce, le richieste, l\'usura. Anni di indagini.'
            },
            {
                who: 'police2', name: 'Agente',
                text: 'Mettete le mani dietro la schiena. Siete in arresto.',
                action: 'arrest'
            },
            {
                who: 'businessman2', name: 'Secondo uomo',
                text: 'Non potete farci questo! Noi abbiamo avvocati! Noi... noi...'
            },
            {
                who: 'police1', name: 'Commissario',
                text: 'I vostri beni sono stati confiscati. Ogni proprietà, ogni conto, ogni debito.',
                action: 'confiscate'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'Quindi... il debito del Signor Calogero?'
            },
            {
                who: 'police1', name: 'Commissario',
                text: 'Cancellato. I debiti usurai non sono legalmente validi. E questi 15.000€ sono tuoi.'
            },
            {
                who: 'narrator', name: '',
                text: 'I poliziotti portano via i due uomini d\'affari. Il locale torna silenzioso.',
                hide: true, action: 'policeLeave'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Ragazza... non so come ringraziarti. Hai salvato il mio ristorante.'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'È il mio ristorante adesso, no? Ho lavorato per questo.'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Hai ragione. E io sono vecchio. Non posso più gestirlo come una volta.'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Per questo... te lo lascio in eredità. Il ristorante è tuo, per sempre.',
                action: 'giveRestaurant'
            },
            {
                who: 'waitress', name: 'Cameriera',
                text: 'Signor Calogero... non so cosa dire. Grazie. Grazie di tutto.'
            },
            {
                who: 'owner', name: 'Signor Calogero',
                text: 'Sei tu che devi ringraziare te stessa. Hai dimostrato di meritarlo.',
                action: 'hug'
            },
            {
                who: 'narrator', name: '',
                text: 'E così, la cameriera divenne la nuova proprietaria del ristorante. La sua avventura era appena iniziata.',
                hide: true, action: 'closing'
            }
        ];

        this.currentLine = 0;
        this.isTyping = false;
        this.canAdvance = false;
        this.badEntered = false;
        this.policeEntered = false;

        this.input.on('pointerdown', () => this.advance());
        this.input.keyboard.on('keydown-SPACE', event => { event.stopPropagation(); this.advance(); });
        this.input.keyboard.on('keydown-ENTER', event => { event.stopPropagation(); this.advance(); });
        this.input.keyboard.on('keydown-ESC', event => { event.stopPropagation(); this.endCutscene(); });

        this.time.delayedCall(1500, () => {
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

        if (this.typingTimer) this.typingTimer.remove();
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
        } else if (action === 'showMoney') {
            this.money.setVisible(true).setScale(0);
            this.tweens.add({
                targets: this.money,
                x: 300, y: 300,
                scaleX: 1.5, scaleY: 1.5,
                duration: 800,
                ease: 'Back.easeOut'
            });
            this.tweens.add({ targets: this.owner, x: 515, duration: 500, yoyo: true, ease: 'Sine.easeInOut' });
        } else if (action === 'enterBad') {
            if (typeof window.triggerSfx === 'function') window.triggerSfx('alert');
            this.badEntered = true;
            this.door.setFillStyle(0x3a2015);
            this.businessman.setVisible(true).setAlpha(0).x = 900;
            this.businessman2.setVisible(true).setAlpha(0).x = 950;
            this.tweens.add({
                targets: this.businessman,
                x: 620, alpha: 1, duration: 900, ease: 'Cubic.easeOut'
            });
            this.tweens.add({
                targets: this.businessman2,
                x: 700, alpha: 1, duration: 1100, delay: 180, ease: 'Cubic.easeOut'
            });
            this.tweens.add({
                targets: this.cameras.main, zoom: 1.12, duration: 700, yoyo: true, ease: 'Sine.easeInOut'
            });
            this.cameras.main.shake(400, 0.008);
        } else if (action === 'enterPolice') {
            if (typeof window.triggerSfx === 'function') window.triggerSfx('alert');
            this.policeEntered = true;
            this.door.setFillStyle(0x2a3a5a);
            this.police1.setVisible(true).setAlpha(0).x = 900;
            this.police2.setVisible(true).setAlpha(0).x = 960;
            this.tweens.add({
                targets: this.police1,
                x: 420, y: 340, alpha: 1, duration: 700, ease: 'Cubic.easeOut'
            });
            this.tweens.add({
                targets: this.police2,
                x: 200, y: 340, alpha: 1, duration: 800, delay: 150, ease: 'Cubic.easeOut'
            });
            this.tweens.add({
                targets: this.cameras.main, zoom: 1.15, duration: 500, yoyo: true, ease: 'Sine.easeInOut'
            });
            this.cameras.main.flash(400, 255, 255, 255, false);
        } else if (action === 'arrest') {
            this.handcuffs.setVisible(true).setAlpha(0);
            this.tweens.add({
                targets: this.handcuffs,
                alpha: 1, scaleX: 1.3, scaleY: 1.3,
                duration: 400, yoyo: true, repeat: 2
            });

            this.tweens.add({
                targets: [this.businessman, this.businessman2],
                y: 380, duration: 600, ease: 'Cubic.easeIn'
            });
        } else if (action === 'confiscate') {

            this.tweens.add({
                targets: this.money,
                x: 245, y: 300, scaleX: 2, scaleY: 2,
                duration: 1000, ease: 'Cubic.easeInOut'
            });

            const confiscated = this.add.text(620, 340, '💰💰', { fontSize: '22px' })
                .setOrigin(0.5).setDepth(13).setAlpha(0);
            this.tweens.add({
                targets: confiscated,
                alpha: 1, y: 300,
                duration: 600,
                onComplete: () => {
                    this.tweens.add({
                        targets: confiscated,
                        x: 245, y: 320,
                        duration: 900,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => confiscated.destroy()
                    });
                }
            });
        } else if (action === 'policeLeave') {
            this.tweens.add({
                targets: [this.police1, this.police2],
                x: 900, alpha: 0,
                duration: 1200, delay: 400
            });

            this.tweens.add({
                targets: [this.businessman, this.businessman2],
                x: 900, alpha: 0,
                duration: 1200, delay: 200,
                onComplete: () => {
                    if (this.businessman) this.businessman.destroy();
                    if (this.businessman2) this.businessman2.destroy();
                    if (this.police1) this.police1.destroy();
                    if (this.police2) this.police2.destroy();
                    this.handcuffs.destroy();
                }
            });
        } else if (action === 'giveRestaurant') {

            const contract = this.add.text(535, 300, '📜', { fontSize: '28px' })
                .setOrigin(0.5).setDepth(13).setAlpha(0);
            this.tweens.add({
                targets: contract,
                alpha: 1, scaleX: 1.2, scaleY: 1.2,
                duration: 500,
                onComplete: () => {
                    this.tweens.add({
                        targets: contract,
                        x: 245, y: 320,
                        duration: 1000,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => contract.destroy()
                    });
                }
            });
            this.tweens.add({
                targets: this.owner,
                alpha: 0.7,
                duration: 600, yoyo: true
            });
        } else if (action === 'hug') {

            this.tweens.add({
                targets: this.waitress,
                x: 480, duration: 800, ease: 'Cubic.easeInOut'
            });
            this.tweens.add({
                targets: this.owner,
                x: 500, duration: 800, ease: 'Cubic.easeInOut'
            });
        } else if (action === 'closing') {
            this.tweens.add({ targets: this.cameras.main, zoom: 1, duration: 900, ease: 'Sine.easeInOut' });
        }
    }

    highlightSpeaker(who) {
        if (this.waitress) this.waitress.setAlpha(0.5);
        if (this.owner) this.owner.setAlpha(0.5);
        if (this.businessman && this.badEntered) this.businessman.setAlpha(who === 'businessman' ? 1 : 0.72);
        if (this.businessman2 && this.badEntered) this.businessman2.setAlpha(who === 'businessman2' ? 1 : 0.62);
        if (this.police1 && this.policeEntered) this.police1.setAlpha(who === 'police1' ? 1 : 0.75);
        if (this.police2 && this.policeEntered) this.police2.setAlpha(who === 'police2' ? 1 : 0.75);

        if (who === 'waitress' && this.waitress) this.waitress.setAlpha(1);
        if (who === 'owner' && this.owner) this.owner.setAlpha(1);
    }

    endCutscene() {
        if (this._endingCutscene) return;
        this._endingCutscene = true;
        this.input.enabled = false;


        localStorage.setItem('waitress_ending_seen', 'true');
        localStorage.setItem('waitress_story_completed', 'true');


        if (window.GAME) {
            window.GAME.hasWon = true;
            window.GAME.finalScore = window.GAME.score;
        }

        this.cameras.main.fadeOut(1500, 0, 0, 0);
        this.time.delayedCall(1500, () => {
            this.scene.start('Credits');
        });
    }
}

window.EndingScene = EndingScene;