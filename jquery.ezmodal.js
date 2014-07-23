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

    var NS = 'ez-modal';
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
                closeKeyCodes: "27",  // a space separated list of numbers:
                                      // clicking on one of this keys triggers the close. 
                                      // Set to empty to not close using keys

                center: false,         // it centers the modal on the screen
                
                // use this options if you want to load the content of the modal using xmlhttprequest
                // ajaxUrl is passed to the $(element).load function. So you can use also a selector
                // to filter the html: "http://www.example.com/page.html #content"
                ajaxUrl: false, // can be false, a string or a function that returns a url
                ajaxRefreshEverytime: true, // refresh the modal when reopened
                ajaxLoadOnInit: false, // it loads on init (instead of on open)
                ajaxErrorMessage: "Sorry, but something went wrong. Please come back later and try again."
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var o = options,
                    showModal, hideModal, showBackdrop, loadHTML,
                    ui = {},
                    evtNS = '.' + NS + '-' + (numberOfModals++),
                    alreadyLoaded = false,
                    toBeCentered = o.center, centerModal,
                    closeKeyCodes = $.map(o.closeKeyCodes.split(" "), function (el){
                        if (el && el.length){
                            return parseInt(el, 10)
                        }
                    });;

                ui.container = $(o.container);
                ui.backdrop = ui.container.children('.' + NS + '-backdrop');
                if (!ui.backdrop.length){
                    ui.backdrop = $('<div class=' + NS + '-backdrop></div>').appendTo(ui.container);
                }
                 
                ui.modal = $(this).addClass(NS);
                ui.modal.data('modal', 'active');

                showBackdrop = function(){
                    ui.backdrop.show();
                    setTimeout(function (){
                        ui.backdrop.addClass(NS + '-backdrop-on');
                    }, 30);
                };

                showModal = function(){
                    ui.modal.show();
                    centerModal();

                    setTimeout(function (){
                        ui.container.addClass(NS + '-container-on');
                        ui.modal.addClass(NS + "-on");
                        ui.modal.attr("aria-hidden", "false");
                        ui.modal.focus();                   
                        ui.modal.trigger({type: NS + "-after-open", ui: ui, opt: o});
                    }, 30);

                };

                hideModal = function (){
                    ui.container.removeClass(NS + "-container-on");
                    ui.backdrop.removeClass(NS + "-backdrop-on");
                    ui.modal.removeClass(NS + "-on");
                    ui.modal.attr("aria-hidden", "true")                   

                    if ($.support.transition){

                        ui.container.addClass(NS + "-container-off")
                        .one($.support.transition.end, function (){
                            ui.container.removeClass(NS + "-container-off");
                        })
                        .emulateTransitionEnd(600);

                        ui.backdrop.addClass(NS + "-backdrop-off")
                        .one($.support.transition.end, function (){
                            ui.backdrop.removeClass(NS + "-backdrop-off")
                            .hide();
                        })
                        .emulateTransitionEnd(600);

                        ui.modal.addClass(NS + "-off")
                        .one($.support.transition.end, function (){
                            ui.modal.removeClass(NS + "-off")
                            .hide();
                            ui.modal.trigger({type: NS + "-after-close", ui: ui, opt: o});
                        })
                        .emulateTransitionEnd(600);

                    }
                    else {
                        ui.backdrop.hide();
                        ui.modal.hide();
                        ui.modal.trigger({type: NS + "-after-close", ui: ui, opt: o});
                    }
                        

                };

                centerModal = function (){
                    if (toBeCentered){
                        ui.modal.css("margin-left",0);
                        ui.modal.css("margin-left","-" + (ui.modal.outerWidth(true) / 2) + "px");
                        ui.modal.css("margin-top",0);
                        ui.modal.css("margin-top","-" + (ui.modal.outerHeight(true) / 2) + "px");
                    }
                    toBeCentered = false;

                };

                loadHTML = o.ajaxUrl && function (cb){
                    if (!alreadyLoaded || o.ajaxRefreshEverytime){
                        ui.modal.trigger({type: NS + "-before-load", ui: ui, opt: o});
                        ui.modal.load($.isFunction(o.ajaxUrl) && o.ajaxUrl() || o.ajaxUrl, function (response, status, req){
                            if (status === "error"){
                                ui.modal.html('<div class="' + NS +'-error '+ NS +'-close" >' + o.ajaxErrorMessage + '</div>');
                            }
                            else {
                                alreadyLoaded = true;
                                toBeCentered = o.center;                            
                            }
                            ui.modal.trigger({type: NS + "-after-load", ui: ui, opt: o});
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

                ui.modal.on(NS + '-open' + evtNS, function (){
                    showBackdrop();
                    ui.modal.trigger({type: NS + "-before-open", ui: ui, opt: o});
                    loadHTML(function (){
                        showModal();
                    });
                });

                ui.modal.on(NS + '-close' + evtNS, function (){
                    ui.modal.trigger({type: NS + "-before-close", ui: ui, opt: o});
                    hideModal();   
                });

                if(o.autoOpen) {
                    ui.modal.trigger(NS + '-open');
                } 

                if(closeKeyCodes){                    
                    $(document).on("keydown" + evtNS, function (e) {
                        // key pressed
                        if(ui.modal.is('.' + NS + '-on')){
                            if ($.inArray(e.keyCode, closeKeyCodes) !== -1) {    
                                ui.modal.trigger(NS + '-close');
                                return false;
                            }                            
                        }
                    });                    
                }

                if (o.triggerOnClick){
                    $(document).on("click" + evtNS, o.triggerOnClick, function (evt){
                        ui.modal.trigger(NS + '-open');
                        return false;
                    });
                }

                if (o.toggleButtons){
                    $(o.toggleButtons).each(function (){
                        $(this).data('modal', ui.modal);
                    });
                }

                ui.modal.on("click" + evtNS, '.' + NS + '-close',function (evt){
                    ui.modal.trigger(NS + '-close');
                    return false;
                });

                if (o.closeOnBackgroundClick){
                    ui.backdrop.on("click" + evtNS,function (){
                        ui.modal.trigger(NS + '-close');
                        return false;
                    });
                }

                ui.modal.bind(NS + '-destroy' + evtNS, function (){
                    ui.backdrop.off(evtNS);
                    ui.modal.off(evtNS);
                    $(document).off(evtNS);
                    hideModal();
                    ui.modal.removeData('modal');
                    
                });

            });

        },
        open: function (){
            this.trigger(NS + '-open');
        },
        close: function (){
            this.trigger(NS + '-close');
        },
        destroy: function (){
            this.trigger(NS + '-destroy');
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
    $(document).on('click.' + NS, '[data-toggle="modal"]', function (e) {
        var $this   = $(this);
        if ($this.attr('data-on-mobile')) {
            $(this).attr("href",$this.attr('data-on-mobile'));
            return;
        }
        
        var href    = $this.attr('href'),
            target = $this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')), //strip for ie7
            modalId = $this.data('modal-id'),
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
            if (modalId){
                $target = $('#' + modalId);
            }
            else {
                $target = $this.data('modal');
            }
            if (!$target || $target.length == 0){
                $target = $('<div class="' + NS + '" aria-hidden="true" role="dialog"></div>');

                modalId && $target.attr('id', modalId);
                
                $target
                .ezmodal($.extend({ajaxUrl: target, toggleButtons: $this}, $this.data()))
                .appendTo('body');
            }
        }

        $target.ezmodal('open');
        e.preventDefault();
    });


}(jQuery));
