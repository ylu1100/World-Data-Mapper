import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
 
    
    const entries = props.activeList && props.regionslist ? props.regionslist.getAllRegions : null;
    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
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