import React, { useState, useEffect } from 'react';
import {SORT_BY_TASK} from '../../cache/mutations';
import { WButton, WRow, WCol } from 'wt-frontend';
import { useMutation }    	from '@apollo/client';
const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const clickDisabled = () => { };
    
    const[sortedAscend,setSortedAscend]=useState(false)
    const[sortedDate,setSortedDate]=useState(false)
    const[sortedComplete,setSortedComplete]=useState(false)
    const[sortedAssignment,setSortedAssignment]=useState(false)
    const sortAscendTask=()=>{
        props.sortByTaskName()
        setSortedAscend(true)
    }
    const sortDescendTask=()=>{
        props.sortByDescTaskName()
        setSortedAscend(false)
    }
    const sortDescendDate=()=>{
        props.sortListByDescendingDate()
        setSortedDate(false)
    }
    const sortAscendDate=()=>{
        props.sortListByAscendingDate()
        setSortedDate(true)
    }
    const sortListByIncomplete=()=>{
        props.sortListByIncomplete()
        setSortedComplete(false)
    }
    const sortListByComplete=()=>{
        props.sortListByComplete()
        setSortedComplete(true)
    }
    const sortListByAscendAssignment=()=>{
        props.sortListByAscendingAssignment()
        setSortedAssignment(true)
    }
    const sortListByDescendAssignment=()=>{
        props.sortListByDescendingAssignment()
        setSortedAssignment(false)
    }
    return (
        <WRow className="table-header">
            <WCol size="2">
                {!sortedAscend?
                <WButton onClick={sortAscendTask} className='table-header-section' wType="texted" >Task</WButton>
                :
                <WButton onClick={sortDescendTask} className='table-header-section' wType="texted" >Task</WButton>
                
                }   
            </WCol>

            <WCol size="2">
                {!sortedDate?
                <WButton onClick={sortAscendDate} className='table-header-section' wType="texted">Due Date</WButton>
                :
                <WButton onClick={sortDescendDate} className='table-header-section' wType="texted">Due Date</WButton>
               
                }   
            </WCol>

            <WCol size="2">
                {!sortedComplete?
                <WButton onClick={sortListByComplete} className='table-header-section' wType="texted" >Status</WButton>
                 :
                <WButton onClick={sortListByIncomplete} className='table-header-section' wType="texted" >Status</WButton>
                }   
            </WCol>
            <WCol size="2">
                {!sortedAssignment?
                <WButton onClick={sortListByAscendAssignment} className='table-header-section' wType="texted" >Assignment</WButton>
                 :
                <WButton onClick={sortListByDescendAssignment} className='table-header-section' wType="texted" >Assignment</WButton>
                }   
            </WCol>    
            <WCol size="2">
            <div className='button-group'>
            {   
                        props.tps.hasTransactionToUndo()?
                        <WButton className="table-entry-buttons undo-redo" onClick={props.undo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">undo</i>
                        </WButton>
                        :
                        <WButton className="table-entry-buttons undo-redo button-disable" onClick={props.undo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">undo</i>
                        </WButton>
                        }
                        {props.tps.hasTransactionToRedo()?
                        <WButton className="table-entry-buttons undo-redo" onClick={props.redo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">redo</i>
                        </WButton>
                        :
                        <WButton className="table-entry-buttons undo-redo button-disable" onClick={props.redo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">redo</i>
                        </WButton>
                        }
            </div>            
            </WCol>
            <WCol size="2">
                <div className="table-header-buttons">
                    <WButton onClick={props.disabled||props.addingItem? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => {props.setActiveList({});props.tps.clearAllTransactions()}} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;