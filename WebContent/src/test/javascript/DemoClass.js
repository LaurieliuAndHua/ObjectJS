O.Interface({
	pkg : 'o.util',
	name : 'IUser',
	methods : ['getUserInfo', 'createUserInfo']
});

O.Interface({
	pkg : 'o.util',
	name : 'IUserDao',
	extend : ['o.util.IUser'],
	methods : ['getUserInfo', 'createUserInfo']
});

O.Class({
	pkg : 'o.util',
	interfaces : ['o.util.IUserDao']
}, "DemoClass", function(){
	var me = this;
	
	me.getUserInfo = function(){
		alert("This is father get method.");
	};
	me.createUserInfo = function(){};
	
	o.util.DemoClass.staticFunc = function(){
		alert("This is a static function.");
	};
});

o.util.DemoClass.prototype = {
	sayHello : function(){
		this.superClass.getUserInfo();
	}
};

O.Class({
	pkg : 'o.util',
	extend : 'o.util.DemoClass'
}, "DemoSubClass", function(){
	var me = this;
	me.getUserInfo = function(){
		alert(1111111111);
		me.superClass.getUserInfo();
	};
});

alert("This is a {1}".formatValue("wangxh",'2','1','3'));

var objSub = new o.util.DemoSubClass();
objSub.getUserInfo();
objSub.sayHello();
alert(O.isInstanceOf(objSub, "o.util.IUser"));
o.util.DemoClass.staticFunc();