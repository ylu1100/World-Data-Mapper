import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const MapName = (props) => {
	const [input, setInput] = useState("")
	
	const updateInput = (e) => {
		setInput(e.target.value)
	};
    const handleCreateList=()=>{
        props.createNewList(input)
        props.toggleMapName(false)
    }

	return (
        // Replace div with WModal
		
		
		<div style={{background:"rgb(53,58,68)"}}  className="signup-modal">
		<WButton style={{marginLeft:"80%",width:'20%'}} onClick={()=>props.toggleMapName(false)} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">x</WButton>
			<div className="modal-header" onClose={() => props.toggleMapName(false)}>
				Enter the Name of Your Map
			</div>
            <WInput 
							className="modal-input" onBlur={updateInput} name="mapname" labelAnimation="up" 
							barAnimation="solid" labelText="Map Name" wType="outlined" inputType="text" 
						/>
			<WButton className="modal-button" onClick={handleCreateList} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
				Submit
			</WButton>
		</div>
		
	);
}

export default MapName;
