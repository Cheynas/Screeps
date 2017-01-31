/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.harvester');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var harvester = new Creep();
harvester.role = 'harvester';

harvester.tiers[1] = [WORK,WORK,CARRY,MOVE]; /* 300/300 */
harvester.tiers[2] = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]; /* 550/550 */
harvester.tiers[3] = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; /* 800/800 */
harvester.tiers[4] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE] /* 1150/1300 */
/*        tiers[5] =  1800 */
/*        tiers[6] =  2300 */
/*        tiers[7] =  5600 */
/*        tiers[8] = 12900 */

harvester.run = function (creep) {
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
		} else {
		    var status = this.build(creep);
		    if (status == ERR_NOT_FOUND) this.upgrade(creep);
		}
	}
}

module.exports = harvester;
