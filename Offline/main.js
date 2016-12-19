var creep = {};
creep.builder = require('creep.builder');
creep.harvester = require('creep.harvester');
creep.upgrader = require('creep.upgrader');

if (!Memory.count) { Memory.count = {} };
if (!Memory.count.builder) { Memory.count.builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length };
if (!Memory.count.harvester) { Memory.count.harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length };
if (!Memory.count.upgrader) { Memory.count.upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length };

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var role = Memory.creeps[name].role;
			console.log(role, 'expired:', name);
			delete(Memory.creeps[name]);
			Memory.count[role] -= 1;
		}
	}

	for (var name in Game.creeps) {
		var role = Memory.creeps[name].role;
		creep[role].run(Game.creeps[name]);
	}
}
