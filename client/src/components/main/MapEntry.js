import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import WLayout from 'wt-frontend/build/components/wlayout/WLayout';
import Delete 							from '../modals/Delete';


const MapEntry = (props) => {
    const entry = props.entry;
    const name = entry.name;
    const [editingName, toggleNameEdit] = useState(false);
    const [showDelete, toggleShowDelete] 	= useState(false);

    const setShowDelete = () => {
		toggleShowDelete(!showDelete)
	};
    
    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : ' Double Click To Enter Map Name';
        props.editMap(entry._id, newName);
    }

    return (
        <div>
        <WRow className= "map-entry">
            <WCol size="12">
            {
                editingName
                ? <WInput className="input-text"
                onBlur={handleNameEdit}
                autoFocus={true} defaultValue={name} type='text'
                wType="outlined" barAnimation="solid" 
                />
                : <div onDoubleClick={() => toggleNameEdit(!editingName)} onClick= {() =>props.handleSetCurrent(entry._id)} >
                    {name}
                </div>
            }
            <WButton className="map-delete-button" shape="rounded" size="small" color="primary" onClick={setShowDelete}>
                X
            </WButton>
            </WCol>
        </WRow>
            {
				showDelete && (<Delete deleteMap={props.deleteMap} entryid={entry._id} setShowDelete={setShowDelete} showDelete={showDelete} />)
			}
        </div>
    )



};
export default MapEntry;