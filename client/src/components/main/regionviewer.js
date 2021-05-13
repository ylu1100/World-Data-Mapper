import React ,{useState}      from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import * as query						from '../../cache/queries';
const Regionviewer = (props) => {
    let allUserRegions=[]
    const [landmarkInput,setLandmarkInput]=useState("")
    const [addLandmarkToList] = useMutation(mutations.ADD_LANDMARK)
    const [landmarks,setLandmarks]=useState(props.data.landmarks)
    const [showChangeRegion,toggleChangeRegion]=useState(false)
    const [SetNewParent] = useMutation(mutations.SET_NEW_PARENT)
    let parentRegion=""
    let flagExists=true
    const addLandmark=async()=>{
        console.log("input:")
        console.log(landmarkInput)
        const landmarklist=await addLandmarkToList({variables:{_id:props.data._id,landmark:landmarkInput}})
        console.log(landmarklist.data.addLandmark)
        setLandmarkInput("")
        setLandmarks(landmarklist.data.addLandmark)
        
    }
    const updateLandmarkInput=(e)=>{
        setLandmarkInput(e.target.value)
    }
    const parentregionsquery = useQuery(query.GET_DB_REGION_BY_ID,{
		variables:{parentId:props.data.parentId},
	})
  
    if(parentregionsquery.data!==undefined){
        parentRegion=parentregionsquery.data.getRegionById
    }
    const userregions=useQuery(query.GET_ALL_USERREGIONS)
	if(userregions.data){
		allUserRegions=userregions.data.getAllUserRegions
	}
    const changeParent=async(parent)=>{
        const setParent=await SetNewParent({variables:{_id:props.data._id,newParent:parent._id}})
        parentregionsquery.refetch()
    }
    console.log(props.data.imgPath)

    try{
        require(`../../${props.data.imgPath}`)
    }
    catch{
        flagExists=false
    }
    return (
       <div>
            {flagExists?
                <div>
                     <img  src={require(`../../${props.data.imgPath}`)} ></img> 
                     
                </div>
                :
                <div></div>
                }
           <h1>Region Name: {props.data.name}</h1>
           <h1>Parent Region: 
           </h1>
           <a  style={{color:"blue"}} className="hoverEffect" onClick={()=>props.setShowRegionViewer(false)}>{parentRegion.name}</a>
           <a onClick={()=>toggleChangeRegion(true)}>Change region</a>
           <h1>Region Capital: {props.data.capital}</h1>
            <h1>Region Leader: {props.data.leader}</h1>
            <h1># of Sub Regions: {props.data.subregions.length}</h1>
            <div>
            <div style={{overflow:"hidden",overflowY:"scroll",width:"300px",height:"500px"}}>
            {landmarks.map((landmark)=>(
                <div>
                <h1 style={{fontSize:"12px"}}>{landmark}</h1>
                
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
                    <a onClick={()=>toggleChangeRegion(false)}>x</a>
                    {allUserRegions.map((region)=>(
                        <div>
                        <a onClick={()=>changeParent(region)} style={{fontSize:"12px"}}>{region.name}</a>
                        </div>
                    ))

                    }
                </div>
                :
                null
                }
       </div>
    );
};

export default Regionviewer;