import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import Login 							from '../modals/Login';
import CreateAccount 					from '../modals/CreateAccount';
import { WNavbar, WNavItem, WButton } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain } from 'wt-frontend';

const Homescreen = (props) => {

	const [showLogin, toggleShowLogin] 		= useState(false);
    const [showCreate, toggleShowCreate] 	= useState(false);

    const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
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
                    <WNavItem hoverAnimation="lighten">
                        <WButton className="create-account" onClick={setShowCreate} wType="texted" hoverAnimation="text-primary">
                            Create Account
                        </WButton>
                    </WNavItem>
                    <WNavItem hoverAnimation="lighten">
                        <WButton className="navbar-options" onClick={setShowLogin} wType="texted" hoverAnimation="text-primary"> 
                            Login 
                        </WButton>
                    </WNavItem>
					</ul>
				</WNavbar>
			</WLHeader>
            <WLMain>
                {
                    <div className="container-secondary">
                    <div className="welcome">Welcome To The World Data Mapper</div>
                    </div>
                }
            </WLMain>

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} showCreate={showCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} setShowLogin={setShowLogin} showLogin={showLogin} />)
			}

        </WLayout>
    );
};

export default Homescreen;