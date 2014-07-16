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

    var modal3 = $('<div id="modal4" class="ez-modal" aria-hidden="true" role="dialog"></div>').ezmodal({
      ajaxUrl: "ajax.html",
      ajaxRefreshEverytime: false,
      triggerOnClick: ".trigger-modal4",
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
    $("#modal2").ezmodal("close");
	start();
  }, 650);
});

asyncTest( "open ajax without refreshing", function() {
  $("#modal4").ezmodal("open");
  setTimeout(function (){
    $("#modal4").html('changed!');
    $("#modal4").ezmodal("close");

    setTimeout(function (){
      $("#modal4").ezmodal("open");
      setTimeout(function (){
        equal($("#modal4").html(), "changed!");
        $("#modal4").ezmodal("close");

        start();
      }, 650);

    }, 650);

  }, 650);

});


asyncTest( "open ajax without refreshing (using id html5 api)", function() {
  $("#trigger5").click();
  setTimeout(function (){
    var $modal5 = $("#modal5");
    equal($modal5.length, 1, "The modal has the given ID");
    $("#trigger5").click();

    $("#modal5").html('changed!');
    $('.ez-modal-backdrop').click(); // closing

    setTimeout(function (){
      $("#trigger5").removeData('modal');
      $("#trigger5").click();
      setTimeout(function (){
        equal($("#modal5").html(), "changed!");
        $('.ez-modal-backdrop').click(); // closing

        start();
      }, 650);

    }, 650);

  }, 650);

});