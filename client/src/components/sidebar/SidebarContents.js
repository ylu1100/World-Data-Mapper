import React            from 'react';
import SidebarHeader    from './SidebarHeader';
import SidebarList      from './SidebarList';

const SidebarContents = (props) => {
    return (
        <>
            <SidebarHeader 
                
                tps={props.tps}
                activeid={props.activeid}
                toggleMapName={props.toggleMapName}
                auth={props.auth} createNewList={props.createNewList} 
                undo={props.undo} redo={props.redo} 
            />
            <SidebarList
                refetchRegions={props.refetchRegions}
                setShowDelete={props.setShowDelete}
                deleteList={props.deleteList}
                activeid={props.activeid} handleSetActive={props.handleSetActive}
                todolists={props.todolists} createNewList={props.createNewList}
                updateListField={props.updateListField}
            />
        </>
    );
};

export default SidebarContents;