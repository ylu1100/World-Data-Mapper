const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		owner:{
			type:ObjectId,
			required:true
		},
		parentId:{
			type:ObjectId,
			required:true
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: true
		},
		leader: {
			type: String,
			required: true
		},
		subregions:{
			type:[String],
			required:true
		},
		landmarks: {
			type: [String],
			required: true
		},
		subregionlandmarks:{
			type:[String],
			required:true
		}
	}
);

const Region = model('Region', regionSchema);
module.exports = Region;