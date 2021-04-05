import React            from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    
    return (
        <div className='table ' >
            <TableHeader
                
                addingItem={props.addingItem}
                tps={props.tps}
                activeList={props.activeList}
                undo={props.undo} redo={props.redo}
                sortByDescTaskName={props.sortByDescTaskName}
                sortByTaskName={props.sortByTaskName}
                sortListByDescendingDate={props.sortListByDescendingDate}
                sortListByAscendingDate={props.sortListByAscendingDate}
                sortListByIncomplete={props.sortListByIncomplete}
				sortListByComplete={props.sortListByComplete}
                sortListByDescendingAssignment={props.sortListByDescendingAssignment}
				sortListByAscendingAssignment={props.sortListByAscendingAssignment}
                disabled={!props.activeList._id} addItem={props.addItem}
                setShowDelete={props.setShowDelete} setActiveList={props.setActiveList}
            />
            <TableContents
                key={props.activeList.id} activeList={props.activeList}
                deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                editItem={props.editItem}
            />
        </div>
    );
};

export default MainContents;