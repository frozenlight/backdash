var mongoose = require('mongoose')

var Group = require('./Group.js')

var WebsiteSchema = new mongoose.Schema({
	name: {type: String, default: ''},
	url: {type: String, default: ''},
	icon: {type: String, default: ''},
	image: {type: String, default: ''},
	description: {type: String, default: ''},
	group: {type: mongoose.Schema.ObjectId, ref: 'Group'},
})

WebsiteSchema.statics.formFill = (input, group_id) => {
	let website = {}
	if (input.website_name.length >= 3) {
		website.name = input.website_name
		website.slug = createSlug(website.name)
	} else {
		website.name = 'None'
		website.slug = 'none'
	}
	if (input.website_icon !== '') {
		website.icon = input.website_icon
	} else {
		website.icon = '/public/images/placeholders/website-icon.png'
	}
	if (input.website_image !== '') {
		website.image = input.website_image
	} else {
		website.image = 'public/images/placeholders/website-image.png'
	}
	if (input.website_url !== '') {
		website.url = input.website_url
	} else {
		website.url = '#!'
	}
	website.group = group_id

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
