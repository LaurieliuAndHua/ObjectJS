O.importModule([
	'o.event.IEventMgr'
]);
O.Class({
	pkg : 'o.data.impl',
	interfaces : ['o.event.IEventMgr']
}, "Data", function(config){
	var me = this;
	var mData;
	var mModel;
	O.registNewError('DATA_MODEL_NULL', {
		cn : '数据的模型约束配置为空或对象类型不对，应为 o.data.impl.Model 类型的对象',
		en : 'cfg[model] config must be the instance of (o.data.impl.Model)'
	});
	me.init = function(cfg){
		if(!cfg)
			return;
		var model = cfg['model'];
		if(!model || ! O.isInstanceOf(model, 'o.data.impl.Model'))
			throw O.createError(errorCode);
		mModel = model;
		var data = cfg['data'];
		model.checkData(data);
		mData = data;
	};
	
	me.set = function(name, value){
		
		mData[name] = value;
	};
	me.init(config);
});

