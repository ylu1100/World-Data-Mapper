const { gql } = require('apollo-server');
const userDef=require('./user-def.js').typeDefs;
const mapDef=require('./map-def.js').typeDefs;
const regionDef=require('./region-def.js').typeDefs;
const rootDef = gql`
	type Query {
		_empty: String
	}

	type Mutation {
		_empty: String
	}
`;

module.exports = {
	typeDefs: [rootDef, userDef,mapDef,regionDef] 
}; 