module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log('Creep expired:', name);
			delete(Memory.creeps[name]);
		}
	}
}
