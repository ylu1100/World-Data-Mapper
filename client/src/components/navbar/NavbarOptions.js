import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);
    
    console.log(props.user)
    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            if (reset) props.setActiveList({});
        }
    };

    return (
        <div>
        <WNavItem hoverAnimation="lighten">
            <h1 className="navbar-options">{props.user.fullName}</h1>
        </WNavItem>
        <WNavItem hoverAnimation="lighten">
            <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                Logout
            </WButton>
        </WNavItem>

        <WNavItem hoverAnimation="lighten">
            <WButton className="navbar-options" onClick={props.setShowUpdate} wType="texted" hoverAnimation="text-primary">
                Update Account
            </WButton>
        </WNavItem>
        </div>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowLogin} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowCreate} wType="texted" hoverAnimation="text-primary"> 
                    Sign Up 
                </WButton>
            </WNavItem>
            
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut user={props.user} setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} />
                : <LoggedIn  user={props.user} fetchUser={props.fetchUser} setShowUpdate={props.setShowUpdate} setActiveList={props.setActiveList} logout={props.logout} />
            }
        </>

    );
};

export default NavbarOptions;