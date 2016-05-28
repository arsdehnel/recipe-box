$(document).foundation();

const BOX_URLS = {
	"LIST": "http://localhost:4000/api/v1/users/1/boxes",
	"SAVE": "http://localhost:4000/api/v1/users/1/boxes"
};

var jsonObj = { 
	"box": {
		"user_id": 1,
		"name": "box from ui",
		"read_order": 30,
		"status_code": "A"		
	}
};

// curl -i -H "Accept: application/vnd.api+json" -H 'Content-Type:application/vnd.api+json' -X POST -d '
// {"box":{"user_id": 1, "name":"other thing", "status_code":"A", "read_order": 20 }}' 
// http://localhost:4000/api/v1/users/1/boxes

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
			});

		$.ajax({
			url: BOX_URLS.LIST,
			type: 'GET',
			complete: function(response,textStatus){
				console.log(arguments);
			}
		});

	})(jQuery)

)