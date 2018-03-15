

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
            settings            = $.extend( {}, defaults, options ),
            hiddenFields        = [],
            _allfields          = [];



        return this.each(function(){

            //setup based properties. @todo : make global vars more viewable with g_ ? or find an ES6 convention ready.
            var $self                   = $(this),
                toggles                 = $self.data(settings.dataName),
                value                   = $self.val(),
                fieldSet                = $self.attr('name');

            this.init                   = init;
            this.toggle                 = toggle;
            this.haveCheckedField       = haveCheckedField;
            this.isValueChecked         = isValueChecked;

            _allfields.push($self);

            function init() {

                hiddenFields[ fieldSet ] = hiddenFields[ fieldSet ] || [];
                
                //Loop for each values set in the showWhen //may be overkill if a lots id and field.
                if (hiddenFields[ fieldSet ].length == 0)
                {
                    var lastFieldName = "";
                    //use general jquery each method, because it's missed in js I think.
                    $.each( toggles, function(idx, obj)
                    {
                        var fields = toggles[idx],
                            target_showWhenIds = "";
                        //loop through index here ?
                        $.each(fields, function(name, params)
                        {
                            var f;
                            if (typeof name === 'number') {
                                //- if it's a normal array with no params.
                                f = $('[name="'+params+'"]');
                            } else {
                                f = $('[name="'+name+'"]');
                            }
                            if( f.length )
                            {
                                hiddenFields[ fieldSet ].push(f);
                                target_showWhenIds = f.data("showWhen") ? f.data("showWhen")+","+idx : idx;//the id or id's list

                                f.data("showWhen", target_showWhenIds);//Set the main objet on every field
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
                var self            = this,
                    $self           = $(this),
                    value           = $self.val(),
                    fieldSet        = $self.attr('name'),
                    checked         = $self.is(":checked");

                // if the value is found in the toggles array, we passed through it.
                if ( typeof toggles[ value ] !== "undefined" ) {

                    //loop through the showWhen array (it's always)
                    $.each(hiddenFields[ fieldSet ], function(idx, targetField)
                    {
                        
                        targetFieldShowWhen = targetField.data('show-when');
                        targetValues = targetFieldShowWhen.split(",");
                        targetFieldValue = targetValues[targetValues.indexOf(value)];
                        
                        /// if the value is in array and the value is true (for checkbox)
                        if ( targetFieldValue == value && 
                            ($self.is(":checkbox") || $self.is(":radio") ? $self.is(":checked") : true ) )
                        {
                            targetField.parents('.form-group').show();
                        }
                        else
                        {
                            //toggles[value][0] === targetField.attr("name") && 
                            //console.log("top",toggles[value][0], "===", targetField.attr("name"));
                            //if its a check box, check if there is other checkbox check. @todo check if it's associated.
                            if (toggles[value][0] === targetField.attr("name") || ($self.is(":checkbox") || $self.is(":radio") ? !self.haveCheckedField() : true ) ) {
                                targetField.parents('.form-group').hide();
                            }
                        }

                        targetLabel = toggles[value][targetField.attr("name")];

                        //change the label
                        if (targetLabel && targetLabel["label"])
                        {
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
                        targetFieldShowWhen = targetField.data('show-when');
                        //  That is a sign that my algorith got flaws. Recheck your structure for checks.
                        if (!$('[name="'+fieldSet+'"][value='+targetFieldShowWhen+']').is(":checked"))
                        {
                            targetField.parents('.form-group').hide();
                        }
                    });
                }

            };//end of toggle function.

            function haveCheckedField(value) {
                var checked_fields = [],
                    value = value ? value : null;
                $.each(_allfields, function(key, field) {
                    
                    if (field.val() == value) {
                        //console.log(field.attr("name"),field.is(":checked"), field.val(), "==", value);
                    }
                    if (field.is(":checked")) {
                        checked_fields.push(field);
                    }
                });
                //console.log(checked_fields.length);
                return checked_fields.length > 0;
            }

            function isToggleFieldChecked(value) {

            }

            function isValueChecked(value) {

                $.each(_allfields, function(key, field) {
                    if (field.is(":checked")) {
                        if (field.val() == value) return true;
                    }
                });
                return false;
            }

            // Target element with class.
            $self.on('change', function() {
                return this.toggle();
            });

            this.init();
            return this;
        });

    }   //end of bpToggableField plugin.

}( jQuery ));
