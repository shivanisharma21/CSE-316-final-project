import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: ''});
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			props.fetchUser();
			props.setShowUpdate(false);

		};
	};

	return (

		<WModal className="signup-modal" visible={props.showUpdate}>
			<WMHeader className="modal-header" onClose={() => props.setShowUpdate(false)}>
				Update Account
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
						<WRow className="modal-col-gap signup-modal">
							<WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="name" labelAnimation="up" 
									barAnimation="solid" labelText="First Name" wType="outlined" inputType="text" 
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
					</WMMain>
			}
			<WMFooter>
                <WButton className="modal-button" onClick={handleUpdateAccount}  clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Update
				</WButton>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<WButton className="modal-button-cancel" onClick={() => props.setShowUpdate(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</WMFooter>
		</WModal>
	);
}

export default UpdateAccount;
