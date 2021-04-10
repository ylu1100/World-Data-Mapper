import React, { useState, useEffect,Component } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction, 
	SortItemsByTaskName_Transaction,
	jsTPS} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';


const Homescreen = (props) => {
	
	let todolists 							= [];
	const [todolistlist,setTodolists] = useState([])
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [addingItem,setAddingItem] =useState(false)

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SortByTaskName] 			= useMutation(mutations.SORT_BY_TASK);
	const [SelectedListFirst]		= useMutation(mutations.SELECT_LIST_FIRST)

	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	console.log(refetch)
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { todolists = data.getAllTodos; }
	//if(data) { setTodolists(data.getAllTodos); }
	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
			
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		return retVal;
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async(undo) => {
		setAddingItem(true)
		let list = activeList;
		const items = list.items;
		let lastID=0;
		for(let i=0;i<items.length;i++){
			if(items[i].id>lastID){
				lastID=items[i].id
			}
		}
		lastID+=1
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'No Assignment',
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction =  await new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		
		props.tps.addTransaction(transaction);
		
		tpsRedo();
		await new Promise(r => setTimeout(r, 200));
		setAddingItem(false)
	};


	const deleteItem = async (item) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = await new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = await new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = await new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewList = async () => {
		const length = todolists.length
		
		let id=1
		for(let i=0;i<todolists.length;i++){
			if(todolists[i].id>id){
				id=todolists[i].id
			}
		}
		id+= Math.floor((Math.random() * 100) + 1)
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		props.tps.clearAllTransactions()
		await new Promise(r => setTimeout(r, 400));
		
		//setActiveList(list)
	};
	
	const sortListByAscendingDesc=async()=>{
		
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].description.localeCompare(items[j+1].description)>0){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByDescendingDesc=async()=>{
		
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].description.localeCompare(items[j+1].description)<0){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByDescendingDate=async()=>{
		
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].due_date<items[j+1].due_date){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
				
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByAscendingDate=async()=>{
		
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].due_date>items[j+1].due_date){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
				
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByComplete=async()=>{
		
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(!items[j].completed&&items[j+1].completed){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
				
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByIncomplete=async()=>{
		
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].completed&&!items[j+1].completed){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
				
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByAscendingAssignment=async()=>{
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].assigned_to.localeCompare(items[j+1].assigned_to)>0){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const sortListByDescendingAssignment=async ()=>{
		let items=[]
		items.push(...activeList.items)
		for(let i=0;i<items.length-1;i++){
			for(let j=0;j<items.length-i-1;j++){
				if(items[j].assigned_to.localeCompare(items[j+1].assigned_to)<0){
					let temp=items[j];
					items[j]=items[j+1];
					items[j+1]=temp;
				}
			}
		}
		let listID = activeList._id;
		let transaction=await new SortItemsByTaskName_Transaction(listID,activeList.items,items,SortByTaskName)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id,userId:props.user._id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		
		setActiveList({});
		
		props.tps.clearAllTransactions()
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction =await  new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = async (id) => {
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		
		
		let temp=[]
		temp.push(...todolists)
		let index=todolists.indexOf(todo)
		let temp2=[]
		temp2.push(temp[index])
		temp.splice(index,1)
		temp2.push(...temp)
		//temp2= new list of todolists
		let listids=[]
		for(let i=0;i<temp2.length;i++){
			listids.push(temp2[i].id)
		}
		const {data} = await SelectedListFirst({
			variables:{ownerId:props.user._id,listIds:listids}})
			
		
		setActiveList(todo);
		props.tps.clearAllTransactions()
		refetch()
		
	};


	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	}
	
	return (
		
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								activeList={activeList}
								todolists={todolists} activeid={activeList.id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								undo={tpsUndo} redo={tpsRedo}
								updateListField={updateListField}
								tps={props.tps}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addingItem={addingItem}
									undo={tpsUndo} redo={tpsRedo}
									sortByTaskName={sortListByAscendingDesc}
									sortByDescTaskName={sortListByDescendingDesc}
									sortListByDescendingDate={sortListByDescendingDate}
									sortListByAscendingDate={sortListByAscendingDate}
									sortListByIncomplete={sortListByIncomplete}
									sortListByComplete={sortListByComplete}
									sortListByDescendingAssignment={sortListByDescendingAssignment}
									sortListByAscendingAssignment={sortListByAscendingAssignment}
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									tps={props.tps}
									activeList={activeList} setActiveList={setActiveList}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>
			{showDelete||showCreate||showLogin?
				<div className="blurBackground"></div>
			:
			null
			}	
			
			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount setShowCreate={setShowCreate} fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login setShowLogin={setShowLogin} fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;