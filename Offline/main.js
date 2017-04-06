var creep = {};
creep.hauler = require('creep.hauler');
creep.builder = require('creep.builder');
creep.repairer = require('creep.repairer');
creep.harvester = require('creep.harvester');
creep.upgrader = require('creep.upgrader');

if (!Memory.custom) { Memory.custom = {}; }

if (!Memory.custom.count) { Memory.custom.count = {}; }
if (!Memory.custom.count.creeps) { Memory.custom.count.creeps = {}; }
if (!Memory.custom.count.creeps.hauler) { Memory.custom.count.creeps.hauler = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler').length; }
if (!Memory.custom.count.creeps.builder) { Memory.custom.count.creeps.builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length; }
if (!Memory.custom.count.creeps.repairer) { Memory.custom.count.creeps.repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length; }
if (!Memory.custom.count.creeps.harvester) { Memory.custom.count.creeps.harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length; }
if (!Memory.custom.count.creeps.upgrader) { Memory.custom.count.creeps.upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length; }

if (!Memory.custom.limit) { Memory.custom.limit = {} };
if (!Memory.custom.limit.creeps) { Memory.custom.limit.creeps = {}; }
if (!Memory.custom.limit.creeps.hauler) { Memory.custom.limit.creeps.hauler = 4; }
if (!Memory.custom.limit.creeps.builder) { Memory.custom.limit.creeps.builder = 1; }
if (!Memory.custom.limit.creeps.repairer) { Memory.custom.limit.creeps.repairer = 3; }
if (!Memory.custom.limit.creeps.harvester) { Memory.custom.limit.creeps.harvester = 1; }
if (!Memory.custom.limit.creeps.upgrader) { Memory.custom.limit.creeps.upgrader = 1; }


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

	for (var ID in Game.structures) {
		var tower = Game.structures[ID];
		if (tower.structureType != STRUCTURE_TOWER) continue;

		var target = tower.pos.findInRange(FIND_MY_CREEPS, 5, {filter: function(creep) {
			return creep.hits < creep.hitsMax;
		}});

		if (target[0]) { tower.heal(target[0]); continue; }
		else target = tower.pos.findInRange(FIND_STRUCTURES, 5, {filter: function(struct) {
			return struct.hits < struct.hitsMax && struct.hits < 1500;
		}});
		if (target[0]) { tower.repair(target[0]); continue; }
		else target = tower.pos.findInRange(FIND_STRUCTURES, 5, {filter: function(struct) {
			return struct.hits < struct.hitsMax;
		}});
		if (target[0]) { tower.repair(target[0]); continue; }
		else target = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
		if (target) { tower.attack(target[0]); continue; }

		if (tower.energy < tower.energyCapacity/2) continue;

		var target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(creep) {
			return creep.hits < creep.hitsMax;
		}});
		if (target[0]) { tower.heal(target[0]); continue; }
		else target = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(struct) {
			return struct.hits < struct.hitsMax && struct.hits < 1500;
		}});
		if (target[0]) { tower.repair(target[0]); continue; }
		else target = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(struct) {
			return struct.hits < struct.hitsMax;
		}});
		if (target[0]) { tower.repair(target[0]); continue; }
		else target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target) { tower.attack(target[0]); continue }
	}
 
	for (var name in Game.creeps) {
		var role = Memory.creeps[name].role;
		creep[role].run(Game.creeps[name]);
	}
}
