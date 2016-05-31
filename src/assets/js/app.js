$(document).foundation();

$(document).ready(function() {

	RB.boxes.init();
	RB.drawer.init();
	RB.recipes.init();

	$('body')
		.on('click','.drawer-trigger',RB.drawer.handle);

});