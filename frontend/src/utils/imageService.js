import axios from "axios";

function convertBase64(file) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}

async function getImageFromId(id) {
	try {
		return await axios.get(`http://localhost:8000/image/${id}`);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

async function postImage(image) {
	try {
		return await axios.post("http://localhost:8000/image", image);
	} catch (error) {
		console.log(error);
	}
}

async function updateImageById(id, image) {
	try {
		return await axios.put(`http://localhost:8000/image/${id}`, image);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

export { convertBase64, getImageFromId, postImage, updateImageById }
