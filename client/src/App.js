import React , { useState }			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import Regionspreadsheet from './components/main/regionviewer'
import Home from './components/main/home'
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import cookieParser from 'cookie-parser';
 

const App = (props) => {
	const [showRegionViewer,setShowRegionViewer]=useState(false)
	const [regionViewerData,setRegionViewerData]=useState({data:-1})
	const [activeList,setActiveList]=useState({})
	console.log(regionViewerData)
	let user = null;

   
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
	
	console.log(refetch)
    if(error) { 
		
	console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const openRegionViewer=(data,imgPath,regionslist,index)=>{
		console.log(regionslist)
		console.log(index)
		setRegionViewerData({data,imgPath,regionslist,index})
		setShowRegionViewer(true)
		
	}
	
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
						<Homescreen activeList={activeList} setActiveList={setActiveList}  showRegionViewer={showRegionViewer} setShowRegionViewer={setShowRegionViewer} setRegionViewerData={setRegionViewerData} regionViewerData={regionViewerData} openRegionViewer={openRegionViewer} tps={props.transactionStack} fetchUser={refetch} user={user} />
					} 
				/> 
				:
				<Route
					path="/regionviewer/:id"
					name="mapselect"
					
				
					render={()=>
						
						<Regionspreadsheet showRegionViewer={showRegionViewer} tps={props.transactionStack} setActiveList={setActiveList} fetchUser={refetch} user={user}  setRegionViewerData={setRegionViewerData} setShowRegionViewer={setShowRegionViewer} data={regionViewerData}/>
					}
				/>
				
		}
		</BrowserRouter>
	);
}

export default App;