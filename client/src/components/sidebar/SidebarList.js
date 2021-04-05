import React        from 'react';
import SidebarEntry from './SidebarEntry';


const SidebarList = (props) => {
    let index=0;
    return (
        <>
            {
                props.todolists &&
                props.todolists.map(todo => (
                    <SidebarEntry
                        index={index++}
                        handleSetActive={props.handleSetActive} activeid={props.activeid}
                        id={todo.id} key={todo.id} name={todo.name} _id={todo._id}
                        updateListField={props.updateListField}
                    />
                ))
            }
        </>
    );
};

export default SidebarList;