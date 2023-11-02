import axios from "axios";

export default class Image {
	static convertBase64 = (file) => {
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
	};

	static getImageFromId = async (id) => {
		try {
			return await axios.get(`http://localhost:8000/listing/image/${id}`);
		} catch (error) {
			console.log(error)
			return undefined;
		}
	}
}
