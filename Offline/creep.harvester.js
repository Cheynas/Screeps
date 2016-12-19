/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.harvester');
 * mod.thing == 'a thing'; // true
 */

var creep = require('_baseCreep');

creep.run = function (creep) {
	if (!creep.memory.gather && creep.carry.energy == 0) creep.memory.gather = true;
	if (creep.memory.gather && creep.carry.energy == creep.carryCapacity) creep.memory.gather = false;

	if (creep.memory.gather) {
		var source = creep.pos.findClosestByPath(FIND_SOURCES);
		if (creep.pos.isNearTo(source)) return creep.harvest(source);
		else return this.nav(creep,source);
	} else {
		var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
			return (
				structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType == STRUCTURE_SPAWN ||
				structure.structureType == STRUCTURE_TOWER
			) && structure.energy < structure.energyCapacity;
		}});

		if (target) {
			if (creep.pos.isNearTo(target)) return creep.transfer(target, RESOURCE_ENERGY);
			else return this.nav(creep,target);
		}
	}
}

module.exports = creep;
