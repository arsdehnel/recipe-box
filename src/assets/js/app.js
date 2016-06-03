$(document).foundation();

$(document).ready(function() {

	RB.utils.querystringToParms();

	RB.utils.setBodyClass();

	RB.boxes.init();
	RB.drawer.init();
	RB.recipes.init();
	RB.ingredients.init();

	$('body')
		.on('click','.drawer-trigger',RB.drawer.handle);

});