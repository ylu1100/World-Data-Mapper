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
    
    const [showUpdate,setShowUpdate]=useState(false);
    let parentRegion=""
    let flagExists=true
    const testquery = useQuery(query.GET_DB_REGION_BY_ID,{
		variables:{parentId:props.data.data._id},
     
	})
    const regionsquery =  useQuery(query.GET_DB_REGIONS,{
		variables:{parentId:props.data.data.parentId},
	})
    
    const mapsquery=useQuery(query.GET_DB_TODOS);
    const addLandmark=async()=>{
       let transaction = new AddLandmark_Transaction(props.data.data._id,landmarkInput,landmarks.length,DeleteLandmark,addLandmarkToList)
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
    
    
    if(parentregionsquery.data!==undefined){
        parentRegion=parentregionsquery.data.getRegionById
        
    }
    const userregions=useQuery(query.GET_ALL_USERREGIONS,{
        variables:{_id:props.data.data._id}
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
        let transaction = new EditLandmark_Transaction(props.data.data._id,index,oldlandmark,newlandmark,EditLandmark)
        props.tps.addTransaction(transaction);
    
      
		const promise= await tpsRedo()
      
        console.log(promise.changeRegionLandmark)
        updateLandmarksList(promise.changeRegionLandmark)
       
    }
    const deleteLandmark=async(landmark,index)=>{
        let transaction=new DeleteLandmark_Transaction(props.data.data._id,index,landmark,DeleteLandmark,InsertLandmark)
        props.tps.addTransaction(transaction)
        const promise=await tpsRedo()
        updateLandmarksList(promise.deleteLandmark)
    }
    const changeParent=async(parent)=>{
        let transaction= new ChangeParent_Transaction(props.data.data._id,props.data.data.parentId,parent._id,SetNewParent)
        props.tps.addTransaction(transaction)
        tpsRedo()
        let data={...props.data.data}
        data.parentId=parent._id
        let newdata={...props.data}
        newdata.data=data
        console.log(data)
        props.setRegionViewerData(newdata)
        
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
    const changeRegionWindow=()=>{
        toggleChangeRegion(true);
        
    }
    try{
        require(`../../${props.data.imgPath}`)
    }
    catch{
        flagExists=false
    }
    return (
        <WLayout wLayout="header-lside" >
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
                        <IoArrowBack style={{color:'gray'}}></IoArrowBack>
                        </WNavItem>
                    :
                    <WNavItem hoverAnimation="lighten">
                    <IoArrowBack onClick={()=>goPrevRegion()}  className="reactIconButton"></IoArrowBack>
                    </WNavItem>
                    }
                  
                    
                    {props.data.index==props.data.regionslist.length-1?
                        <WNavItem >
                        <IoArrowForward style={{color:'gray'}}></IoArrowForward>
                        </WNavItem>
                    :
                    <WNavItem hoverAnimation="lighten">
                    <IoArrowForward onClick={()=>goNextRegion()}  className="reactIconButton"></IoArrowForward>
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
                <WLMain>
                {
                    props.tps.hasTransactionToUndo()?
                <IoArrowUndo className='hoverEffect'  onClick={tpsUndo}></IoArrowUndo>
                :
                <IoArrowUndo style={{color:'rgb(53,58,68)'}} ></IoArrowUndo>
                }
                {
                    props.tps.hasTransactionToRedo()?
                 <IoArrowRedo className='hoverEffect'  onClick={tpsRedo}></IoArrowRedo>
                 :
                 <IoArrowRedo style={{color:'rgb(53,58,68)'}} ></IoArrowRedo>
                }
            {flagExists?
                <div>
                     <img  src={require(`../../${props.data.imgPath}`)} ></img> 
                     
                </div>
                :
                <div></div>
                }
           <h1>Region Name: {props.data.data.name}</h1>
           <h1>Parent Region: 
           </h1>
           <a  style={{color:"blue"}} className="hoverEffect" onClick={()=>props.setShowRegionViewer(false)}>{parentRegion.name}</a>
           <a className="hoverEffect" onClick={changeRegionWindow}>Change region</a>
           <h1>Region Capital: {props.data.data.capital}</h1>
            <h1>Region Leader: {props.data.data.leader}</h1>
            <h1># of Sub Regions: {props.data.data.subregions.length}</h1>
            <div>
            <div style={{overflow:"hidden",overflowY:"scroll",width:"300px",height:"500px"}}>
            {landmarks.map((landmark,index)=>(
                <div style={{width:'90%'}}>
                {landmark}
                <a onClick={()=>openDeleteLandmarkModal(landmark,index)} className='hoverEffect' style={{float:'right'}} >x</a>
                <IoPencil onClick={()=>openEditLandmarkModal(landmark,index)} className='hoverEffect' style={{float:'right'}}></IoPencil>
                </div>
            ))
            }
            </div>
            <WInput        
                             style={{marginTop:"10px",width:"300px"}}
                            onChange={updateLandmarkInput}
                            className='table-input' 
                            value={landmarkInput}
                            type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                <WButton onClick={addLandmark}><i>Add landmark</i></WButton>
                </div>
                {showChangeRegion?
                <div style={{overflow:"hidden",overflowY:"scroll",width:"300px",height:"500px"}}>
                    <a className="hoverEffect" onClick={()=>toggleChangeRegion(false)}>x</a>
                    {allUserRegions.map((region)=>(
                        <div>
                        <a  className="hoverEffect"  onClick={()=>changeParent(region)} style={{fontSize:"12px"}}>{region.name}</a>
                        </div>
                    ))

                    }
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