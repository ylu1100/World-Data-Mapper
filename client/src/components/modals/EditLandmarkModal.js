import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';
import WInput from 'wt-frontend/build/components/winput/WInput';
const EditLandmarkModal = (props) => {

    const handleLandmarkEdit=(e)=>{
        props.changeLandmark(props.landmarkToBeEdited.landmark,props.landmarkToBeEdited.index,e.target.value)
        props.setShowEditLandmark(false)
    }
    return (
        <div style={{backgroundColor:'rgb(64,69,78)'}} className="delete-modal">
            <div className="modal-header" >
                Edit Landmark: {props.landmarkToBeEdited.landmark}
			</div>

            <div >
                
                <label className="col-spacer">&nbsp;</label>
                <WInput autoFocus onBlur={handleLandmarkEdit} defaultValue={props.landmarkToBeEdited.landmark} clickAnimation="ripple-light"  >
                   
				</WInput>
                <WButton className="modal-button cancel-button" onClick={()=>props.setShowEditLandmark(false)} hoverAnimation="darken"  wType="texted">
                    Cancel
				</WButton>
                <WButton className="modal-button cancel-button"  hoverAnimation="darken"  wType="texted">
                    Save
				</WButton>
            </div>

        </div>
    );
}

export default EditLandmarkModal;