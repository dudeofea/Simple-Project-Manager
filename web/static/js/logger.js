//TODO: add more to this logger if needed

module.exports = function(self){
	console.log("logger", self);
	return function(e){
		console.log("logger-error", e);
	}
}
