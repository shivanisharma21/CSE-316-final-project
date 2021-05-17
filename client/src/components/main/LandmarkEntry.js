import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import DeleteLandmark 							from '../modals/DeleteLandmark';
import { useHistory } from 'react-router-dom';


const LandmarkEntry = (props) => {
    const entry = props.entry;
    const [editingName, toggleNameEdit] = useState(false);
    const [showDelete, toggleShowDelete] 	= useState(false);

    const setShowDelete = () => {
		toggleShowDelete(!showDelete)
	};

    const handleNameEdit = (e) => {
        e.stopPropagation();
        toggleNameEdit(!editingName);
    }
    
    const handleSubmitNameEdit = (e) => {
        handleNameEdit(e);
        const newName = e.target.value ? e.target.value : 'Untitled';
        props.editLandmarks(newName, props.index);
    }



    return (
        <div>
        <WRow className= "map-entry landmark-entry">
            <WCol size="12">
            {
                editingName
                ? <WInput className="input-text" 
                onBlur={handleSubmitNameEdit}
                autoFocus={true} defaultValue={entry} type='text'
                wType="outlined"  barAnimation="solid"
                />
                : <div>
                    {entry}
                </div>
            }
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <WButton className="map-entry-button" shape="rounded" size="small" hoverAnimation="lighten" clickAnimation="ripple-light" onClick={handleNameEdit}>
                <i className="material-icons">edit</i>
            </WButton>
            <WButton className="map-entry-button delete-region" shape="rounded"  wType="texted" size="small" hoverAnimation="lighten" clickAnimation="ripple-light"  onClick={setShowDelete}>
                <i className="material-icons">clear</i>
            </WButton>
            </WCol>
        </WRow>
            {
				showDelete && (<DeleteLandmark deleteLandmark={props.deleteLandmark} index={props.index} setShowDelete={setShowDelete} showDelete={showDelete} />)
			}
        </div>
    )



};
export default LandmarkEntry;