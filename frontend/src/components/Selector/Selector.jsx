import React from "react";
import Select from "react-select";

const Selector = ({ options, setValue, isMulti }) => {

	const handleChange = (event) => {
		// if multiple items selected
		if (event.length >= 1) {
			var arr = []
			for (let i = 0; i < event.length; i++) {
				arr.push(event[i].value)
			}
			setValue(arr)
		} else {
			setValue(event.value)
		}
	};

	return (
		<div>
			<Select
				onChange={handleChange}
				options={options}
				closeMenuOnSelect={!isMulti}
				isMulti={isMulti}
			/>
		</div>
	);
};

export default Selector;
