$(document).foundation();

const BOX_URL = "http://localhost:4000/api/v1/users/1/boxes";

$(document).ready(

	(function($){

		$.ajax({
			url: BOX_URL,
			complete: function(response,textStatus){
				console.log(arguments);
			}
		});

	})(jQuery)

)