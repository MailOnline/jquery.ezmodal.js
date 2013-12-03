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

                closeOnBackgroundClick: true, // close backdrop when someone clicks on the backdrop

                triggerOnClick: false, // the modal opens when you click on this element

                toggleButtons: false, // this is a list of buttons that trigger the modal
                                      // (it used to link the buttons to the modal)

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
                ui.modal.data('modal', 'active');

                addClasses = function(){
                    ui.backdrop.show();
                    ui.modal.show();

                    setTimeout(function (){
                        ui.container.addClass("ez-modal-container-on");
                        ui.backdrop.addClass("ez-modal-backdrop-on");
                        ui.modal.addClass("ez-modal-on");
                    }, 30);

                    ui.modal.attr("aria-hidden", "false");
                    ui.modal.focus();                   
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
                            ui.modal.trigger({type: "ez-modal-after-load", ui: ui, opt: o});
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
                        addClasses();
                        centerModal();
                        ui.modal.trigger({type: "ez-modal-after-open", ui: ui, opt: o});
                    });
                });

                ui.modal.bind('ez-modal-close', function (){
                    removeClasses();   
                    ui.modal.trigger({type: "ez-modal-after-close", ui: ui, opt: o});
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
                    $(document).on("click" + evtNS, o.triggerOnClick, function (evt){
                        ui.modal.trigger('ez-modal-open');
                        evt.preventDefault();
                    });
                }

                if (o.toggleButtons){
                    $(o.toggleButtons).each(function (){
                        $(this).data('modal', ui.modal);
                    });
                }

                ui.modal.on("click" + evtNS, ".ez-modal-close", o.closeButtonClass,function (evt){
                    ui.modal.trigger('ez-modal-close');
                    evt.preventDefault();
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
                    ui.modal.removeData('modal');
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

    /* HTML5 data API */
    $(document).on('click.ez-modal', '[data-toggle="modal"]', function (e) {
        var $this   = $(this),
            href    = $this.attr('href'),
            target = $this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')), //strip for ie7
            $target;

        // not ajax
        if(target.indexOf('#') === 0){
            $target = $(target);
            if (!$target.data('modal')){
                $target.ezmodal($.extend($target.data(), $this.data()));
            }
        }
        // ajax
        else {
            if (!$this.data('modal')){
                $target = $('<div class="ez-modal" aria-hidden="true" role="dialog"></div>');
                $target
                .ezmodal($.extend({ajaxUrl: target, toggleButtons: $this}, $this.data()))
                .appendTo('body');
            }
            else {
                $target = $this.data('modal');
            }
        }

        $target.ezmodal('open');
        e.preventDefault();
    });


}(jQuery));
