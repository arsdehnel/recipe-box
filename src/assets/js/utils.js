var RB = RB || {};
RB.utils = {
	getUserId: function(){
		return 1;
	},
	querystringToParms: function(){
		var pairs = location.search.slice(1).split('?');
		RB.parms = {};
		for( var i = 0; i < pairs.length; i++ ){
			var kv = pairs[i].split('=');
			RB.parms[kv[0]] = kv[1];
		}
	},
	setBodyClass: function(){

		var pagePath = window.location.pathname;

		if( pagePath === '/' ){
			$('body').addClass('home');
		}else{

			var pagePath = pagePath.substring(1).replace('.html','').split('/');
			$('body').addClass(pagePath.join('-'));

		}


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