import React, { useState } 	from 'react';
import { UPDATE_ACCOUNT }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Update = (props) => {
	const [input, setInput] = useState({ email: '', password: '', fullName:'' });
	const [loading, toggleLoading] = useState(false);
    const [Update] = useMutation(UPDATE_ACCOUNT)
	
	const updateInput = (e) => {
		const { name, value } = e.target;
        console.log(value)
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
        console.log(input)
        console.log(props.user)
		const { loading, error, data } = await Update({ variables: { ...input,_id:props.user._id } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.updateAccount.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
			}
			props.setShowUpdate(false);

		};
	}

	return (
        // Replace div with WModal

		<div className="signup-modal">
			<div className="modal-header" onClose={() => props.setShowUpdate(false)}>
				Update Account Information
			</div>

			{
				loading ? <div />
					: <div>
					<WButton style={{marginLeft:"80%",width:'20%'}} onClick={()=>props.setShowUpdate(false)} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">x</WButton>
						<WRow >
						
							<WCol size="6">
								<WInput 
									defaultValue={props.user.fullName}
									className="" onBlur={updateInput} name="fullName" labelAnimation="up" 
									barAnimation="solid" labelText="Full Name" wType="outlined" inputType="text" 
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							defaultValue={props.user.email}
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
					</div>
			}
			<WButton className="modal-button" onClick={handleUpdateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
				Submit
			</WButton>
		</div>
	);
}

export default Update;
