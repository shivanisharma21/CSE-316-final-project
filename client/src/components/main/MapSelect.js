import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLFooter } from 'wt-frontend';
import UpdateAccount                    from '../modals/UpdateAccount';
import NavbarOptions from '../navbar/NavbarOptions';
import MapEntry from '../main/MapEntry';

const MapSelect = (props) => {

    let maps 							= [];
	const [currentMap, setCurrentMap] 		= useState({});
    const [showUpdate, toggleShowUpdate]    = useState(false);

    const [AddMap]                          = useMutation(mutations.ADD_MAP);
    const [EditMap]                         = useMutation(mutations.EDIT_MAP);
    const [DeleteMap]                       = useMutation(mutations.DELETE_MAP);

    const auth = props.user === null ? false : true;

    let username = '';
    if (auth)
        username = props.user.name;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) {maps = data.getAllMaps;}

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (currentMap._id) {
				let tempID = currentMap._id;
				let map = maps.find(map => map._id === tempID);
				setCurrentMap(map);
			}
		}
	}


    const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
	};

    const addMap = async () => {
        const lastID = maps.length >= 1 ? maps[maps.length - 1].id + 1 : 0;
        const newMap = {
            _id:'',
            id: lastID,
            name: 'Untitled',
            owner: props.user._id,
            regions: []
        };
        const { data } = await AddMap({ variables: { map: newMap }, refetchQueries: [{ query: GET_DB_MAPS }] });
        if (data) {
            setCurrentMap(newMap);
            refetchMaps(refetch);
        }

    }

    const editMap = async (_id, newName) => {
        const {data} = await EditMap({variables: {_id: _id, name: newName}, refetchQueries: [{ query: GET_DB_MAPS }] });
        if (data)
            refetchMaps(refetch);
    }

    const deleteMap = async (_id) => {
        const {data} = await DeleteMap({variables: {_id: _id}, refetchQueries: [{ query: GET_DB_MAPS }] });
        if (data)
            refetchMaps(refetch);
    }

    const handleSetCurrent = (_id) => {
        const map = maps.find(map => map._id === _id);
        setCurrentMap(map);
    }

    //const nextMaps = maps.filter(testMap => testMap._id !== currentMap._id);
    // nextMaps.unshift(currentMap);


    return (
        <WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
                        <NavbarOptions fetchUser={props.fetchUser} setCurrentMap={setCurrentMap} setShowUpdate={setShowUpdate} username={username}/>
					</ul>
				</WNavbar>
			</WLHeader>
            <WLMain>
                {
                    <div className="map-container">
                        <WLayout wLayout="header">
                            <WLHeader>
                                <WNavbar color="colored">
                                    <h2 className="maps-header">Your Maps</h2>
                                    <WButton shape= "rounded" size= "large" className="new-map-button" onClick={addMap}  hoverAnimation="darken">
                                        Create New Map
                                    </WButton>
                                    
                                </WNavbar>
                            </WLHeader>
                            <WLMain>
                                <div className= "map-entries">
                                {   maps &&
                                    maps.map((entry, index) => (
                                        <MapEntry
                                            handleSetCurrent={handleSetCurrent} entry={entry} index={index}
                                            key={entry._id} currentMap={currentMap} editMap={editMap}
                                            deleteMap={deleteMap}
                                            
                                        />
                                        ))
                                }
                                </div>
                            </WLMain>
                        </WLayout>
                    </div>
                }
            </WLMain>

            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} showUpdate={showUpdate} />)
			}
        </WLayout>

    );
};
export default MapSelect;