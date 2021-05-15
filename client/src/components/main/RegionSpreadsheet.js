import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLFooter } from 'wt-frontend';
import UpdateAccount                    from '../modals/UpdateAccount';
import NavbarOptions from '../navbar/NavbarOptions';
import { useLocation } from "react-router-dom";
import SpreadsheetHeader from '../main/SpreadsheetHeader';
import { useHistory } from 'react-router-dom';


const RegionSpreadsheet = (props) => {

    const [currentMap, setCurrentMap] 		= useState({});
    const [currentRegion, setCurrentRegion] = useState({});
    const [showUpdate, toggleShowUpdate]    = useState(false);

    let maps = [];
    let regions = [];

    const auth = props.user === null ? false : true;

    let username = '';
    if (auth)
        username = props.user.name;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) {maps = data.getAllMaps;}

    const location = useLocation();
    let currentMapId = '';
    let regionName = 'Default';
    if (location.state) {
        currentMapId = location.state.details; 

    }
    

    const refetchRegions  = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (currentMapId) {
				let tempID = currentMapId;
				let map = maps.find(map => map._id === tempID);
				setCurrentMap(map);
                regions = currentMap.regions;
			}
		}
	}

    const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
	};

    const history = useHistory();


    return (
        <WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
                            <WButton onClick={() => history.push('/mapselect')}>
                                <Logo className='logo'/>
                            </WButton>
						</WNavItem>
					</ul>
					<ul>
                        <NavbarOptions fetchUser={props.fetchUser} setCurrentMap={setCurrentMap} setShowUpdate={setShowUpdate} username={username}/>
					</ul>
				</WNavbar>
			</WLHeader>
            <WLMain>
                {

                    <div className="spreadsheet-container container-secondary">
                        <SpreadsheetHeader/>
                      
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