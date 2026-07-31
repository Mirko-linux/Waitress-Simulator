// ============================================
// BATHROOM SYSTEM - Sistema Vescica Realistico
// ============================================
class BathroomSystem {
    constructor(scene) {
        this.scene = scene;
        this.needIncrementRate = 0.15; // Incremento per secondo
        
        // --- POSIZIONE BAGNO (SOTTO LA SPILLATRICE) ---
        // Dalla tua immagine, la spillatrice è a X~690, Y~320. 
        // Il bagno sarà subito sotto, occupando l'angolo in basso a destra.
        this.bathroomDoorX = 690; // Porta d'ingresso
        this.bathroomDoorY = 420;
        
        this.bathroomX = 750; // Punto esatto dove va il cliente
        this.bathroomY = 540;
        
        this.bathroomOccupied = false;
        this.occupiedText = null;
        
        this.createBathroomGraphics();
    }

    createBathroomGraphics() {
        const scene = this.scene;
        
        // 1. DISEGNIAMO LE PIASTRELLE DEL BAGNO (CAMBIA COLORE)
        // Occupiamo la zona sotto la birra (dalla Y 390 fino a 600)
        for (let y = 4; y < 6; y++) {
            for (let x = 7; x < 8; x++) {
                const color = (x + y) % 2 === 0 ? 0x7f8c8d : 0x95a5a6; // Grigio chiaro
                scene.add.rectangle(x * 100 + 50, y * 100 + 50, 100, 100, color).setDepth(0);
            }
        }

        // 2. MURI DEL BAGNO
        // Muro di sinistra (sotto la parete della cucina)
        const leftWall = scene.add.rectangle(630, 480, 16, 140, 0x1a252f).setDepth(2);
        leftWall.setStrokeStyle(2, 0x2c3e50);
        
        // Muro in basso (bordo schermo) - giusto per estetica
        const bottomWall = scene.add.rectangle(730, 610, 140, 16, 0x1a252f).setDepth(2);

        // 3. SAGOMA DELLA PORTA (con effetto apertura)
        // La porta è larga 40px, in basso a sinistra del bagno
        this.doorFrame = scene.add.rectangle(this.bathroomDoorX, this.bathroomDoorY, 40, 60, 0x2c3e50).setDepth(3);
        this.doorFrame.setStrokeStyle(2, 0x7f8c8d);

        // 4. CUBICOLO DEL WC
        // Colore marrone scuro legno
        const cubicleBg = scene.add.rectangle(730, 540, 55, 60, 0x3d2518).setDepth(3);
        cubicleBg.setStrokeStyle(2, 0x5c2c16);
        
        // Il WC vero e proprio (acqua + tazza)
        scene.add.text(730, 540, '🚽', {
            fontSize: '32px'
        }).setOrigin(0.5).setDepth(4);
        
        // Un po' di carta igienica decorativa
        scene.add.text(745, 520, '🧻', {
            fontSize: '12px'
        }).setOrigin(0.5).setDepth(4);

        // 5. CARTELLINO "WC" E INDICATORE DI OCCUPATO
        // Testo sopra la porta
        this.signText = scene.add.text(this.bathroomDoorX, this.bathroomDoorY - 30, '🚻 WC', {
            fontSize: '12px', color: '#1abc9c', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(4);
        
        // Testo "OCCUPATO" che appare quando qualcuno è dentro
        this.occupiedText = scene.add.text(this.bathroomDoorX, this.bathroomDoorY - 55, 'OCCUPATO', {
            fontSize: '10px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka', backgroundColor: '#110906', padding: {x: 4, y: 2}
        }).setOrigin(0.5).setDepth(5).setVisible(false);
    }

    // Chiamato ogni frame dal GameScene
    update(time, delta) {
        if (!this.scene.gameActive) return;
        const deltaSec = delta / 1000;

        this.scene.customers.forEach(customer => {
            if (!customer || customer.isInBathroom || customer.isDead) return; // Se è in bagno o andato via

            // Determina la velocità di riempimento (Donne più veloci)
            let rate = this.needIncrementRate;
            if (customer.gender === 'female') {
                rate *= 1.4; // Le donne vanno in bagno il 40% più velocemente
            }

            customer.bladder += rate * deltaSec;
            if (customer.bladder > 100) customer.bladder = 100;

            this.updateBathroomBubble(customer);

            const threshold = customer.gender === 'female' ? 78 : 98;
            if (customer.bladder >= threshold && !customer.isInBathroom) {
                this.goToBathroom(customer);
            }
        });
    }

    updateBathroomBubble(customer) {
        if (customer.bladder > 60 && !customer.bubbleIcon) {
            customer.bubbleIcon = this.scene.add.text(customer.x, customer.y - 35, '🚽', {
                fontSize: '26px'
            }).setOrigin(0.5).setDepth(10);
            
        } else if (customer.bladder <= 60 && customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }
    }

    goToBathroom(customer) {
        if (this.bathroomOccupied) {
            // Se occupato, il cliente aspetta fuori e soffre di più
            customer.patience -= 0.6; 
            return;
        }

        this.bathroomOccupied = true;
        customer.isInBathroom = true;
        this.occupiedText.setVisible(true);
        
        if (customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }

        // Animazione del cliente verso la porta del bagno
        this.scene.tweens.add({
            targets: customer,
            x: this.bathroomDoorX,
            y: this.bathroomDoorY + 10,
            duration: 600,
            ease: 'Quad.easeIn',
            onComplete: () => {
                // "Scompare" dentro il bagno spostandolo fuori schermo visivamente (o lo lasci lì)
                customer.x = this.bathroomX;
                customer.y = this.bathroomY;
                
                const stayTime = Phaser.Math.Between(3500, 6000);
                
                // La pazienza non cala mentre è in bagno
                if (customer.timerEvent) {
                    customer.timerEvent.paused = true;
                }

                this.scene.time.delayedCall(stayTime, () => {
                    // Esce dal bagno
                    this.occupiedText.setVisible(false);
                    this.bathroomOccupied = false;
                    customer.isInBathroom = false;
                    customer.bladder = 0; 
                    
                    if (customer.timerEvent) {
                        customer.timerEvent.paused = false;
                    }

                    // Torna al tavolo
                    this.scene.tweens.add({
                        targets: customer,
                        x: customer.table.x,
                        y: customer.table.y,
                        duration: 600,
                        ease: 'Quad.easeOut'
                    });
                });
            }
        });
    }
}