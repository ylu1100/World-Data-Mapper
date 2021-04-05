const ObjectId = require('mongoose').Types.ObjectId;
const Todolist = require('../models/todolist-model');
const User=require('../models/user-model')
// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
		getAllTodos: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const todolists = await Todolist.find({owner: _id});
			const listIds=await User.findOne({_id:_id})
			if(!listIds){
				return ([])
			}
			
			let todolistIds=listIds.todolists
			let todolistordered=[]
			for(let i=0;i<todolistIds.length;i++){
				const todolist= await Todolist.findOne({owner:_id,id:todolistIds[i]})
				todolistordered.push(todolist)
			}
			console.log(todolistordered)
			if(todolists) return (todolistordered);

		},
		/** 
		 	@param 	 {object} args - a todolist id
			@returns {object} a todolist on success and an empty object on failure
		**/
		getTodoById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const todolist = await Todolist.findOne({_id: objectId});
			if(todolist) return todolist;
			else return ({});
		},
	},
	Mutation: {
		/** 
		 	@param 	 {object} args - a todolist id and an empty item object
			@returns {string} the objectID of the item or an error message
		**/
		addItem: async(_, args) => {
			const { item, _id } = args;
			const listId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Todolist.findOne({_id: listId});
			if(!found) return ('Todolist not found');
			item._id = objectId;
			let listItems = found.items;
			listItems.push(item);
			
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems });

			if(updated) return (objectId);
			else return ('Could not add item');
		},
		/** 
		 	@param 	 {object} args - an empty todolist object
			@returns {string} the objectID of the todolist or an error message
		**/
		addTodolist: async (_, args) => {
			const { todolist } = args;
			const objectId = new ObjectId();
			const { id, name, owner, items } = todolist;
			const newList = new Todolist({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				items: items
			});
			const user=await User.findOne({_id:owner})
			let currList=[]
			
			currList.push(...user.todolists)
			currList.push(id)
			await User.updateOne({_id:owner},{todolists:currList})
			//console.log(user)
			//console.log(currList)
			const updated = newList.save();
			if(updated) return objectId;
			else return ('Could not add todolist');
		},
		/** 
		 	@param 	 {object} args - a todolist objectID and item objectID
			@returns {array} the updated item array on success or the initial 
							 array on failure
		**/
		deleteItem: async (_, args) => {
			const  { itemId, _id } = args;
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			let listItems = found.items;
			listItems = listItems.filter(item => item._id.toString() !== itemId);
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
			if(updated) return (listItems);
			else return (found.items);

		},
		/** 
		 	@param 	 {object} args - a todolist objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteTodolist: async (_, args) => {
			const { _id ,userId} = args;
			const objectId = new ObjectId(_id);
			const deletedTodolist=await Todolist.findOne({_id: objectId});
			const deleted = await Todolist.deleteOne({_id: objectId});
			//console.log(deletedTodolist.id)
			//console.log(userId)
			let todolistsId=await User.findOne({_id:userId})
			
			//console.log(todolistsId.todolists)
			let newtodolists=[]
			newtodolists.push(...todolistsId.todolists)
			newtodolists.splice(newtodolists.indexOf(deletedTodolist.id),1)
			console.log(newtodolists)
			await User.updateOne({_id:userId},{todolists:newtodolists})
			if(deleted) return true;
			else return false;
		},
		/** 
		 	@param 	 {object} args - a todolist objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		updateTodolistField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Todolist.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},
		/** 
			@param	 {object} args - a todolist objectID, an item objectID, field, and
									 update value. Flag is used to interpret the completed 
									 field,as it uses a boolean instead of a string
			@returns {array} the updated item array on success, or the initial item array on failure
		**/
		updateItemField: async (_, args) => {
			const { _id, itemId, field,  flag } = args;
			let { value } = args
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			let listItems = found.items;
			if(flag === 1) {
				if(value === 'complete') { value = true; }
				if(value === 'incomplete') { value = false; }
			}
			listItems.map(item => {
				if(item._id.toString() === itemId) {	
					
					item[field] = value;
				}
			});
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
			if(updated) return (listItems);
			else return (found.items);
		},
		/**
			@param 	 {object} args - contains list id, item to swap, and swap direction
			@returns {array} the reordered item array on success, or initial ordering on failure
		**/
		reorderItems: async (_, args) => {
			const { _id, itemId, direction } = args;
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			let listItems = found.items;
			const index = listItems.findIndex(item => item._id.toString() === itemId);
			// move selected item visually down the list
			if(direction === 1 && index < listItems.length - 1) {
				let next = listItems[index + 1];
				let current = listItems[index]
				listItems[index + 1] = current;
				listItems[index] = next;
			}
			// move selected item visually up the list
			else if(direction === -1 && index > 0) {
				let prev = listItems[index - 1];
				let current = listItems[index]
				listItems[index - 1] = current;
				listItems[index] = prev;
			}
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
			if(updated) return (listItems);
			// return old ordering if reorder was unsuccessful
			listItems = found.items;
			return (found.items);

		},
		sortByTaskName:async (_,args)=>{
			
			const {_id,newItems}=args;
			const listId = new ObjectId(_id);
			const found=await Todolist.findOne({_id:listId});
			console.log(newItems)
			let newList=[]
			for(let i=0;i<newItems.length;i++){
				let items=found.items
				for(let j=0;j<items.length;j++){
					if(items[j].id==newItems[i]){
						newList.push(items[j])
					}
				}
			}
			console.log(newList)
			const updated=await Todolist.updateOne({_id:listId},{items:newList})
			return "lol"
			// const updated=await TodoList.updateOne({_id:listId},{items:newItems})
			// if(updated) return (newItems);
			// return (found.items);
		},
		selectedListFirst:async(_,args)=>{
			const {ownerId,listIds}=args
			const user = await User.findOne({_id: ownerId});
			//console.log(user)
			let todolists=[]
			todolists.push(...user.todolists)
			// console.log(todolists)
			// console.log(listIds)
			// console.log(123)
			let newtodolists=[];
			for(let i=0;i<listIds.length;i++){
				let todolist=listIds[i]
				for(let j=0;j<todolists.length;j++){
					if(todolist==todolists[j]){
						newtodolists.push(todolists[j])
						break;
					}
				}
			}
			const updated= await User.updateOne({_id: ownerId},{todolists:newtodolists})
		
			return newtodolists
		}
		
	}
}