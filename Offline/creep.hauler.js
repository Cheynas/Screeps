/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.hauler');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var hauler = new Creep('hauler');

hauler.tiers[1] = [WORK,CARRY,MOVE,MOVE] /* 250/300 */
hauler.tiers[2] = [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] /* 500/550 */
hauler.tiers[3] = [WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] /* 650/800 */
hauler.tiers[4] = [CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE] /* 1200/1300 */
hauler.tiers[5] = [CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE] /* 1800/1800 */
/*     tiers[6] = [] /*  2300 */
/*     tiers[7] = [] /*  5600 */
/*     tiers[8] = [] /* 12900 */

hauler.run = function (creep) {
	if (!creep.memory.gather && creep.carry.energy == 0) creep.memory.gather = true;
	if (creep.memory.gather && creep.carry.energy == creep.carryCapacity) creep.memory.gather = false;

	if (creep.memory.gather) {
		return this.gather(creep);
	} else {
		var status = this.haul(creep);

		if (status == ERR_NOT_FOUND)
			status = this.build(creep);
		if (status == ERR_NOT_FOUND)
			status = this.repair(creep);

		if (status == ERR_NOT_FOUND)
			status = this.upgrade(creep);
		return status;
	}
}

module.exports = hauler;
