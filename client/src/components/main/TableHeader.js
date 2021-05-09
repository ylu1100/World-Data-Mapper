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
    const checkForSortedTask=()=>{
        if(!props.activeList.items){
            
            return false
        }
        let items=props.activeList.items;
        for(let i=0;i<items.length-1;i++){
            if(items[i].description.localeCompare(items[i+1].description)>0){
                
                return false
            }
        }
        
        return true
    }
    const checkForSortedDate=()=>{
        if(!props.activeList.items){
            return false
        }
        let items=props.activeList.items;
        for(let i=0;i<items.length-1;i++){
            if(items[i].due_date>items[i+1].due_date){
                return false
            }
        }
        return true
    }
    const checkForSortedAssignment=()=>{
        if(!props.activeList.items){
            return false
        }
        let items=props.activeList.items;
        for(let i=0;i<items.length-1;i++){
            if(items[i].assigned_to.localeCompare(items[i+1].assigned_to)>0){
                return false
            }
        }
        return true
    }
    
    const sortDescendTask=()=>{
        props.sortByDescTaskName()
        setSortedAscend(false)
    }
    const sortAscendTask=()=>{
       
        if(checkForSortedTask()){
            sortDescendTask()
            
            return "lol"
        }
        props.sortByTaskName()
        setSortedAscend(true)
    }
    const sortDescendDate=()=>{
        props.sortListByDescendingDate()
        setSortedDate(false)
    }
    const sortAscendDate=()=>{
        if(checkForSortedDate()){
            sortDescendDate()
            return
        }
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
   
    const sortListByDescendAssignment=()=>{
        props.sortListByDescendingAssignment()
        setSortedAssignment(false)
    }
    const sortListByAscendAssignment=()=>{
        if(checkForSortedAssignment()){
            sortListByDescendAssignment()
            return
        }
        props.sortListByAscendingAssignment()
        setSortedAssignment(true)
    }
    return (
       
        <WRow className="table-header">
             <WCol size="2">

                {
                    !props.activeList.items ||props.activeList.items.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Name</WButton>
                :

                !sortedAscend?
                <WButton onClick={sortAscendTask} className='table-header-section' wType="texted" >Name</WButton>
                :
                <WButton onClick={sortDescendTask} className='table-header-section' wType="texted" >Name</WButton>
                
                }   
            </WCol>

            <WCol size="2">
            
                {
                    !props.activeList.items ||props.activeList.items.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Capital</WButton>
                :
                    !sortedDate?
                <WButton onClick={sortAscendDate} className='table-header-section' wType="texted">Capital</WButton>
                :
                <WButton onClick={sortDescendDate} className='table-header-section' wType="texted">Capital</WButton>
               
                }   
            </WCol>

            <WCol size="2">
                {
                    !props.activeList.items ||props.activeList.items.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Leader</WButton>
                :
                    !sortedComplete?
                <WButton onClick={sortListByComplete} className='table-header-section' wType="texted" >Leader</WButton>
                 :
                <WButton onClick={sortListByIncomplete} className='table-header-section' wType="texted" >Leader</WButton>
                }   
            </WCol>
            <WCol size="2">
                {
                    !props.activeList.items ||props.activeList.items.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Flag</WButton>
                :
                    !sortedComplete?
                <WButton onClick={sortListByComplete} className='table-header-section' wType="texted" >Flag</WButton>
                 :
                <WButton onClick={sortListByIncomplete} className='table-header-section' wType="texted" >Flag</WButton>
                }   
            </WCol>
            {/* <WCol size="2">
                {
                    !props.activeList.items ||props.activeList.items.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Assigned To</WButton>
                :
                    !sortedAssignment?
                <WButton onClick={sortListByAscendAssignment} className='table-header-section' wType="texted" >Assigned To</WButton>
                 :
                <WButton onClick={sortListByDescendAssignment} className='table-header-section' wType="texted" >Assigned To</WButton>
                }   
            </WCol>     */}
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