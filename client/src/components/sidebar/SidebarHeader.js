import React                    from 'react';
import { WButton, WRow, WCol }  from 'wt-frontend';
import {jsTPS} from '../../utils/jsTPS';
const SidebarHeader = (props) => {
    return (
        <WRow className='sidebar-header'>
            <WCol size="7">
                <WButton wType="texted" hoverAnimation="text-primary" className='sidebar-header-name'>
                    Maps
                </WButton>
            </WCol>

            <WCol size="5">
                {
                    props.auth && <div className="sidebar-options">
                        {!props.activeid?
                        <WButton className="sidebar-buttons" onClick={()=>props.toggleMapName(true)} hoverAnimation="darken" clickAnimation="ripple-light" shape="rounded" color="primary">
                            <i >Create New Map</i>
                        </WButton>
                        :
                        <WButton  style={{backgroundColor:"gray"}} className="sidebar-buttons button-disable"  clickAnimation="ripple-light" shape="rounded" >
                            <i >Create New Map</i>
                        </WButton>
                        }
                        {/* {
                        props.tps.hasTransactionToUndo()?
                        <WButton className="sidebar-buttons undo-redo" onClick={props.undo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">undo</i>
                        </WButton>
                        :
                        <WButton className="sidebar-buttons undo-redo button-disable" onClick={props.undo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">undo</i>
                        </WButton>
                        }
                        {props.tps.hasTransactionToRedo()?
                        <WButton className="sidebar-buttons undo-redo" onClick={props.redo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">redo</i>
                        </WButton>
                        :
                        <WButton className="sidebar-buttons undo-redo button-disable" onClick={props.redo} wType="texted" clickAnimation="ripple-light" shape="rounded">
                            <i className="material-icons">redo</i>
                        </WButton>
                        } */}
                    </div>
                }
            </WCol>

        </WRow>

    );
};

export default SidebarHeader;