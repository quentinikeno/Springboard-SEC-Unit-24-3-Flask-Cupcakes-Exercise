const cupcakeCardSection = $("#cupcake-cards");

class Cupcake {
	constructor() {
		this.BASE_URL = "http://127.0.0.1:5000/api/cupcakes";
		this.getCupcakes = this.getCupcakes.bind(this);
		this.appendCupcakeCards = this.appendCupcakeCards.bind(this);
		this.getCupcakes(this.BASE_URL, cupcakeCardSection, "cupcakes");
	}

	async getCupcakes(url, appendElement, key) {
		try {
			const response = await axios.get(url);
			const data = response.data;
			this.appendCupcakeCards(data, appendElement, key);
		} catch (error) {
			console.log("Something went wrong!");
			console.log(error);
			cupcakeCardSection.append($("<p>Somthing went wrong!</p>"));
		}
	}

	async appendCupcakeCards(data, appendElement, key) {
		for (let cupcake of data[key]) {
			const cupcake_card = $(`
            <div class="col-12 col-sm-6 col-md-4">
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
			appendElement.append(cupcake_card);
		}
	}
}

$(document).ready(() => {
	new Cupcake();
});
