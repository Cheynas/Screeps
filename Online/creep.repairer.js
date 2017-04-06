/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.repairer');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var repairer = new Creep('repairer');

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
		return this.gather(creep);
	} else {
		var status = this.repair(creep);

		if (status == ERR_NOT_FOUND)
			status = this.build(creep);
		if (status == ERR_NOT_FOUND)
			status = this.haul(creep);

		if (status == ERR_NOT_FOUND)
			status = this.upgrade(creep);
		return status;
	}
}

module.exports = repairer;
