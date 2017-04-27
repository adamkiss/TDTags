/* global $, window, document */
/* eslint curly: 0, semi: ["error", "never"], camelcase: 0, no-constant-condition: 0 */

// Load definitions
const def = {}
const def_keys = []
const def_list = window.dashboard.lists[window.dashboard.lists.length - 1]

def_list.todos.forEach(d => {
	const definition = d.text.split(' - ')
	def_keys.push(definition[0].toLowerCase())
	def[definition[0].toLowerCase()] = {
		backgroundColor: definition[1],
		color: definition[2]
	}
})

// Add definitions as CSS
const css_rules = def_keys.map(key => {
	const tag = def[key]
	return `.ak-label-${key} { background-color: ${tag.backgroundColor}; color: ${tag.color}; }`
})
const style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = css_rules.join('')
document.getElementsByTagName('head')[0].appendChild(style)

// Monkey patch Handlebars Markdownify
const Hbs = window.Handlebars
const hlp = Hbs.helpers
function label_to_html(l) {
	return `<span class="ak-label ak-label-${l.toLowerCase()}">${l}</span> `
}
function if_label(match, label) {
	const i = def_keys.indexOf(label.toLowerCase())
	return i > -1 ? label_to_html(label) : match
}
hlp.markdownify_old = hlp.markdownify
hlp.markdownify = todo_item => {
	todo_item = hlp.markdownify_old(todo_item)

	// If WebKit updates, use /y flag
	todo_item.string = todo_item.string.replace(
		/([^\s>]*?):\s/g, (m, l) => if_label(m, l)
	)

	return todo_item
}

// Day/Night Switch
// const icon_mode_switch = '<li class="header-tab header-tab-icon"><svg id="i-eye" class="header-eye-icon" viewBox="0 0 32 32"> <circle cx="17" cy="15" r="1"></circle> <circle cx="16" cy="16" r="6"></circle><path d="M2 16 C2 16 7 6 16 6 25 6 30 16 30 16 30 16 25 26 16 26 7 26 2 16 2 16 Z"></path> </svg></li>'
// const $header_bar = $('.header-bar .header-tab-group')
// const $body = $('body')

// $body.addClass('mode-day')
// $header_bar.prepend(icon_mode_switch).on('click', () => {
// 	$body.toggleClass('mode-day mode-night')
// })
