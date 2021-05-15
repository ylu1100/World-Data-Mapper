import React, { useState, useEffect,Component } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import Update					from '../modals/Update';
import Home from '../main/home'
import DeleteSubregionModal from '../modals/DeleteSubregion'
import MapName					from '../modals/MapName';
import { GET_DB_TODOS } 				from '../../cache/queries';

import * as mutations 					from '../../cache/mutations';
import * as query						from '../../cache/queries';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateSubregions_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction, 
	SortItems_Transaction,
	jsTPS} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import { NoFragmentCyclesRule } from 'graphql';


const Homescreen = (props) => {
	
	let todolists 							= [];
	// const [regionslist,setRegionsList]							=useState([]);
	let regionslist=[]
	let ancestorList				=[];
	
	const [todolistlist,setTodolists] = useState([])
	
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate,toggleShowUpdate]=useState(false);
	const [showMapName,toggleMapName]=useState(false)
	const [showDeleteSubregion,setShowDeleteSubregion] = useState(false)
	const [subregionToBeDeleted,setSubregionToBeDeleted] = useState({})
	const [addingItem,setAddingItem] =useState(false)
	const [sortBy,setSortBy]=useState("")
	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD); //update field of subregion
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD); //update map
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteSubregion]			=useMutation(mutations.DELETE_SUBREGION)
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SortByTaskName] 			= useMutation(mutations.SORT_BY_TASK);
	const [SelectedListFirst]		= useMutation(mutations.SELECT_LIST_FIRST)
	const[createSubregion]			= useMutation(mutations.ADD_NEW_REGION);
	const[createNewRegion]			= useMutation(mutations.CREATE_NEW_REGION);
	const [setRecentMap]=useMutation(mutations.SET_RECENT_MAP)
	// const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	// const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
	const mapsquery=useQuery(GET_DB_TODOS);
	
	

	
	const getparentsquery=useQuery(query.GET_ALL_PARENTS,{ //get all parents
		variables:{_id:activeList._id},
		skip:activeList._id==undefined
	})
	
	const parentregionsquery = useQuery(query.GET_DB_REGION_BY_ID,{
		variables:{parentId:props.regionViewerData.data.parentId},
		skip:props.regionViewerData.data==-1,
	})
	//if navigated from regionviewer, show parents
	if((activeList==undefined || Object.keys(activeList).length==0)&&parentregionsquery.data!==undefined){
		
		setActiveList(parentregionsquery.data.getRegionById)
	}
	
	
	const regionsquery =  useQuery(query.GET_DB_REGIONS,{
		variables:{parentId:activeList._id},
		skip:activeList._id==undefined,
		fetchPolicy: "network-only"
	})

	const regionssortedquery=useQuery(query.GET_DB_REGIONS_SORTED,{
		variables:{parentId:activeList._id,sortBy:sortBy},
		skip:activeList._id==undefined
	})
	
	if(getparentsquery.data!==undefined){
		ancestorList=[...getparentsquery.data.getAllParents]
		ancestorList.reverse()
	
	}
	
	if(sortBy==""){
		if(regionsquery.data!==undefined){
			
		// setRegionsList(regionsquery.data.getAllRegions)
			regionslist=regionsquery.data.getAllRegions
		}
	}
	else{
		if(regionssortedquery.data!==undefined){
			regionslist=regionssortedquery.data.getAllRegionsSorted
		}
	}

	

	if(mapsquery.loading) { console.log(mapsquery.loading, 'loading'); }
	if(mapsquery.error) { console.log(mapsquery.error, 'error'); }
	if(mapsquery.data) { 
		todolists = mapsquery.data.getAllMaps;
		
	}
	
	// if(regionsquery.loading) { console.log(regionsquery.loading, 'loading'); }
	// if(regionsquery.error) { console.log(regionsquery.error, 'error'); }
	// if(regionsquery.data) { regionslist = regionsquery.data.getAllRegions({variables:{parentId:"lol"}}); }
	
	//if(data) { setTodolists(data.getAllTodos); }
	const auth = props.user === null ? false : true;
	
	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllMaps;
			
			if (activeList._id) {
				
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				if(list){
				setActiveList(list);
				}
				
			}
			
		}
	}
	
	const refetchEverything=async(region)=>{
		setActiveList(region)
		props.tps.clearAllTransactions()
		mapsquery.refetch()
		regionsquery.refetch({variables:{parentId:-1}})
		console.log(regionsquery)
		if(regionsquery.data!==undefined){
		regionslist=regionsquery.data.getAllRegions
		}
		
		
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();

		refetchTodos(mapsquery.refetch);
		regionsquery.refetch()
		regionssortedquery.refetch()
		
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(mapsquery.refetch);
		regionsquery.refetch();
		regionssortedquery.refetch();
		
		return retVal;
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async(undo) => {
		setAddingItem(true)
		let list = activeList;
		let items = list.regions;
		if(!items){
			items=list.subregions
		}
		let lastID=0;
		for(let i=0;i<items.length;i++){
			if(items[i].id>lastID){
				lastID=items[i].id
			}
		}
		lastID+=1
		
		let opcode = 1;
		// let itemID = newItem._id;
		let listID = activeList._id;
		const newItem = {
			id: lastID,
			parentId:activeList._id,
			name:'Untitled',
			capital:'N/A',
			leader:'N/A',
			subregions:[],
			landmarks:[]
		};
		//let transaction =  await new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		const {data}=await createNewRegion({variables:{region:newItem}})
		
		// const newRegionId=await createSubregion({variables:{regionId:data.createNewRegion,_id:listID}})
		let transaction=await new UpdateSubregions_Transaction(listID,data.createNewRegion,1,createSubregion,DeleteSubregion)
		props.tps.addTransaction(transaction);
		
		tpsRedo();
		await new Promise(r => setTimeout(r, 200));
		
		
		
		setAddingItem(false)
	};

	const goToSubregion =(region)=>{
		
		setActiveList(region)
		refetchEverything(region)
	}
	const deleteItem = async (item) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		
		let transaction = await new UpdateSubregions_Transaction(listID, itemID,  opcode, createSubregion,DeleteSubregion);
		props.tps.addTransaction(transaction);
		tpsRedo();
		
	};

	const editItem = async (itemID, field, value, prev) => {
		let transaction = await new EditItem_Transaction(itemID, field, prev, value, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();
		
	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = await new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewList = async (name) => {
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
			name: name,
			owner: props.user._id,
			regions: [],
		}
		
		const { data } = await AddTodolist({ variables: { map: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		props.tps.clearAllTransactions()
		await new Promise(r => setTimeout(r, 400));
		mapsquery.refetch()
		//setActiveList(list)
	};
	const sortListByAscendingName=async()=>{
		let subregions=[...regionslist]
		
		for(let i=0;i<subregions.length-1;i++){
			for(let j=0;j<subregions.length-i-1;j++){
				if((subregions[j].name).localeCompare(subregions[j+1].name)>0){
					let transaction=new SortItems_Transaction(sortBy,"name",setSortBy)
					regionssortedquery.refetch()
					props.tps.addTransaction(transaction)
					tpsRedo()
					return
				}
			}
		}
		let transaction=new SortItems_Transaction(sortBy,"revname",setSortBy)
		regionssortedquery.refetch()
		props.tps.addTransaction(transaction)
		tpsRedo()
		
	}
	const sortListByAscendingLeader=async()=>{
		let subregions=[...regionslist]
		for(let i=0;i<subregions.length-1;i++){
			for(let j=0;j<subregions.length-i-1;j++){
				if((subregions[j].leader).localeCompare(subregions[j+1].leader)>0){
					let transaction=new SortItems_Transaction(sortBy,"leader",setSortBy)
					regionssortedquery.refetch()
					props.tps.addTransaction(transaction)
					tpsRedo()
					return
				}
			}
		}
		let transaction=new SortItems_Transaction(sortBy,"revleader",setSortBy)
		regionssortedquery.refetch()
		props.tps.addTransaction(transaction)
		tpsRedo()
	}
	const sortListByAscendingCapital=async()=>{
		let subregions=[...regionslist]
		for(let i=0;i<subregions.length-1;i++){
			for(let j=0;j<subregions.length-i-1;j++){
				if((subregions[j].capital).localeCompare(subregions[j+1].capital)>0){
					let transaction=new SortItems_Transaction(sortBy,"capital",setSortBy)
					regionssortedquery.refetch()
					props.tps.addTransaction(transaction)
					tpsRedo()
					return
				}
			}
		}
		let transaction=new SortItems_Transaction(sortBy,"revcapital",setSortBy)
		regionssortedquery.refetch()
		props.tps.addTransaction(transaction)
		tpsRedo()
	}
	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id,userId:props.user._id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		
		setActiveList({});
		
		props.tps.clearAllTransactions()
	};

	const updateListField = async (_id, newName, prev) => {
		let transaction =await  new UpdateListField_Transaction(_id, newName, prev, UpdateTodolistField);
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
		
		document.cookie="listId="+todo._id
		// const {data} = await SelectedListFirst({
		// 	variables:{ownerId:props.user._id,listIds:listids}})
		
		setActiveList(todo);
		
		props.tps.clearAllTransactions()
		mapsquery.refetch()
		regionsquery.refetch()
		
	};


	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show
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
	const setShowUpdate = () => {
		
		toggleShowUpdate(!showUpdate);
	}

	if(auth){
	return (
	
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
					{
						activeList._id==undefined?
						<WNavItem className="hoverEffect">
							The World Data Mapper
						</WNavItem>
						:
						<WNavItem className="hoverEffect" onClick={()=>{setActiveList({});props.setRegionViewerData({data:-1})}}>
							The World Data Mapper
						</WNavItem>
					}
					</ul>
					<ul>
					{	
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							user={props.user}
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							setShowUpdate={setShowUpdate}
							_id={activeList._id}
							refetchTodos={mapsquery.refetch} setActiveList={setActiveList}
						/>
						
					}
					</ul>
				</WNavbar>
			</WLHeader>
			{
			activeList._id==undefined?
			<WLSide side="left">
				<WSidebar>					
							<SidebarContents
								refetchRegions={regionsquery.refetch}
								setShowDelete={setShowDelete}
								toggleMapName={toggleMapName}
								deleteList={deleteList}
								activeList={activeList}
								todolists={todolists} activeid={activeList.id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								undo={tpsUndo} redo={tpsRedo}
								updateListField={updateListField}
								tps={props.tps}
							/>
				</WSidebar>
			</WLSide>
			:
			<WLSide side="left">
			<WSidebar>
				{ancestorList.map((region,index)=>(
					<div>
					{index==ancestorList.length-1?
					<a className="hoverEffect"  style={{color:"yellow"}} onClick={()=>{refetchEverything(region);}}>{region.name}</a>
					
					:
					<a className="hoverEffect"   onClick={()=>{refetchEverything(region);}}>{region.name}</a>
					
					}
					<br></br>
					</div>
				))
				}
			</WSidebar>
			</WLSide>
			}
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									refetchEverything={refetchEverything}
									setShowDeleteSubregion={setShowDeleteSubregion}
									setSubregionToBeDeleted={setSubregionToBeDeleted}
									ancestorList={ancestorList}
									openRegionViewer={props.openRegionViewer}
									addingItem={addingItem}
									goToSubregion={goToSubregion}
									undo={tpsUndo} redo={tpsRedo}
									sortListByAscendingName={sortListByAscendingName}
									sortListByAscendingCapital={sortListByAscendingCapital}
									sortListByAscendingLeader={sortListByAscendingLeader}
									refetchRegions={regionsquery.refetch}
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									tps={props.tps}
									regionslist={regionslist}
									activeList={activeList} setActiveList={setActiveList}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>
			{showDelete||showCreate||showLogin||showUpdate||showMapName||showDeleteSubregion?
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
				showLogin && (<Login setShowLogin={setShowLogin} fetchUser={props.fetchUser} refetchTodos={mapsquery.refetch} setShowLogin={setShowLogin} />)
			}
			{
				showUpdate && (<Update  user={props.user} setShowLogin={setShowLogin} fetchUser={props.fetchUser} refetchTodos={mapsquery.refetch} setShowUpdate={setShowUpdate} />)
			}
			{
				showMapName &&(<MapName createNewList={createNewList} refetchTodos={mapsquery.refetch}  toggleMapName={toggleMapName}></MapName>)
			}
			{
				showDeleteSubregion && (<DeleteSubregionModal subregionToBeDeleted={subregionToBeDeleted} deleteItem={deleteItem} setShowDeleteSubregion={setShowDeleteSubregion} ></DeleteSubregionModal>)
			}
		</WLayout>
	
	)
		}
		else{
	return(
		<div>
		<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							The World Data Mapper 
						</WNavItem>
					</ul>
					<ul>
					{	
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							user={props.user}
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							setShowUpdate={setShowUpdate}
							refetchTodos={mapsquery.refetch} setActiveList={setActiveList}
						/>
						
					}
					</ul>
				</WNavbar>
			</WLHeader>
			{showCreate||showLogin?
				<div className="blurBackground"></div>
				
			:
			null
			
			}	
			<Home/>
	
			{
				showCreate && (<CreateAccount setShowCreate={setShowCreate} fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login setShowLogin={setShowLogin} fetchUser={props.fetchUser} refetchTodos={mapsquery.refetch} setShowLogin={setShowLogin} />)
			}
	
	</div>)
		}
};

export default Homescreen;