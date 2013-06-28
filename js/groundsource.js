$(document).ready(function() {

	/*$.extend($.fn, {
		fancySelect: function
	});*/

	$('input[type="checkbox"]').each(function() {
		var classy = $(this).hasClass('toggle') ? 'toggle' : 'checkbox';
		$(this).removeClass();

		var id = $(this).attr('id');
		var parent = $(this).wrap('<div class="'+ classy +'" />').parent();

		var lbl = $('label[for="'+ id +'"]');
		if (lbl[0] == undefined) lbl = $('<label for="'+ id +'" />');
		lbl.prepend('<span />').appendTo(parent);
	});

	$('input[type="radio"]').each(function() {
		var id = $(this).attr('id');
		var parent = $(this).wrap('<div class="radio" />').parent();

		var lbl = $('label[for="'+ id +'"]');
		if (lbl[0] == undefined) lbl = $('<label for="'+ id +'" />');
		lbl.prepend('<span />').appendTo(parent);
	});

	$('select:not([multiple])').each(function(i) {
		var targ = $(this),
			options = $('option,optgroup', targ);

		targ.css({'visibility': 'hidden', 'display': 'none'}).attr('data-ref', i);

		var drop = $('<div class="dropdown" />');
		var inner = $('<div class="dropdownInner" />').appendTo(drop);
		var label = $('<span class="selectedLabel" />').appendTo(inner);
		var optionlist = $('<ul class="options" />');

		options.each(function(n) {
			var item = $(this),
				key = i+''+n;
				li = $('<li />');

			if (item.is('optgroup')) {
				li.text(item.attr('label')).addClass('group');
			} else {
				li.text(item.text());
				item.attr('data-ref', key);
				li.attr('data-ref', key);
				li.on('click', function() {
					var select = $(this).parent();
					item.prop('selected', true);
					select.find('li.selected').removeClass('selected');
					$(this).addClass('selected');
					label.text($(this).text());
					dropdown.hide();
				});
			}
			//if (item.attr('value')) li.attr('data-value', item.attr('value'));
			if (item.attr('selected')) {
				li.addClass('selected');
				label.text(item.text());
			}
			if (item.parent().is('optgroup')) li.addClass('groupie');

			li.appendTo(optionlist);
		});

		optionlist.appendTo(drop);
		drop.insertAfter(targ);
	});


	var dropdown = {

		build: function() {
			//
		},

		show: function(event) {
			var targ = $(this),
				isOpen = targ.hasClass('opened');

			event.preventDefault();
			event.stopPropagation();
			dropdown.hide();

			if (isOpen) return;
			targ.addClass('opened');
			//if (targ.not('.disabled').not('.opened')) targ.addClass('opened');
			var targetGroup = event ? $(event.target).parents().addBack() : null;
			if (isOpen || targetGroup.is('ul.options')) targ.removeClass('opened');
			//if (isOpen && !targetGroup.is('ul.options')) targ.removeClass('opened');
			//if (isOpen && $(targetGroup).is(':not(ul.options)')) targ.removeClass('opened');
		},

		hide: function(event) {
			var targetGroup = event ? $(event.target).parents().addBack() : null;
			if (targetGroup && targetGroup.is('.dropdown')) {
				if (targetGroup.is('.checkbox') || targetGroup.is('.toggle')) {
					return;
				}
			}

			$(document).find('.dropdown.opened').removeClass('opened');
		}
	};

	$(document).on('click.dropdown', '.dropdown', dropdown.show);
	$(document).on('click.dropdown', dropdown.hide);
});