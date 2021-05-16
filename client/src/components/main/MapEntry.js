import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import Delete 							from '../modals/Delete';
import { useHistory } from 'react-router-dom';


const MapEntry = (props) => {
    const entry = props.entry;
    const name = entry.name;
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
        props.editMap(entry._id, newName);
    }

    const history = useHistory();


    return (
        <div>
        <WRow className= "map-entry">
            <WCol size="12">
            {
                editingName
                ? <WInput className="input-text" 
                onBlur={handleSubmitNameEdit}
                autoFocus={true} defaultValue={name} type='text'
                wType="outlined"  barAnimation="solid"
                />
                : <div onClick= {() => history.push({
                    pathname: '/regionspreadsheet',
                    state: {map: entry, name: name}
                })} >
                    {name}
                </div>
            }
            <WButton className="map-entry-button" shape="rounded" size="small" onClick={handleNameEdit}>
                <i className="material-icons">edit</i>
            </WButton>
            <WButton className="map-delete-button" shape="rounded" size="small"  onClick={setShowDelete}>
                <i className="material-icons">delete_outline</i>
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