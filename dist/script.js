'use strict';

function extend() {
	var i = 0;
	var result = {};
	for (; i < arguments.length; i++) {
		var attributes = arguments[i];
		for (var key in attributes) {
			result[key] = attributes[key];
		}
	}
	return result;
}

var Cookies_js = function Cookies_js(converter) {
	function api(key, value, attributes) {
		var result;
		if (typeof document === 'undefined') {
			return;
		}

		if (arguments.length > 1) {
			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				var expires = new Date();
				expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
				attributes.expires = expires;
			}

			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			if (!converter.write) {
				value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
			} else {
				value = converter.write(value, key);
			}

			key = encodeURIComponent(String(key));
			key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
			key = key.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';

			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}
				stringifiedAttributes += '=' + attributes[attributeName];
			}
			return document.cookie = key + '=' + value + stringifiedAttributes;
		}

		if (!key) {
			result = {};
		}

		var cookies = document.cookie ? document.cookie.split('; ') : [];
		var rdecode = /(%[0-9A-Z]{2})+/g;
		var i = 0;

		for (; i < cookies.length; i++) {
			var parts = cookies[i].split('=');
			var cookie = parts.slice(1).join('=');

			if (cookie.charAt(0) === '"') {
				cookie = cookie.slice(1, -1);
			}

			try {
				var name = parts[0].replace(rdecode, decodeURIComponent);
				cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

				if (this.json) {
					try {
						cookie = JSON.parse(cookie);
					} catch (e) {}
				}

				if (key === name) {
					result = cookie;
					break;
				}

				if (!key) {
					result[name] = cookie;
				}
			} catch (e) {}
		}

		return result;
	}

	api.set = api;
	api.get = function (key) {
		return api.call(api, key);
	};
	api.getJSON = function () {
		return api.apply({
			json: true
		}, [].slice.call(arguments));
	};
	api.defaults = {};

	api.remove = function (key, attributes) {
		api(key, '', extend(attributes, {
			expires: -1
		}));
	};

	api.withConverter = Cookies_js;

	return api;
};

var def = {};
var def_keys = [];
var def_list = window.dashboard.lists[window.dashboard.lists.length - 1];

def_list.todos.forEach(function (d) {
	var definition = d.text.split(' - ');
	def_keys.push(definition[0].toLowerCase());
	def[definition[0].toLowerCase()] = {
		backgroundColor: definition[1],
		color: definition[2]
	};
});

var css_rules = def_keys.map(function (key) {
	var tag = def[key];
	return '.ak-label-' + key + ' { background-color: ' + tag.backgroundColor + '; color: ' + tag.color + '; }';
});
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css_rules.join('');
document.getElementsByTagName('head')[0].appendChild(style);

var Hbs = window.Handlebars;
var hlp = Hbs.helpers;
function label_to_html(l) {
	return '<span class="ak-label ak-label-' + l.toLowerCase() + '">' + l + '</span> ';
}
function if_label(match, label) {
	var i = def_keys.indexOf(label.toLowerCase());
	return i > -1 ? label_to_html(label) : match;
}
hlp.markdownify_old = hlp.markdownify;
hlp.markdownify = function (todo_item) {
	todo_item = hlp.markdownify_old(todo_item);

	todo_item.string = todo_item.string.replace(/([^\s>]*?):\s/g, function (m, l) {
		return if_label(m, l);
	});

	return todo_item;
};

var icon_mode_switch = '<li class="header-tab header-tab-icon"><svg id="i-eye" class="ak-custom-icon header-eye-icon" viewBox="0 0 32 32"> <circle cx="17" cy="15" r="1"></circle> <circle cx="16" cy="16" r="6"></circle><path d="M2 16 C2 16 7 6 16 6 25 6 30 16 30 16 30 16 25 26 16 26 7 26 2 16 2 16 Z"></path> </svg></li>';
var $header_bar = $('.header-bar .header-tab-group');
var $body = $('body');
var Cookies = Cookies_js(function () {});
Cookies.set('mode', Cookies.get('mode') || 'day', { expires: 365 });

$body.addClass('mode-' + Cookies.get('mode'));
$header_bar.prepend(icon_mode_switch).on('click', function () {
	Cookies.set('mode', Cookies.get('mode') === 'day' ? 'night' : 'day', { expires: 365 });
	$body.toggleClass('mode-day mode-night');
});