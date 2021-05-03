import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {
    const { data } = props;

    const capital=data.capital
    const name=data.name
    const leader=data.leader
    const landmarks=data.landmarks
   
    

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
                    editingCapital ? <input
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
                    editingLeader ?<input
                        className='table-input' onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div onClick={() => toggleLeaderEdit(!editingLeader)} className={` table-text`}>
                            {leader}
                        </div>
                }
            </WCol>
            {/* <WCol size="2">
                {
                    editingAssignment ? <WInput
                            className='table-input' onBlur={handleAssignmentEdit}
                            autoFocus={true} defaultValue={assignment} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : 
                        !data.completed?
                            <div style={{color:'red'}} onClick={() => toggleAssignmentEdit(!editingAssignment)} className={`${completeStyle} table-text assignment-col`}>
                            {assignment}
                        </div>
                        :
                        <div style={{color:'black'}} onClick={() => toggleAssignmentEdit(!editingAssignment)} className={`${completeStyle} table-text assignment-col`}>
                            {assignment}
                        </div>
                        }
                
            </WCol>     */}
            <WCol size="2">
                <div className='button-group'>
                    {
                    props.index==0?
                    <WButton className="table-entry-buttons button-disable" onClick={() => props.reorderItem(data._id, -1)} wType="texted">
                        <i className="material-icons">expand_less</i>
                    </WButton>
                    :
                    <WButton className="table-entry-buttons " onClick={() => props.reorderItem(data._id, -1)} wType="texted">
                        <i className="material-icons">expand_less</i>
                    </WButton>
                    }
                    {
                    props.index==props.size-1?
                    <WButton className="table-entry-buttons button-disable" onClick={() => props.reorderItem(data._id, 1)} wType="texted">
                        <i className="material-icons">expand_more</i>
                    </WButton>
                    :
                    <WButton className="table-entry-buttons" onClick={() => props.reorderItem(data._id, 1)} wType="texted">
                        <i className="material-icons">expand_more</i>
                    </WButton>
                    }
                    <WButton className="table-entry-buttons" onClick={() => props.deleteItem(data)} wType="texted">
                        <i className="material-icons">close</i>
                    </WButton>
                    
                    <a onClick={()=>props.goToSubregion(props.data)}>Go to sub</a>
                    {
                    props.data.landmarks.length!==0?
                    <a onClick={()=>props.openRegionViewer(props.data)}>{props.data.landmarks}</a>
                    :
                    <a onClick={()=>props.openRegionViewer(props.data)}>N/A</a>
                    
                    }
                </div>
            </WCol>
        </WRow>
    );
};

export default TableEntry;