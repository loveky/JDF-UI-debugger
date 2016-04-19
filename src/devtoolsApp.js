let UI_INSTANCE_TEMPLATE = '{for instance in list}'
							+'<div data-expando="${instance.expando}" class="ui-instance">'
							+'	<h2 class="selector">${instance.selector}</h2>'
							+'	<div class="operations">'
							+'		<a data-expando="${instance.expando}" class="inspect" href="#">审查元素</a>'
							+'		<a data-expando="${instance.expando}" class="debug" href="#">调试参数</a>'
							+'	</div>'
							+'</div>'
							+'{/for}'

export function initDevtoolsApp (bridge) {
	bridge.on('info', function (payload) {
       $('body').html(UI_INSTANCE_TEMPLATE.process({list:payload}));
	});
	
	$('body').on('mouseenter', '.ui-instance', function () {
		$(this).addClass('hover');
		bridge.send('focus', {
			type: 'tab',
			expando: $(this).data('expando')
		})
	});

	$('body').on('mouseleave', '.ui-instance', function () {
		$(this).removeClass('hover');	
	});
	
	$('body').on('click', '.inspect', function () {
		chrome.devtools.inspectedWindow.eval('inspect(getElement("tab", ' + $(this).data('expando') + ')[0])');
	})

}



