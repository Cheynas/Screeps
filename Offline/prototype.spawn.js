/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.spawn');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {
	if (!StructureSpawn.prototype._spawnCreep) {
		StructureSpawn.prototype._spawnCreep = StructureSpawn.prototype.spawnCreep;
		StructureSpawn.prototype.spawnCreep = function(role, tier) {
			if (this.spawning) return ERR_BUSY;
			if (undefined === role) return ERR_INVALID_ARGS;

			if (undefined === tier) {
				tier = 10;

				let canSpawn = ERR_NOT_ENOUGH_ENERGY;
				do {
					if (0 > tier) return ERR_INVALID_ARGS;
					tier -= 1;
					let body = Memory.tiers[role][tier];
					if (undefined === body) continue;

					canSpawn = this._spawnCreep(body, undefined, { dryRun: true });
				} while (ERR_NOT_ENOUGH_ENERGY === canSpawn);
			}

			let body;
			do {
				body = Memory.tiers[role][tier];
				if (undefined === body) tier -= 1;

				if (0 > tier) Memory.tiers[role][tier] = [WORK,CARRY,MOVE];
			} while (undefined === body);

			this._spawnCreep(body, undefined, { memory: {role: role, tier: tier}});
		};
	}
};
