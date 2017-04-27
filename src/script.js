/* eslint-disable */
var icon_day_switch = '<li class="header-tab header-tab-icon"><svg id="i-eye" class="header-eye-icon" viewBox="0 0 32 32"> <circle cx="17" cy="15" r="1"></circle> <circle cx="16" cy="16" r="6"></circle><path d="M2 16 C2 16 7 6 16 6 25 6 30 16 30 16 30 16 25 26 16 26 7 26 2 16 2 16 Z"></path> </svg></li>',
icon_tag_switch = '<li class="header-tab header-tab-icon"><svg id="i-tag" class="ak-custom-icon header-tag-icon" viewBox="0 0 32 32"> <circle cx="24" cy="8" r="2"></circle><path d="M2 18 L18 2 30 2 30 14 14 30 Z"></path> </svg></li>';

$('body').addClass('mode-day');

// $('.header-bar .header-tab-group').prepend(icon_day_switch).on('click', () => {
// 	$('body').toggleClass('mode-day mode-night');
// });
$('.header-bar .header-tab-group').prepend(icon_tag_switch).on('click', function () {
	/*
	$('.todo-text-html').each(function (index, el) {
	let html = $(el).text();
	html = html.replace(/(([^\s]*?):)/g, function (ignore, ignore2, label) { return `<span class='ak-label ak-label-${label.toLowerCase()}'>${label}</span>`; });
	$(el).html(html);
	});
	*/
	});

/*$(document).on('keydown', '.todo-text', function (e) {
	if (e.which !== 13) return;

	console.log(e, e.target.parentNode);
	const $item = $(e.originalEvent.target).parent();
	setTimeout(() => {
 console.log($item, $item.length);
	}, 100);
 });*/
var Hbs = window.Handlebars,
hlp = Hbs.helpers;

console.log('hulo!', Hbs, hlp);

hlp.markdownify_old = hlp.markdownify;
hlp.markdownify = function (e) {
    var text = e.replace(/([^\s]*?):\s/y, function (all, label) {
                         return "<span class='ak-label ak-label-"+label.toLowerCase()+"'>"+label+"</span>";
                         });

    // replace(/([^\s]*?):\s/g, (all, label) => `{${label}}`);
    // "after: restart: Still doesn't work".replace(/([^\s]*?):\s/g, (all, label) => `{${label}}`);

    // todo: nereplacuje vsetky
    return new Hbs.SafeString(
                              hlp.markdownify_old(text).toString()
                              .replace('&lt;', '<').replace('&gt;', '>')
                              );
};
