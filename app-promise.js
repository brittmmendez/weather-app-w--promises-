const yargs = require('yargs');
const axios = require('axios');

const argv= yargs
  .options({
    address: {
        demand: true,
        alias: 'a',
        describe: 'Address to fetch weathe for',
        string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

//using axiou library allows us to chain promises
let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAOGmd8C9GSfQh543uE_r86Hr870X88004`

//returns a promise then we use then once to do something with thr geo data
axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS'){
    throw new Error("Unable to find address");
  }

  //print address to screen
  console.log(response.data.results[0].formatted_address);

  //set up and run another promise where we make the request for weather if location is found above
  let latitude = response.data.results[0].geometry.location.lat;
  let longitude = response.data.results[0].geometry.location.lng;
  let weatherUrl= `https://api.darksky.net/forecast/f4e35530b3613dd34d6ef61b6d97792b/${latitude},${longitude}`
  return axios.get(weatherUrl);
  //second then call to print weather to screen
}).then((response) => {
  let temperature = response.data.currently.temperature;
  let apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`The temp is ${temperature}, but it feels like ${apparentTemperature}`);
  //added catch call which will handle any errors
}).catch((e) => {
  if (e.code === 'ECONNREFUSED'){
    console.log('Unable to connect to API servers')
  }else {
    console.log(e.message);
  }
})
