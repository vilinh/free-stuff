import axios from "axios";

async function getUserById(id) {
	try {
		return await axios.get(`http://localhost:8000/user/${id}`);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

async function updateUserById(id, user) {
	try {
		await axios.put(`http://localhost:8000/user/${id}`, user);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

export { getUserById, updateUserById }