/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.upgrader');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var upgrader = new Creep('upgrader');

upgrader.tiers[1] = [WORK,WORK,CARRY,MOVE]; /* 300/300 */
upgrader.tiers[2] = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]; /* 550/550 */
upgrader.tiers[3] = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; /* 800/800 */
upgrader.tiers[4] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE] /* 1150/1300 */
/*       tiers[5] =  1800 */
/*       tiers[6] =  2300 */
/*       tiers[7] =  5600 */
/*       tiers[8] = 12900 */

upgrader.run = function (creep) {
	if (!creep.memory.gather && creep.carry.energy == 0) creep.memory.gather = true;
	if (creep.memory.gather && creep.carry.energy == creep.carryCapacity) creep.memory.gather = false;

	if (creep.memory.gather) {
		return this.gather(creep);
	} else {
		return this.upgrade(creep);
	}
}

module.exports = upgrader;
