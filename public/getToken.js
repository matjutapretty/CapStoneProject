const CryptoJS = require('crypto-js');
const request = require('request');
const Promise = require('promise');

let auth_uri = 'https://sandbox-authservice.priaid.ch/login';
let API_KEY = 'sudarshanvittal@gmail.com';
let SECRET_KEY = 'j8ZGd65NbDr2z7F4C';

//function to get hashed string 
const genHashString = () => {
	const hash = CryptoJS.HmacMD5(auth_uri, SECRET_KEY);
	const hashString = hash.toString(CryptoJS.enc.Base64);
	return hashString;
}

let reqToken = new Promise(function (resolve, reject) {

	let hashString = genHashString();
	let options = {
		method: 'POST',
		url: auth_uri,
		headers: {
			'Authorization': `Bearer ${API_KEY}:${hashString}`
		}
	}

	//send request to server to get token
	request(options, (error, response, body) => {
		if (error)
			reject(error);
		else {
			let newBody = JSON.parse(response.body);
			resolve(newBody.Token);
		}
	});
});

module.exports = {
	reqToken
}