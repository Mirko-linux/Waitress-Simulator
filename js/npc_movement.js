// npc_movement.js - Sistema di movimento AI per NPC

class NPCMovementController {
    constructor(scene, npc) {
        this.scene = scene;
        this.npc = npc;
        
        // Configurazione movimento
        this.speed = npc.speed || 100;
        this.path = [];
        this.currentPathIndex = 0;
        this.isMoving = false;
        this.targetPosition = null;
        this.lastDirection = 'down'; // 'up', 'down', 'left', 'right'
        
        // Animazioni direzionali (se disponibili)
        this.animKeys = {
            up: `${npc.tilesheetKey}_up`,
            down: `${npc.tilesheetKey}_down`,
            left: `${npc.tilesheetKey}_left`,
            right: `${npc.tilesheetKey}_right`
        };
        
        // Textures statiche (se non hai animazioni, usa immagini singole)
        this.textureKeys = {
            up: npc.textureUp || `${npc.name}_Dietro.png`,
            down: npc.textureDown || `${npc.name}_Avanti.png`,
            left: npc.textureLeft || `${npc.name}_Sinistra.png`,
            right: npc.textureRight || `${npc.name}_Destra.png`
        };
        
        // Sistema di pathfinding
        this.pathfinder = new GridPathfinder(scene.tilemap);
        
        // Timer per il movimento
        this.moveTimer = 0;
        this.updateInterval = 100; // ms
    }
    
    // Imposta una destinazione e calcola il percorso
    setDestination(targetX, targetY, callback = null) {
        // Converti in coordinate tile
        const startTile = this.scene.tilemap.worldToTile(this.npc.x, this.npc.y);
        const endTile = this.scene.tilemap.worldToTile(targetX, targetY);
        
        // Calcola percorso A*
        this.path = this.pathfinder.findPath(startTile, endTile);
        
        if (this.path.length > 0) {
            this.isMoving = true;
            this.currentPathIndex = 0;
            this.targetPosition = { x: targetX, y: targetY };
            this.callback = callback;
            console.log(`🦶 ${this.npc.name} parte verso (${targetX}, ${targetY}) - percorso ${this.path.length} tiles`);
        } else {
            console.log(`⚠️ ${this.npc.name} non trova percorso per (${targetX}, ${targetY})`);
            if (callback) callback(false);
        }
    }
    
    // Aggiorna il movimento (chiamato ogni frame)
    update(delta) {
        if (!this.isMoving || !this.npc || !this.npc.sprite) return;
        
        this.moveTimer += delta;
        if (this.moveTimer < this.updateInterval) return;
        this.moveTimer = 0;
        
        // Se non c'è path, ferma il movimento
        if (this.path.length === 0 || this.currentPathIndex >= this.path.length) {
            this.stopMoving();
            if (this.callback) this.callback(true);
            return;
        }
        
        // Ottieni il prossimo punto del percorso
        const nextTile = this.path[this.currentPathIndex];
        const targetX = nextTile.x * this.scene.tilemap.tileSize + this.scene.tilemap.tileSize / 2;
        const targetY = nextTile.y * this.scene.tilemap.tileSize + this.scene.tilemap.tileSize / 2;
        
        // Calcola la direzione del movimento
        const dx = targetX - this.npc.x;
        const dy = targetY - this.npc.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            // Arrivato al tile successivo
            this.currentPathIndex++;
            return;
        }
        
        // Normalizza la direzione
        const vx = dx / distance;
        const vy = dy / distance;
        
        // Muovi lo sprite
        const newX = this.npc.x + vx * this.speed * (delta / 1000);
        const newY = this.npc.y + vy * this.speed * (delta / 1000);
        
        // Aggiorna posizione
        if (this.npc.sprite) {
            this.npc.sprite.x = newX;
            this.npc.sprite.y = newY;
        }
        
        // Aggiorna direzione per l'animazione
        this.updateDirection(vx, vy);
        
