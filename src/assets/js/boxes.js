var RB = RB || {};
RB.boxes = {

	init: function(){

		this.load();

		$('body')
			.on('click','#boxes--new',this.new)
			.on('submit','#boxes--create',this.create)
			.on('submit','#boxes--update',this.update)
			.on('click','.boxes--remove',this.remove)
			;

	},
	new: function(e){
		e.preventDefault();
		RB.drawer.open(RB.templates.boxes.create());
	},
	load: function(){

		if( $('#boxes-tabset').size() === 0 ){
			return;
		}

		RB.api.ajax({
			url: '/users/'+RB.utils.getUserId()+'/boxes',
			type: 'GET',
			complete: function(response,textStatus){
				
				if( response.status === 200 ){

					for( var i=0; i < response.responseJSON.data.length; i++ ){
						RB.boxes.tabAppend(response.responseJSON.data[i].attributes);
					}		

				}else{

					alert('RB.boxes.init: '+response.status);
					console.log(response.responseText);

				}

			}
		})

	},
	create: function(e){
		e.preventDefault(); 

		var $form = $(e.target).closest('form');
		var formObj = $form.serializeObject();

		formObj.user_id = RB.utils.getUserId();

		var ajaxRequest = {
			url: $form.attr('action'),
			type: 'POST',
			data: JSON.stringify({
				"box": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 201:
						RB.boxes.tabAppend(formObj);
						RB.drawer.close();
						break;
					case 422:
						// console.log(response.responseJSON);
						for( var prop in response.responseJSON.errors ){
							$form.find(':input[name='+prop+']').before(response.responseJSON.errors[prop]);
						}
						break;
					default:
						alert('ajax-create-submit got a '+response.status);
						console.log(response.responseText);
						break;
				}

			}
		}

		RB.api.ajax(ajaxRequest);

	},
	update: function(e){
		e.preventDefault(); 

		var $form = $(e.target).closest('form');
		var formObj = $form.serializeObject();

		formObj.user_id = RB.utils.getUserId();

		var ajaxRequest = {
			url: $form.attr('action'),
			type: 'PATCH',
			data: JSON.stringify({
				"box": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 200:
						RB.boxes.tabReplace(formObj);
						RB.drawer.close();
						break;
					case 422:
						// console.log(response.responseJSON);
						for( var prop in response.responseJSON.errors ){
							$form.find(':input[name='+prop+']').before(response.responseJSON.errors[prop]);
						}
						break;
					default:
						alert('ajax-create-submit got a '+response.status);
						console.log(response.responseText);
						break;
				}

			}
		}

		RB.api.ajax(ajaxRequest);

	},
	remove: function(e){
		e.preventDefault();

		var $link = $(e.target).closest('a');

		var ajaxRequest = {
			url: $link.attr('href'),
			type: 'DELETE',
			complete: function(response,textStatus){

				switch( response.status ){
					case 204:
						var labelId = $link.closest('.tabs-panel').attr('aria-labelledby');
						$link.closest('.tabs-panel').remove();
						$('#'+labelId).remove();
						break;
					default:
						alert('ajax-delete-click got a '+response.status);
						console.log(response.responseText);

				}

			}					

		}

		RB.api.ajax( ajaxRequest );

	},
	tabAppend: function( dataObj ){ 
		$('#boxes-tabset').append(RB.templates.boxes.tab(dataObj));
		$('#boxes-tabset-content').append(RB.templates.boxes.tabPanel(dataObj));
	},
	tabReplace: function( dataObj ){
		$('#boxes-tabset #box-'+dataObj.id+'-label').parent().replaceWith(RB.templates.boxes.tab(dataObj));
		$('#boxes-tabset-content #box-'+dataObj.id).replaceWith(RB.templates.boxes.tabPanel(dataObj));
	}

};