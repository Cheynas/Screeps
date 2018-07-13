require('prototype.creep')();
require('prototype.spawn')();

module.exports.loop = function () {
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];

		let job;
		switch(creep.role) {
			case 'repairer':
				job = creep.repair();
				if (OK === job) break;
			case 'builder':
				job = creep.build();
				if (OK === job) break;
			case 'hauler':
				job = creep.haul();
				if (OK === job) break;
			case 'upgrader':
				job = creep.upgrade();
				if (OK === job) break;
			case 'harvester':
				job = creep.harvest();
				if (OK === job) break;
			default:
				job = creep.say('Got no job');
				Game.notify('A '+creep.role+' ('+name+') is out of work!');
		}
	}
};

/* Personal notes:
 *
 * Harvest = 2 energy per tick per part
 * Source = 3000 energy / 300 ticks
 * Optimal harvester: 5 work parts
 *
 */
