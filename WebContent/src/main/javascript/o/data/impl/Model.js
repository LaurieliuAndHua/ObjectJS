O.Class({
	pkg : 'o.data.impl'
}, 'Model', function(config){
	var me = this;
	var mFields;
	var mTypes = { string : true,	number : true,
		date : true,	bool : true
	};
	
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
	
	function checkOneFieldData(fieldCfg, data){
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
	}
	
	me.checkData = function(data){
		for(var i = 0; i < mFields.length; i++){
			var fieldCfg = mFields[i];
			checkOneFieldData(fieldCfg, data);
		}
		return true;
	};
	
	function checkFieldCfg(fieldCfg){
		var name = fieldCfg.name;
		if(!O.isString(name))
			throw O.createError('MODEL_FIELD_02');
		var type = fieldCfg.type;
		type = mTypes[type] ? type : 'string';
		var forcedStr = (fieldCfg.forced + "").toLowerCase();
		fieldCfg.type = type;
		fieldCfg.forced = forcedStr == 'true' ? true : false;
	}
	
	function init(cfg){
		if( !cfg )
			return;
		mFields = new Array();
		var fields = cfg['fields'];
		if(! O.isArray(fields))
			throw O.createError('MODEL_FIELD_01');
		for(var i = 0; i < fields.length; i++){
			var fieldCfg = O.clone(fields[i]);
			checkFieldCfg(fieldCfg);
			mFields[i] = fieldCfg;
		}
	};
	init(config);
});
