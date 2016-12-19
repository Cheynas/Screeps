var creep = {};
creep.builder = require('creep.builder');
creep.harvester = require('creep.harvester');
creep.upgrader = require('creep.upgrader');

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log('Creep expired:', name);
			delete(Memory.creeps[name]);
		}
	}

	for (var name in Game.creeps) {
		var role = Memory.creeps[name].role;
		creep[role].run(Game.creeps[name]);
	}
}
