import React ,{useState,useEffect}      from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import * as query						from '../../cache/queries';
import NavbarOptions 					from '../navbar/NavbarOptions';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import Update					from '../modals/Update';
import DeleteLandmarkModal				from '../modals/DeleteLandmark';
import EditLandmarkModal from '../modals/EditLandmarkModal'
import {IoArrowBack,IoArrowForward,IoPencil,IoArrowRedo,IoArrowUndo} from 'react-icons/io5'
import {EditLandmark_Transaction,DeleteLandmark_Transaction,
    AddLandmark_Transaction,ChangeParent_Transaction } from '../../utils/jsTPS';
const Regionviewer = (props) => {
    let allUserRegions=[]
    let subregions=[]
    const [landmarkInput,setLandmarkInput]=useState("")
    const [addLandmarkToList] = useMutation(mutations.ADD_LANDMARK)
    const [landmarks,setLandmarks]=useState(props.data.regionslist[props.data.index].landmarks)
    const [showChangeRegion,toggleChangeRegion]=useState(false)
    const [showDeleteLandmark,setShowDeleteLandmark]=useState(false)
    const [showEditLandmark,setShowEditLandmark]=useState(false)
    const [landmarkToBeDeleted,setLandmarkToBeDeleted]=useState({})
    const [landmarkToBeEdited,setLandmarkToBeEdited]=useState({})
    const [SetNewParent] = useMutation(mutations.SET_NEW_PARENT)
    const [DeleteLandmark] = useMutation(mutations.DELETE_LANDMARK)
    const [EditLandmark] = useMutation(mutations.EDIT_LANDMARK)
    const [InsertLandmark]=useMutation(mutations.INSERT_LANDMARK)
    
    const [state,setState]=useState({
        ctrlPressed:false,
        zPressed:false,
        undoPressed:false,
        redoPressed:false,
    })
    const checkKeyEvent=(event)=>{
        if(event.key=='Control'){
          console.log('cpressed')
          setState({
            ctrlPressed:true
          })
        }
        if(event.key=='z'){
          console.log('zpressed')
          if(state.ctrlPressed){
            ctrlZEvent()
          }
        }
        else if(event.key=='y'){
          console.log('ypressed')
          if(state.ctrlPressed){
            ctrlYEvent()
          }
        }
      }
        
      const  removeKeyEvent=()=>{
        console.log('fin')
        setState({
          ctrlPressed:false,
          undoPressed:false,
          redoPressed:false,
        })
      }
    const  ctrlZEvent=()=>{
          setState({
            undoPressed:true,
            ctrlPressed:false,
          })
         tpsUndo()
         
          removeKeyEvent()
      }
    const  ctrlYEvent=()=>{
        setState({
          redoPressed:true,
          ctrlPressed:false,
        })
        tpsRedo()
        
        removeKeyEvent()
      }

    const [showUpdate,setShowUpdate]=useState(false);
    let parentRegion=""
    let flagExists=true
    let ancestorList=[]
    const testquery = useQuery(query.GET_DB_REGION_BY_ID,{
		variables:{parentId:props.data.data._id},
     
	})

    const regionsquery =  useQuery(query.GET_DB_REGIONS,{
		variables:{parentId:props.data.data._id},
	})
    if(regionsquery.data!=undefined){
        subregions=regionsquery.data.getAllRegions
    }
   
    const addLandmark=async()=>{
        if( props.data.data.subregionlandmarks.indexOf(landmarkInput)>=0){
            alert('Duplicate landmarks not allowed')
            return
        }
        if(props.data.data.landmarks.indexOf(landmarkInput)>=0){
            alert('Duplicate landmarks not allowed')
            return
        }
        if(landmarkInput.length==0){
            alert('Empty Input.No changes made')
            return
        }
        let ancestorIds=[]
        for(let i=0;i<ancestorList.length;i++){
            ancestorIds.push(ancestorList[i]._id)
        }
        console.log(ancestorList)
        ancestorIds.splice(0,1)
       let transaction = new AddLandmark_Transaction(props.data.data._id,ancestorIds,landmarkInput,landmarks.length,DeleteLandmark,addLandmarkToList)
       props.tps.addTransaction(transaction)
        const promise=await tpsRedo()
        updateLandmarksList(promise.addLandmark)
        testquery.refetch()
        setLandmarkInput("")
        
        
        
    }
    
    const updateLandmarkInput=(e)=>{
        setLandmarkInput(e.target.value)
    }
    const parentregionsquery = useQuery(query.GET_DB_REGION_BY_ID,{
		variables:{parentId:props.data.data.parentId},
	})
    const getancestorsquery=useQuery(query.GET_ALL_PARENTS,{ //get all parents
		variables:{_id:props.data.data._id},
        
	})
    if(getancestorsquery.data!==undefined){
        ancestorList=[...getancestorsquery.data.getAllParents]
        ancestorList.reverse()
        
        console.log(ancestorList)
    }
    if(parentregionsquery.data!==undefined){
        parentRegion=parentregionsquery.data.getRegionById
        
    }
    const userregions=useQuery(query.GET_ALL_USERREGIONS,{
        variables:{_id:props.data.data._id},
        
    })
	if(userregions.data){
        console.log("alluserregions")
    console.log(userregions)
		allUserRegions=userregions.data.getAllUserRegions
	}
    console.log(props.tps.getUndoSize())
    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
        if(retVal.changeRegionLandmark!=undefined){
            updateLandmarksList(retVal.changeRegionLandmark)
        }
        if(retVal.insertLandmark!=undefined){
            updateLandmarksList(retVal.insertLandmark)
        }
        if(retVal.deleteLandmark!=undefined){
            updateLandmarksList(retVal.deleteLandmark)
        }
        if(retVal.addLandmark!=undefined){
            updateLandmarksList(retVal.addLandmark)
        }
        if(retVal.setNewParent!=undefined){
            let data={...props.data.data}
            data.parentId=retVal.setNewParent
            let newdata={...props.data}
            newdata.data=data
            props.setRegionViewerData(newdata)
        }
        setLandmarkInput('')
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
        if(retVal.changeRegionLandmark!=undefined){
            updateLandmarksList(retVal.changeRegionLandmark)
        }
        if(retVal.insertLandmark!=undefined){
            updateLandmarksList(retVal.insertLandmark)
        }
        if(retVal.deleteLandmark!=undefined){
            updateLandmarksList(retVal.deleteLandmark)
        }
        if(retVal.addLandmark!=undefined){
            updateLandmarksList(retVal.addLandmark)
        }
        if(retVal.setNewParent!=undefined){
            let data={...props.data.data}
            data.parentId=retVal.setNewParent
            let newdata={...props.data}
            newdata.data=data
            props.setRegionViewerData(newdata)
        }
        setLandmarkInput('')
		return retVal;
	}
    const openDeleteLandmarkModal=(landmark,index)=>{
        
        setLandmarkToBeDeleted({landmark,index});
        
        setShowDeleteLandmark(true)
    }
    const openEditLandmarkModal=(landmark,index)=>{
        setLandmarkToBeEdited({landmark,index})
        setShowEditLandmark(true)
    }
    const updateLandmarksList=(list)=>{
        setLandmarks(list)
        let data={...props.data.data}
        data.landmarks=list
        let newdata={...props.data}
        newdata.data=data
        let templist=[...newdata.regionslist]
        templist[props.data.index]=data
        newdata.regionslist=templist
        props.setRegionViewerData(newdata)
    }
    const changeLandmark=async(oldlandmark,index,newlandmark)=>{
        if( props.data.data.subregionlandmarks.indexOf(newlandmark)>=0){
            alert('Duplicate landmarks not allowed')
            return
        }
        if(newlandmark==oldlandmark){
            alert('No changes made')
            return
        }
        if(newlandmark.length==0){
            alert('Empty input.No changes made')
            return
        }
        if(landmarks.includes(newlandmark)){
            alert('Duplicate landmarks not allowed')
            return
        }
        let ancestorIds=[]
        for(let i=0;i<ancestorList.length;i++){
            ancestorIds.push(ancestorList[i]._id)
        }
        console.log(ancestorList)
        ancestorIds.splice(0,1)
        let transaction = new EditLandmark_Transaction(props.data.data._id, ancestorIds,index,oldlandmark,newlandmark,EditLandmark)
        props.tps.addTransaction(transaction);
    
      
		const promise= await tpsRedo()
      
        console.log(promise.changeRegionLandmark)
        updateLandmarksList(promise.changeRegionLandmark)
       
    }
    const deleteLandmark=async(landmark,index)=>{
        let ancestorIds=[]
        for(let i=0;i<ancestorList.length;i++){
            ancestorIds.push(ancestorList[i]._id)
        }
        console.log(ancestorList)
        ancestorIds.splice(0,1)
        let transaction=new DeleteLandmark_Transaction(props.data.data._id,ancestorIds,index,landmark,DeleteLandmark,InsertLandmark)
        props.tps.addTransaction(transaction)
        const promise=await tpsRedo()
        updateLandmarksList(promise.deleteLandmark)
    }
    const changeParent=async(parent)=>{
        let ancestorIds=[]
        for(let i=0;i<ancestorList.length;i++){
            ancestorIds.push(ancestorList[i]._id)
        }
        console.log(ancestorList)
        ancestorIds.splice(0,1)
        let transaction= new ChangeParent_Transaction(props.data.data._id,ancestorIds,props.data.data.parentId,parent._id,SetNewParent)
        props.tps.addTransaction(transaction)
        tpsRedo()
        let data={...props.data.data}
        data.parentId=parent._id
        let newdata={...props.data}
        newdata.data=data
        console.log(data)
        props.setRegionViewerData(newdata)
        getancestorsquery.refetch()
        ancestorList=[...getancestorsquery.data.getAllParents]
        console.log(ancestorList)
        ancestorList.reverse()
        
    }
    const goPrevRegion=()=>{
        
        let index=props.data.index
        let data={...props.data}
        data.data=props.data.regionslist[index-1]
        
        data.index=index-1
        let path=props.data.imgPath.toString()
        
        path=path.substring(0,path.lastIndexOf("/")+1)+data.data.name+" Flag.png"
        data.imgPath=path
   
        props.setRegionViewerData(data)
        testquery.refetch()
        setLandmarks(props.data.regionslist[props.data.index-1].landmarks)
        props.tps.clearAllTransactions()
     }
    const goNextRegion=()=>{

        let index=props.data.index
        let data={...props.data}
        data.data=props.data.regionslist[index+1]
        data.index=index+1
        let path=props.data.imgPath.toString()
        
        path=path.substring(0,path.lastIndexOf("/")+1)+data.data.name+" Flag.png"
        data.imgPath=path
        props.setRegionViewerData(data)
        testquery.refetch()
        setLandmarks(props.data.regionslist[props.data.index+1].landmarks)
        props.tps.clearAllTransactions()
     }
     const landmarkEnterPress=(e)=>{
         if(e.keyCode===13){
             addLandmark()
         }
     }
    const changeRegionWindow=()=>{
        toggleChangeRegion(!showChangeRegion);
        
    }
    try{
        require(`../../${props.data.imgPath}`)
    }
    catch{
        flagExists=false
    }
    return (
        <WLayout tabIndex='0'  onKeyDown={checkKeyEvent}  wLayout="header-lside" >
        <WLHeader>
				<WNavbar color="colored">
					<ul>
					
						<WNavItem className="hoverEffect"onClick={()=>{props.setShowRegionViewer(false);props.setRegionViewerData({data:-1});props.setActiveList({})}} >
							The World Data Mapper
						</WNavItem>
					
					</ul>
                    <ul>
                 
                    {props.data.index==0?
                        <WNavItem >
                        <IoArrowBack style={{color:'gray',fontSize:'30px'}}></IoArrowBack>
                        </WNavItem>
                    :
                    <WNavItem hoverAnimation="lighten">
                    <IoArrowBack style={{fontSize:'30px'}} onClick={()=>goPrevRegion()}  className="reactIconButton"></IoArrowBack>
                    </WNavItem>
                    }
                  
                    
                    {props.data.index==props.data.regionslist.length-1?
                        <WNavItem >
                        <IoArrowForward style={{color:'gray',fontSize:'30px'}}></IoArrowForward>
                        </WNavItem>
                    :
                    <WNavItem hoverAnimation="lighten">
                    <IoArrowForward style={{fontSize:'30px'}} onClick={()=>goNextRegion()}  className="reactIconButton"></IoArrowForward>
                    </WNavItem>
                    }
                    
                    </ul>
					<ul>
					{	
						<NavbarOptions
                            showRegionViewer={props.showRegionViewer}
							fetchUser={props.fetchUser} 
							user={props.user}
                            setShowRegionViewer={props.setShowRegionViewer}
                            setShowUpdate={setShowUpdate}
                            auth={props.user !== null}
                            setActiveList={props.setActiveList}
						/>
						
					}
					</ul>
				</WNavbar>
                </WLHeader>
                <WLSide side="left">
			<WSidebar style={{marginRight:'50px'}}>
				{ancestorList.map((region,index)=>(
					<div>
					{index==ancestorList.length-1?
					<a className="hoverEffect" onClick={()=>{props.tps.clearAllTransactions();props.setShowRegionViewer(false);props.setRegionViewerData({data:-1});props.setActiveList(region)}} style={{color:"yellow"}} >{region.name}</a>
					
					:
					<a className="hoverEffect" onClick={()=>{props.tps.clearAllTransactions();props.setShowRegionViewer(false);props.setRegionViewerData({data:-1});props.setActiveList(region)}} >{region.name}</a>
					
					}
					<br></br>
					</div>
				))
				}
			</WSidebar>
			</WLSide>
                <WLMain>
                {
                    props.tps.hasTransactionToUndo()?
                <IoArrowUndo style={{fontSize:'25px'}} className='hoverEffect'  onClick={tpsUndo}></IoArrowUndo>
                :
                <IoArrowUndo style={{color:'rgb(53,58,68)',fontSize:'25px'}} ></IoArrowUndo>
                }
                {
                    props.tps.hasTransactionToRedo()?
                 <IoArrowRedo  style={{fontSize:'25px'}} className='hoverEffect'  onClick={tpsRedo}></IoArrowRedo>
                 :
                 <IoArrowRedo style={{color:'rgb(53,58,68)',fontSize:'25px'}} ></IoArrowRedo>
                }
            {flagExists?
                <div>
                     <img  src={require(`../../${props.data.imgPath}`)} ></img> 
                     
                </div>
                :
                <div></div>
                }
           <h1 style={{color:'white'}} >Region Name: {props.data.data.name}</h1>
           <h1 style={{color:'white'}} >Parent Region: 
           </h1>
           <a  style={{color:'rgb(77,138,171)',fontSize:'25px'}} className="hoverEffect" onClick={()=>props.setShowRegionViewer(false)}>{parentRegion.name}</a>
           <IoPencil style={{color:'orange',fontSize:'17px'}} className="hoverEffect" onClick={changeRegionWindow}>Change region</IoPencil>
           <h1 style={{color:'white'}} >Region Capital: {props.data.data.capital}</h1>
            <h1 style={{color:'white'}} >Region Leader: {props.data.data.leader}</h1>
            <h1 style={{color:'white'}} ># of Sub Regions: {subregions.length}</h1>
            {!showChangeRegion?
            <div style={{position:'absolute',marginLeft:'50%',top:'10%'}}>
            <h1 style={{color:'white',textAlign:'center',fontSize:'25px'}}>
            REGION LANDMARKS:
            </h1>
            <div style={{backgroundColor:'black',overflow:"hidden",overflowY:"scroll",width:"300px",height:"500px"}}>
            {landmarks.map((landmark,index)=>(
                <div style={{color:'white', width:'90%'}}>
                <a onClick={()=>openDeleteLandmarkModal(landmark,index)} className='hoverEffect' style={{fontWeight:'bold',color:'red',float:'left',marginRight:'20px'}} >x</a>
                {landmark}
                <IoPencil onClick={()=>openEditLandmarkModal(landmark,index)} className='hoverEffect' style={{float:'right'}}></IoPencil>
                </div>
            ))
            }
           
            {
                props.data.data.subregionlandmarks.map((sublandmark)=>(
                    <div style={{marginLeft:'30px',color:'gray',width:'90%'}}>
                {sublandmark}
               
                </div>
                ))
            }
            </div>
            <WInput        
                        onKeyUp={landmarkEnterPress}
                             style={{marginTop:"10px",width:"300px"}}
                            onChange={updateLandmarkInput}
                            className='table-input' 
                            value={landmarkInput}
                            type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                <WButton onClick={addLandmark}><i>Add landmark</i></WButton>
                </div>
                :null
            }
            
                {showChangeRegion?
                <div style={{position:'absolute',marginLeft:'50%',top:'10%'}}>
                <h1 style={{color:'pink',textAlign:'center',fontSize:'25px'}}>
                CHANGE PARENT REGION:
                </h1>
                <div style={{backgroundColor:'black',overflow:"hidden",overflowY:"scroll",width:"300px",height:"500px"}}>
                    <a style={{color:'red'}} className="hoverEffect" onClick={()=>toggleChangeRegion(false)}>x</a>
                    {allUserRegions.map((region)=>(
                        
                        region._id != parentRegion._id?
                        <div className="hoverEffect" onClick={()=>changeParent(region)} style={{width:'100%'}}>
                        <a     style={{fontWeight:'bold',fontSize:"17px",color:'white'}}>{region.name}</a>
                        </div>
                        :
                        null
                        
                    ))

                    }
                </div>
                </div>
                :
                null
                }
                </WLMain>
                {showUpdate||showDeleteLandmark||showEditLandmark?
				<div className="blurBackground"></div>
			    :
			    null
                }
                {
				showUpdate && (<Update  user={props.user}  fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} />)
			    }
                {
                showDeleteLandmark && (<DeleteLandmarkModal deleteLandmark={deleteLandmark} setShowDeleteLandmark={setShowDeleteLandmark} landmarkToBeDeleted={landmarkToBeDeleted}></DeleteLandmarkModal>)
                }
                {
                showEditLandmark && (<EditLandmarkModal changeLandmark={changeLandmark} landmarkToBeEdited={landmarkToBeEdited} setShowEditLandmark={setShowEditLandmark}></EditLandmarkModal>)
                }
                </WLayout>
    );
};

export default Regionviewer;