var creep = {};
creep.builder = require('creep.builder');
creep.harvester = require('creep.harvester');
creep.upgrader = require('creep.upgrader');

if (!Memory.count) { Memory.count = {} };

if (!Memory.count.creeps) { Memory.count.creeps = {} };
if (!Memory.count.creeps.builder) { Memory.count.creeps.builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length };
if (!Memory.count.creeps.harvester) { Memory.count.creeps.harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length };
if (!Memory.count.creeps.upgrader) { Memory.count.creeps.upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length };

if (!Memory.limit) { Memory.limit = {} };
if (!Memory.limit.creeps) { Memory.limit.creeps = {} };
if (!Memory.limit.creeps.builder) { Memory.limit.creeps.builder = 5; }
if (!Memory.limit.creeps.harvester) { Memory.limit.creeps.harvester = 2; }
if (!Memory.limit.creeps.upgrader) { Memory.limit.creeps.upgrader = 2; }

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var role = Memory.creeps[name].role;
			console.log(role, 'expired:', name);
			delete(Memory.creeps[name]);
			Memory.count.creeps[role] -= 1;
		}
	}

	for (var spawn in Game.spawns) {
		if (Memory.count.creeps.upgrader < 1) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
			Memory.count.creeps.upgrader += 1;
		} else if (Memory.count.creeps.harvester < 1) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			Memory.count.creeps.harvester += 1;
		} else if (Memory.count.creeps.builder < 1) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
			Memory.count.creeps.builder += 1;
		} else if (Memory.count.creeps.harvester < Memory.limit.creeps.harvester) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			Memory.count.creeps.harvester += 1;
		} else if (Memory.count.creeps.builder < Memory.limit.creeps.builder) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
			Memory.count.creeps.builder += 1;
		} else if (Memory.count.creeps.upgrader < Memory.limit.creeps.upgrader) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
			Memory.count.creeps.upgrader += 1;
		}
	}

	for (var name in Game.creeps) {
		var role = Memory.creeps[name].role;
		creep[role].run(Game.creeps[name]);
	}
}
