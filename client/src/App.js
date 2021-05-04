import React , { useState }			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import Regionspreadsheet from './components/main/regionspreadsheet'
import Home from './components/main/home'
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import cookieParser from 'cookie-parser';
 

const App = () => {
	const [showRegionViewer,setShowRegionViewer]=useState(false)
	const [regionViewerData,setRegionViewerData]=useState({})
	
	let user = null;
    let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
	console.log(refetch)
    if(error) { 
		
	console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const openRegionViewer=(data)=>{
		setShowRegionViewer(true)
		setRegionViewerData(data)
	}
	console.log('regionv')
	console.log((showRegionViewer))
	//console.log(regionViewerData)
	return(
		<BrowserRouter>

			
		{!showRegionViewer?
				<Redirect exact from="/" to={ {pathname: "/home"} } /> 
				:
				<Redirect  from="/" to={ {pathname: "/regionviewer/"+regionViewerData._id} } /> 
		}
		
		{!showRegionViewer?		

				<Route 
					path="/home" 
					name="home" 
					render={() => 
						<Homescreen setShowRegionViewer={setShowRegionViewer} setRegionViewerData={setRegionViewerData} regionViewerData={regionViewerData} openRegionViewer={openRegionViewer} tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/> 
				:
				<Route
					path="/regionviewer/:id"
					name="mapselect"
					
				
					render={()=>
						
						<Regionspreadsheet  setShowRegionViewer={setShowRegionViewer} data={regionViewerData}/>
					}
				/>
				
		}
		</BrowserRouter>
	);
}

export default App;