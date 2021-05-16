const { gql } = require('apollo-server');


const typeDefs = gql `
	type Subregion {
		_id: String!
		id: Int!
		owner:String!
		parentId:String!
		name:String!
		capital:String!
        leader:String!
		subregions:[String]
        landmarks:[String]
		subregionlandmarks:[String]
	}
	
	extend type Query {
		getAllUserRegions(_id:String!):[Subregion]
		getAllRegions(parentId:String!): [Subregion]
        getRegionById(parentId:String!):Subregion
		getAllParents(_id:String!):[Subregion]
		getAllRegionsSorted(parentId:String!,sortBy:String!):[Subregion]
		
	}
	extend type Mutation {
		addSubregion(region:String!, _id: String!): String
		createNewRegion(region:SubregionInput!):String
		updateItemField(_id:String!,field:String!,value:String!):Subregion
		deleteSubregion(_id:String!):String
		setNewParent(_id:String!,newParent:String!,parentRegions:[String!]):String
		addLandmark(_id:String!,landmark:String!,parentRegions:[String!]):[String]
		deleteLandmark(_id:String!,landmarkIndex:Int!,parentRegions:[String!]):[String]
		changeRegionLandmark(_id:String!,landmarkIndex:Int!,landmark:String!,parentRegions:[String!]):[String!]
		insertLandmark(_id:String!,landmarkIndex:Int!,landmark:String!,parentRegions:[String!]):[String!]
	}
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input SubregionInput{

		id: Int!
		parentId:String!
		name:String!
	
		capital:String!
        leader:String!
		subregions:[String]
        landmarks:[String]
		subregionlandmarks:[String]
	}
`;

module.exports = { typeDefs: typeDefs }