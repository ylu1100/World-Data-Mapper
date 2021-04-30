const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions:[Region]
	}
	type Region {
		_id: String!
		id: Int!
		name:String!
		capital:String!
        leader:String!
        landmarks:[String]
	}
	
	extend type Query {
		getAllMaps: [Map]
        getMapById(_id:String!):Map
        getRegionsInMap(_id:String!):[Region]

	}
	extend type Mutation {
		addTodolist(map: MapInput!): String
        deleteTodolist(_id: String!,userId:String!): Boolean
		addItem(region:RegionInput!,_id:String!):String
		deleteItem(region:RegionInput!,_id:String!):[Region]
		}
        
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [RegionInput]
	}
	input RegionInput {
		_id: String!
		id: Int!
		name:String!
		capital:String!
        leader:String!
        landmarks:[String]
	}
`;

module.exports = { typeDefs: typeDefs }