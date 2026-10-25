class MissionSystem {
    constructor(scene) {
        this.scene = scene;
        this.catalog = this.readCatalog();
        this.definitions = {};
        this.catalog.forEach(mission => {
            if (mission && mission.id) {
                this.definitions[mission.id] = mission;
            }
        });
        this.state = this.loadState();
        this.sanitizeState();
        this._lastElenaCheck = 0;
    }

    readCatalog() {
        const fallback = [
            { id: 'main_restaurant', type: 'primary', exclusive: false, activation: { kind: 'story', day: 3 } },
            { id: 'sponsor_moroni', type: 'secondary', exclusive: true, activation: { kind: 'day', day: 8 } },
            { id: 'briscola_rosa', type: 'secondary', exclusive: true, activation: { kind: 'day', day: 11 } },
            { id: 'clan_first', type: 'secondary', exclusive: true, activation: { kind: 'day', minDay: 5, avoidDays: [8, 11] } },
            { id: 'elena_adoption', type: 'secondary', exclusive: false, activation: { kind: 'relationship', npc: 'Elena', target: 100, requiresAllCustomers: 100, minMoney: 15000 } },
            { id: 'clan_second', type: 'secondary', exclusive: true, activation: { kind: 'event', event: 'clan_first_completed' } }
        ];

        const cache = this.scene && this.scene.cache && this.scene.cache.json;
        const data = cache && typeof cache.get === 'function' ? cache.get('missions') : null;
        if (!data) return fallback;

        const missions = [];
        if (Array.isArray(data.primary)) missions.push(...data.primary);
        if (Array.isArray(data.secondary)) missions.push(...data.secondary);
        if (Array.isArray(data.missions)) missions.push(...data.missions);
        return missions.length > 0 ? missions : fallback;
    }

    loadState() {
        const base = { active: null, completed: [], failed: [] };
        try {
            const raw = localStorage.getItem('waitress_missions_data');
            if (!raw) return base;
            const data = JSON.parse(raw);
            return {
                active: data.active || null,
                completed: Array.isArray(data.completed) ? data.completed : [],
                failed: Array.isArray(data.failed) ? data.failed : []
            };
        } catch (e) {
            return base;
        }
    }

    sanitizeState() {
        if (this.state.active && !this.definitions[this.state.active]) {
            this.state.active = null;
        }
        this.state.completed = this.state.completed.filter(id => this.definitions[id]);
        this.state.failed = this.state.failed.filter(id => this.definitions[id]);
    }

    saveState() {
        try {
            localStorage.setItem('waitress_missions_data', JSON.stringify(this.state));
        } catch (e) {}
    }

    getDefinition(id) {
        return this.definitions[id] || null;
    }

    getActiveMissionId() {
        const scene = this.scene;
        const briscola = scene && scene.briscolaSystem;
        if (briscola && (briscola.missionStarted || briscola.pendingBriscola) && !briscola.missionComplete && !briscola.missionFailed) {
            return 'briscola_rosa';
        }

        const sponsor = scene && scene.sponsorSystem;
        if (sponsor && typeof sponsor.isMissionActive === 'function' && sponsor.isMissionActive()) {
            return 'sponsor_moroni';
        }

        const crime = scene && scene.crime;
        if (crime && crime.hasAcceptedClanMission) {
            return 'clan_first';
        }
        if (crime && crime.clanSecondTaskActive) {
            return 'clan_second';
        }

        if (this.state.active === 'elena_adoption' && !this.isCompleted('elena_adoption') && !this.isFailed('elena_adoption')) {
            const definition = this.getDefinition('elena_adoption');
            if (definition && definition.exclusive !== false) {
                return 'elena_adoption';
            }
        }

        return null;
    }

    isActive(id) {
        return this.getActiveMissionId() === id;
    }

    isCompleted(id) {
        return this.state.completed.includes(id);
    }

    isFailed(id) {
        return this.state.failed.includes(id);
    }

    canStart(id) {
        const definition = this.getDefinition(id);
        if (!definition) return false;
        if (this.isCompleted(id) || this.isFailed(id)) return false;
        if (!this.canActivate(definition)) return false;
        if (definition.exclusive === false) return true;
        const active = this.getActiveMissionId();
        return !active || active === id;
    }

    canActivate(definition) {
        const activation = definition.activation || {};
        const day = window.GAME ? window.GAME.level : 0;
        const score = window.GAME ? window.GAME.score : 0;

        if (activation.kind === 'day') {
            if (typeof activation.day === 'number' && day !== activation.day) return false;
            if (typeof activation.minDay === 'number' && day < activation.minDay) return false;
            if (Array.isArray(activation.avoidDays) && activation.avoidDays.includes(day)) return false;
            if (Array.isArray(activation.onlyDays) && !activation.onlyDays.includes(day)) return false;
        }

        if (activation.kind === 'money') {
            if (score < activation.target) return false;
        }

        if (activation.kind === 'relationship') {
            if (score < (activation.minMoney || 0)) return false;
            const customers = this.scene.customers || [];
            if (activation.requiresAllCustomers && customers.length > 0) {
                const allReady = customers.every(customer => customer && customer.relationScore >= activation.requiresAllCustomers);
                if (!allReady) return false;
            }
            if (activation.npc) {
                const customer = customers.find(item => item && item.name === activation.npc);
                if (!customer || customer.relationScore < activation.target) return false;
            }
        }

        return true;
    }

    activate(id) {
        if (!this.canStart(id)) return false;
        this.state.active = id;
        this.state.failed = this.state.failed.filter(item => item !== id);
        this.saveState();
        return true;
    }

    cancel(id) {
        if (this.state.active === id) {
            this.state.active = null;
            this.saveState();
        }
    }

    complete(id) {
        if (this.state.active === id) this.state.active = null;
        if (!this.state.completed.includes(id)) this.state.completed.push(id);
        this.state.failed = this.state.failed.filter(item => item !== id);
        this.saveState();
    }

    fail(id) {
        if (this.state.active === id) this.state.active = null;
        if (!this.state.failed.includes(id)) this.state.failed.push(id);
        this.saveState();
    }

    startElenaAdoptionQuest() {
        if (this.state.active === 'elena_adoption') return false;
        if (!this.canStart('elena_adoption')) return false;
        return this.activate('elena_adoption');
    }

    update() {
        if (!window.GAME || window.GAME.score < 15000) return;
        if (this.state.active === 'elena_adoption') return;
        if (this.isCompleted('elena_adoption') || this.isFailed('elena_adoption')) return;

        const now = this.scene && this.scene.time ? this.scene.time.now : 0;
        if (now - this._lastElenaCheck < 1000) return;
        this._lastElenaCheck = now;
        this.startElenaAdoptionQuest();
    }
}

window.MissionSystem = MissionSystem;
