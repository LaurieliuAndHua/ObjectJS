var O = {};

(function(){
	var sLanguage = 'cn';
	var sTopObj = window;
	var sClassPath = "";
	
	var EXCEPTION_MSG_MAP = {
		'SYS_DEFINE_000001' : {
			cn : '该异常Code({0}) 未被定义',
			en : 'This ERR CODE({0}) has not defined.'
		},
		'SYS_DEFINE_000002' : {
			cn : '该异常Code ({0}) 已被注册',
			en : 'This ERR CODE ({0}) has allready been regist. '
		},
		'SYS_DEFINE_000003' : {
			cn : '类型名称({0})有误，类型各名称不能为空，且只能由数字字幕下划线组成',
			en : 'This ERR CODE ({0}) has allready been regist. '
		},
		'SYS_DEFINE_000004' : {
			cn : '类型名称({0})在该命名空间({1})下已被占用',
			en : 'Type name ({0}) has been used in this namespace ({1}). '
		},
		'SYS_DEFINE_000005' : {
			cn : '该类型尚未定义({0})',
			en : 'This type is undefined ({0}). '
		},
		'SYS_DEFINE_000006' : {
			cn : '接口定义中的父接口必须使用数组来进行定义，数组成员为字符串，其内容为父接口的全名称',
			en : 'This type is undefined ({0}). '
		},
		'SYS_DEFINE_000007' : {
			cn : '类的定义体必须是类，急救室 Function 对象。 {0}',
			en : 'Class body must be Function\'s object. {0}'
		},
		'SYS_DEFINE_000008' : {
			cn : '父类必须是类类型，急救室 Function 类型，不得是其他类型。 extend : {0}',
			en : 'Parent class must be Function type. extend :{0}'
		},
		'SYS_DEFINE_000009' : {
			cn : '类实现的接口配置得以数组提供。 在类({0})中的定义异常',
			en : 'Intfces config must be Array. In class({0}) defination.'
		},
		'SYS_DEFINE_000010' : {
			cn : '类({0})中有未实现的接口的抽象方法。未实现的方法：{1}',
			en : 'Unimplement Exception in class({0}) defination. Unimplements methods is : {1}'
		}
	};
	
	function initSystem(){
		String.prototype.formatValue = function(){
			var res = this;
			var args = arguments;
			for(var i = 0; i < args.length; i++){
				var reg = new RegExp("({)"+ i +"(})", "g");
				res = res.replace(reg, args[i] + "");
			}
			return res;
		};
		
		String.prototype.headToUpperCase = function(){
			var res = this;
			return res.substring(0, 1).toUpperCase() + res.substring(1);
		};
	};
	
	/**
	 * 切换语言
	 * @param  language 语言类型
	 */
	function switchLanguage(language){
		sLanguage = language || 'cn';
	};
	
	function buildNameSpace(nameSpace){
		var array = nameSpace.split(".");
		var nmspObj = sTopObj;
		for(var i = 0; i < array.length; i++){
			var nameStr = array[i];
			if(! nmspObj[nameStr])
				nmspObj[nameStr] = {};
			nmspObj = nmspObj[nameStr];
		}
		return nmspObj;
	};
	
	O.init = function(config){
		var cfg = config || {};
		sClassPath = cfg.sClassPath;
		sLanguage = cfg.sLanguage || 'cn';
	};
	
	/**
	 * 判断参数是否为字符串类型
	 * @param  inData  被判断数据
	 * @returns  true 表示被判断参数 inData 为字符串， 否则不为字符串
	 */
	O.isString = function(inData){
		return typeof(inData) === "string";
	};
	
	O.isArray = function(inObj){
		return inObj && inObj.constructor == Array;
	};
	
	O.isFunction = function(inData){
		return typeof(inData) === "function";
	};
	
	O.createError = function(errorCode){
		var errFmtStr = EXCEPTION_MSG_MAP[errorCode];
		if(! errFmtStr)
			throw new Error(EXCEPTION_MSG_MAP['SYS_DEFINE_000001'][sLanguage].formatValue(errorCode));
		
		errFmtStr = errFmtStr[sLanguage];
		var args = new Array();
		for(var i = 1; i < arguments.length; i++)
			args[i  - 1] = arguments[i];
		return new Error(errFmtStr.formatValue.apply(errFmtStr, args));
	};
	
	O.registNewError = function(errorCode, msgStrObj){
		var errFmtStr = EXCEPTION_MSG_MAP[errorCode];
		if(errFmtStr)
			throw O.createError('SYS_DEFINE_000002', 'SYS.DEFINE.000002');
		EXCEPTION_MSG_MAP[errorCode] = msgStrObj;
	};
	
	O.getRegistType = function(typeFullName){
		var array = typeFullName.split(".");
		var nmspObj = sTopObj;
		for(var i = 0; i < array.length; i++){
			var nameStr = array[i];
			if(! nmspObj[nameStr])
				throw O.createError("SYS_DEFINE_000005", typeFullName);
			nmspObj = nmspObj[nameStr];
		}
		return nmspObj;
	};
	
	O.isInterface = function(obj){
		if(O.isString(obj))
			obj = O.getRegistType(obj);
		return obj.isIntfc === true;
	};
	
	function getInfcInheritStack(intfc){
		if(O.isString(intfc))
			intfc = O.getRegistType(intfc);
		if(!intfc.isIntfc)
			return ;
		var stack = new Array();
		stack.push(intfc.typeName);
		var extend = intfc.extend;
		if(O.isArray(extend)){
			for(var i = 0; i < extend.length; i++){
				stack = stack.concat(getInfcInheritStack(extend[i]));
			}
		}
		return stack;
	};
	
	O.Interface = function(config){
		var cfg = config || {};
		var pkg = cfg.pkg;
		var extend = cfg.extend;
		var name = cfg.name;
		var methods = cfg.methods;
		var nmSp = preTypeDefineConfig(pkg, name);
		var imports = cfg.imports;
		
		if(nmSp[name])
			throw O.createError('SYS_DEFINE_000004', name, pkg);
		
		nmSp[name] = {isIntfc : true};
		nmSp[name].methods = {};
		nmSp[name].typeName = pkg + "." + name;
		nmSp[name].name = name;
		nmSp[name].pkg = pkg;
		if(extend){
			if(! O.isArray(extend))
				throw O.createError('SYS_DEFINE_000006');
			nmSp[name].extend = new Array();
			for(var i = 0; i < extend.length; i++){
				if(O.isString(extend[i])){
					nmSp[name].extend.push(extend[i]);
					var parentIntfc = O.getRegistType(extend[i]);
					inheritParentIntfcMethod(nmSp[name], parentIntfc);
				}
			}
		}
		
		if(O.isArray(methods)){
			for(var i = 0; i < methods.length; i++){
				nmSp[name].methods[methods[i]] = true;
			}
		};
	};
	
	function inheritParentIntfcMethod(childIntfc, parentIntfc){
		var parentMethods = parentIntfc.methods;
		for(var methodName in parentMethods)
			childIntfc['methods'][methodName] = true;
	}
	
	function preTypeDefineConfig(pkg, typeName){
		if(! typeName || typeName.indexOf(".") > 0)
			throw O.createError('SYS_DEFINE_000003', typeName);
		
		var nmSp = sTopObj;
		if(pkg)
			nmSp = buildNameSpace(pkg);
		
		if(nmSp[name])
			throw O.createError('SYS_DEFINE_000004', name, pkg);
		
		return nmSp;
	}
	
	/**
	 * 克隆方法，对于普通的对象可以实现 deepClone， 
	 * 但对于 Object JS 框架定义的类的对象，不能克隆其私有属性的内存空间，
	 * 使用时需格外注意！
	 * @param  resObj  被克隆对象
	 * @returns  克隆结果对象
	 */
	O.clone = function(resObj){
		var desObj = {};
		for(var p in resObj){
			if(typeof(resObj[p]) === "object" && resObj[p] !== null)
				desObj[p] = O.clone(resObj[p]);
			else
				desObj[p] = resObj[p];
		}
		return desObj;
	};
	
	function getObjUnImplsMethodsForOneIntfc(targetObj, intfc){
		var tmpObj = targetObj;
		var unimplMethods = new Array();
		if(O.isString(intfc))
			intfc = O.getRegistType(intfc);
		if(!intfc.isIntfc)
			return unimplMethods;
		
		for(var methodName in intfc.methods){
			if(! O.isFunction(tmpObj[methodName]))
				unimplMethods.push(methodName);
		}
		return unimplMethods;
	}
	
	function getClsUnimplsMethods(cls, intfces){
		var unimplMethods = new Array();
		var targetObj = new cls();
		for(var i = 0; i < intfces.length; i++){
			unimplMethods = unimplMethods.concat(getObjUnImplsMethodsForOneIntfc(targetObj, intfces[i]));
			cls.intfces[i] = intfces[i];
		}
		return unimplMethods;
	}
	
	/**
	 * 为类自动生成一个 getter 访问器方法。将会为 targetObj 增加一个以参数 p 为参考的 get 方法，
	 * 例如：p 的值为 "name"， 则会为 targetObj 生成一个  getName 方法，生成的方法的返回值为 priv[p]
	 * @param   targetObj 为类定义体中的 this
	 * @param   priv   为类定义体中的一个私有的 JSON Object
	 * @param   p       为 priv 参数的一个属性的名称，字符串类型
	 */
	O.generateGetter = function(targetObj, priv, p){
			var methodName = 'get{0}'.formatValue(p.headToUpperCase());
			targetObj[methodName] = function(){
				return priv[p];
			};
	};
	
	O.generateAllGetter = function(targetObj, priv){
		for(var p in priv)
			O.generateGetter(targetObj, priv, p);
	};
	
	/**
	 * 为类自动生成一个 setter 访问器方法。将会为 targetObj 增加一个以参数 p 为参考的 set 方法，
	 * 例如：p 的值为 "name"， 则会为 targetObj 生成一个  setName 方法，生成的方法会拥有一个参数，该参数
	 * 会赋值给 priv[p]
	 * @param   targetObj 为类定义体中的 this
	 * @param   priv   为类定义体中的一个私有的 JSON Object
	 * @param   p       为 priv 参数的一个属性的名称，字符串类型
	 */
	O.generateSetter = function(targetObj, priv, p){
		var methodName = 'set{0}'.formatValue(p.headToUpperCase());
		targetObj[methodName] = function(value){
			priv[p] = value;
		};
	};
	
	O.generateAllSetter = function(targetObj, priv){
		for(var p in priv)
			O.generateSetter(targetObj, priv, p);
	};
	
	O.Class = function(config, name, clsBody){
		var preCfg = config || {};
		var extend = preCfg.extend;
		var intfces = preCfg.interfaces || [];
		var pkg = preCfg.pkg;
		var imports = preCfg.imports;
		var nmSp = preTypeDefineConfig(pkg, name);
		var typeName = name;
		if(pkg)
			typeName = pkg + "." + name;
		
		if(! O.isFunction(clsBody))
			throw O.createError("SYS_DEFINE_000007", typeName);
		
		if(imports && O.isArray(imports)){
			for(var i = 0; i < imports.length; i++){
				O.importModule(imports[i]);
			}
		}
		
		nmSp[name] = function(){
			var me = this;
			if(extend && O.isString(extend)){
				var parentCls = O.getRegistType(extend);
				if(! O.isFunction(parentCls))
					throw O.createError("SYS_DEFINE_000008", extend);
				var tmpObj = new parentCls();
				for(var p in tmpObj){
					me[p] = tmpObj[p];
				}
				me.superClass = tmpObj;
				me.extend = extend;
			}
			me.typeName = typeName;
			clsBody.call(me);
			if(intfces){
				if(! O.isArray(intfces))
					throw O.createError("SYS_DEFINE_000009", me.typeName);
				me.intfces = new Array();
				for(var i = 0; i < intfces.length; i++)
					me.intfces[i] = intfces[i];
			}
		};
		if(pkg)
			nmSp[name].typeName = typeName;
		if(extend)
			nmSp[name].extend = extend;
		
		if(intfces){
			if(! O.isArray(intfces))
				throw O.createError("SYS_DEFINE_000009", nmSp[name].typeName);
			nmSp[name].intfces = new Array();
			var unimplMethods = getClsUnimplsMethods(nmSp[name], intfces);
			if(unimplMethods.length > 0)
				throw O.createError("SYS_DEFINE_000010", nmSp[name].typeName, unimplMethods.join(","));
		}
		return O;
	};
	
	function getClsInheritStack(cls){
		if(O.isString(cls))
			cls = O.getRegistType(cls);
		var inheritStack = new Array();
		inheritStack.push(cls.typeName);
		if(cls.extend){
			inheritStack = inheritStack.concat(getClsInheritStack(cls.extend));
		}
		if(O.isArray(cls.intfces))
			for(var i = 0; i < cls.intfces.length; i++){
				inheritStack = inheritStack.concat(getInfcInheritStack(cls.intfces[i]));
			}
				
		return inheritStack;
	};
	
	O.getObjInheritStack = function(obj){
		var objType = obj.typeName;
		if(!O.isString(objType))
			throw O.createError("SYS_DEFINE_000005", obj);
		objType = O.getRegistType(objType);
		
		var typeStack = new Array();
		if(O.isFunction(objType))
			typeStack = getClsInheritStack(objType);
		else
			throw O.createError("SYS_DEFINE_000005", obj.typeName);
		return typeStack;
	};
	
	O.isInstanceOf = function(obj, type){
		var typeStack = O.getObjInheritStack(obj);
		for(var i = 0; i < typeStack.length; i++)
			if(typeStack[i] === type)
				return true;
		return false;
	};
	
	O.importModule = function(moduleName){
		
	};
	
	O.create = function(moduleName, clsBodyOrCfg, cfg){
		var module = O.getRegistType(moduleName);
		var retObj = null;
		if(O.isFunction(module)){
			var clsArgCfg = {};
			if(typeof(clsBodyOrCfg) === "object")
				clsArgCfg = clsBodyOrCfg;
			retObj = new module(clsArgCfg);
		}else if(O.isInterface(module)){
			var tmpClsName = O.hashCode(clsBodyOrCfg) + name;
			module = O.Class({
				pkg : module.pkg,
				interfaces : [moduleName]
			}, tmpClsName, clsBodyOrCfg).getRegistType(module.pkg + "." + tmpClsName);
			retObj = new module(cfg);
		}
		return retObj;
	};
	
	O.hashCode = function(obj){
		var objStr = obj + "";
		var hashCode = 0;
		for(var i = 0; i < objStr.length; i++){
			var ch = objStr.charCodeAt(i);
			hashCode = ( (hashCode << 5) - hashCode) + ch;
			hashCode = hashCode & hashCode;
		}
		return hashCode;
	};
	
	initSystem();
	
	O.Class({
		pkg : 'o.io'
	}, 'Logger', function(){
		function regLogMethod(methodName){
			if(window.console){
				o.io.Logger[methodName] = function(msg){
					window.console[methodName](msg);
				}
			}
		};
		regLogMethod('info');
		regLogMethod('log');
		regLogMethod('debug');
		regLogMethod('error');
	});
	
	O.Class({
		pkg : 'o.util'
	}, "Ajax", function(){
		o.util.Ajax.request = function(json){};
		
		o.util.Ajax.loadScript  = function(jsSrc){};
		
		o.util.Ajax.doPost = function(url, params, callBack){};
		
		o.util.Ajax.doGet = function(url, params, callBack){};
	});
})();