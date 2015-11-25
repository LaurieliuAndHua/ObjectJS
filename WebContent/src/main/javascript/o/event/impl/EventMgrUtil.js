O.importModule(['o.event.IEventMgr', 'o.event.impl.Event']);
O.Class({
	pkg : 'o.event.impl',
	interfaces : ['o.event.IEventMgr']
}, "EventMgrUtil", function(config){
	var me = this;
	var priv = {
		target : null,
		eventPool : {}
	};
	
	O.registNewError('EVENT_NOT_REG', {
		cn : '这个事件名称({0})尚未注册，不能绑定或解绑定监听',
		en : 'This event name ({0}) has not been registed.'
	});
	
	function getEventStack(eventName){
		var eventStack = priv.eventPool[eventName];
		if(!eventStack){
			throw O.createError('EVENT_NOT_REG', eventName);
		}
		return eventStack;
	}
	
	me.init = function(cfg){
		priv.target = cfg.target;
		var eventNames = cfg.eventNames;
		me.regEvent(eventNames);
	};
	
	me.on = function(eventName, callBackFunc){
		var eventStack = getEventStack(eventName);
		var len = eventStack.length;
		eventStack[len] = callBackFunc;
	};
	
	function regEvent(eventName){
		if(!O.isString(eventName))
			return;
		if(priv.eventPool[eventName]){
			return;
		}
		priv.eventPool[eventName] = new Array();
	}
	
	me.regEvent = function(eventName){
		if(O.isArray(eventName)){
			for(var i = 0; i < eventName.length; i++){
				regEvent(eventName[i]);
			}
		}else{
			regEvent(eventName);
		}
	};
	
	me.eraseEvent = function(eventName){
		if(priv.eventPool[eventName]){
			delete priv.eventPool[eventName];
		}
	};
	
	me.off = function(eventName, callBackFunc){
		var eventStack = getEventStack(eventName);
		var count = eventStack.length;
		for(var i = 0; i < count; i++){
			var callBack = eventStack[i];
			if(callBack === callBackFunc){
				eventStack.splice(i, 1);
			}
		}
	};
	
	function doEvent(eventStack, eventObj, extendArgCfg, indexI){
		if(indexI >= eventStack.length)
			return;
		var callBackFunc = eventStack[indexI];
		callBackFunc(eventObj, extendArgCfg);
		doEvent(eventStack, eventObj, extendArgCfg, indexI + 1);
	}
	
	me.fire = function(eventName, nativeEvent, extendArgCfg){
		var eventStack = getEventStack(eventName);
		var eventObj = O.create('o.event.impl.Event', {
			name : eventName,
			nativeEvent : nativeEvent,
			target : priv.target
		});
		doEvent(eventStack, eventObj, extendArgCfg, 0);
	};
	if(! config)
		return;
	me.init(config);
});