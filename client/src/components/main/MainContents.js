import React   ,{useState}         from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    const [state,setState]=useState({
        ctrlPressed:false,
        zPressed:false,
        undoPressed:false,
        redoPressed:false,
    })
    const checkKeyEvent=(event)=>{
        if(event.key=='Control'){
          console.log('cpressed')
          setState({
            ctrlPressed:true
          })
        }
        if(event.key=='z'){
          console.log('zpressed')
          if(state.ctrlPressed){
            ctrlZEvent()
          }
        }
        else if(event.key=='y'){
          console.log('ypressed')
          if(state.ctrlPressed){
            ctrlYEvent()
          }
        }
      }
        
      const  removeKeyEvent=()=>{
        console.log('fin')
        setState({
          ctrlPressed:false,
          undoPressed:false,
          redoPressed:false,
        })
      }
    const  ctrlZEvent=()=>{
          setState({
            undoPressed:true,
            ctrlPressed:false,
          })
          props.undo()
          removeKeyEvent()
      }
    const  ctrlYEvent=()=>{
        setState({
          redoPressed:true,
          ctrlPressed:false,
        })
        props.redo()
        removeKeyEvent()
      }
    return (
        <div tabIndex='0'  onKeyDown={checkKeyEvent} className='table ' >
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
                openRegionViewer={props.openRegionViewer}
                goToSubregion={props.goToSubregion}
                regionslist={props.regionslist}
                key={props.activeList.id} activeList={props.activeList}
                deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                editItem={props.editItem}
            />
        </div>
    );
};

export default MainContents;