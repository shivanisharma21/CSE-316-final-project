import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';
import { useHistory } from 'react-router-dom';

const NavbarOptions = (props) => {
     const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const history = useHistory();

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            if (reset) props.setCurrentMap({});
            history.push('/home');
        }
    };
    return (
        <>
             <WNavItem hoverAnimation="lighten">
                <WButton className="create-account" onClick={props.setShowUpdate} wType="texted" hoverAnimation="text-primary">
                    {props.username}
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                    Logout
                </WButton>
            </WNavItem >
           
        </>

    );
};

export default NavbarOptions;