const ObjectId = require('mongoose').Types.ObjectId;
const Map=require('../models/map-model');
const User=require('../models/user-model2')
const Region=require('../models/region-model')
module.exports={
    Query: {
        getAllRegions: async (_,args) => {
            console.log("loading regions")
        
            const parentId=new ObjectId(args.parentId)
			
			if(!parentId) { return([])};
			const regionlists = await Region.find({parentId: parentId});
			//const listIds=await User.findOne({_id:_id})
			
			// let mapIds=listIds.maps
			// let maplistordered=[]
			// for(let i=0;i<mapIds.length;i++){
			// 	const map= await Map.findOne({owner:_id,id:mapIds[i]})
			// 	maplistordered.push(map)
			// }
			//console.log(todolistordered)
			if(regionlists) return (regionlists);

		},
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
		
		/** 
		 	@param 	 {object} args - a todolist id
			@returns {object} a todolist on success and an empty object on failure
		**/
		getRegionById: async (_, args) => {
			const { parentId} = args;
			
			const objectId = new ObjectId(parentId);
			
			let map = await Region.findOne({_id: objectId});
			
			if(map==null){
			
				map=await Map.findOne({_id: objectId});
				map=({_id:map._id,id:map.id,parentId:-1,name:map.name,capital:"",leader:"",subregions:map.regions,landmarks:[]})
			}
			
			if(map) {
				
				return map
			}
			
			else {
				
				return ({})
			};
		},
		getAllParents:async(_,args)=>{
			let {_id}= args
			let objectId=new ObjectId(_id)
			let region=await Region.findOne({_id:objectId});
			let parentList=[]
			let tempparent=region
			while(region!==null){
				tempparent=region
				parentList.push(region) //push id of region to list each time
				region=await Region.findOne({_id:new ObjectId(region.parentId)})
				if(region==null){ //if cant find parent as region, then we're at map level. so add map to list
					
					region=await Map.findOne({_id:new ObjectId(tempparent.parentId)})
				
					region={_id:region._id,id:region.id,name:region.name,parentId:"",subregions:region.regions,landmarks:[],leader:"",capital:""}
				
					delete region.owner
					delete region.regions
					parentList.push(region)
					break
				}
			}
			if(parentList.length==0){
				
				region=await Map.findOne({_id:new ObjectId(_id)})
				
				region={_id:region._id,id:region.id,name:region.name,parentId:"",subregions:region.regions,landmarks:[],leader:"",capital:""}
				
				delete region.owner
				delete region.regions
				parentList.push(region)
				
			}
			
			return parentList
		}
	},
	Mutation: {
		/** 
		 	@param 	 {object} args - a todolist id and an empty item object
			@returns {string} the objectID of the item or an error message
		**/
		addSubregion: async(_, args) => {
			
			const { region, _id } = args;
	
			const listId = new ObjectId(_id);
			let objectId;
			
			if(!region._id){ 
				objectId= new ObjectId();
			}
			else{
				objectId=region._id
			}
            let foundInRegion=true;
			let found = await Region.findOne({_id: listId});
			if(!found){
               
                found=await Map.findOne({_id:listId})
                foundInRegion=false
            }
            
			region._id = objectId;
			let listRegions
			if(foundInRegion){
				listRegions = found.subregions;
			}
			else{
				listRegions = found.regions;
			}
			
			listRegions.push(region);
			
			let updated;  
            
			if(!foundInRegion){
                console.log('region not found')
                updated=await Map.updateOne({_id: listId}, { regions: listRegions });
            }
            else{
                updated=await Region.updateOne({_id: listId}, { subregions: listRegions });
            }
            
            if(updated)return (objectId)
			else return ('Could not add Region');
		},
        
		/** 
		 	@param 	 {object} args - an empty todolist object
			@returns {string} the objectID of the todolist or an error message
		**/
		deleteSubregion:async(_,args)=>{
			const {_id}=args
			console.log(_id)
			const objectId=new ObjectId(_id)
			const found=await Region.findOne({_id:objectId})
			if(!found){
				return "region not found"
			}
			const updated=await Region.updateOne({_id:objectId},{parentId:undefined})
			if(updated) return found._id
		// 	const  { region, _id } = args;
		// 	console.log(region)
		// 	const listId = new ObjectId(_id);
		// 	const found = await Map.findOne({_id: listId});
		// 	console.log(region._id)
		// 	let listItems = found.regions;
		// 	listItems = listItems.filter(item => item._id.toString() !== region._id);
			
		// 	const updated = await Map.updateOne({_id: listId}, { regions: listItems })
		// 	if(updated) return (listItems);
		// 	else return (found.regions);
		},
		createNewRegion: async (_, args) => {
            console.log('region creating...')
			const { region } = args;
			const objectId = new ObjectId();
			const { id,name,parentId,capital,leader,regions,landmarks } = region;
			const newList = new Region({
				_id: objectId,
				id: id,
                parentId: parentId,
				name: name,
				capital:capital,
                leader:leader,
				subregions: regions,
                landmarks:landmarks
			});
            
           
			
			// let currList=[]
			
			// currList.push(...user.maps)
			// currList.push(id)
			// await User.updateOne({_id:owner},{maps:currList})
			//console.log(user)
			//console.log(currList)
			const updated = await newList.save();
			if(updated) return objectId;
			else return ('Could not add region');
		},
		// /** 
		//  	@param 	 {object} args - a todolist objectID and item objectID
		// 	@returns {array} the updated item array on success or the initial 
		// 					 array on failure
		// **/
		// deleteItem: async (_, args) => {
		// 	console.log(12312321)
		// 	const  { region, _id } = args;
		// 	console.log(region)
		// 	const listId = new ObjectId(_id);
		// 	const found = await Map.findOne({_id: listId});
		// 	console.log(region._id)
		// 	let listItems = found.regions;
		// 	listItems = listItems.filter(item => item._id.toString() !== region._id);
			
		// 	const updated = await Map.updateOne({_id: listId}, { regions: listItems })
		// 	if(updated) return (listItems);
		// 	else return (found.regions);

		// },
		// /** 
		//  	@param 	 {object} args - a todolist objectID 
		// 	@returns {boolean} true on successful delete, false on failure
		// **/
		// deleteTodolist: async (_, args) => {
		// 	const { _id ,userId} = args;
		// 	const objectId = new ObjectId(_id);
		// 	const deletedMap=await Map.findOne({_id: objectId});
		// 	const deleted = await Map.deleteOne({_id: objectId});
		// 	//console.log(deletedTodolist.id)
		// 	//console.log(userId)
		// 	let mapId=await User.findOne({_id:userId})
			
		// 	//console.log(todolistsId.todolists)
		// 	let newMaps=[]
		// 	newMaps.push(...mapId.maps)
		// 	newMaps.splice(newMaps.indexOf(deletedMap.id),1)
		// 	//console.log(newtodolists)
		// 	await User.updateOne({_id:userId},{maps:newMaps})
		// 	if(deleted) return true;
		// 	else return false;
		// },
		// /** 
		//  	@param 	 {object} args - a todolist objectID, field, and the update value
		// 	@returns {boolean} true on successful update, false on failure
		// **/
		// updateTodolistField: async (_, args) => {
		// 	const { field, value, _id } = args;
		// 	const objectId = new ObjectId(_id);
		// 	const updated = await Todolist.updateOne({_id: objectId}, {[field]: value});
		// 	if(updated) return value;
		// 	else return "";
		// },
		// /** 
		// 	@param	 {object} args - a todolist objectID, an item objectID, field, and
		// 							 update value. Flag is used to interpret the completed 
		// 							 field,as it uses a boolean instead of a string
		// 	@returns {array} the updated item array on success, or the initial item array on failure
		// **/
		updateItemField: async (_, args) => {
			const { _id,  field,  value} = args;
			const itemId = new ObjectId(_id);
			const found = await Region.findOne({_id: itemId});
			
			let region= found;
			region[field]=value
			const updated = await Region.updateOne({_id: itemId}, region)
	
			if(updated) return (region);
			else return (found);
		},
		addLandmark:async(_,args)=>{
			const {_id,landmark}= args
			const region= await Region.findOne({_id:_id})
			let landmarklist=[...region.landmarks]
			landmarklist.push(landmark)
			const update= await Region.updateOne({_id:_id},{landmarks:landmarklist})
			if(update){return landmarklist}
			else{
				return []
			}

		},
		
		/**
		// 	@param 	 {object} args - contains list id, item to swap, and swap direction
		// 	@returns {array} the reordered item array on success, or initial ordering on failure
		// **/
		// reorderItems: async (_, args) => {
		// 	const { _id, itemId, direction } = args;
		// 	const listId = new ObjectId(_id);
		// 	const found = await Todolist.findOne({_id: listId});
		// 	let listItems = found.items;
		// 	const index = listItems.findIndex(item => item._id.toString() === itemId);
		// 	// move selected item visually down the list
		// 	if(direction === 1 && index < listItems.length - 1) {
		// 		let next = listItems[index + 1];
		// 		let current = listItems[index]
		// 		listItems[index + 1] = current;
		// 		listItems[index] = next;
		// 	}
		// 	// move selected item visually up the list
		// 	else if(direction === -1 && index > 0) {
		// 		let prev = listItems[index - 1];
		// 		let current = listItems[index]
		// 		listItems[index - 1] = current;
		// 		listItems[index] = prev;
		// 	}
		// 	const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
		// 	if(updated) return (listItems);
		// 	// return old ordering if reorder was unsuccessful
		// 	listItems = found.items;
		// 	return (found.items);

		// },
		// sortByTaskName:async (_,args)=>{
			
		// 	const {_id,newItems}=args;
		// 	const listId = new ObjectId(_id);
		// 	const found=await Todolist.findOne({_id:listId});
		// 	//console.log(newItems)
		// 	let newList=[]
		// 	for(let i=0;i<newItems.length;i++){
		// 		let items=found.items
		// 		for(let j=0;j<items.length;j++){
		// 			if(items[j].id==newItems[i]){
		// 				newList.push(items[j])
		// 			}
		// 		}
		// 	}
		// 	//console.log(newList)
		// 	const updated=await Todolist.updateOne({_id:listId},{items:newList})
		// 	return "lol"
		// 	// const updated=await TodoList.updateOne({_id:listId},{items:newItems})
		// 	// if(updated) return (newItems);
		// 	// return (found.items);
		// },
		// selectedListFirst:async(_,args)=>{
		// 	const {ownerId,listIds}=args
		// 	const user = await User.findOne({_id: ownerId});
		// 	//console.log(user)
		// 	let todolists=[]
		// 	todolists.push(...user.todolists)
		// 	// console.log(todolists)
		// 	// console.log(listIds)
		// 	// console.log(123)
		// 	let newtodolists=[];
		// 	for(let i=0;i<listIds.length;i++){
		// 		let todolist=listIds[i]
		// 		for(let j=0;j<todolists.length;j++){
		// 			if(todolist==todolists[j]){
		// 				newtodolists.push(todolists[j])
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	const updated= await User.updateOne({_id: ownerId},{todolists:newtodolists})
		
		// 	return newtodolists
		// }
    }
}