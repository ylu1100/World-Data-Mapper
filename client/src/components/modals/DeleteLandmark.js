import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteLandmark = (props) => {
    console.log(props.landmarkToBeDeleted)
    const handleDelete = () => {
       
        props.deleteLandmark(props.landmarkToBeDeleted.landmark,props.landmarkToBeDeleted.index);
        props.setShowDeleteLandmark(false);
    }

    return (
        <div style={{backgroundColor:'rgb(64,69,78)'}} className="delete-modal">
            <div className="modal-header" onClose={() => props.setShowDeleteLandmark(false)}>
                Confirm Delete Landmark: {props.landmarkToBeDeleted.landmark}
			</div>

            <div >
                <WButton className="modal-button cancel-button" hoverAnimation="darken" onClick={() => props.setShowDeleteLandmark(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </div>

        </div>
    );
}

export default DeleteLandmark;