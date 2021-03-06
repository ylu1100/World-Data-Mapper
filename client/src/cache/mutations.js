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

export const UPDATE_ACCOUNT = gql`
	mutation UpdateAccount($_id:String!,$email:String!,$password:String!,$fullName:String!) {
		updateAccount(_id:$_id,email: $email, password: $password, fullName:$fullName) {
			email 
			_id
			fullName
			password
		}
	}
`;


export const ADD_ITEM = gql`
	mutation AddItem($region: String!, $_id: String!) {
		addItem(region:$region, _id: $_id)
	}
`;

export const DELETE_SUBREGION=gql`
	mutation DeleteSubregion($_id:String!){
		deleteSubregion(_id:$_id)
	}
`

export const UPDATE_ITEM_FIELD = gql`
	mutation UpdateItemField($_id: String!, $field: String!, $value: String!) {
		updateItemField(_id: $_id, field: $field, value: $value) {
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
	mutation UpdateTodolistField($_id: String!, $newName:String!) {
		updateTodolistField(_id: $_id, newName:$newName)
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
export const ADD_NEW_REGION=gql`
	mutation AddNewRegion($regionId:String!,$_id:String!){
		addSubregion(region:$regionId,_id:$_id)
	}
`;
export const CREATE_NEW_REGION=gql`
	mutation CreateNewRegion($region:SubregionInput!){
		createNewRegion(region:$region)
	}
`;

export const SET_RECENT_MAP=gql`
	mutation setRecentMap($mapId:Int!){
		setRecentMap(mapId:$mapId)
	}
`;
export const SET_NEW_PARENT=gql`
	mutation setNewParent($_id:String!,$newParent:String!,$parentRegions:[String!]){
		setNewParent(_id:$_id,newParent:$newParent,parentRegions:$parentRegions)
	}
`
export const ADD_LANDMARK=gql`
	mutation addLandmark($_id:String!,$landmark:String!,$parentRegions:[String!]){
		addLandmark(_id:$_id,landmark:$landmark,parentRegions:$parentRegions)
	}
`;
export const DELETE_LANDMARK=gql`
	mutation deleteLandmark($_id:String!,$landmarkIndex:Int!,$parentRegions:[String!]){
		deleteLandmark(_id:$_id,landmarkIndex:$landmarkIndex,parentRegions:$parentRegions)
	}
`
export const INSERT_LANDMARK=gql`
	mutation insertLandmark($_id:String!,$landmarkIndex:Int!,$landmark:String!,$parentRegions:[String!]){
		insertLandmark(_id:$_id,landmarkIndex:$landmarkIndex,landmark:$landmark,parentRegions:$parentRegions)
	}
`
export const EDIT_LANDMARK=gql`
	mutation changeRegionLandmark($_id:String!,$landmarkIndex:Int!,$landmark:String!,$parentRegions:[String!]){
		changeRegionLandmark(_id:$_id,landmarkIndex:$landmarkIndex,landmark:$landmark,parentRegions:$parentRegions)
	}
`