import React        from 'react';


const Regionspreadsheet = (props) => {

    
    console.log(props.data)
    return (
       <div>
           <h1>Region Name: {props.data.name}</h1>
           <h1>Parent Region: 
           </h1>
           <a onClick={()=>props.setShowRegionViewer(false)}>{props.data.parentId}</a>
           <h1>Region Capital: {props.data.capital}</h1>
            <h1>Region Leader: {props.data.leader}</h1>
            <h1># of Sub Regions: {props.data.subregions.length}</h1>
       </div>
    );
};

export default Regionspreadsheet;