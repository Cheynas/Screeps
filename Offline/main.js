var creep = {};
creep.upgrader = require('creep.upgrader');
creep.harvester = require('creep.harvester');
creep.builder = require('creep.builder');
creep.repairer = require('creep.repairer');

if (!Memory.count) { Memory.count = {}; }

if (!Memory.count.creeps) { Memory.count.creeps = {}; }
if (!Memory.count.creeps.harvester) { Memory.count.creeps.harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length; }
if (!Memory.count.creeps.upgrader) { Memory.count.creeps.upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length; }
if (!Memory.count.creeps.builder) { Memory.count.creeps.builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length; }
if (!Memory.count.creeps.repairer) { Memory.count.creeps.repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length; }

if (!Memory.limit) { Memory.limit = {} };

if (!Memory.limit.creeps) { Memory.limit.creeps = {}; }
if (!Memory.limit.creeps.harvester) { Memory.limit.creeps.harvester = 2; }
if (!Memory.limit.creeps.upgrader) { Memory.limit.creeps.upgrader = 2; }
if (!Memory.limit.creeps.builder) { Memory.limit.creeps.builder = 2; }
if (!Memory.limit.creeps.repairer) { Memory.limit.creeps.repairer = 2; }

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var role = Memory.creeps[name].role;
			console.log(role, 'expired:', name);
			delete(Memory.creeps[name]);
			Memory.count.creeps[role] -= 1;
		}
	}

	spawn:
	for (var spawn in Game.spawns) {
		if (Game.spawns[spawn].spawning) continue;
		if (Game.spawns[spawn].room.energyAvailable < 200) continue;

		for (var role in Memory.count.creeps) {
			if (Memory.count.creeps[role] < 1) {
				var name = creep[role].spawn(Game.spawns[spawn]);
				if (name) {
					Memory.count.creeps[role] += 1;
					continue spawn;
				}
			}
		}

		for (var role in Memory.count.creeps) {
			if (Memory.count.creeps[role] < Memory.limit.creeps[role]) {
				var name = creep[role].spawn(Game.spawns[spawn]);
				if (name) {
					Memory.count.creeps[role] += 1;
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
