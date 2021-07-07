function MockWorker(script) {
	this.script = script;
	this._receivedMessages = [];
	this._isTerminated = false;
	return this;
}
MockWorker.prototype.postMessage = function(data){
	this._receivedMessages.push(data);
};
MockWorker.prototype.terminate = function(){
	this._isTerminated = true;
};

module.exports = MockWorker;
