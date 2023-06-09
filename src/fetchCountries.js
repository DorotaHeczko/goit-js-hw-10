export function fetchCountries(query) {	
	return fetch(
	`https://restcountries.com/v3.1/name/${query}`
	).then((response) => {
	if (!response.ok) {
	throw new Error(response.status);
	}
	return response.json();
	});
	}
