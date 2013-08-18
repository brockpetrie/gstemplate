(function($){

	$.fn.fancySelect = function() {
		var targ = $(this),
			options = $('option,optgroup', targ);

		targ.css({'visibility': 'hidden', 'display': 'none'});

		var drop = $('<div class="dropdown" />');
		var inner = $('<div class="dropdownInner" />').appendTo(drop);
		var label = $('<span class="selectedLabel" />').appendTo(inner);
		var optionlist = $('<ul class="options" />');

		options.each(function(n) {
			var item = $(this),
				caption = $(this).attr('data-caption');
				li = $('<li />');

			if (item.is('optgroup')) {
				li.text(item.attr('label')).addClass('group');
			} else {
				li.text(item.text());
				if (caption) $('<i />').text(caption).appendTo(li);
				li.on('click', function() {
					var select = $(this).parent();
					item.prop('selected', true);
					select.find('li.selected').removeClass('selected');
					$(this).addClass('selected');
					label.html($(this).html());
					dropdown.hide();
				});
			}

			if (item.attr('selected')) {
				li.addClass('selected');
				label.html(li.html());
			}
			if (item.parent().is('optgroup')) li.addClass('groupie');

			li.appendTo(optionlist);
		});

		optionlist.appendTo(drop);
		drop.insertAfter(targ);
	};


	$.fn.autoGrowInput = function(o) {
		o = $.extend({
			maxWidth: 1000,
			minWidth: 0,
			comfortZone: 20
		}, o);

		this.filter('input:text').each(function() {

			var minWidth = o.minWidth || $(this).width(),
			val = '',
			input = $(this),
			testSubject = $('<tester/>').css({
				position: 'absolute',
				top: -9999,
				left: -9999,
				width: 'auto',
				fontSize: input.css('fontSize'),
				fontFamily: input.css('fontFamily'),
				fontWeight: input.css('fontWeight'),
				letterSpacing: input.css('letterSpacing'),
				whiteSpace: 'nowrap'
			}),

			check = function() {
				if (val === (val = input.val())) { return; }

				// Enter new content into testSubject
				var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				testSubject.html(escaped);

				// Calculate new width + whether to change
				var testerWidth = testSubject.width(),
					newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
					currentWidth = input.width(),
					isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth) || (newWidth > minWidth && newWidth < o.maxWidth);

				// Animate width
				if (isValidWidthChange) {
					input.width(newWidth);
				}
			};

			testSubject.insertAfter(input);

			$(this).bind('keyup keydown blur update', check);

		});
		return this;
	};


})(jQuery);



$(document).ready(function() {

	$('input[type="checkbox"]').each(function() {
		var classy = $(this).hasClass('toggle') ? 'toggle' : 'checkbox';
		if ($(this).hasClass('bigger')) classy += ' bigger';
		$(this).removeClass('toggle checkbox bigger');

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
			targ.addClass('opened').focus();
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

			$(document).find('.dropdown.opened').removeClass('opened').blur();
		}
	};


	var questionBuilder = {

		stage: 		$('#qBuilder'),
		template: 	$('#qBuilder li.question.template'),
		addBtn: 	$('#qBuilderBtnAdd'),

		init: function() {
			this.template.hide();
			this.stage.sortable();

			questionBuilder.add();

			this.addBtn.click(function(event) {
				event.preventDefault();
				questionBuilder.add();
			});
		},

		add: function() {
			var newQ = this.template.clone().removeClass('template').appendTo(this.stage).show();
			$('textarea.questionText', newQ).autosize();
			$('select', newQ).fancySelect();
			$('.questionTags', newQ).tagit({
				placeholderText: 'Optional'
			});
			//$('.questionTags', newQ).tagsInput();
			this.stage.sortable('refresh');
			var del = $('.btnRemove', newQ);
			del.click(function(event) {
				if ($(this).parent().hasClass('focused')) {
					if (confirm('Are you sure you want to remove this question?')) {
						$(this).parent().remove();
						questionBuilder.stage.sortable('refresh');
					} else {
						event.preventDefault();
					}
				} else {
					event.preventDefault();
				}
			});
		},

		kill: function(el) {
			// Nothing?
		},

		focus: function() {
			var question = event ? $(event.target).closest('.question') : null;

			if (question.not('.focused')) {
				$('.question.focused').not(question).removeClass('focused').children('.options').slideUp(250);
				question.addClass('focused');
				question.children('.options').slideDown(300);
			}
		}

	};


	$(document).on('click.dropdown', '.dropdown', dropdown.show);
	$(document).on('click.dropdown', dropdown.hide);

	$(document).on('click.question', questionBuilder.focus);

	questionBuilder.init();

	$('select:not([multiple]):not(.notFancy)').fancySelect();

});