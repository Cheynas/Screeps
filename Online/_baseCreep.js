/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('_baseCreep');
 * mod.thing == 'a thing'; // true
 */

function Creep(role) { this.role = role; }

Creep.prototype.tiers = [[WORK,CARRY,MOVE]]; /* Lowest viable creep */

Creep.prototype.spawn = function (spawn) {
	if (spawn.spawning) return ERR_BUSY;
	if (spawn.room.energyAvailable < 200) return ERR_NOT_ENOUGH_ENERGY;

	for (var i = 1; i < this.tiers.length; i++) {
		if (spawn.canCreateCreep(this.tiers[i]) == OK) continue;
		else break;
	}
	i -= 1;

	return spawn.createCreep(this.tiers[i], undefined, {role: this.role, tier: i});
}

Creep.prototype.cost = function(creep) {
	var cost = 0;
	var body = creep.body;
	for (var i in body) {
		cost += BODYPART_COST[body[i].type];
	}
	return cost;
}

Creep.prototype.nav = function(creep, target) {
	if (creep.spawning) return ERR_BUSY;
	if (target == null) return ERR_INVALID_TARGET;
	if (creep.pos.isNearTo(target)) return OK;

	return creep.moveTo(target, {visualizePathStyle: {}});
}

Creep.prototype.run = function(creep) {
	creep.say('ERROR!');
}

Creep.prototype.gather = function(creep) {
	var drop = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
	if (drop) {
		if (creep.pos.isNearTo(drop)) return creep.pickup(drop);
		else return this.nav(creep, drop);
	}

	if (creep.carry.energy > creep.carryCapacity/2) creep.memory.gather = false;
	var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
		return (
			structure.structureType == STRUCTURE_LINK &&
			structure.energy > 0
		) || (
			(structure.structureType == STRUCTURE_CONTAINER ||
			structure.structureType == STRUCTURE_STORAGE
			) && structure.store[RESOURCE_ENERGY] > 0
		);
	}});
	if (container) {
		if (creep.pos.isNearTo(container)) return creep.withdraw(container, RESOURCE_ENERGY);
		else return this.nav(creep, container);
	}

	var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
	if (source) {
		if (creep.pos.isNearTo(source)) return creep.harvest(source);
		else return this.nav(creep, source);
	} else return ERR_NOT_FOUND;
}

Creep.prototype.build = function(creep) {
	if (_.size(Game.constructionSites) == 0) return ERR_NOT_FOUND;

	var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
	if (target) {
		if (creep.pos.inRangeTo(target, 3)) return creep.build(target);
		else return this.nav(creep, target);
	} else return ERR_NOT_FOUND;
}

Creep.prototype.repair = function(creep) {
	var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
		return structure.hits < 1000 && structure.hits < structure.hitsMax;
	}});

	if (!target) target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
		return (
			structure.structureType != STRUCTURE_WALL &&
			structure.structureType != STRUCTURE_RAMPART &&
			structure.structureType != STRUCTURE_ROAD
			) && structure.hits < structure.hitsMax;
	}});
	if (!target) target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
		return structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax;
	}});
	if (!target) target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
		return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
	}});
	if (!target) target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
		return structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax;
	}});

	if (target) {
		if (creep.pos.inRangeTo(target, 3)) return creep.repair(target);
		else return this.nav(creep,target);
	} else return ERR_NOT_FOUND;
}

Creep.prototype.upgrade = function(creep) {
	if (creep.room.controller.my) {
		if (creep.pos.inRangeTo(creep.room.controller, 3)) return creep.upgradeController(creep.room.controller);
		else return this.nav(creep, creep.room.controller);
	} else return ERR_NOT_FOUND;
};

Creep.prototype.haul = function(creep) {
	var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {
		return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
	}})

	if (!target) target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {
		return (
			structure.structureType == STRUCTURE_EXTENSION ||
			structure.structureType == STRUCTURE_TOWER ||
			structure.structureType == STRUCTURE_SPAWN
		) && structure.energy < structure.energyCapacity;
	}});

	if (target) {
		if (creep.pos.isNearTo(target)) return creep.transfer(target, RESOURCE_ENERGY);
		else return this.nav(creep,target);
	} else return ERR_NOT_FOUND;
}

Creep.prototype.harvest = function(creep) {
	if (_.sum(creep.carry)) {
		var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) => {
			return (
				structure.structureType == STRUCTURE_LINK &&
				structure.energy < structure.energyCapacity
			) || (
				(structure.structureType == STRUCTURE_CONTAINER ||
				structure.structureType == STRUCTURE_STORAGE
				) && (_.sum(structure.store) < structure.storeCapacity)
			);
		}});
		if (container.length) creep.transfer(container[0], RESOURCE_ENERGY);
	}

	if (_.sum(creep.carry) == creep.carryCapacity) return ERR_FULL;

	var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
	if (!target) target = creep.pos.findClosestByPath(FIND_SOURCES);

	if (target) {
		if (creep.pos.isNearTo(target)) return creep.harvest(target);
		else return this.nav(creep, target);
	} else return ERR_NOT_FOUND;
};

module.exports = Creep;
