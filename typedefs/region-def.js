const { gql } = require('apollo-server');


const typeDefs = gql `
	type Subregion {
		_id: String!
		id: Int!
		parentId:String!
		name:String!
		capital:String!
        leader:String!
		subregions:[String]
        landmarks:[String]
	}
	
	extend type Query {
		getAllRegions(parentId:String!): [Subregion]
        getRegionById(parentId:String!):Subregion
	}
	extend type Mutation {
		addSubregion(region:String!, _id: String!): String
		createNewRegion(region:SubregionInput!):String
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
	}
`;

module.exports = { typeDefs: typeDefs }