var mongoose = require('mongoose')

var Group = require('./Group.js')

var WebsiteSchema = new mongoose.Schema({
	name: {type: String, default: ''},
	url: {type: String, default: ''},
	icon: {type: String, default: ''},
	image: {type: String, default: ''},
	description: {type: String, default: ''},
	group: {type: mongoose.Schema.ObjectId, ref: 'Group'},
	slug: {type: String},
})

WebsiteSchema.statics.formFill = (website, input, group_id) => {
	if (input.website_name.length >= 3) {
		website.name = input.website_name
		website.slug = createSlug(website.name)
	} else if (!website.name) {
		website.name = 'None'
		website.slug = 'none'
	}
	if (input.website_icon !== '') {
		website.icon = input.website_icon
	} else if (!website.icon) {
		website.icon = '/public/images/placeholders/website-icon.png'
	}
	if (input.website_image !== '') {
		website.image = input.website_image
	} else if (!website.image) {
		website.image = 'public/images/placeholders/website-image.png'
	}
	if (input.website_url !== '') {
		if (input.website_url.indexOf('https://') > 0 || input.website_url.indexOf('http://') > 0) {
			website.url = 'https://' + input.website_url
		} else {
			website.url = input.website_url
		}
	} else {
		website.url = '#!'
	}
	if (!website.group && group_id) {
		website.group = group_id
	}
	console.log('Inside, after assignment ' + JSON.stringify(website))

	return website
}

module.exports = mongoose.model('Website', WebsiteSchema)

let createSlug = (base) => {
	return base.toLowerCase().replaceAll(/\W+/g, "-")
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement)
}
