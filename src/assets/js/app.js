$(document).foundation();

const API_ROOT = "http://localhost:4000/api";

const BOX_URLS = {
	"LIST": "/v1/users/1/boxes",
	"SAVE": "/v1/users/1/boxes",
	"DELETE": "/v1/users/1/boxes"
};

var jsonObj = { 
	"box": {
		"user_id": 1,
		"name": "box from ui",
		"read_order": 30,
		"status_code": "A"		
	}
};

$(document).ready(

	(function($){

		$('body')
			.on('click','.ajax-submit',function(e){
				e.preventDefault();
				var $form = $(e.target).closest('form');
				$.ajax({
					url: $form.attr('action'),
					type: $form.attr('method'),
					contentType: 'application/vnd.api+json',
					data: JSON.stringify(jsonObj),
					complete: function(response,textStatus){
						console.log(arguments);
					}					
				})
			})
			.on('click','.ajax-click',function(e){
				e.preventDefault();
				var $link = $(e.target);
				$.ajax({
					url: $link.attr('href'),
					type: $link.attr('data-method'),
					contentType: 'application/vnd.api+json',
					complete: function(response,textStatus){
						console.log(arguments);
					}					
				})
			})
			;

		$.ajax({

			url: API_ROOT+BOX_URLS.LIST,
			type: 'GET',
			complete: function(response,textStatus){
				
				if( response.status === 200 ){

					var data = response.responseJSON.data;	

					for( var i=0; i < data.length; i++ ){
						$('#boxes-tabset').prepend(RecipeBox.templates.boxes.tab(data[i].attributes));
						$('#boxes-tabset-content').append(RecipeBox.templates.boxes.tabPanel(data[i].attributes));
					}

				}

			}

		});

	})(jQuery)

)