        // Aggiorna profondità (y-sorting)
        if (this.npc.sprite) {
            this.npc.sprite.setDepth(newY);
        }
    }
    
    // Aggiorna la direzione e cambia texture/animazione
    updateDirection(vx, vy) {
        const horizontal = Math.abs(vx) > Math.abs(vy);
        
        if (horizontal) {
            this.lastDirection = vx > 0 ? 'right' : 'left';
        } else {
            this.lastDirection = vy > 0 ? 'down' : 'up';
        }
        
        // Prova ad usare animazioni, altrimenti texture statiche
        if (this.npc.sprite) {
            const key = this.animKeys[this.lastDirection];
            if (key && this.scene.anims.exists(key)) {
                if (this.npc.sprite.anims.currentAnim?.key !== key) {
                    this.npc.sprite.play(key);
                }
            } else {
                const texKey = this.textureKeys[this.lastDirection];
                if (texKey && this.scene.textures.exists(texKey)) {
                    if (this.npc.sprite.texture.key !== texKey) {
                        this.npc.sprite.setTexture(texKey);
                    }
                }
            }
        }
    }
    
    // Ferma il movimento
    stopMoving() {
        this.isMoving = false;
        this.path = [];
        this.currentPathIndex = 0;
        
        // Opzionale: ferma l'animazione di camminata
        if (this.npc.sprite && this.scene.anims.exists(`${this.npc.tilesheetKey}_idle`)) {
            this.npc.sprite.play(`${this.npc.tilesheetKey}_idle`);
        }
    }
}

// Pathfinding A* su griglia
class GridPathfinder {
    constructor(tilemap) {
        this.tilemap = tilemap;
    }
    
    findPath(start, end) {
        if (!this.tilemap) return [];
        
        const openSet = [];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const key = (x, y) => `${x},${y}`;
        
        // Aggiungi il nodo di partenza
        openSet.push(start);
        gScore.set(key(start.col, start.row), 0);
        fScore.set(key(start.col, start.row), this.heuristic(start, end));
        
        while (openSet.length > 0) {
            // Trova il nodo con fScore minore
            let current = openSet[0];
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                if (fScore.get(key(openSet[i].col, openSet[i].row)) < 
                    fScore.get(key(current.col, current.row))) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            // Se siamo arrivati a destinazione
            if (current.col === end.col && current.row === end.row) {
                return this.reconstructPath(cameFrom, current);
            }
            
            // Sposta dalla open set alla closed set
            openSet.splice(currentIndex, 1);
            closedSet.add(key(current.col, current.row));
            
            // Esplora i vicini
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                const neighborKey = key(neighbor.col, neighbor.row);
                
                if (closedSet.has(neighborKey)) continue;
                if (!this.isWalkable(neighbor)) continue;
                
                const tentativeG = (gScore.get(key(current.col, current.row)) || 0) + 1;
                
                if (!openSet.some(node => node.col === neighbor.col && node.row === neighbor.row) ||
                    tentativeG < (gScore.get(neighborKey) || Infinity)) {
                    
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeG);
                    fScore.set(neighborKey, tentativeG + this.heuristic(neighbor, end));
                    
                    if (!openSet.some(node => node.col === neighbor.col && node.row === neighbor.row)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        
        return []; // Nessun percorso trovato
    }
    
    heuristic(a, b) {
        // Distanza Manhattan
        return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
    }
    
    getNeighbors(tile) {
        const neighbors = [];
        const dirs = [
            { col: 1, row: 0 },  // Destra
            { col: -1, row: 0 }, // Sinistra
            { col: 0, row: 1 },  // Giù
            { col: 0, row: -1 }, // Su
            // Diagonali (opzionali)
            { col: 1, row: 1 },
            { col: -1, row: 1 },
            { col: 1, row: -1 },
            { col: -1, row: -1 }
        ];
        
        for (const dir of dirs) {
            neighbors.push({
                col: tile.col + dir.col,
                row: tile.row + dir.row
            });
        }
        
        return neighbors;
    }
    
    isWalkable(tile) {
        if (!this.tilemap.collisionLayer) return true;
        
        if (tile.col < 0 || tile.col >= this.tilemap.mapWidth ||
            tile.row < 0 || tile.row >= this.tilemap.mapHeight) {
            return false;
        }
        
        return !this.tilemap.collisionLayer[tile.row][tile.col];
    }
    
    reconstructPath(cameFrom, current) {
        const path = [];
        let node = current;
        
        while (node) {
            path.unshift(node);
            const parent = cameFrom.get(`${node.col},${node.row}`);
            node = parent;
        }
        
        return path;
    }
}

// Esponi le classi globalmente
window.NPCMovementController = NPCMovementController;
window.GridPathfinder = GridPathfinder;