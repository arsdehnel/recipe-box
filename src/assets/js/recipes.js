var RB = RB || {};
RB.recipes = {

	init: function(){
		$('body')
			.on('click','.recipes--new',this.new)
			.on('click','.recipes--edit',this.edit)
			.on('submit','#recipes--maint',this.save)
			.on('submit','#instructions--maint',this.instructionsSave)
			.on('change.zf.tabs','#sections-tabset',this.tabChange)

		if( $('body').hasClass('recipes-view') ){
			this.view();
		}			

	},
	new: function(e){

		var $trigger = $(e.target).closest('a, button');

		RB.api.ajax({
			url: '/users/'+RB.utils.getUserId()+'/boxes',
			type: 'GET',
			complete: function(response,textStatus){
				
				if( response.status === 200 ){

					var boxes = response.responseJSON.data;
					RB.drawer.open(RB.templates.recipes.maint({
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
	save: function(e){
		e.preventDefault();
		var $form = $(e.target).closest('form');
		var formObj = $form.serializeObject();
		formObj.user_id = RB.utils.getUserId();

		if( formObj.hasOwnProperty('id') ){
			RB.recipes.update($form,formObj);
		}else{
			RB.recipes.create($form,formObj);
		}

	},
	create: function($form,formObj){

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
	update: function($form,formObj){

		RB.api.ajax({
			url: $form.attr('action')+'/'+formObj.id,
			type: 'PATCH',
			data: JSON.stringify({
				"recipe": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 200:
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
		})

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
						window.location.href = '/recipes/view.html?recipeId='+recipeId;
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
	edit: function(e){

		var $trigger = $(e.target).closest('a, button');

		RB.api.ajax({
			url: '/recipes/'+$trigger.attr('data-recipe-id'),
			type: 'GET',
			complete: function( response, textStatus ){

				RB.drawer.open(RB.templates.recipes.maint(response.responseJSON.data.attributes));

			}
		})

	},
	view: function(){
		
		RB.api.ajax({
			url: '/recipes/'+RB.parms.recipeId,
			type: 'GET',
			complete: function( response, textStatus ){

				$('#recipe-wrapper').html(RB.templates.recipes.view(response.responseJSON.data.attributes));
				RB.recipes.loadSections(RB.parms.recipeId);
				var elem = new Foundation.Tabs($('#sections-tabset'));

			}
		})

	},
	loadSections: function( recipeId ){
		RB.api.ajax({
			url: '/recipes/'+recipeId+'/sections',
			type: 'GET',
			complete: function( response, textStatus ){

				if( response.status === 200 ){
					for( var i=0; i < response.responseJSON.data.length; i++ ){
						RB.recipes.sectionTabAppend($.extend({},response.responseJSON.data[i].attributes,{recipeId:recipeId}));
					}							
				}else{
					alert('damn');
					console.log(response);
				}

			}
		})
	},
	tabChange: function(e){

		var sectionId = $(e.target).find('.is-active').attr('data-section-id');

		RB.ingredients.load(RB.parms.recipeId,sectionId);

		if( ! (typeof sectionId == 'undefined') ){

			RB.api.ajax({
				url: '/recipes/'+RB.parms.recipeId+'/sections/'+sectionId+'/instructions',
				type: 'GET',
				complete: function( response, textStatus ){

					var $tbody = $('#section-'+sectionId+' .instructions-listing tbody');

					if( response.status === 200 ){
						for( var i = 0; i < response.responseJSON.data.length; i++ ){
							$tbody.append(RB.templates.recipes.instructionRow(response.responseJSON.data[i].attributes));
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
	sectionTabAppend: function( dataObj ){ 
		$('#sections-tabset').append(RB.templates.recipes.sectionTab(dataObj));
		$('#sections-tabset-content').append(RB.templates.recipes.sectionTabPanel(dataObj));
	},
	sectionTabReplace: function( dataObj ){
		$('#sections-tabset #box-'+dataObj.id+'-label').parent().replaceWith(RB.templates.recipes.sectionTab(dataObj));
		$('#sections-tabset-content #box-'+dataObj.id).replaceWith(RB.templates.recipes.sectionTabPanel(dataObj));
	},
	instructionsSave: function(e){
		e.preventDefault();
		var $form = $(e.target).closest('form');
		var formObj = $form.serializeObject();
		formObj.user_id = RB.utils.getUserId();

		if( formObj.hasOwnProperty('id') ){
			RB.recipes.instructionsUpdate($form,formObj);
		}else{
			RB.recipes.instructionsCreate($form,formObj);
		}
	},
	instructionsCreate: function($form,formObj){

		RB.api.ajax({
			url: $form.attr('action'),
			type: 'POST',
			data: JSON.stringify({
				"instruction": formObj
			}),
			complete: function(response,textStatus){

				switch( response.status ){
					case 201:
						$form.find('tbody').append(RB.templates.recipes.instructionRow(response.responseJSON.data.attributes));
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