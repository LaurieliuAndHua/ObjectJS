O.importModule(['o.data.IStore', 'o.event.IEventMgr', 'o.event.impl.EventMgrUtil', 'o.data.impl.Model']);
O.Class({
	pkg : 'o.data.impl',
	interfaces : ['o.data.IStore', 'o.event.IEventMgr']
}, "Store", function(config){
	var me = this;
	var mDatas = [];
	var mModel;
	var mSize;
	var mLoader;
	var mEventMgr;
	var mEventNames = ['afterLoad', 'beforeLoad', 'beforeAdd', 
	                   'afterAdd', 'beforeRemove', 'afterRemove', 'beforeClear', 'afterClear'];
	
	O.registNewError('ARRAY_OUT_BOUNDS', {
		cn : '数组下标越界异常',
		en : 'Array index out of bounds'
	});
	
	me.getCount = function(){
		return mDatas.length;
	};
	
	me.foreach = function(eachFunc){
		for(var i = 0; i < mDatas.length; i++){
			if(eachFunc(me, mDatas[i], i) === false)
				return;
		}
	};
	
	me.getAt = function(indexI){
		if(indexI >= mSize)
			throw O.createError('ARRAY_OUT_BOUNDS');
		return mDatas[indexI];
	};
	
	me.add = function(data){
		mEventMgr.fire('beforeAdd');
		if(mModel.checkData(data)){
			mDatas[mSize] = data;
			mSize ++;
		}
		mEventMgr.fire('afterAdd');
		return me;
	};
	
	me.removeAt = function(indexI){
		if(indexI >= mSize)
			throw O.createError('ARRAY_OUT_BOUNDS');
		mEventMgr.fire('beforeRemove');
		var retData = mDatas.splice(indexI, 1);
		mSize--;
		mEventMgr.fire('afterRemove');
		return retData;
	};
	
	me.clear = function(){
		mEventMgr.fire('beforeClear');
		mDatas = [];
		mSize = 0;
		mEventMgr.fire('afterClear');
		return me;
	};
	
	me.load = function(){
		mEventMgr.fire('beforeLoad');
		mEventMgr.fire('afterLoad');
	};
	
	me.init = function(cfg){
		var fields = cfg['fields'];
		mModel = O.create('o.data.impl.Model',  {
			fields : fields
		});
		mSize = 0;
		mEventMgr = O.create('o.event.impl.EventMgrUtil', {
			target : me,
			eventNames : mEventNames
		});
		return me;
	};
	
	me.contains = function(data){
		try{
			mModel.checkData(data);
			for(var i = 0; i < mDatas.length; i++){
				if(data === mDatas[i])
					return true;
			}
		}catch(e){ }
		return false;
	};
	
	me.on = function(eventName, callBack){
		mEventMgr.on(eventName, callBack);
	};
	
	me.off = function(eventName, callBack){
		mEventMgr.off(eventName, callBack);
	};
	
	me.fire = function(eventName, extendArgCfg){
		mEventMgr.fire(eventName, callBack, extendArgCfg);
	};
	
	me.regEvent = function(eventName){
		mEventMgr.regEvent(eventName);
	};
	
	me.eraseEvent = function(eventName){
		mEventMgr.eraseEvent(eventName);
	};
	
	if(! config)
		return;
	me.init(config);
});