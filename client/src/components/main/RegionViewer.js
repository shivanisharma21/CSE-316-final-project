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
import {EditRegion_Transaction} from '../../utils/jsTPS';

const RegionViewer = (props) => {

    const location = useLocation();
    const [currentMap, setCurrentMap]       = useState(location.state.map);
    const [showUpdate, toggleShowUpdate]    = useState(false);
    const [UpdateRegionField]               = useMutation(mutations.UPDATE_REGION_FIELD);


    let regionName = 'Default';
    if (location.state) {
       
        regionName = location.state.region.name;
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
    const handleUndo = (event) => {
		if (event.ctrlKey && event.key === 'z') {
			tpsUndo();
		}
	};

	const handleRedo = (event) => {
		if (event.ctrlKey && event.key === 'y') {
			tpsRedo();
		}
	};

	useEffect (() => {
		document.addEventListener('keydown', handleUndo);

		return () => {
			document.removeEventListener('keydown', handleUndo);
		};
		  
	}, [handleUndo]);

	useEffect (() => {
		document.addEventListener('keydown', handleRedo);

		return () => {
			document.removeEventListener('keydown', handleRedo);
		};
		  
	}, [handleRedo]);
	

    const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
	};

    const history = useHistory();

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchRegions(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchRegions(refetch);
		return retVal;
	}

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
                        <WNavItem>
                            <h3 className="navbar-text">
                                {currentMap.name}{' > '}{regionName}
                            </h3>
                        </WNavItem>
                    </ul>
                    <ul>
                        <WNavItem>
                            <WButton className="back-arrow" wType="texted">
                                <i className="material-icons">arrow_back</i>
                            </WButton>
                        </WNavItem>
                    </ul>
                    <ul>
                        <WNavItem>
                            <WButton className="forward-arrow" wType="texted">
                                <i className="material-icons">arrow_forward</i>
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
                         <h2 className="region-viewer-text region-viewer-name">Region Name: {regionName}</h2>
                         <h2 className="region-viewer-text region-viewer-parent" onClick= {() => history.push({
                            pathname: '/regionspreadsheet',
                            state: {map: currentMap, name: currentMap.name}
                            })}>Parent Region: {currentMap.name}</h2>
                         <h2 className="region-viewer-text region-viewer-capital">Region Capital: {location.state.region.capital}</h2>
                         <h2 className="region-viewer-text region-viewer-leader">Region Leader: {location.state.region.leader}</h2>
                         <h2 className="region-viewer-text region-viewer-num"># Of Sub Regions: 0</h2>

                        <div className="landmarks-container">
                            <WLayout wType="header">
                            <WLHeader>
                                <WNavbar color="colored">
                                    <h2 className="maps-header">Region Landmarks</h2>
                                    <WButton shape= "rounded" size= "large" className="add-landmark-button"  hoverAnimation="darken">
                                        <i className="material-icons new-region-button">add_box</i>
                                        Add Landmark
                                    </WButton>
                                    
                                </WNavbar>
                            </WLHeader>


                            </WLayout>


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
export default RegionViewer;
