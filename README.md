jquery.ezmodal.js 0.0.1
=======================
A extensible jQuery modal.

Instructions
------------
This is your modal:
    <div class="my-modal-selector ez-modal-modal">
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

And the html becomes:

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

Options are explained below (see the comments).
