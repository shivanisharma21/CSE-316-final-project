import React, { useState } from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const SpreadsheetHeader = (props) => {

    const handleSortByName = () => {
        props.sortColumnItems("name");
    };

    const handleSortByCapital = () => {
        props.sortColumnItems("capital");
    };

    const handleSortByLeader = () => {
        props.sortColumnItems("leader");
    };


    return (
        <WRow className='spreadsheet-header'>
            <WCol size="3">
                <WButton  onClick={handleSortByName} hoverAnimation="lighten" clickAnimation="ripple-light" className='spreadsheet-section' wType="texted" >Name</WButton>
            </WCol>
            <WCol size="2">
                <WButton onClick={handleSortByCapital} hoverAnimation="lighten" clickAnimation="ripple-light" className='spreadsheet-section' wType="texted" >Capital</WButton>
            </WCol>
            <WCol size="2">
                <WButton onClick={handleSortByLeader} hoverAnimation="lighten" clickAnimation="ripple-light" className='spreadsheet-section' wType="texted" >Leader</WButton>
            </WCol>
            <WCol size="2">
                <WButton disabled="true" className='spreadsheet-section' wType="texted" >Flags</WButton>
            </WCol>
            <WCol size="3">
                <WButton disabled="true" className='spreadsheet-section' wType="texted" >Landmarks</WButton>
            </WCol>

        </WRow>

    );



}
export default SpreadsheetHeader;