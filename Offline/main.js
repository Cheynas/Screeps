var creep = {};
creep.builder = require('creep.builder');
creep.repairer = require('creep.repairer');
creep.harvester = require('creep.harvester');
creep.upgrader = require('creep.upgrader');

if (!Memory.custom) { Memory.custom = {}; }

if (!Memory.custom.count) { Memory.custom.count = {}; }
if (!Memory.custom.count.creeps) { Memory.custom.count.creeps = {}; }
if (!Memory.custom.count.creeps.builder) { Memory.custom.count.creeps.builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length; }
if (!Memory.custom.count.creeps.repairer) { Memory.custom.count.creeps.repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length; }
if (!Memory.custom.count.creeps.harvester) { Memory.custom.count.creeps.harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length; }
if (!Memory.custom.count.creeps.upgrader) { Memory.custom.count.creeps.upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length; }

if (!Memory.custom.limit) { Memory.custom.limit = {} };
if (!Memory.custom.limit.creeps) { Memory.custom.limit.creeps = {}; }
if (!Memory.custom.limit.creeps.builder) { Memory.custom.limit.creeps.builder = 2; }
if (!Memory.custom.limit.creeps.repairer) { Memory.custom.limit.creeps.repairer = 2; }
if (!Memory.custom.limit.creeps.harvester) { Memory.custom.limit.creeps.harvester = 2; }
if (!Memory.custom.limit.creeps.upgrader) { Memory.custom.limit.creeps.upgrader = 2; }


module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var role = Memory.creeps[name].role;
			console.log(role, 'expired:', name);
			delete(Memory.creeps[name]);
			Memory.custom.count.creeps[role] -= 1;
		}
	}

	spawn:
	for (var spawn in Game.spawns) {
		if (Game.spawns[spawn].spawning) continue;
		if (Game.spawns[spawn].room.energyAvailable < 200) continue;

		for (var role in Memory.custom.count.creeps) {
			if (Memory.custom.count.creeps[role] < 1) {
				var name = creep[role].spawn(Game.spawns[spawn]);
				if (name) {
					Memory.custom.count.creeps[role] += 1;
					console.log(role,'created:',name);
					continue spawn;
				}
			}
		}

		for (var role in Memory.custom.count.creeps) {
			if (Memory.custom.count.creeps[role] < Memory.custom.limit.creeps[role]) {
				var name = creep[role].spawn(Game.spawns[spawn]);
				if (name) {
					Memory.custom.count.creeps[role] += 1;
					console.log(role,'created:',name);
					continue spawn;
				}
			}
		}
	}

	for (var name in Game.creeps) {
		var role = Memory.creeps[name].role;
		creep[role].run(Game.creeps[name]);
	}
}
