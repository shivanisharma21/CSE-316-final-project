import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain } from 'wt-frontend';
import WInput from 'wt-frontend/build/components/winput/WInput';
import UpdateAccount                    from '../modals/UpdateAccount';
import Delete 							from '../modals/Delete';
import NavbarOptions from '../navbar/NavbarOptions';

const MapSelect = (props) => {

    let maps 							= [];
	const [currentMap, setCurrentMap] 		= useState({});
    const [showDelete, toggleShowDelete] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    = useState(false);

    const auth = props.user === null ? false : true;

    let username = '';
    if (auth)
        username = props.user.name;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

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

    const setShowDelete = () => {
        toggleShowUpdate(false);
		toggleShowDelete(!showDelete)
	};

    const setShowUpdate = () => {
		toggleShowDelete(false);
		toggleShowUpdate(!showUpdate);
	};




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
                    <div className="container-secondary"></div>
                }
            </WLMain>
            {
				showDelete && (<Delete currentid={currentMap._id} setShowDelete={setShowDelete} showDelete={showDelete} />)
			}

            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} showUpdate={showUpdate} />)
			}
        </WLayout>

    );
};
export default MapSelect;