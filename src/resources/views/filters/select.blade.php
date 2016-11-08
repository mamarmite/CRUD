{{-- TODO: make this work --}}
{{-- important variables in here: $filter --}}

<div class="form-group backpack-filter">
	<label for="filter_{{ $filter->name }}">{{ $filter->label }}</label>
	<select id="filter_{{ $filter->name }}" name="filter_{{ $filter->name }}" class="form-control">
		<option value="">-</option>

		@if (is_array($filter->values) && count($filter->values))
			@foreach($filter->values as $key => $value)
				<option value="{{ $key }}"
					@if($filter->isActive() && $filter->currentValue == $key)
						selected
					@endif
					>
					{{ $value }}
				</option>
			@endforeach
		@endif
	</select>
</div>

{{-- ########################################### --}}
{{-- Extra CSS and JS for this particular filter --}}

{{-- FILTERS EXTRA CSS  --}}
{{-- push things in the after_styles section --}}

    {{-- @push('crud_list_styles')
        <!-- no css-->
    @endpush --}}


{{-- FILTERS EXTRA JS --}}
{{-- push things in the after_scripts section --}}

    @push('crud_list_scripts')
        <script>
			function updateQueryStringParameter(uri, key, value) {
			  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
			  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
			  if (uri.match(re)) {
			    return uri.replace(re, '$1' + key + "=" + value + '$2');
			  }
			  else {
			    return uri + separator + key + "=" + value;
			  }
			}

			jQuery(document).ready(function($) {
				$("select[name=filter_{{ $filter->name }}]").change(function() {
					var value = $(this).val();
					var current_name = '{{ $filter->name }}';
					var current_url = '{{ $crud->ajaxTable()?url($crud->route.'/search'):Request::url() }}';
					var new_url = '';

					new_url = updateQueryStringParameter(current_url, current_name, value);
					if (value == '') { new_url = new_url.replace(current_name+"=", ""); }

					@if ($crud->ajaxTable())
						// behaviour for ajax table
						var ajax_table = $("#crudTable").DataTable();
						ajax_table.ajax.url(new_url).load();
						// also set all duplicate filters to the same value
						$("select[name=filter_{{ $filter->name }}]").val(value);
				    @else
				    	// behaviour for normal table
				    	window.location.href = new_url;
				    @endif
				})
			});
		</script>
    @endpush
{{-- End of Extra CSS and JS --}}
{{-- ########################################## --}}