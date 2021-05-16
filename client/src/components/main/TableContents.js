import React ,{useState}       from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
 
    

    
    const entries = props.activeList && props.regionslist ? props.regionslist : null;
    const[editingRowCol,setRowCol]=useState({})
   
    return (
        entries ? <div  className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
                        
                        editingRowCol={editingRowCol}
                        setRowCol={setRowCol}
                        regionslist={props.regionslist }
                         refetchEverything={props.refetchEverything}
                        setShowDeleteSubregion={props.setShowDeleteSubregion}
                        setSubregionToBeDeleted={props.setSubregionToBeDeleted}
                        refetchRegions={props.refetchRegions}
                        ancestorList={props.ancestorList}
                        openRegionViewer={props.openRegionViewer}
                        goToSubregion={props.goToSubregion}
                        size={entries.length}
                        activeList={props.activeList}
                        index={index}
                        data={entry} key={entry.id}
                        deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                        editItem={props.editItem}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;