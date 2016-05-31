var RB = RB || {};
RB.utils = {
	getUserId: function(){
		return 1;
	},
	objPathString: function( baseObj, stringPath ){
		var path = stringPath.split('.');
		var returnObj = baseObj;
		for( var i = 0; i < path.length; i++ ){
			returnObj = returnObj[path[i]];
		}
		return returnObj;
	}
};