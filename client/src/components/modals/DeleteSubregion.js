import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteSubregion = (props) => {

    const handleDelete = async () => {
       
        props.deleteItem(props.subregionToBeDeleted);
        props.setShowDeleteSubregion(false);
    }

    return (
        <div style={{backgroundColor:'rgb(64,69,78)'}} className="delete-modal">
            <div className="modal-header" onClose={() => props.setShowDeleteSubregion(false)}>
                Delete {props.subregionToBeDeleted.name} and all its descendants?
			</div>

            <div >
                <WButton className="modal-button cancel-button" hoverAnimation="darken" onClick={() => props.setShowDeleteSubregion(false)} wType="texted">
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

export default DeleteSubregion;