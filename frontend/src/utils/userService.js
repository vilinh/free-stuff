import axios from "axios";

export async function getUserById(id) {
	try {
		return await axios.get(`http://localhost:8000/user/${id}`);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}