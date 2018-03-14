

/**
 *  bpToggableField
 *  Toggle function to set the visible state show() or hide() when the values sets in the toggle_when_not
 *  Allow multiple value to show the same field
 *  Can change
 *  based on @OwenMelbz toggle field. extended by @mamarmite for select2 type of fields.
 */
(function( $ ) {

    $.fn.bpToggableField = function( options ) {


        // Default settings:
        var defaults = {
                dataName: "field-toggles",
            },
            settings = $.extend( {}, defaults, options ),
            hiddenFields    = [];

        return this.each(function(){

            //setup based properties. @todo : make global vars more viewable with g_ ? or find an ES6 convention ready.
            var $self           = $(this),
                toggles         = $self.data(settings.dataName),
                value           = $self.val(),
                fieldSet        = $self.attr('name');

            this.init           = init;
            this.toggle         = toggle;

            function init() {

                hiddenFields[ fieldSet ] = hiddenFields[ fieldSet ] || [];
                
                //Loop for each values set in the showWhen //may be overkill if a lots id and field.
                if (hiddenFields[ fieldSet ].length == 0)
                {
                    var lastFieldName = "";
                    //use general jquery each method, because it's missed in js I think.
                    $.each( toggles, function(idx, obj)
                    {
                        var fields = obj,//this.toggles[idx],
                            target_showWhenIds = "",
                            target_showWhenParams = "";

                        //loop through index here ?
                        $.each(fields, function(name, params)
                        {
                            var f = $('[name="'+name+'"]');
                            if( f.length )
                            {
                                hiddenFields[ fieldSet ].push(f);
                                target_showWhenIds = f.data("showWhen") ? f.data("showWhen")+","+idx : idx;//the id or id's list
                                target_showWhenParams = f.data("showWhenParams") ? f.data("showWhenParams")+","+params : params;
                                
                                f.data("showWhen",target_showWhenIds);//Set the main objet on every field
                                f.data("field-toggles", this.toggles);//Set the main objet on every field
                                f.data("sync",0);
                                f.parents('.form-group').hide();
                            }
                            lastFieldName = name;
                        });
                    });
                }
                this.toggle();

            };//end of init function.

            /**
             *  Passe trough the hiddenFields and set the field visible or not.
             */
            function toggle() {

                //setup based properties. @todo : make global vars more viewable with g_ ? or find an ES6 convention ready.
                var $self           = $(this),
                    value           = $self.val(),
                    fieldSet        = $self.attr('name');

                // if the value is found in the toggles array, we passed through it.
                if ( typeof toggles[ value ] !== "undefined" ) {

                    //loop through the showWhen array (it's always)
                    $.each(hiddenFields[ fieldSet ], function(idx, targetField)
                    {
                        targetFieldShowWhen = targetField.data('showWhen').split(",");
                        
                        /// if the value is in array.
                        if (targetFieldShowWhen[targetFieldShowWhen.indexOf(value)] == value)
                        {
                            targetField.parents('.form-group').show();
                            targetField.data("sync", value);
                        }
                        else
                        {
                            targetField.parents('.form-group').hide();
                        }

                        targetLabel = toggles[value][targetField.attr("name")];
                        //change the label
                        if (targetLabel)
                        {
                            //@todo : check if Label exist.
                            targetField.siblings("label").text(targetLabel["label"]);
                        }
                    });
                    //dont reset hiddenFields here. Worst case we call show on an already showed item.
                }
                else
                {
                    //hide all field if we are not set.
                    $.each(hiddenFields[ fieldSet ], function(idx, targetField)
                    {
                        targetField.parents('.form-group').hide();
                    });
                }

            };//end of toggle function.

            // Target element with class.
            $self.on('change', function() {
                return this.toggle();
            });

            this.init();
            return this;
        });

    }   //end of bpToggableField plugin.

}( jQuery ));
