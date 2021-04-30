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
			regions {
				_id
				id
				
			}
		}
	}
`;
