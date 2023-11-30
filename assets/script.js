document.addEventListener('DOMContentLoaded', function(){
    const apikey = "81bfdb81e8ee1d86945888fe66c7d01d";
    var citySearchForm = $("#weather-search");
    var citySearchValue = $("#city");
    var currentConditions = $("#current-conditions");
    var selectedCityLat;
    var selectedCityLon;
    var forecastCityName;
    var forecastCityDate;
    var forecastCityTemp;
    var forecastCityHumidity;
    var forecastCityWind;
    var forecastCityIcon;
    var forecastTimeZone;

    //fetch weather data
    function getCoordinates(){
        var coordinatesURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearchValue.val() + '&limit=5&appid=' + apikey;
        console.log(coordinatesURL);
        fetch(coordinatesURL)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
            if(data && data.length > 0){
                selectedCityLat = data[0].lat;
                selectedCityLon = data[0].lon;
                getCurrentForecast(selectedCityLat, selectedCityLon);
            }
            else{
                console.log("No Lat/long");
            }
            console.log('lat: ', selectedCityLat);
            console.log('long: ', selectedCityLon);
        })
       .catch(function(error){
        console.log('Error fetching data: ', error);
       });
    }

    function getCurrentForecast(lat, lon){
        var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon='+ lon + '&cnt=48&appid=' + apikey +'&units=imperial';

        fetch(forecastURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log('weather data: ', data);
            forecastCityName = data.city.name;
            forecastCityDate = data.list[0].dt_txt;
            forecastCityTemp = data.list[0].main.temp;
            forecastCityHumidity = data.list[0].main.humidity;
            forecastCityWind = data.list[0].wind.speed;
            forecastCityIcon = data.list[0].weather[0].icon;
            forecastTimeZone = data.city.timezone;

            console.log(forecastCityName);
            console.log(forecastCityDate);
            console.log(forecastCityTemp);
            console.log(forecastCityHumidity);
            console.log(forecastCityWind);
            console.log(forecastCityIcon);
            console.log(forecastTimeZone);

            
        })
        //write current data to the DOM
        writeToDom();
        
        //get 5 day forecast data
        
    }

//write current data to DOM
    function writeToDom(){
        
    }

//write 5 day forecast to DOM

//save search to local storage & append 'saved-cities'
//saved cities should just store lat/long and recall API data when clicked & refresh DOM



citySearchForm.submit(function(event){
    event.preventDefault();
console.log('clicked');
console.log(citySearchValue.val());
getCoordinates();
});
})

















//Weather API Key: 81bfdb81e8ee1d86945888fe66c7d01d

// function getApi() {
//     var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=81bfdb81e8ee1d86945888fe66c7d01d';
  
//     fetch(requestUrl)
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         console.log(data);
//       })}

// getApi();


//lat: 51.5073219
//lon: -0.1276474


//api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}

// function getApi2() {
//     var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=51.5073219&lon=-0.1276474&appid=81bfdb81e8ee1d86945888fe66c7d01d&units=imperial';
  
//     fetch(requestUrl)
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         console.log(data);
//       })}

// getApi2(); 