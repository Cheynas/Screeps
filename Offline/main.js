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

	for (var spawn in Game.spawns) {
		if (Memory.count.upgrader < 1) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
			Memory.count.upgrader += 1;
		} else if (Memory.count.harvester < 2) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			Memory.count.harvester += 1;
		} else if (Memory.count.builder < 1) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
			Memory.count.builder += 1;
		} else if (Memory.count.upgrader < 2) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
			Memory.count.upgrader += 1;
		} else if (Memory.count.builder < 3) {
			Game.spawns[spawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
			Memory.count.builder += 1;
		}
	}

	for (var name in Game.creeps) {
		var role = Memory.creeps[name].role;
		creep[role].run(Game.creeps[name]);
	}
}
