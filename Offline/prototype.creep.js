/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.creep');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {
	Object.defineProperty(Creep.prototype, 'tier', {
		get: function() {
			if (!this._tier) {
				if (!this.memory.tier) {
					this.memory.tier = 0;
				}
				this._tier = this.memory.tier;
			}
			return this._tier;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(Creep.prototype, 'role', {
		get: function() {
			if (!this._role) {
				if (!this.memory.role) {
					this.memory.role = 'blank';
				}
				this._role = this.memory.role;
			}
			return this._role;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(Creep.prototype, 'cost', {
		get: function() {
			if (!this._cost) {
				if (!this.memory.cost) {
					let cost = 0;
					let body = this.body;
					for (let i in body) {
						cost += BODYPART_COST[body[i].type];
					}
					this.memory.cost = cost;
				}
				this._cost = this.memory.cost;
			}
			return this._cost;
		}
	});

	Creep.prototype.nav = function(target) {
		if (this.spawning) return ERR_BUSY;
		if (target === null) return ERR_INVALID_TARGET;
		if (this.pos.isNearTo(target)) return OK;

		return this.moveTo(target, { visualizePathStyle: {}});
	};

	Creep.prototype.gather = function() {
		let target = this.pos.findClosestByPath(FIND_DROPPED_ENERGY, { filter: (resource) => {
			return (resource.amount > 15);
		}});
		if (target) {
			if (this.pos.isNearTo(target)) return this.pickup(target);
			else return this.nav(target);
		}

		if (this.carry.energy > this.carryCapacity/2) this.memory.gather = false;
		else {
			target = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
				return (
					structure.structureType === STRUCTURE_LINK &&
					structure.energy > 0
				) || (
					(structure.structureType === STRUCTURE_CONTAINER ||
					 structure.structureType === STRUCTURE_STORAGE
					) && (structure.store[RESOURCE_ENERGY] > 0)
				);
			}});
			if (target) {
				if (this.pos.isNearTo(target)) return this.withdraw(target, RESOURCE_ENERGY);
				else return this.nav(target);
			}

			return this.harvest();
		}
	};

	if (!Creep.prototype._repair) {
		Creep.prototype._repair = Creep.prototype.repair;
		Creep.prototype.repair = function() {
			let target = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.hits < 1000 && structure.hits < structure.hitsMax);
			}});
			if (!target) target = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
				return (
					structure.structureType !== STRUCTURE_WALL &&
					structure.structureType !== STRUCTURE_RAMPART &&
					structure.structureType !== STRUCUTRE_ROAD
				) && (structure.hits < structure.hitsMax);
			}});
			if (!target) target = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax);
			}});
			if (!target) target = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax);
			}});
			if (!target) target = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax);
			}});

			if (target) {
				if (this.pos.inRangeTo(target, 3)) return this._repair(target);
				else return this.nav(target);
			} else return ERR_NOT_FOUND;
		};
	}

	if (!Creep.prototype._build) {
		Creep.prototype._build = Creep.prototype.build;
		Creep.prototype.build = function() {
			if (_.size(Game.constructionSites) === 0) return ERR_NOT_FOUND;

			let target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			if (target) {
				if (this.pos.inRangeTo(target, 3)) return this._build(target);
				else return this.nav(target);
			} else return ERR_NOT_FOUND;
		};
	}

	Creep.prototype.haul = function() {
		let target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (structure) => {
			return (
				structure.structureType === STRUCTURE_EXTENSION ||
				structure.structureType === STRUCTURE_SPAWN
			) && (structure.energy < structure.energyCapacity);
		}});

		if (!target) target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (structure) => {
			return (structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
		}});

		if (target) {
			if (this.pos.isNearTo(target)) return this.transfer(target, RESOURCE_ENERGY);
			else return this.nav(target);
		} else return ERR_NOT_FOUND;
	};

	Creep.prototype.upgrade = function() {
		if (this.room.controller.my) {
			if (this.pos.inRangeTo(this.room.controller, 3)) return this.upgradeController(this.room.controller);
			else return this.nav(this.room.controller);
		} else return ERR_NOT_FOUND;
	};

	if (!Creep.prototype._harvest) {
		Creep.prototype._harvest = Creep.prototype.harvest;
		Creep.prototype.harvest = function() {
			if (_.sum(this.carry)) {
				let container = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: (structure) => {
					return (
						structure.structureType === STRUCTURE_LINK &&
						structure.energy < structure.energyCapacity
					) || (
						(structure.structureType === STRUCTURE_CONTAINER ||
						 structure.structureType === STRUCTURE_STORAGE
						) && (_.sum(structure.store) < structure.storeCapacity)
					);
				}});
				if (container.length) this.transfer(container[0], RESOURCE_ENERGY);
			}

			if (_.sum(this.carry) === this.carryCapacity) return ERR_FULL;

			let target = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if (!target) target = this.pos.findClosestByPath(FIND_SOURCES);

			if (target) {
				if (this.pos.isNearTo(target)) return this._harvest(target);
				else return this.nav(target);
			} else return ERR_NOT_FOUND;
		};
	}
};
