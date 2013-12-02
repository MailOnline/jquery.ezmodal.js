/**
jquery.ezmodal.js 0.0.1
=======================
A extensible jQuery modal.

*/

/*jslint browser: true*/
/*global jQuery*/

(function ($) {
    "use strict";

    /*this 2 functions are from "transitions.js" of twitter bootstrap*/
    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
          'WebkitTransition' : 'webkitTransitionEnd'
        , 'MozTransition'    : 'transitionend'
        , 'OTransition'      : 'oTransitionEnd otransitionend'
        , 'transition'       : 'transitionend'
        }

        for (var name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return { end: transEndEventNames[name] }
          }
        }
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false, $el = this
        $(this).one($.support.transition.end, function () { called = true })

        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)

        return this
    };

    $.support.transition = transitionEnd();

    var numberOfModals = 0; // I use this to have a different namespace for each modal
    var methods = {
        init: function (options) {
            var defaults = {
                container: 'body', // the backdrop container

                // these functions can be used as entry point
                // for complex animations for example. But I suggest to use CSS3 transitions.
                // arguments: ui is an object with: container, backdrop, wrapper and modal 
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

                center: false,         // it centers the modal on the screen
                
                // use this options if you want to load the content of the modal using xmlhttprequest
                // ajaxUrl is passed to the $(element).load function. So you can use also a selector
                // to filter the html: "http://www.example.com/page.html #content"
                ajaxUrl: false, // can be false, a string or a function that returns a url
                ajaxRefreshEverytime: true, // refresh the modal when reopened
                ajaxLoadOnInit: false // it loads on init (instead of on open)
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var o = options,
                    addClasses, removeClasses, loadHTML,
                    ui = {},
                    evtNS = '.ez-modal-' + numberOfModals++,
                    alreadyLoaded = false,
                    toBeCentered = o.center, centerModal;

                ui.container = $(o.container);
                ui.backdrop = ui.container.children(".ez-modal-backdrop");
                if (!ui.backdrop.length){
                    ui.backdrop = $('<div class="ez-modal-backdrop"></div>').appendTo(ui.container);
                }
                 
                ui.modal = $(this).addClass("ez-modal");

                addClasses = function(){
                    ui.backdrop.show();
                    ui.modal.show();

                    setTimeout(function (){
                        ui.container.addClass("ez-modal-container-on");
                        ui.backdrop.addClass("ez-modal-backdrop-on");
                        ui.modal.addClass("ez-modal-on");
                    }, 30);

                    ui.modal.attr("aria-hidden", "false")                   
                };

                removeClasses = function (){
                    ui.container.removeClass("ez-modal-container-on");
                    ui.backdrop.removeClass("ez-modal-backdrop-on");
                    ui.modal.removeClass("ez-modal-on");
                    ui.modal.attr("aria-hidden", "true")                   

                    if ($.support.transition){

                        ui.container.addClass("ez-modal-container-off")
                        .one($.support.transition.end, function (){
                            ui.container.removeClass("ez-modal-container-off");
                        })
                        .emulateTransitionEnd(600);

                        ui.backdrop.addClass("ez-modal-backdrop-off")
                        .one($.support.transition.end, function (){
                            ui.backdrop.removeClass("ez-modal-backdrop-off")
                            .hide();
                        })
                        .emulateTransitionEnd(600);

                        ui.modal.addClass("ez-modal-off")
                        .one($.support.transition.end, function (){
                            ui.modal.removeClass("ez-modal-off")
                            .hide();
                        })
                        .emulateTransitionEnd(600);

                    }
                    else {
                        ui.backdrop.hide();
                        ui.modal.hide();
                    }
                        

                };

                centerModal = function (){
                    if (toBeCentered){
                        ui.modal.css("margin-left",0);
                        ui.modal.css("margin-left","-" + (ui.modal.outerWidth(true) / 2) + "px");
                    }
                    toBeCentered = false;

                };

                loadHTML = o.ajaxUrl && function (cb){
                    if (!alreadyLoaded || o.ajaxRefreshEverytime){
                        ui.modal.load($.isFunction(o.ajaxUrl) && o.ajaxUrl() || o.ajaxUrl, function (){
                            alreadyLoaded = true;
                            toBeCentered = o.center;                            
                            o.onAfterLoad(ui, o);
                            cb();
                        });
                    }
                    else {
                        cb();
                    }
                } || function (cb){cb()};

                if (o.ajaxLoadOnInit) {
                    loadHTML(function (){});
                }

                ui.modal.bind('ez-modal-open', function (){
                    loadHTML(function (){
                        o.onBeforeOpen(ui, o, function (){
                            addClasses();
                            centerModal();
                            o.onAfterOpen(ui, o);                        
                        });

                    });
                });

                ui.modal.bind('ez-modal-close', function (){
                    o.onBeforeClose(ui, o, function (){
                        removeClasses();   
                        o.onAfterClose(ui, o);
                    });
                });

                if(o.autoOpen) {
                    ui.modal.trigger('ez-modal-open');
                } 

                if(o.closeKeyCodes){                    
                    $(document).on("keydown" + evtNS, function (e) {
                        // key pressed
                        if ($.inArray(e.keyCode, o.closeKeyCodes) !== -1) {
                            ui.modal.trigger('ez-modal-close');
                        }
                    });                    
                }

                if (o.triggerOnClick){
                    $(document).on("click" + evtNS, o.triggerOnClick, function (){
                        ui.modal.trigger('ez-modal-open');
                    });
                }

                ui.modal.on("click" + evtNS, ".ez-modal-close", o.closeButtonClass,function (evt){
                    ui.modal.trigger('ez-modal-close');
                });

                if (o.closeOnBackgroundClick){
                    ui.backdrop.on("click" + evtNS,function (){
                        ui.modal.trigger('ez-modal-close');
                    });
                }

                ui.modal.bind('ez-modal-destroy', function (){
                    ui.backdrop.off(evtNS);
                    ui.modal.off(evtNS);
                    $(document).off(evtNS);
                    removeClasses();
                });
            });

        },
        open: function (){
            this.trigger('ez-modal-open');
        },
        close: function (){
            this.trigger('ez-modal-close');
        },
        destroy: function (){
            this.trigger('ez-modal-destroy');
        }

    };

    $.fn.ezmodal = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        $.error('Method ' + method + ' does not exist on jQuery.ezmodal');

    };

}(jQuery));
