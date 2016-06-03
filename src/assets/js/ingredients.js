var RB = RB || {};
RB.ingredients = {
	init: function(){
		$('body')
			.on('submit','#ingredients--maint',this.save)

	},
	load: function( recipeId, sectionId ){

		if( ! (typeof sectionId == 'undefined') ){

			RB.api.ajax({
				url: '/recipes/'+recipeId+'/sections/'+sectionId+'/ingredients',
				type: 'GET',
				complete: function( response, textStatus ){

					var $tbody = $('#section-'+sectionId+' .ingredients-listing tbody');

					if( response.status === 200 ){
						for( var i = 0; i < response.responseJSON.data.length; i++ ){
							$tbody.append(RB.templates.ingredients.row(response.responseJSON.data[i].attributes));
						}
					}else{
						alert('crap');
						console.log(response);
					}
				}
			})

		}else{
			console.error('this probably should not be happening',e);
		}

	},
	save: function(e){
		e.preventDefault();
		var $form = $(e.target).closest('form');
		var formObj = $form.serializeObject();
		formObj.user_id = RB.utils.getUserId();

		if( formObj.hasOwnProperty('id') ){
			RB.ingredients.update($form,formObj);
		}else{
			RB.ingredients.create($form,formObj);
		}
	},
	create: function($form,formObj){

		RB.api.ajax({
			url: $form.attr('action'),
			type: 'POST',
			data: JSON.stringify({
				"ingredient": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 201:
						$form.find('tbody').append(RB.templates.ingredients.row(response.responseJSON.data.attributes));
						$form.find(':input').val('');
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
		})

	}

}
