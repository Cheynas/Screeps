/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.upgrader');
 * mod.thing == 'a thing'; // true
 */

var creep = require('_baseCreep');

creep.role = 'upgrader';
creep.tiers[1] = [WORK,WORK,CARRY,MOVE]; /* 300 */
creep.tiers[2] = [WORK,WORK,WORK,CARRY,MOVE]; /* 400 */

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
		var target = creep.room.controller;
		if (target) {
			if (creep.pos.inRangeTo(target, 3)) return creep.upgradeController(target);
			else return this.nav(creep,target);
		}
	}
}

module.exports = creep;
