import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain } from 'wt-frontend';
import WInput from 'wt-frontend/build/components/winput/WInput';

const Homescreen = (props) => {

	let maps 							= [];
	const [currentMap, setCurrentMap] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
    const [showCreate, toggleShowCreate] 	= useState(false);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const auth = props.user === null ? false : true;

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


    const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	}




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
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchMaps={refetch} setCurrentMap={setCurrentMap}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
            <WLMain>
            <div className="container-secondary">
                <div className="welcome">Welcome To The World Data Mapper</div>
            </div>
            </WLMain>
            {
				showDelete && (<Delete currentid={currentMap._id} setShowDelete={setShowDelete} showDelete={showDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} showCreate={showCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchMaps={refetch} setShowLogin={setShowLogin} showLogin={showLogin} />)
			}
        </WLayout>
    );
};

export default Homescreen;