import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			fullName
			email
			
		}
	}
`;

export const GET_DB_TODOS = gql`
	query GetDBTodos {
		getAllMaps {
			_id
			id
			name
			owner
			regions
		}
	}
`;
export const GET_DB_REGIONS = gql`
	query getDBRegions($parentId:String!){
		getAllRegions(parentId:$parentId){
			_id
			id
			parentId
			name
			capital
			leader
			subregions
			landmarks
		}
	}
`;