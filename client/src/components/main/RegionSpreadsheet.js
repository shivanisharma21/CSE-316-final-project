import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton, WRow, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLFooter } from 'wt-frontend';
import UpdateAccount                    from '../modals/UpdateAccount';
import NavbarOptions from '../navbar/NavbarOptions';
import { useLocation } from "react-router-dom";
import SpreadsheetHeader from '../main/SpreadsheetHeader';
import SpreadsheetEntry from '../main/SpreadsheetEntry';
import { useHistory } from 'react-router-dom';
import {UpdateRegions_Transaction, EditRegion_Transaction} from '../../utils/jsTPS';


const RegionSpreadsheet = (props) => {

    const location = useLocation();
    const [currentMap, setCurrentMap]       = useState(location.state.map);
    const [showUpdate, toggleShowUpdate]    = useState(false);
    const [showUndo, setShowUndo]			= useState(false);
	const [showRedo, setShowRedo]			= useState(false);
    const [sorted, setSorted]				= useState(false);

    const [AddRegion]                       = useMutation(mutations.ADD_REGION);
    const [DeleteRegion]                    = useMutation(mutations.DELETE_REGION);
    const [UpdateRegionField]               = useMutation(mutations.UPDATE_REGION_FIELD);
    const [SortColumn] 				        = useMutation(mutations.SORT_COLUMN);

    
    let regionName = 'Default';
    if (location.state) {
       
        regionName = location.state.name;
    }

    let maps = [];


    const auth = props.user === null ? false : true;

    let username = '';
    if (auth)
        username = props.user.name;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) {maps = data.getAllMaps;}
    

    const refetchRegions  = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
            let map = maps.find(map => map._id === currentMap._id);
            setCurrentMap(map);
		}
	}

    const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
	};

    const history = useHistory();

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchRegions(refetch);
		if (!props.tps.hasTransactionToUndo()) {
			setShowUndo(false);
		}
		setShowRedo(true);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchRegions(refetch);
		if (!props.tps.hasTransactionToRedo()) {
			setShowRedo(false);
		}
		setShowUndo(true);
		return retVal;
	}


    const addRegion = async () => {
		const lastID = currentMap.regions.length >= 1 ? currentMap.regions[currentMap.regions.length - 1].id + 1 : 0;
		const newRegion = {
			_id: '',
			id: lastID,
			name: 'No Name',
			capital: 'No Capital',
			leader: 'No Leader',
			landmarks: ''
		};
		let opcode = 1;
		let regionID = newRegion._id;
		let transaction = new UpdateRegions_Transaction(currentMap._id, regionID, newRegion, opcode, AddRegion, DeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteRegion = async (region, index) => {
		let mapID = currentMap._id;
		let regionID = region._id;
		let opcode = 0;
		let regionToDelete = {
			_id: region._id,
			id: region.id,
			name: region.name,
			capital: region.capital,
			leader: region.leader,
			landmarks: region.landmarks
		}
		let transaction = new UpdateRegions_Transaction(mapID, regionID, regionToDelete, opcode, AddRegion, DeleteRegion, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

    
	const editRegion = async (regionID, field, value, prev) => {
		let mapID = currentMap._id;
		let transaction = new EditRegion_Transaction(mapID, regionID, field, prev, value, UpdateRegionField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

    const sortColumnItems = async (field) => {
		let _id = currentMap._id;
		let direction = 1;
		if (sorted) {
			direction = -1;
			setSorted(false);
		}
		if (direction === 1) {
			setSorted(true);
		}
		const { data } = await SortColumn({
			variables:{ _id: _id, field: field,
						direction: direction
					}
		});
		refetchRegions(refetch);

	}


    const undoStyle = showUndo ? "undo-redo" : "undo-redo-disabled";
    const redoStyle = showRedo ? "undo-redo" : "undo-redo-disabled";
    return (
        <WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem hoverAnimation="lighten">
                            <WButton wType="texted" onClick={() => history.push('/mapselect')}>
                                <Logo className='logo'/>
                            </WButton>
						</WNavItem>
					</ul>
					<ul>
                        <NavbarOptions fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} username={username}/>
					</ul>
				</WNavbar>
			</WLHeader>
            <WLMain>
                {
                    <div className="container-secondary">
                        <WRow className="container-header">
                            <WCol size="3">
                                <div className="region-buttons">
                                <WButton className="new-region-button" wType="texted" hoverAnimation="lighten" clickAnimation="ripple-light" onClick={addRegion}>
                                    <i className="material-icons">add_box</i>
                                </WButton>
                                <WButton className={`${undoStyle}`} hoverAnimation="lighten" clickAnimation="ripple-light" wType="texted" onClick={tpsUndo}>
                                    <i className="material-icons">undo</i>
                                </WButton>
                                <WButton className={`${redoStyle}`} hoverAnimation="lighten" clickAnimation="ripple-light" wType="texted" onClick={tpsRedo}>
                                    <i className="material-icons">redo</i>
                                </WButton>
                                </div>
                            </WCol>
                          
                            <WCol size="8">
                                <h3 className="region-name">
                                    Region Name: {regionName}
                                </h3>

                            </WCol>
                        </WRow>
                        <div className="spreadsheet-container">
                            <SpreadsheetHeader sortColumnItems={sortColumnItems}/>
                           
                            {   
                                maps &&
                                currentMap.regions.map((entry, index) => (
                                    <SpreadsheetEntry
                                        entry={entry} index={index}  key={entry._id} deleteRegion={deleteRegion} editRegion={editRegion}
                                    />
                                ))
                            }
                           
                      
                        </div>
                    </div>
                }
            </WLMain>

            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} showUpdate={showUpdate} />)
			}
        </WLayout>

    );




}
export default RegionSpreadsheet;