(function(){
	O.Interface({
		pkg : 'o.test',
		name : 'IC',
		methods : ['remove', 'use']
	});
	
	O.Interface({
		pkg : 'o.test',
		name : 'IA',
		extend : ['o.test.IC'],
		methods : ['get', 'size']
	});
	
	O.Interface({
		pkg : 'o.test',
		name : 'ID',
		extend : ['o.test.IA'],
		methods : ['Hello']
	});
	
	O.Interface({
		pkg : 'o.test',
		name : 'IB',
		extend : ['o.test.ID'],
		methods : ['set', 'size']
	});
	
//	alert("parent interface is : " + O.getInfcInheritStack(o.test.IB));
	
	var tmp = [];
	for(var methodName in o.test.IB.methods){
		tmp.push(methodName);
	}
//	alert(tmp.join(", "));
	/*O.intfc({
		pkg : '',
		name : '',
		extend : [],
		methods : []
	});*/
	
	O.Class({
		pkg : 'o.test'
	}, "A", function(){
		var me = this;
		var mStr = "uuuu ";
		me.sayHello = function(){
			alert('Hello {0}'.formatValue(mStr));
		};
		
		me.getStr = function(){
			return mStr;
		};
		
		me.setStr = function(str){
			mStr = str;
		};
	});
	
	O.Class({
		pkg : 'o.test'
	}, "C", function(){});
	
	O.Class({
		pkg : 'o.test',
		extend : 'o.test.A',
		interfaces : ['o.test.IA']
	}, "B", function(){
		var me = this;
		
		var priv = {
			name : 'wangxh',
			age : '11'
		};
		
		O.generateAllGetter(me, priv);
		O.generateAllSetter(me, priv);
		
		me.sayHello = function(){
			me.setStr("iiiiii");
			alert(me.getStr());
		};
		
		me.remove = function(){};
		me.use = function(){};
		me.get = function(){};
		me.size = function(){};
	});
	
	
	/*var objA = new o.test.A();
	objA.sayHello();
//	alert(objA.typeName);
	var objB = new o.test.B();
	alert(objB.getName() + "," + objB.getAge());
	objB.setAge(12);
	alert("b: " + objB.getName() + "," + objB.getAge());
//	objB.sayHello();
//	alert(objB.typeName);
	var c = new o.test.B();
	o.io.Logger.info(c);
	alert("c : " + c.getName() + "," + c.getAge());*/
	
	var d = {
		name : 'superman'
	};
	var f = O.clone(d);
	/*o.util.Ajax.request({
		param : {
			userName : 'Superman',
			age : 19
		},
		url : '/OJS/TestJsonData',
		type : 'text',
		method : 'post',
		success : function(response){
			alert(response);
		},
		failure : function(response){
			alert(response);
		}
	});*/
	
	O.init({
		classPath : '../../../main/javascript'
	});
	O.importModule(['o.data.IStore', 'o.data.impl.Store', 'o.data.impl.Model']);
	
	var arr = O.create('o.data.impl.Store', {
		fields : [{
			name : 'userName', forced : true
		},{
			name : 'age', type : 'number', forced : true, defaultValue : 20
		},{
			name : 'address'
		}]
	});
	
	arr.add({
		userName : 'Wangxh',
		age : 12
	}).add({
		userName : 'SpiderMan',
		age : 12
	}).add({
		userName : 'HelloWorld'
	});
	
	alert(arr.getCount());
	
	alert(arr.getAt(0).userName);
	alert(arr.getAt(1).userName);
	arr.removeAt(1);
	alert(arr.getCount());
	alert(arr.getAt(1).userName);
})();