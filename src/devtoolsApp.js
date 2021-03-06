const UI_INSTANCE_TEMPLATE = '{for instance in list}'
							+'<div data-guid="${instance.guid}" class="ui-instance">'
							+'	<h2 class="selector">${instance.selector}</h2>'
							+'	<div class="operations">'
							+'		<a data-guid="${instance.guid}" class="inspect" href="#">审查元素</a>'
							+'		<a data-guid="${instance.guid}" class="debug" href="#">调试参数</a>'
							+'	</div>'
							+'</div>'
							+'{/for}'

const OPTIONS_TEMPLATE = '{for option in options}'
						+'<div class="option">'
						+'	<span title="${option_index}" class="option-name">${option_index}</span>'
						+'  {if option_index.indexOf("is") == 0 || option_index.indexOf("has") == 0}'
						+'  <select name="${option_index}"><option value="true" {if option==true} selected="selected"{/if}>true</option><option value="false" {if option==false} selected="selected"{/if}>false</option></select>'
						+'  {else}'
						+'	<input name="${option_index}" value="${option}" type="text"/>'
						+'  {/if}'
						+'</div>'
						+'{/for}';

const COMPONMENTS_TEMPLATE =  '{for name in data}'
							+ '<div class="componment">${name_index}</div>'
							+ '{/for}';

let componmentsCache;

let bridge;

let currentComponment = null;

export function initDevtoolsApp (_bridge) {
	bridge = _bridge;

	bridge.on('info', function (payload) {
		$('.componments-list').html(COMPONMENTS_TEMPLATE.process({data: payload}));
		componmentsCache = {};

		for (let name of Object.keys(payload)) {
			componmentsCache[name] = {};

			for (let i of payload[name]) {
				componmentsCache[name][i.guid] = i;
			}
		}
	});
	
	$('body').on('mouseenter', '.ui-instance', function () {
		$(this).addClass('hover');
		bridge.send('focus', {
			type: currentComponment,
			guid: $(this).data('guid')
		});
	});

	$('body').on('mouseleave', '.ui-instance', function () {
		$(this).removeClass('hover');	
	});
	
	$('body').on('click', '.inspect', function () {
		chrome.devtools.inspectedWindow.eval('inspect(JDFUIDEBUGGERgetElement("tab", ' + $(this).data('guid') + ')[0])');
	});

	$('body').on('click', '.debug', function () {
		edit(componmentsCache[currentComponment][$(this).data('guid')]);
	});
}

// helper
$('#cancel').on('click', closeEditor);
$('#submit').on('click', updateInstanceConfig)

function closeEditor() {
	$('#backdrop').hide();
	$('#options-editor').hide();
}

function edit (instance) {
	$('#options-editor').data('guid', instance.guid);
	$('#options-editor .options').html(OPTIONS_TEMPLATE.process({options: instance.options}));
	$('#backdrop').show();
	$('#options-editor').show();
}

function updateInstanceConfig () {
	var newOptions = {};
	$('#options-editor .options').find('input, select').each(function () {
		var name = $(this).attr('name');

		if (name.match(/^(is|has)/)) {
			newOptions[name] = ($(this).val() == 'true');
		}
		else {
			newOptions[name] = $(this).val();
		}

	});

	bridge.send('updateOptions', {
		type: currentComponment,
		guid: $('#options-editor').data('guid'),
		newOptions: newOptions
	})
}

// 切换组件
$('.componments-list').on('click', '.componment', function () {
	$(this).addClass('curr').siblings().removeClass('curr');
	currentComponment = $(this).text();
	$('.ui-instance-list').html(UI_INSTANCE_TEMPLATE.process({list: componmentsCache[currentComponment]}));
})