// ============================================
// TILEMAP SYSTEM (RISCITTO DA ZERO - FISSO BUG SOVRAPPOSIZIONE)
// ============================================

class TilemapSystem {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 32;
        this.mapWidth = 25;  // 800px / 32
        this.mapHeight = 19; // 600px / 32
        
        this.mapData = [];
        this.collisionLayer = [];
        this.wallGroup = null;
        
        this.initMap();
    }
    
    initMap() {
        for (let row = 0; row < this.mapHeight; row++) {
            this.mapData[row] = [];
            this.collisionLayer[row] = [];
            for (let col = 0; col < this.mapWidth; col++) {
                let isWall = false;
                let tileType = 0; // 0=Sala, 1=Cucina, 2=Bagno, 3=Muro
                
                const isPerimeter = (row === 0 || row === this.mapHeight - 1 || col === 0 || col === this.mapWidth - 1);
                
                if (isPerimeter) {
                    // Ingresso in basso
                    if (row === this.mapHeight - 1 && (col >= 6 && col <= 8)) {
                        tileType = 0;
                        isWall = false;
                    } else {
                        tileType = 3;
                        isWall = true;
                    }
                } else if (col === 18) {
                    // Passaggi verticali
                    if (row >= 5 && row <= 7) {
                        tileType = 1;
                        isWall = false;
                    } else if (row >= 13 && row <= 15) {
                        tileType = 2;
                        isWall = false;
                    } else {
                        tileType = 3;
                        isWall = true;
                    }
                } else if (col > 18) {
                    // Cucina e Bagno
                    if (row < 11) {
                        tileType = 1;
                        isWall = false;
                    } else if (row > 11) {
                        tileType = 2;
                        isWall = false;
                    } else {
                        // Corridoio orizzontale
                        if (col === 21) {
                            tileType = 1;
                            isWall = false;
                        } else {
                            tileType = 3;
                            isWall = true;
                        }
                    }
                } else {
                    // Sala principale
                    tileType = 0;
                    isWall = false;
                }
                
                this.mapData[row][col] = tileType;
                this.collisionLayer[row][col] = isWall;
            }
        }
    }
    
    createTileMap() {
        this.destroy();
        
        if (this.scene.physics) {
            this.wallGroup = this.scene.physics.add.staticGroup();
        }

        // Sfondo generico nero (non si vede mai, ma utile se manca una tile)
        this.scene.add.rectangle(400, 300, 800, 600, 0x000000).setDepth(-1);

        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                // Calcola il centro della tile (32x32)
                const x = col * this.tileSize + (this.tileSize / 2);
                const y = row * this.tileSize + (this.tileSize / 2);
                
                const isWall = this.collisionLayer[row][col];
                const tileType = this.mapData[row][col];

                // --- PAVIMENTI (Disegnati SEMPRE, anche sotto i muri) ---
                let floorKey = null;
                if (tileType === 0) floorKey = 'floor_sala';
                else if (tileType === 1) floorKey = 'floor_cucina';
                else if (tileType === 2) floorKey = 'floor_bagno';

                if (floorKey && this.scene.textures.exists(floorKey)) {
                    const floor = this.scene.add.image(x, y, floorKey);
                    floor.setOrigin(0.5, 0.5); // Centro
                    floor.setDisplaySize(this.tileSize, this.tileSize);
                    floor.setDepth(0); // In fondo a tutto
                }

                // --- MURI (Disegnati SOPRA il pavimento, ma solo se tileType === 3) ---
                if (isWall) {
                    // Il muro usa la texture 'wall'
                    if (this.scene.textures.exists('wall')) {
                        const wall = this.wallGroup.create(x, y, 'wall');
                        wall.setOrigin(0.5, 0.5); // IMPORTANTE: Centro uguale al pavimento!
                        wall.setDisplaySize(this.tileSize, this.tileSize);
                        wall.setDepth(1); // Un livello sopra il pavimento
                        
                        // FISSA IL BUG DELLO SPAZIO VUOTO:
                        // Phaser di default sposta il corpo se l'immagine è storta.
                        // Qui resettiamo il corpo esattamente al centro.
                        wall.body.setSize(this.tileSize, this.tileSize);
                        wall.body.setOffset(0, 0); 
                        
                        wall.refreshBody();
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

    destroy() {
        if (this.wallGroup) {
            this.wallGroup.clear(true, true);
            this.wallGroup = null;
        }
    }
}

window.TilemapSystem = TilemapSystem;