jquery.ezmodal.js 0.0.1
=======================
A extensible jQuery modal.

Instructions
------------
This is your modal:

    <div class="my-modal-selector ez-modal" aria-hidden="true" role="dialog">
        <!-- this is you modal -->
    </div>

Initialize with:
 
    $(".my-modal-selector").ezmodal(options)

    <body>
        ...
        <div class="my-modal-selector ez-modal" aria-hidden="true" role="dialog">
            <!-- this is you modal -->
        </div>
        ...
        <div class="ez-modal-backdrop"></div>

Open with:

    $(".my-modal-selector").trigger('ez-modal-open')
    or
    $(".my-modal-selector").ezmodal("open");

And the html becomes:

    <body class="ez-modal-container-on">
        ...
        <div class="my-modal-selector ez-modal ez-modal-on" aria-hidden="false" role="dialog">
            <!-- this is you modal -->
        </div>
        ...
        <div class="ez-modal-backdrop ez-modal-backdrop-on"></div>

Close with:

    $(".my-modal-selector").trigger('ez-modal-close')
    or
    $(".my-modal-selector").ezmodal("close");

And the html becomes (during the animation):

    <body class="ez-modal-container-off">
        ...
        <div class="my-modal-selector ez-modal ez-modal-off" aria-hidden="false" role="dialog">
            <!-- this is you modal -->
        </div>
        ...
        <div class="ez-modal-backdrop ez-modal-backdrop-off"></div>

and then:

    <body>
        ...
        <div class="my-modal-selector ez-modal" aria-hidden="false" role="dialog">
            <!-- this is you modal -->
        </div>
        ...
        <div class="ez-modal-backdrop"></div>

Destroy (unbind all events) with:

    $(".my-modal-selector").trigger('ez-modal-destroy')
    or
    $(".my-modal-selector").ezmodal("destroy");

Give a look to the CSS to have an idea on how to style the modal.

Options
-------

    container: 'body', // the modal container

    // these functions can be used as entry point
    // for complex animations. But I suggest to use CSS3 transitions.
    // arguments: ui is an object with: container, backdrop, wrapper and modal
    //            opt is the original options object  
    onBeforeOpen: function (ui, opt, cb){cb();},
    onAfterOpen: function (ui, opt){},
    onBeforeClose: function (ui, opt, cb){cb();},
    onAfterClose: function (ui, opt){},
    onAfterLoad: function (ui, opt){}, // it is called after loading a page (see below)

    closeOnBackgroundClick: true, // close backdrop when someone clicks on the backdrop

    triggerOnClick: false, // the modal opens when you click on this element

    autoOpen: false,      // opens the modal after init
    closeKeyCodes: [27],  // clicking on one of this keys triggers the close. 
                          // Set to null to not close using keys

    center: false,         // it centers the modal on the screen (you should use css if possible)
    
    // use this options if you want to load the content of the modal using xmlhttprequest
    // ajaxUrl is passed to the $(element).load function. So you can use also a selector
    // to filter the html: "http://www.example.com/page.html #content"
    ajaxUrl: false, // can be false, a string or a function that returns a url
    ajaxRefreshEverytime: true, // refresh the modal when reopened
    ajaxLoadOnInit: false // it loads on init (instead of on open)

