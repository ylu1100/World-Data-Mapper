import React 			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import Regionspreadsheet from './components/main/regionspreadsheet'
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import cookieParser from 'cookie-parser';
 
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
  }
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	console.log(getCookie("listId"))
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
	console.log(refetch)
    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }

	return(
		<BrowserRouter>
		
			<Switch>

				<Redirect exact from="/" to={ {pathname: "/home"} } /> 
				
				<Route 
					path="/home" 
					name="home" 
					render={() => 
						<Homescreen tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/> 
				
				<Route
					path="/mapselect/id=:id"
					name="mapselect"
					id={getCookie("listId")}
					render={()=>
						
						<Regionspreadsheet/>
					}
				/>
				
			</Switch>
		</BrowserRouter>
	);
}

export default App;