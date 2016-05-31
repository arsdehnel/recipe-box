var RB = RB || {};
RB.api = {
	ajax: function( requestObj ){
		$.ajax({
			url: 'http://localhost:4000/api/v1'+requestObj.url,
			type: requestObj.type,
			contentType: 'application/vnd.api+json',
			data: requestObj.data,
			complete: requestObj.complete
		})
	}
}