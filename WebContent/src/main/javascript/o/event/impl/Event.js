O.importModule(['o.event.IEvent']);
O.Class({
	pkg : 'o.event.impl',
	interfaces : ['o.event.IEvent']
}, 'Event', function(config){
	var me = this;
	var mName;
	var mTarget;
	var mNativeEvent;
	
	me.init = function(cfg){
		mTarget = cfg['target'];
		mName = cfg['name'];
		mNativeEvent = cfg['nativeEvent'];
	};
	
	me.getName = function(){
		
	};
	
	me.getTarget = function(){
		
	};
	
	me.getNativeEvent = function(){
		
	};
	
	if(! config)
		return;
	me.init(config);
});
