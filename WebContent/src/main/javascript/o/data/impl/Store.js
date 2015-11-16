O.Class({
	pkg : 'o.data.impl',
	interfaces : ['o.data.IStore', 'o.data.loader.ILoader']
}, "Store", function(config){
	var me = this;
	var mDatas = [];
	var mModel;
	var mSize;
	var mLoader;
	
	O.registNewError('ARRAY_OUT_BOUNDS', {
		cn : '数组下标越界异常',
		en : 'Array index out of bounds'
	});
	
	me.getCount = function(){
		return mDatas.length;
	};
	
	me.getAt = function(indexI){
		if(indexI >= mSize)
			throw O.createError('ARRAY_OUT_BOUNDS');
		return mDatas[indexI];
	};
	
	me.add = function(data){
		if(mModel.checkData(data)){
			mDatas[mSize] = data;
			mSize ++;
		}
		return me;
	};
	
	me.removeAt = function(indexI){
		if(indexI >= mSize)
			throw O.createError('ARRAY_OUT_BOUNDS');
		var retData = mDatas.splice(indexI, 1);
		mSize--;
		return retData;
	};
	
	me.clear = function(){
		mDatas = [];
		mSize = 0;
		return me;
	};
	
	me.load = function(){
		
	};
	
	me.init = function(cfg){
		if( !cfg )
			return;
		var fields = cfg['fields'];
		mModel = O.create('o.data.impl.Model',  {
			fields : fields
		});
		mSize = 0;
		return me;
	};
	
	me.init(config);
});