const cupcakeCardSection = $("#cupcake-cards");
const cupcakeForm = $("#cupcake-form");

class Cupcake {
	constructor() {
		this.BASE_URL = "http://127.0.0.1:5000/api/cupcakes";
		this.getCupcakes = this.getCupcakes.bind(this);
		this.appendCupcakeCards = this.appendCupcakeCards.bind(this);
		this.createCupcakeCard = this.createCupcakeCard.bind(this);
		this.createNewCupcake = this.createNewCupcake.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.objectifyDataArray = this.objectifyDataArray.bind(this);
		this.getCupcakes(this.BASE_URL, cupcakeCardSection, "cupcakes");
		this.createNewCupcake();
	}

	async getCupcakes(url, appendElement, key) {
		try {
			const response = await axios.get(url);
			const data = response.data;
			this.appendCupcakeCards(data, appendElement, key);
		} catch (error) {
			cupcakeCardSection.append($("<p>Somthing went wrong!</p>"));
		}
	}

	async appendCupcakeCards(data, appendElement, key) {
		for (let cupcake of data[key]) {
			const cupcake_card = this.createCupcakeCard(cupcake);
			appendElement.append(cupcake_card);
		}
	}

	async appendSingleCupcakeCard(data, appendElement, key) {
		const cupcake = data[key];
		const cupcake_card = this.createCupcakeCard(cupcake);
		appendElement.append(cupcake_card);
	}

	createCupcakeCard(cupcake) {
		const cupcake_card = $(`
            <div class="col-12 col-sm-6 col-md-4 my-3">
                <div class="card">
                    <img src="${cupcake.image}" class="card-img-top text-center" alt="${cupcake.flavor}">
                    <div class="card-body">
                    <h5 class="card-title">Flavor: ${cupcake.flavor}</h5>
                    <ul class="list-group list-group-flush">
                            <li class="list-group-item">Rating: ${cupcake.rating}</li>
                            <li class="list-group-item">Size: ${cupcake.size}</li>
                        </ul>
                    </div>
                </div>
            </div>
            `);
		return cupcake_card;
	}

	createNewCupcake() {
		cupcakeForm.submit(this.handleSubmit);
	}

	async handleSubmit(event) {
		try {
			event.preventDefault();
			const formDataArray = cupcakeForm.serializeArray();
			const jsonObject = this.objectifyDataArray(formDataArray);
			const response = await axios.post(this.BASE_URL, jsonObject);
			console.log(response.data);
			this.appendSingleCupcakeCard(
				response.data,
				cupcakeCardSection,
				"cupcake"
			);
			cupcakeForm.trigger("reset");
		} catch (error) {
			alert("Something went wrong!  Please double check your form.");
		}
	}

	objectifyDataArray(dataArray) {
		const arrayNoCSRF = dataArray.slice(1);
		const returnObject = {};
		for (let i = 0; i < arrayNoCSRF.length; i++) {
			let { name, value } = arrayNoCSRF[i];
			returnObject[name] = value;
		}
		return returnObject;
	}
}

$(document).ready(() => {
	new Cupcake();
});
