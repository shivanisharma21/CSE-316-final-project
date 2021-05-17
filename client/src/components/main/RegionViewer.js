import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton, WRow, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLFooter } from 'wt-frontend';
import UpdateAccount                    from '../modals/UpdateAccount';
import NavbarOptions from '../navbar/NavbarOptions';
import { useLocation } from "react-router-dom"
import { useHistory } from 'react-router-dom';
import {EditRegion_Transaction} from '../../utils/jsTPS';
import LandmarkEntry            from '../main/LandmarkEntry';

const RegionViewer = (props) => {

    const location = useLocation();
    const [currentMap, setCurrentMap]       = useState(location.state.map);
    const [currentRegion, setCurrentRegion] = useState(location.state.region);
    const [showUpdate, toggleShowUpdate]    = useState(false);
    const [UpdateRegionLandmarks]           = useMutation(mutations.UPDATE_REGION_LANDMARKS);


    let regionName = 'Default';
    if (location.state) {
       
        regionName = location.state.region.name;
    }
    let maps = [];
    let landmarks = currentRegion.landmarks;
    let regionIndex = currentMap.regions.findIndex(region => region._id === currentRegion._id);


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
            let region = map.regions.find(region => region._id === currentRegion._id);
            setCurrentRegion(region);
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

    const addLandmark = async () => {
        let mapID = currentMap._id;
        let regionID = location.state.region._id;
        let field = "landmarks";
        let prev = landmarks;
        let newLandmarks = landmarks.map((x) => x);
        newLandmarks.push("Untitled");
        let value = newLandmarks;
		let transaction = new EditRegion_Transaction(mapID, regionID, field, prev, value, UpdateRegionLandmarks);
		props.tps.addTransaction(transaction);
		tpsRedo();

    }

    const deleteLandmark = async (index) => {
        let mapID = currentMap._id;
        let regionID = location.state.region._id;
        let field = "landmarks";
        let prev = landmarks;
        let newLandmarks = landmarks.filter((element, i) => i !== index);
        let value = newLandmarks;
		let transaction = new EditRegion_Transaction(mapID, regionID, field, prev, value, UpdateRegionLandmarks);
		props.tps.addTransaction(transaction);
		tpsRedo();


    }

    const editLandmarks = async (newName, index) => {
		let mapID = currentMap._id;
        let regionID = location.state.region._id;
        let field = "landmarks";
        let prev = landmarks;
        let newLandmarks = landmarks.map((x) => x);
        newLandmarks[index] = newName;
        let value = newLandmarks;
		let transaction = new EditRegion_Transaction(mapID, regionID, field, prev, value, UpdateRegionLandmarks);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

    const handleMoveBack = async () => {
        let nextRegion = currentMap.regions[regionIndex - 1];

        history.push({
            pathname: '/region/' + currentMap.regions[regionIndex - 1]._id,
            state: {map: currentMap, region: nextRegion}});

        setCurrentRegion(nextRegion);
        
    }

    const handleMoveForward = async () => {
        let nextRegion = currentMap.regions[regionIndex + 1];

        history.push({
            pathname: '/region/' + currentMap.regions[regionIndex + 1]._id,
            state: {map: currentMap, region: nextRegion}});

        setCurrentRegion(nextRegion);
    }

    const backStyle = (regionIndex === 0) ? "back-arrow-disabled" : "back-arrow";
    const forwardStyle = (regionIndex === (currentMap.regions.length - 1)) ? "forward-arrow-disabled" : "forward-arrow"; 

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
                            <WButton className={`${backStyle}`} wType="texted" onClick= {handleMoveBack}>
                                <i className="material-icons">arrow_back</i>
                            </WButton>
                        </WNavItem>
                    </ul>
                    <ul>
                        <WNavItem>
                            <WButton className={`${forwardStyle}`} wType="texted" onClick= {handleMoveForward}>
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
                                    <h2 className="maps-header">Region Landmarks:</h2>
                                    <WButton shape= "rounded" size= "large" className="add-landmark-button"  hoverAnimation="darken" onClick={addLandmark}>
                                        <i className="material-icons new-region-button">add_box</i>
                                        Add Landmark
                                    </WButton>
                                    
                                </WNavbar>
                            </WLHeader>
                            <WLMain>
                                <div className= "map-entries">
                                {  
                                    currentRegion.landmarks.map((entry, index) => (
                                        <LandmarkEntry
                                            entry={entry} index={index}
                                            key={index} editLandmarks={editLandmarks}
                                            deleteLandmark={deleteLandmark}
                                        />
                                        ))
                                }
                                </div>
                            </WLMain>


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
