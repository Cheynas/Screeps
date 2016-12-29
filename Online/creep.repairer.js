/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.repairer');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var repairer = new Creep();
repairer.role = 'repairer';

repairer.tiers[1] = [WORK,CARRY,MOVE]; /* 200/300 */
repairer.tiers[2] = [WORK,WORK,CARRY,CARRY,MOVE,MOVE]; /* 400/550 */
repairer.tiers[3] = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE] /* 600/800 */
repairer.tiers[4] = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE] /* 800/1300 */
repairer.tiers[5] = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE] /* 1000/1800 */
repairer.tiers[6] = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] /* 1200/2300 */
repairer.tiers[7] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] /* 1400/5600 */
repairer.tiers[8] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] /* 1600/12900 */

repairer.run = function (creep) {
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

module.exports = repairer;
