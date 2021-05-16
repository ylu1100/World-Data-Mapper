import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {
    const { data } = props;

    const capital=data.capital
    const name=data.name
    const leader=data.leader
    const landmarks=data.landmarks
    const ancestorList=props.ancestorList
   
    let flagExists=true
    let imgPath=""
    for(let i=0;i<ancestorList.length;i++){
        imgPath+=ancestorList[i].name+"/"
    }
    imgPath+=name+" Flag.png"
  
    try{
        require(`../../${imgPath}`)
    }
    catch{
        flagExists=false
    }
    let landmarkStr=""
    for(let i=0;i<landmarks.length;i++){
        landmarkStr+=landmarks[i]+","
    }
    for(let i=0;i<data.subregionlandmarks.length;i++){
        landmarkStr+=data.subregionlandmarks[i]+","
    }
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    
    const handleNameEdit = (e) => {
        props.setRowCol({})
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'No Name';
        const prevName = name;
        if(prevName==newName){
            
			return
		}
      
        props.editItem(data._id, 'name', newName, prevName);
        
    };

    const handleCapitalEdit = (e) => {
        props.setRowCol({})
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'No Capital';
        const prevCapital = capital;
        if(prevCapital==newCapital){
            console.log('what')
			return
		}
        
        props.editItem(data._id, 'capital', newCapital, prevCapital);
        
    };

    const handleLeaderEdit = (e) => {
        props.setRowCol({})
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : "No Leader";
        const prevLeader = leader;
        if(prevLeader==newLeader){
            console.log('what')
			return
		}
        
        props.editItem(data._id, 'leader', newLeader, prevLeader);
       
    };
    const handleFocus = (e) => {
        
        e.target.select();
    }
    const checkKeyEvent=(e)=>{
        //left
        
        if(e.keyCode=='37'){
            
            if(props.editingRowCol.col==0){
                return
            }
            e.target.blur()
            props.setRowCol({row:props.editingRowCol.row,col:props.editingRowCol.col-1})
        }
        //up
        if(e.keyCode=='38'){
            if(props.editingRowCol.row==0){
                return
            }
            e.target.blur()
            props.setRowCol({row:props.editingRowCol.row-1,col:props.editingRowCol.col})
        }
        //right
        if(e.keyCode=='39'){
            if(props.editingRowCol.col==2){
                return
            }
            e.target.blur()
            props.setRowCol({row:props.editingRowCol.row,col:props.editingRowCol.col+1})
        }
        //down
        if(e.keyCode=='40'){
            if(props.editingRowCol.row==props.size-1){
               
                return
            }
            e.target.blur()
            props.setRowCol({row:props.editingRowCol.row+1,col:props.editingRowCol.col})
        }
    }
    return (
        <WRow  onKeyDown={checkKeyEvent} className='table-entry'>
         <WCol size="1">
                <div className='button-group'>
                    
                    <WButton className="table-entry-buttons" onClick={() => {props.setSubregionToBeDeleted(data);props.setShowDeleteSubregion(true);}} wType="texted">
                        <i className="material-icons">close</i>
                    </WButton>
                    <a className="hoverEffect" onClick={()=>props.goToSubregion(props.data)}>Sub region</a>
                    
                </div>
                </WCol>
            <WCol size="2">
                {
                    editingName ||(props.editingRowCol.row==props.index && props.editingRowCol.col==0)
                        ? <WInput
                            onFocus={handleFocus}
                            className='table-input' onBlur={handleNameEdit}
                            onFocusOut={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            onClick={() => {toggleNameEdit(!editingName);props.setRowCol({row:props.index,col:0})}}
                        >{name}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingCapital ||(props.editingRowCol.row==props.index && props.editingRowCol.col==1) ? 
                    <WInput
                    onFocus={handleFocus}
                        className='table-input' onBlur={handleCapitalEdit}
                        onFocusOut={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => {toggleCapitalEdit(!editingCapital);props.setRowCol({row:props.index,col:1})}}
                        >{capital}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader ||(props.editingRowCol.row==props.index && props.editingRowCol.col==2) ?<WInput
                        className='table-input' onBlur={handleLeaderEdit}
                        onFocusOut={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div onClick={() => {toggleLeaderEdit(!editingLeader);props.setRowCol({row:props.index,col:2})}} className={` table-text`}>
                            {leader}
                        </div>
                }
            </WCol>
            <WCol size="1">
                {
               flagExists?
                <div>
                     <img style={{width:"24%"}} src={require(`../../${imgPath}`)} ></img> 
                     
                </div>
                :
                <div></div>
                }
            </WCol>    
            <WCol size="1"></WCol>
                <WCol size="2">
               
                    {
                    props.data.landmarks.length==0&&props.data.subregionlandmarks.length==0?
                    <a style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} className="hoverEffect" onClick={()=>props.openRegionViewer(props.data,imgPath,props.regionslist,props.index)}>No landmarks</a>
                    
                    :
                    <a className="hoverEffect" onClick={()=>props.openRegionViewer(props.data,imgPath,props.regionslist,props.index)}>
                    <p className="hoverEffect" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{landmarkStr}</p>
                    </a>
                    
                    }
                    </WCol>
        </WRow>
    );
};

export default TableEntry;