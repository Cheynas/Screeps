/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.repairer');
 * mod.thing == 'a thing'; // true
 */

var creep = require('_baseCreep');

creep.run = function (creep) {
	if (!creep.memory.gather && creep.carry.energy == 0) creep.memory.gather = true;
	if (creep.memory.gather && creep.carry.energy == creep.carryCapacity) creep.memory.gather = false;

	if (creep.memory.gather) {
		var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
		if (source) {
			if (creep.pos.isNearTo(source)) return creep.harvest(source);
			else return this.nav(creep,source);
		}
	} else {
		var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
			return structure.hits < 1000;
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
		}})
		if (!target) target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
			return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
		}})
		if (!target) target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
			return structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax;
		}})

		if (target) {
			if (creep.pos.inRangeTo(target, 3)) return creep.repair(target);
			else return this.nav(creep,target);
		} else {
			var target = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
			if (!creep.pos.inRangeTo(target, 3)) return this.nav(creep,target);
		}
	}
}

module.exports = creep;
