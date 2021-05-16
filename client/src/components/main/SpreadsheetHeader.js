import React, { useState } from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const SpreadsheetHeader = (props) => {

    return (
        <WRow className='spreadsheet-header'>
            <WCol size="3">
                <WButton className='spreadsheet-section' wType="texted" >Name</WButton>
            </WCol>
            <WCol size="2">
                <WButton className='spreadsheet-section' wType="texted" >Capital</WButton>
            </WCol>
            <WCol size="2">
                <WButton className='spreadsheet-section' wType="texted" >Leader</WButton>
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