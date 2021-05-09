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
export const GET_DB_REGION_BY_ID = gql`
	query getDBRegionById($parentId:String!){
		getRegionById(parentId:$parentId){
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
export const GET_ALL_PARENTS = gql`
	query getAllParents($_id:String!){
		getAllParents(_id:$_id){
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
export const GET_ALL_USERREGIONS= gql`
	query getAllUserRegions{
		getAllUserRegions{
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
`