var RB = RB || {};
RB.drawer = {
	init: function() {

		$('body')
			.on('click','.drawer-close',this.close);

	},
	handle: function(e){
		e.preventDefault();
		var $trigger = $(e.target).closest('.drawer-trigger');
		if( $trigger.hasClass('drawer-close') ){
			RB.drawer.close();
		}else{
			var tplData = {};
			var tpl = RB.utils.objPathString(RB.templates,$trigger.attr('data-template'));

			if( $trigger.attr('href') !== '#' ){
				RB.api.ajax({
					url: $trigger.attr('href'),
					type: 'GET',
					complete: function(response,textStatus){

						switch( response.status ){
							case 200:
								tplData = response.responseJSON.data.attributes;
								RB.drawer.open(tpl(tplData));
								break;
							default:
								alert('drawer-handle got a '+response.status);
								break;
						}

					}	

				})
			}else{
				RB.drawer.open(tpl(tplData));
			}
		}
	},
	open: function( html ){
		$('#drawer-content').html(html).parent().addClass('open');
	},
	close: function(){
		$('#recipe-box-drawer').html('').removeClass('open');
	}
}
