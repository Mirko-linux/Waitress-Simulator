// tilemap.js - Versione corretta per 800x600 (25x19 tile da 32px)
// CON PORTA DI INGRESSO E FISSA

class TilemapSystem {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 32;

        // DIMENSIONI ESATTE PER 800x600
        this.mapWidth = 25;  // 800 / 32 = 25
        this.mapHeight = 19; // 608 / 32 = 19 (copre i 600px e un po' di bordo)
        
        this.mapData = [];
        this.collisionLayer = [];
        this.wallGroup = null;

        this.initMap();
    }

    initMap() {
        this.mapData = [];
        this.collisionLayer = [];

        for (let row = 0; row < this.mapHeight; row++) {
            this.mapData[row] = [];
            this.collisionLayer[row] = [];

            for (let col = 0; col < this.mapWidth; col++) {
                let floorType = 0; // 0 = sala, 1 = cucina, 2 = bagno
                let isWall = false;

                // --- 1. MURI ESTERNI (tutti i bordi) ---
                if (row === 0 || row === this.mapHeight - 1 || col === 0 || col === this.mapWidth - 1) {
                    isWall = true;
                    floorType = 0; 
                }

                // --- 2. PORTA DI INGRESSO (in basso a sinistra) ---
                // Riga 18 (ultima riga), colonne da 6 a 8
                if (row === this.mapHeight - 1 && col >= 6 && col <= 8) {
                    isWall = false;
                    floorType = 0; // Pavimento sala
                }

                // --- 3. ZONA CUCINA (a destra, da colonna 19 a 23) ---
                if (col >= 19 && col <= 23 && !isWall) {
                    floorType = 1; // Pavimento cucina
                }

                // --- 4. MURI INTERNI (Separazione Sala/Cucina) ---
                // Muro verticale alla colonna 18 (tra sala e cucina)
                if (col === 18 && !isWall) {
                    isWall = true;
                    // Creiamo un passaggio (porta) tra le righe 9, 10, 11 (centro)
                    if (row >= 8 && row <= 10) {
                        isWall = false;
                        floorType = 0; // Passaggio sala
                    }
                }

                // --- 5. ZONA BAGNO (in basso a destra, colonne 19-21, righe 15-17) ---
                if (col >= 19 && col <= 21 && row >= 15 && row <= 17 && !isWall) {
                    floorType = 2; // Pavimento bagno
                }
                // Muro del bagno (in alto)
                if (col >= 19 && col <= 21 && row === 14 && !isWall) {
                    isWall = true;
                    if (col === 20) {
                        isWall = false; // Porta del bagno al centro
                    }
                }
                // Muro del bagno (sinistra)
                if (col === 18 && row >= 15 && row <= 17 && !isWall) {
                    isWall = true;
                }

                // --- 6. ZONA LAVELLO PIATTI (in basso a sinistra) ---
                // Lasciamo lo spazio libero per il lavello in basso a sinistra

                this.mapData[row][col] = floorType;
                this.collisionLayer[row][col] = isWall;
            }
        }
    }

    createTileMap() {
        this.destroy();

        if (this.scene.physics) {
            this.wallGroup = this.scene.physics.add.staticGroup();
        }

        // Sfondo nero di base per evitare il vuoto
        this.scene.add.rectangle(400, 300, 800, 600, 0x000000).setDepth(-10);

        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const x = col * this.tileSize + this.tileSize / 2;
                const y = row * this.tileSize + this.tileSize / 2;
                const floorType = this.mapData[row][col];
                let floorKey = null;

                if (floorType === 0) floorKey = 'floor_sala';
                else if (floorType === 1) floorKey = 'floor_cucina';
                else if (floorType === 2) floorKey = 'floor_bagno';

                // Disegna il pavimento
                if (floorKey && this.scene.textures.exists(floorKey)) {
                    const floor = this.scene.add.image(x, y, floorKey);
                    floor.setOrigin(0.5, 0.5);
                    floor.setDisplaySize(this.tileSize, this.tileSize);
                    floor.setDepth(0);
                }

                // Disegna il muro e la fisica
                if (this.collisionLayer[row][col]) {
                    if (this.scene.textures.exists('wall')) {
                        const wall = this.wallGroup.create(x, y, 'wall');
                        wall.setOrigin(0.5, 0.5);
                        wall.setDisplaySize(this.tileSize, this.tileSize);
                        wall.setDepth(1);
                        if (wall.body) {
                            wall.body.setSize(this.tileSize, this.tileSize);
                            wall.body.setOffset(0, 0);
                            wall.refreshBody();
                        }
                    } else {
                        // Fallback: se manca l'immagine del muro, disegna un rettangolo nero
                        const wallRect = this.scene.add.rectangle(x, y, this.tileSize, this.tileSize, 0x111111).setDepth(1);
                        this.wallGroup.create(x, y, null).setSize(this.tileSize, this.tileSize).setVisible(false);
                    }
                }
            }
        }
    }

    isWalkable(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        if (col < 0 || col >= this.mapWidth || row < 0 || row >= this.mapHeight) return false;
        return !this.collisionLayer[row][col];
    }

    worldToTile(x, y) {
        return { col: Math.floor(x / this.tileSize), row: Math.floor(y / this.tileSize) };
    }

    tileToWorld(col, row) {
        return { x: col * this.tileSize + this.tileSize / 2, y: row * this.tileSize + this.tileSize / 2 };
    }

    destroy() {
        if (this.wallGroup) {
            this.wallGroup.clear(true, true);
            this.wallGroup = null;
        }
    }
}

window.TilemapSystem = TilemapSystem;