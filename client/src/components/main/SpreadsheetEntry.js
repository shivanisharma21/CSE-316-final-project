import React, { useState, useEffect } 	from 'react';

import { WButton, WRow, WCol, WInput } from 'wt-frontend';



const SpreadsheetEntry = (props) => {
    const name = props.entry.name;
    const capital = props.entry.capital;
    const leader = props.entry.leader;

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'No Name'
        const prevName = name;
        props.editRegion(props.entry._id, 'name', newName, prevName);
    }
    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'No Capital'
        const prevCapital = capital;
        props.editRegion(props.entry._id, 'capital', newCapital, prevCapital);
    }
    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'No Leader'
        const prevLeader = leader;
        props.editRegion(props.entry._id, 'leader', newLeader, prevLeader);
    }
    return (
        <WRow className='spreadsheet-entry'>
            <WCol size="3">
                <WButton className="delete-region" wType="texted" >
                <i className="material-icons">clear</i>
                </WButton>
                {
                     editingName
                     ? <WInput className="input-text" 
                        onBlur={handleNameEdit}
                        autoFocus={true} defaultValue={name} type='text'
                        wType="outlined"  barAnimation="solid"
                     />
                     : <div className="spreadsheet-text" onClick={() => toggleNameEdit(!editingName)}>
                         {name}
                     </div>
                }
            </WCol>

            <WCol size="2">
            {
                     editingCapital
                     ? <WInput className="input-text" 
                        onBlur={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined"  barAnimation="solid"
                     />
                     : <div  className="spreadsheet-text" onClick={() => toggleCapitalEdit(!editingCapital)}>
                         {capital}
                     </div>
                }
            </WCol>

            <WCol size="2">
            {
                     editingLeader
                     ? <WInput className="input-text" 
                        onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined"  barAnimation="solid"
                     />
                     : <div className="spreadsheet-text" onClick={() => toggleLeaderEdit(!editingLeader)}>
                         {leader}
                     </div>
                }
            </WCol>

            <WCol size="2">
                <WButton className='spreadsheet-section' wType="texted" >Flags</WButton>
            </WCol>
            <WCol size="3">
                <WButton className='spreadsheet-section' wType="texted" >Landmarks</WButton>
            </WCol>

        </WRow>

    );



}
export default SpreadsheetEntry;