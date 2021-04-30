import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			fullName
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $fullName:String!) {
		register(email: $email, password: $password, fullName:$fullName) {
			email
			password
			fullName
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_ITEM = gql`
	mutation AddItem($region: RegionInput!, $_id: String!) {
		addItem(region:$region, _id: $_id)
	}
`;

export const DELETE_ITEM = gql`
	mutation DeleteItem($region: RegionInput!, $_id: String!) {
		deleteItem(region: $region, _id: $_id) {
			_id
			id
			name
			capital
			leader
			landmarks
		}
			
	}
`;

export const UPDATE_ITEM_FIELD = gql`
	mutation UpdateItemField($_id: String!, $itemId: String!, $field: String!, $value: String!, $flag: Int!) {
		updateItemField(_id: $_id, itemId: $itemId, field: $field, value: $value, flag: $flag) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const REORDER_ITEMS = gql`
	mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
		reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const ADD_TODOLIST = gql`
	mutation AddTodolist($map: MapInput!) {
		addTodolist(map: $map) 
	}
`;

export const DELETE_TODOLIST = gql`
	mutation DeleteTodolist($_id: String!,$userId:String!) {
		deleteTodolist(_id: $_id,userId:$userId)
	}
`;

export const UPDATE_TODOLIST_FIELD = gql`
	mutation UpdateTodolistField($_id: String!, $field: String!, $value: String!) {
		updateTodolistField(_id: $_id, field: $field, value: $value)
	}
`;
// export const SORT_BY_TASK = gql`
// 	mutation SortByTaskName($_id:String!,$newItems:[Item!]){
// 		sortByTaskName(_id:$_id,newItems:$newItems)
// 	}
// `;
export const SORT_BY_TASK = gql`
	mutation SortByTaskName($_id:String!,$newItems:[Int!]){
		sortByTaskName(_id:$_id,newItems:$newItems)
	}
`;
export const SELECT_LIST_FIRST=gql`
	mutation SelectedListFirst($ownerId:String!,$listIds:[Int!]){
		selectedListFirst(ownerId:$ownerId,listIds:$listIds)
	}
	`;