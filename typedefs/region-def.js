const { gql } = require('apollo-server');


const typeDefs = gql `
	type Subregion {
		_id: String!
		id: Int!
		name:String!
		capital:String!
        leader:String!
        landmarks:[String]
	}
	
	extend type Query {
		getAllSubregions: [Region]
        getRegionById(_id:String!):Region
	}
	extend type Mutation {
		addItem(item: ItemInput!, _id: String!): String
		addTodolist(todolist: TodoInput!): String
		deleteItem(itemId: String!, _id: String!): [Item]		
		deleteTodolist(_id: String!,userId:String!): Boolean
		updateTodolistField(_id: String!, field: String!, value: String!): String
		updateItemField(itemId: String!, _id: String!, field: String!, value: String!, flag: Int!): [Item]
		reorderItems(itemId: String!, _id: String!, direction: Int!): [Item]
		sortByTaskName(_id:String!,newItems:[Int!]):String
		selectedListFirst(ownerId:String!,listIds:[Int!]):[Int!]
	}
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input TodoInput {
		_id: String
		id: Int
		name: String
		owner: String
		items: [ItemInput]
	}
	input ItemInput {
		_id: String
		id: Int
		description: String
		due_date: String
		assigned_to: String
		completed:  Boolean
	}
`;

module.exports = { typeDefs: typeDefs }