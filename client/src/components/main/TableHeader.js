import React, { useState, useEffect } from 'react';
import {SORT_BY_TASK} from '../../cache/mutations';
import { WButton, WRow, WCol } from 'wt-frontend';
import { useMutation }    	from '@apollo/client';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const clickDisabled = () => { };
    
    
    console.log(props.activeList)
   
    
    
    // const sortAscendTask=()=>{
       
    //     if(checkForSortedTask()){
    //         sortDescendTask()
            
    //         return "lol"
    //     }
    //     props.sortByTaskName()
    //     setSortedAscend(true)
    // }
    
   console.log(props.tps.hasTransactionToUndo())
    return (
       
        <WRow className="table-header">
             <WCol size="2">

                {
                    !props.activeList.subregions ||props.activeList.subregions.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Name</WButton>
                :

                <WButton onClick={props.sortListByAscendingName} className='table-header-section' wType="texted" >Name</WButton>
               
                }   
            </WCol>

            <WCol size="2">
            
                {
                    !props.activeList.subregions ||props.activeList.subregions.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Capital</WButton>
                :
                    
                <WButton onClick={props.sortListByAscendingCapital} className='table-header-section' wType="texted">Capital</WButton>
                }
            </WCol>

            <WCol size="2">
                {
                    !props.activeList.subregions ||props.activeList.subregions.length==0?
                <WButton  className='table-header-section button-disable' wType="texted" >Leader</WButton>
                :
                <WButton onClick={props.sortListByAscendingLeader} className='table-header-section' wType="texted" >Leader</WButton>
                }
            </WCol>
            <WCol size="2">
                <WButton  className='table-header-section button-disable' wType="texted" >Flag</WButton>
                  
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
                    <WButton onClick={props.disabled ? clickDisabled : () => {props.setActiveList({});props.tps.clearAllTransactions()}} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;