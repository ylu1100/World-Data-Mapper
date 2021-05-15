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
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    
    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'No Name';
        const prevName = name;
        props.editItem(data._id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'No Capital';
        const prevCapital = capital;
        props.editItem(data._id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : "No Leader";
        const prevLeader = leader;
        props.editItem(data._id, 'leader', newLeader, prevLeader);
    };
    
    return (
        <WRow className='table-entry'>
            <WCol size="2">
                {
                    editingName || name === ''
                        ? <WInput
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            onClick={() => toggleNameEdit(!editingName)}
                        >{name}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingCapital ? <WInput
                        className='table-input' onBlur={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleCapitalEdit(!editingCapital)}
                        >{capital}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader ?<WInput
                        className='table-input' onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div onClick={() => toggleLeaderEdit(!editingLeader)} className={` table-text`}>
                            {leader}
                        </div>
                }
            </WCol>
            <WCol size="2">
                {
               flagExists?
                <div>
                     <img style={{width:"24%"}} src={require(`../../${imgPath}`)} ></img> 
                     
                </div>
                :
                <div></div>
                }
            </WCol>    
            <WCol size="2">
                <div className='button-group'>
                    
                    <WButton className="table-entry-buttons" onClick={() => {props.setSubregionToBeDeleted(data);props.setShowDeleteSubregion(true);}} wType="texted">
                        <i className="material-icons">close</i>
                    </WButton>
                    <a className="hoverEffect" onClick={()=>props.goToSubregion(props.data)}>Go to sub</a>
                    
                </div>
                </WCol>
                <WCol size="2">
               
                    {
                    props.data.landmarks.length!==0?
                    <a className="hoverEffect" onClick={()=>props.openRegionViewer(props.data,imgPath,props.regionslist,props.index)}>{landmarkStr}</a>
                    :
                    <a className="hoverEffect" onClick={()=>props.openRegionViewer(props.data,imgPath,props.regionslist,props.index)}>No landmarks</a>
                    
                    }
                    </WCol>
        </WRow>
    );
};

export default TableEntry;