var mongoose = require('mongoose')

var Website = require('./Website.js')

var GroupSchema = new mongoose.Schema({
	name: {type: String},
	icon: {type: String},
	image: {type: String},
	websites: [{type: mongoose.Schema.ObjectId, ref:'Website'}],
	slug: {type: String},
})

GroupSchema.statics.formFill = (group, input) => {
	
	if (input.group_name.length >= 3) {
		group.name = input.group_name
		group.slug = createSlug(group.name)
	} else if (!group.name) {
		group.name = 'None'
		group.slug = 'none'
	}
	if (input.group_icon !== '') {
		group.icon = input.group_icon
	} else if (!group.icon) {
		group.icon = '/public/images/placeholders/group-icon.png'
	}
	if (input.group_image !== '') {
		group.image = input.group_image
	} else if (!group.image) {
		group.image = 'public/images/placeholders/group-image.png'
	}
	if (!group.websites) {
		group.websites = []
	}

	console.log('Inside, after assignment ' + JSON.stringify(group))

	return group
}

GroupSchema.methods.updateFormFill = (input) => {
	if (input.group_name.length >= 3) {
		this.name = input.group_name
		this.slug = createSlug(this.name)
	}
	if (input.group_icon !== '') {
		this.icon = input.group_icon
	}
	if (input.group_image !== ''){
		this.image = input.group_image
	}
}

GroupSchema.statics.createSlug = (base) => {
	return base.toLowerCase().replaceAll(/\W+/g, "-")
}

module.exports = mongoose.model('Group', GroupSchema)

let createSlug = (base) => {
	return base.toLowerCase().replaceAll(/\W+/g, "-")
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement)
}