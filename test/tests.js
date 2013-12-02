module( "Basic behaviour", {
	setup: function (){
		$("#modal1").ezmodal({
			center: true,
           	triggerOnClick: ".trigger-modal1",
        });
		var modal2 = $('<div id="modal2" class="ez-modal" aria-hidden="true" role="dialog"></div>').ezmodal({
			ajaxUrl: "ajax.html",
			triggerOnClick: ".trigger-modal2",
			center: true
		}).appendTo('body');        
	}
} );

test( "init", function() {
  ok( $('.ez-modal-backdrop').length === 1, "Backdrop is ok" );
});

asyncTest( "open", function() {
  $("#modal1").ezmodal("open");
  setTimeout(function (){
  	ok($("#modal1").hasClass('ez-modal-on'), "Modal is on" );
  	ok($("#modal1").is(':visible'), "Modal is visible" );
  	ok($("body").hasClass('ez-modal-container-on'), "Container is on" );
  	ok($(".ez-modal-backdrop").hasClass('ez-modal-backdrop-on'), "Backdrop is on" );
  	$("#modal1").ezmodal("close");
	start();
  }, 650);
});

asyncTest( "open ajax", function() {
  $("#modal2").ezmodal("open");
  setTimeout(function (){
  	ok($("#modal2").hasClass('ez-modal-on'), "Modal is on" );
  	ok($("#modal2").is(':visible'), "Modal is visible" );
  	ok($("body").hasClass('ez-modal-container-on'), "Container is on" );
  	ok($(".ez-modal-backdrop").hasClass('ez-modal-backdrop-on'), "Backdrop is on" );
  	//ok($(".ez-modal-backdrop").hasClass('ez-modal-backdrop-on'), "Backdrop is on" );
    $("#modal2").ezmodal("close");
	start();
  }, 650);
});
