import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteLandmark = (props) => {
    
    const handleDelete = async () => {
        props.deleteLandmark(props.index);
        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" visible={props.showDelete}>
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete Landmark?
			</WMHeader>

            <WMMain>
                <WButton className="modal-button-cancel" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal>
    );
}

export default DeleteLandmark;