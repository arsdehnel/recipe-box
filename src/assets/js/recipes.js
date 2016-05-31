var RB = RB || {};
RB.recipes = {

	init: function(){
		$('body')
			.on('click','.recipes--new',this.new)
			.on('submit','#recipes--create',this.create)
			.on('submit','#recipes--update',this.update)

	},

	new: function(e){

		var $trigger = $(e.target).closest('a, button');

		RB.api.ajax({
			url: '/users/'+RB.utils.getUserId()+'/boxes',
			type: 'GET',
			complete: function(response,textStatus){
				
				if( response.status === 200 ){

					var boxes = response.responseJSON.data;
					RB.drawer.open(RB.templates.recipes.create({
						boxes: boxes,
						box_id: $trigger.attr('data-box-id')
					}));

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
				"recipe": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 201:
						RB.recipes.addToBox(formObj.box_id,response.responseJSON.data.id);
						// RB.drawer.close();
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
	addToBox: function( boxId, recipeId ){

		var formObj = {
			user_id: RB.utils.getUserId(),
			recipe_id: recipeId,
			box_id: boxId
		}

		RB.api.ajax({
			url: '/users/'+RB.utils.getUserId()+'/boxes/'+boxId+'/cards',
			type: 'POST',
			data: JSON.stringify({
				"card": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 201:
						RB.recipes.initialSection(recipeId);
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
		});

	},
	initialSection: function( recipeId ){

		var formObj = {
			recipe_id: recipeId,
			name: 'Main',
			read_order: 1
		}

		RB.api.ajax({
			url: '/recipes/'+recipeId+'/sections',
			type: 'POST',
			data: JSON.stringify({
				"section": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 201:
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
		});

	},
	update: function(e){
		e.preventDefault();
	}


}