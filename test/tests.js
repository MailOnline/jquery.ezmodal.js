$("#modal1").ezmodal({center: true});

$(".trigger-modal1").click(function (){
	$("#modal1").ezmodal("open");
});

var modal2 = $('<div id="modal2" class="ez-modal" aria-hidden="true" role="dialog"></div>').ezmodal({
	ajaxUrl: "ajax.html",
	triggerOnClick: ".trigger-modal2",
	center: true
}).appendTo('body');

// $(".trigger-modal2").click(function (){
// 	modal2.ezmodal("open");
// });

