(function () {
    'use strict';

    const ARCADE = {
        enabled: false,

        difficulty: 'normale',

        endless: true,
        endlessFromLevel: 10,
        endlessTargetBase: 6,
        endlessTargetGrowth: 4,

        lives: 3,
        startingScore: 0,
        startingLevel: 1,

        patienceDuration: 25000,
        eatingDuration: 12000,
        washDuration: 1200,

        spawnInterval: {
            facile: 11000,
            normale: 9000,
            difficile: 7000
        },

        maxDirtyPlates: 8,
        maxTray: 4,

        maxOrders: {
            base: 1,
            perNotebookLevel: 1
        },

        foodStock: {
            enabled: true,
            baseStock: 20,
            lowStockThreshold: 5,
            restockAmount: 20,
            restockCost: 30
        },

        phone: {
            enabled: true,
            supplierCalls: true,
            storyCalls: false,
            callCenterSound: true
        },

        bathroom: {
            enabled: true,
            bladderDecayPerSecond: 1.2,
            bathroomDuration: 6000
        },

        tutorial: {
            enabled: false,
            forceOnFirstRun: false
        },

        systems: {
            priceSystem: true,
            questSystem: false,
            crimeSystem: false,
            supplierSystem: true,
            storySystem: false,
            radioSystem: false,
            aiDialogueManager: false,
            npcManager: true,
            tutorialSystem: false,
            kitchenSystem: true,
            bathroomSystem: true,
            phoneSystem: true,
            tilemapSystem: true,
            houseSystem: false
        },

        menu: {
            showHouseButton: false,
            showStoryButton: false,
            showRadioButton: false,
            showCrimeButton: false,
            showAdoptionButton: false
        },

        hud: {
            showSuspicion: false,
            showClanSheet: false,
            showStoryProgress: false,
            showRelationship: false
        },

        score: {
            baseServe: 14,
            patienceHighMultiplier: 1.3,
            patienceLowMultiplier: 0.8,
            perfectStreakBonus: 0.2,
            perfectStreakThreshold: 5
        },

        wastePenaltyPerFood: 5,

        save: {
            key: 'waitress_arcade_save',
            autoSave: true,
            autoSaveOnDayComplete: true,
            resetOnNewRun: true
        },

        rank: {
            super: 1.4,
            perfect: 1.1,
            good: 0.8,
            ok: 0
        },

        level: {
            baseTarget: 6,
            targetPerLevel: 4,
            baseRent: 50
        }
    };

    ARCADE.getSpawnInterval = function () {
        const diff = this.difficulty || 'normale';
        return this.spawnInterval[diff] || this.spawnInterval.normale;
    };

    ARCADE.getTargetForLevel = function (level) {
        if (this.endless && level >= this.endlessFromLevel) {
            return this.endlessTargetBase + (level * this.endlessTargetGrowth);
        }
        return this.level.baseTarget + (level * this.level.targetPerLevel);
    };

    ARCADE.getRent = function () {
        return this.level.baseRent;
    };

    ARCADE.getMaxOrders = function (notebookLevel) {
        return this.maxOrders.base + (notebookLevel * this.maxOrders.perNotebookLevel);
    };

    ARCADE.reset = function () {
        if (typeof window.GAME === 'undefined') return;

        this.enabled = true;
        window.GAME.arcadeMode = true;
        window.GAME.score = this.startingScore;
        window.GAME.level = this.startingLevel;
        window.GAME.customersServed = 0;
        window.GAME.customersTarget = this.getTargetForLevel(this.startingLevel);
        window.GAME.lives = this.lives;
        window.GAME.dirtyPlates = 0;
        window.GAME.carriedOrders = [];
        window.GAME.isCheater = false;
        window.GAME.suspicion = 0;
        window.GAME.compartmentHidden = false;
        window.GAME.waste = 0;
        window.GAME.wastePenalty = 0;

        if (!window.GAME.settings) {
            window.GAME.settings = {};
        }
        window.GAME.settings.difficulty = this.difficulty;
    };

    ARCADE.applyConfig = function () {
        const C = window.CONFIG;
        if (!C) return;

        if (C.customers) {
            C.customers.patienceDuration = this.patienceDuration;
            C.customers.eatingDuration = this.eatingDuration;
        }
        if (C.dishes) {
            C.dishes.washDuration = this.washDuration;
            C.dishes.maxDirty = this.maxDirtyPlates;
        }
        if (C.tray) {
            C.tray.maxTotal = this.maxTray;
        }
        if (C.waitress) {
            C.waitress.speed = 300;
        }
    };

    ARCADE.save = function (data) {
        if (!this.save.autoSave) return;
        try {
            localStorage.setItem(this.save.key, JSON.stringify(data));
        } catch (e) {}
    };

    ARCADE.load = function () {
        try {
            const raw = localStorage.getItem(this.save.key);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    };

    ARCADE.clearSave = function () {
        try {
            localStorage.removeItem(this.save.key);
        } catch (e) {}
    };

    ARCADE.isSystemEnabled = function (systemName) {
        if (!this.enabled) return true;
        return this.systems[systemName] === true;
    };

    ARCADE.isStorySystem = function (systemName) {
        const storySystems = [
            'questSystem',
            'crimeSystem',
            'storySystem',
            'radioSystem',
            'aiDialogueManager',
            'tutorialSystem',
            'houseSystem'
        ];
        return storySystems.indexOf(systemName) !== -1;
    };

    ARCADE.enable = function () {
        this.enabled = true;
        window.GAME.arcadeMode = true;
    };

    ARCADE.disable = function () {
        this.enabled = false;
        if (typeof window.GAME !== 'undefined') {
            window.GAME.arcadeMode = false;
        }
    };

    ARCADE.isActive = function () {
        return this.enabled === true;
    };

    window.ARCADE = ARCADE;
})();