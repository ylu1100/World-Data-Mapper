import React        from 'react';
import RotatingEarth 		from '../../imagesandgifs/rotatingearth.gif'; 

const Home = (props) => {
 
    
    
    return (
        <div style={{position:"relative"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translateX(-50%) translateY(45%)"}}>
            <img src= {RotatingEarth}></img>
            <h1 style={{color:"white"}}>WELCOME TO DATA MAPPER</h1>
            </div>
        </div>
    );
};

export default Home;