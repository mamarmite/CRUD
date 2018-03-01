<!-- select2 from array toggle -->
{{-- based on @OwenMelbz toggle field. --}}
<div @include('crud::inc.field_wrapper_attributes') >
    <label>{!! $field['label'] !!}</label>
    <select
        name="{{ $field['name'] }}@if (isset($field['allows_multiple']) && $field['allows_multiple']==true)[]@endif"
        style="width: 100%"
        data-field-toggle="{{ json_encode($field['hide_when_not']) }}"
        @include('crud::inc.field_attributes', ['default_class' =>  'form-control select2_from_array select2_from_array_toggle '])
        @if (isset($field['allows_multiple']) && $field['allows_multiple']==true)multiple @endif
        >

        @if (isset($field['allows_null']) && $field['allows_null']==true)
            <option value="">-</option>
        @endif

        @if (count($field['options']))
            @foreach ($field['options'] as $key => $value)
                @if((old($field['name']) && ($key == old($field['name']) || is_array(old($field['name'])) && in_array($key, old($field['name'])))) || (is_null(old($field['name'])) && isset($field['value']) && ($key == $field['value'] || (is_array($field['value']) && in_array($key, $field['value'])))))
                    <option value="{{ $key }}" selected>{{ $value }}</option>
                @else
                    <option value="{{ $key }}">{{ $value }}</option>
                @endif
            @endforeach
        @endif
    </select>

    {{-- HINT --}}
    @if (isset($field['hint']))
        <p class="help-block">{!! $field['hint'] !!}</p>
    @endif
</div>

{{-- ########################################## --}}
{{-- Extra CSS and JS for this particular field --}}
{{-- If a field type is shown multiple times on a form, the CSS and JS will only be loaded once --}}
@if ($crud->checkIfFieldIsFirstOfItsType($field, $fields))

    {{-- FIELD CSS - will be loaded in the after_styles section --}}
    @push('crud_fields_styles')
    <!-- include select2 css-->
    <link href="{{ asset('vendor/adminlte/plugins/select2/select2.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2-bootstrap-theme/0.1.0-beta.10/select2-bootstrap.min.css" rel="stylesheet" type="text/css" />
    @endpush

    {{-- FIELD JS - will be loaded in the after_scripts section --}}
    @push('crud_fields_scripts')
    <!-- include select2 js-->
    <script src="{{ asset('vendor/adminlte/plugins/select2/select2.min.js') }}"></script>
    <script>
        
        jQuery(document).ready(function($) {

            window.hiddenFields = window.hiddenFields || {};

            // trigger select2 for each untriggered select2 box
            $('.select2_from_array').each(function (i, obj) {
                if (!$(obj).hasClass("select2-hidden-accessible"))
                {
                    $(obj).select2({
                        theme: "bootstrap"
                    });
                }
            });

            {{-- based on @OwenMelbz toggle field. --}}

            /**
             *  Toggle function to set the visible state show() or hide() when the values sets in the toggle_when_not
             */
            var toggle = function( $field ) {

                var hideWhenNot = $field.data('field-toggle'),
                    value    = $field.val(),
                    fieldSet = $field.attr('name');

                hiddenFields[ fieldSet ] = hiddenFields[ fieldSet ] || [];

                //typeof return a string so the === should compare to string.
                if( typeof hideWhenNot[ value ] === "undefined" )
                {
                    //Loop for each values set in the HideWhenNot //may be overkill if a lots id and field.
                    $.each( hideWhenNot, function(idx, obj){
                        var fields = hideWhenNot[idx];
                        $.each(fields, function(index, name){//loop through index here ?
                            var f = $('[name="'+name+'"]').parents('.form-group');

                            if( f.length ) {
                                hiddenFields[ fieldSet ].push(f);
                                f.hide();
                            }
                        });
                    });
                }
                else if ( typeof hideWhenNot[ value ] !== "undefined" )
                {
                    $.each(hiddenFields[ fieldSet ], function(idx, field){
                        field.show();
                    });
                    hiddenFields[ fieldSet ] = [];
                }
            };


            // Target element with class.
            $('select.select2_from_array_toggle').on('change', function(){
                return toggle( $(this) );
            });

            //init, on first load.
            $('select.select2_from_array_toggle').each(function(){
                return toggle( $(this) );
            });
        });
    </script>
    @endpush

@endif
{{-- End of Extra CSS and JS --}}
{{-- ########################################## --}}
