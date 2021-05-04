const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions:[String]
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
		addItem(regionid:RegionId!,_id:String!):String
		deleteItem(region:RegionInput!,_id:String!):[Region]
		updateTodolistField(_id:String!,newName:String!):String
		setRecentMap(user_id:String!,mapId:Int!):String
		}
        
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [String]
	}
	input RegionInput {
		_id: String!
		id: Int!
		parentId:String!
		name:String!
		capital:String!
        leader:String!
		subregions:[String]
        landmarks:[String]
	}
	input RegionId{
		region_id:String!
	}
`;

module.exports = { typeDefs: typeDefs }