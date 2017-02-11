/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.harvester');
 * mod.thing == 'a thing'; // true
 */

var Creep = require('_baseCreep');
var harvester = new Creep('harvester');

harvester.tiers[1] = [WORK,WORK,CARRY,MOVE]; /* 300/300 */
harvester.tiers[2] = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]; /* 550/550 */
harvester.tiers[3] = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; /* 800/800 */
harvester.tiers[4] = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE] /* 1150/1300 */
/*        tiers[5] =  1800 */
/*        tiers[6] =  2300 */
/*        tiers[7] =  5600 */
/*        tiers[8] = 12900 */

harvester.run = function (creep) {
	var status = this.harvest(creep);
	if (status == ERR_FULL)
		creep.say('Full');

	return status;
}

module.exports = harvester;
