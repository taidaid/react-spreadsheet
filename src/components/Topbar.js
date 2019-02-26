import React from "react";

const Topbar = props => {
	const handleChangeValue = e => {
		const newValue = e.target.value;
	};

	return (
		<div>
			<input
				type="text"
				value={props.value}
				onChange={e => handleChangeValue(e)}
			/>
		</div>
	);
};

export default Topbar;
