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
}, "DemoSubClass", function(config){
	var me = this;
	o.io.Logger.info(config);
	me.getUserInfo = function(){
		me.superClass.getUserInfo();
	};
});

var objSub = O.create('o.util.IUser', function(config){
	var me = this;
	
	me.getUserInfo = function(){
		return config.property;
	};
	
	me.createUserInfo = function(){
		
	};
},{
	property : 12345
});

alert(objSub.getUserInfo());

var reqeustSeq = new o.util.SeqAjax();
reqeustSeq.pushRequest();

reqeustSeq.pushRequest([{
	url : './testJson.json',
	type : 'json',
	success : function(responseJson){
		alert("1   " + responseJson);
	}
},{
	url : './testJson.json',
	type : 'json',
	success : function(responseJson){
		alert("2   " + responseJson);
	}
}]).doRequest();



