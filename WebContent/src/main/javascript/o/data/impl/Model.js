O.importModule(['o.event.IEventMgr', 'o.event.impl.EventMgrUtil']);
O.Class({
	pkg : 'o.data.impl',
	interfaces : ['o.event.IEventMgr']
}, 'Model', function(config){
	var me = this;
	var mFields;
	var mEventMgr;
	var mTypes = { string : true,	number : true,
		date : true,	bool : true
	};
	var mData;
	
	O.registNewError('MODEL_FIELD_01', {
		cn : '定义 Model 的 fields 配置必须是数组',
		en : ''
	}).registNewError('MODEL_FIELD_02', {
		cn : '定义 Model 提供的 field 配置缺少最基本的元素',
		en : ''
	}).registNewError('MODEL_FIELD_NOTNULL', {
		cn : '这个字段[{0}]不得为空',
		en : 'This field [{0}] can not be null.'
	}).registNewError('MODEL_FIELD_TYPE_ERROR', {
		cn : '这个字段[{0}]提供的值类型不对',
		en : 'Type of this field[{0}] data that you provide  is not correct'
	});
	
	var dataTypeCheckFuns = {
			string : function(value){ return O.isString(value);	},
			number : function(value){	return O.isNumber(value);},
			date : function(value){	return O.isDate(value);	},
			bool : function(value){	return O.isBoolean(value)}
	};
	
	me.checkData = function(data){
		for(var i = 0; i < mFields.length; i++){
			var fieldCfg = mFields[i];
			o.data.impl.checkOneFieldData(fieldCfg, data);
		}
		return true;
	};
	
	me.on = function(eventName, callBack){
		mEventMgr.on(eventName, callBack);
	};
	
	me.off = function(eventName){
		mEventMgr.off(eventName);
	};
	
	me.regEvent = function(eventName){
		mEventMgr.regEvent(eventName);
	};
	
	me.eraseEvent = function(eventName){
		mEventMgr.eraseEvent(eventName);
	};
	
	me.fire = function(eventName, extArgs){
		mEventMgr.fire(eventName, null, extArgs);
	};
	
	me.setData = function(data){
		me.checkData(data);
		mData = data;
		me.fire('change');
	};
	
	me.set = function(name, value){
		for(var i = 0; i < mFields.length; i++){
			if(mFields[i].name === name){
				o.data.impl.checkOneFieldData(mFields[i], value);
				var oldValue = mData[name];
				mData[name] = value;
				me.fire('set', {name : name, value : value, oldValue : oldValue});
				return;
			}
		}
	};
	
	me.get = function(name){
		return mData[name];
	};
	
	me.init = function(cfg){
		mFields = new Array();
		var fields = cfg['fields'];
		if(! O.isArray(fields))
			throw O.createError('MODEL_FIELD_01');
		for(var i = 0; i < fields.length; i++){
			var fieldCfg = O.clone(fields[i]);
			o.data.impl.checkFieldCfg(mTypes, fieldCfg);
			mFields[i] = fieldCfg;
		}
		mData = {};
		mEventMgr = O.create('o.event.impl.EventMgrUtil', {
			target : me,
			eventNames : ['change', 'set']
		});
	};
	
	if(! config)
		return;
	me.init(config);
});

o.data.impl.checkOneFieldData = function(fieldCfg, data){
	var fieldName = fieldCfg.name;
	var fieldType = fieldCfg.type;
	var forced = fieldCfg.forced;
	var fieldDefaultValue = fieldCfg.defaultValue;
	var fieldData = data[fieldName];
	var resFlag;
	if(forced){
		if(fieldData === undefined || fieldData === null){
			if(fieldDefaultValue === undefined || fieldDefaultValue === null)
				throw O.createError('MODEL_FIELD_NOTNULL', fieldName);
			else{
				data[fieldName] = fieldDefaultValue;
				return true;
			}
		}
	}
	
	if(fieldDefaultValue === undefined || fieldDefaultValue === null)
		return true;
	
	resFlag = dataTypeCheckFuns[fieldType](fieldData);
	if(! resFlag ){
		throw O.createError('MODEL_FIELD_TYPE_ERROR', fieldName);
	}
	return true;
};

o.data.impl.checkFieldCfg = function(types, fieldCfg){
	var name = fieldCfg.name;
	if(!O.isString(name))
		throw O.createError('MODEL_FIELD_02');
	var type = fieldCfg.type;
	type = types[type] ? type : 'string';
	var forcedStr = (fieldCfg.forced + "").toLowerCase();
	fieldCfg.type = type;
	fieldCfg.forced = forcedStr == 'true' ? true : false;
};
