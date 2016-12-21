/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.builder');
 * mod.thing == 'a thing'; // true
 */

var creep = require('_baseCreep');

creep.role = 'builder';
creep.tiers[1] = [WORK,CARRY,MOVE,MOVE]; /* 250/300 */
creep.tiers[2] = [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE]; /* 550/550 */
creep.tiers[3] = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; /* 800/800 */
creep.tiers[4] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; /* 1250/1300 */
/*    tiers[5] =  1800 */
/*    tiers[6] =  2300 */
/*    tiers[7] =  5600 */
/*    tiers[8] = 12900 */

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
		var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
		if (!target) target = creep.room.controller;

		if (target) {
			if (creep.pos.inRangeTo(target, 3)) return creep.build(target);
			else return this.nav(creep,target);
		}
	}
}

module.exports = creep;
