/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('_baseCreep');
 * mod.thing == 'a thing'; // true
 */

var creep = {}

creep.role = null;
creep.tiers = [[WORK,CARRY,MOVE]]; /* Lowest viable creep */

creep.spawn = function (spawn) {
	if (spawn.spawning) return ERR_BUSY;
	if (spawn.room.energyAvailable < 200) return ERR_NOT_ENOUGH_ENERGY;

	for (var i = 1; i < this.tiers.length; i++) {
		if (spawn.canCreateCreep(this.tiers[i]) == OK) continue;
		else break;
	}
	i -= 1;

	return spawn.createCreep(this.tiers[i], undefined, {role: this.role, tier: i});
}

creep.cost = function(creep) {
	var cost = 0;
	var body = creep.body;
	for (var i in body) {
		cost += BODYPART_COST[body[i].type];
	}
	return cost;
}

creep.nav = function(creep, target) {
	if (creep.spawning) return ERR_BUSY;
	if (target == null) return ERR_INVALID_TARGET;
	if (creep.pos.isNearTo(target)) return OK;

	return creep.moveTo(target);
}

creep.run = function(creep) {
	creep.say('ERROR!');
}

module.exports = creep;
