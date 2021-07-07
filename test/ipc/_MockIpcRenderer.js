module.exports = class MockIpcRenderer {
	_invokeCallbacks = {};
	_eventCallbacks = {};
	_messages = [];
	
	_handleInvoke (name, callback){
		this._invokeCallbacks[name] = callback;
	};
	
	_triggerEvent (name, ...args){
		if (!this._eventCallbacks[name]) {
			return;
		}
		const e = {};
		this._eventCallbacks[name].forEach((c) => {
			c(e, ...args);
		});
	}
	
	send (...args) {
		this._messages.push(args);
	}
	
	invoke (name, ...args){
		return new Promise((resolve, reject) => {
			resolve(this._invokeCallbacks[name](...args));
		});
	};
	
	on (name, callback){
		if (!this._eventCallbacks[name]) {
			this._eventCallbacks[name] = [];
		}
		this._eventCallbacks[name].push(callback);
	}
	
};
