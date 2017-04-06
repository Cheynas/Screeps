/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.builder');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var builder = new Creep('builder');

builder.tiers[1] = [WORK,CARRY,MOVE,MOVE]; /* 250/300 */
builder.tiers[2] = [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE]; /* 550/550 */
builder.tiers[3] = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; /* 800/800 */
builder.tiers[4] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; /* 1250/1300 */
/*      tiers[5] =  1800 */
/*      tiers[6] =  2300 */
/*      tiers[7] =  5600 */
/*      tiers[8] = 12900 */

builder.run = function (creep) {
	if (!creep.memory.gather && creep.carry.energy == 0) creep.memory.gather = true;
	if (creep.memory.gather && creep.carry.energy == creep.carryCapacity) creep.memory.gather = false;

	if (creep.memory.gather) {
		return this.gather(creep);
	} else {
		var status = this.build(creep);

		if (status == ERR_NOT_FOUND)
			status = this.repair(creep);
		if (status == ERR_NOT_FOUND)
			status = this.haul(creep);

		if (status == ERR_NOT_FOUND)
			status = this.upgrade(creep);
		return status;
	}
}

module.exports = builder;
