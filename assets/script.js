document.addEventListener('DOMContentLoaded', function(){
    displaySavedCities();
    let apikey = "9693d0aea4eb7f576be9081a0f501d15";
    let citySearchForm = $("#weather-search");
    let citySearchValue = $("#city");
    let currentConditions = $("#current-conditions");
    let selectedCityLat;
    let selectedCityLon;
    let forecastCityName;
    let forecastCityDate;
    let forecastCityTemp;
    let forecastCityHumidity;
    let forecastCityWind;
    let forecastCityIcon;
    let forecastTimeZone;

    
    function parseFiveDayForecast(data) {
       console.log('parsing 5 day data: ', data);
        let today = dayjs().format('YYYY-MM-DD');
        let tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
        let processedDays = 0;
    
        for (let i = 0; i < data.list.length && processedDays < 6; i++) {
            let forecastDateTime = data.list[i].dt_txt;
            let forecastDate = forecastDateTime.split(' ')[0];
            let forecastTime = forecastDateTime.split(' ')[1];
    
            // Check if the date is tomorrow and the time is 12:00:00
            if (forecastDate === tomorrow && forecastTime === '12:00:00') {
                // Extract the relevant information for next day at 12:00:00
                let forecastTemp = Math.round(data.list[i].main.temp);
                let forecastHumidity = data.list[i].main.humidity;
                let forecastWind = Math.round(data.list[i].wind.speed);
                let forecastIcon = data.list[i].weather[0].icon;
    
                // Write the information to the DOM
                let forecastIconURL = `<img src="https://openweathermap.org/img/wn/${forecastIcon}.png">`;
                let dayElementId = `day-${processedDays + 1}`;
                let dayElement = document.getElementById(dayElementId);
                console.log('forecast icon url: ',forecastIconURL);
                dayElement.innerHTML = `<p>Date: ${tomorrow}</p>
                <p>${forecastIconURL}</p>
                <p>Temperature: ${forecastTemp} Degrees</p>
                <p>Humidity: ${forecastHumidity} %</p>
                <p>Wind Speed: ${forecastWind} MPH</p>`;
    
                // Increment the date for the next day
                tomorrow = dayjs(tomorrow).add(1, 'day').format('YYYY-MM-DD');
                processedDays++;
            }
        }
    }
    //fetch weather data
    function getCoordinates(){
        var coordinatesURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearchValue.val() + '&limit=5&appid=' + apikey;
        console.log('citysearchvalue: ', citySearchValue);
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

    function getCurrentForecast(selectedCityLat, selectedCityLon){
        var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + selectedCityLat + '&lon='+ selectedCityLon + '&cnt=48&appid=' + apikey +'&units=imperial';
        console.log("getcurrentforecast function: ", selectedCityLat, selectedCityLon);
        fetch(forecastURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log('weather data: ', data);
            forecastCityName = data.city.name;
            forecastCityDate = data.list[0].dt_txt;
            forecastCityTemp = Math.round(data.list[0].main.temp);
            forecastCityHumidity = data.list[0].main.humidity;
            forecastCityWind = Math.round(data.list[0].wind.speed);
            forecastCityIcon = data.list[0].weather[0].icon;
            forecastTimeZone = data.city.timezone;     
            return data;
            
        })
        
        .then(function(data){
            console.log('begin pulling 5 day data', data);
            // console.log(forecastCityName);
            // console.log(forecastCityDate);
            // console.log(forecastCityTemp);
            // console.log(forecastCityHumidity);
            // console.log(forecastCityWind);
            // console.log(forecastCityIcon);
            // console.log(forecastTimeZone);
            parseFiveDayForecast(data);
            writeForecast(data);
            saveCityToLocalStorage({
                name: forecastCityName,
                lat: selectedCityLat,
                lon: selectedCityLon,
            });

        })
        // writeForecast();
        
    }
        //write current weather data to the DOM
        function writeForecast(){
        
        let formattedDate = dayjs(forecastCityDate).format('MM/DD/YYYY');
        let forecastIconURL = 'https://openweathermap.org/img/wn/' + forecastCityIcon + '@2x.png';
            document.getElementById('city-name').innerHTML = forecastCityName;
            document.getElementById('city-date').innerHTML = formattedDate;
            document.getElementById('city-temp').innerHTML = "Current Temperature: " + forecastCityTemp + ' Degrees';
            document.getElementById('city-wind').innerHTML = "Current Wind Speed: " + forecastCityWind + ' MPH';
            document.getElementById('city-humidity').innerHTML = "Current Humidity: " + forecastCityHumidity + '%';
            document.getElementById('forecastIcon').innerHTML = '<img src="' + forecastIconURL + '">';


        //write 5 day forecast data
        
    }

    function saveCityToLocalStorage(cityData) {
        // Retrieve existing data from local storage
        let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    
        // Add the new city data
        let isCityAlreadySaved = false;
        for(let i =0; i < savedCities.length; i++){
            if(
                cityData.name === savedCities[i].name &&
                cityData.lat === savedCities[i].lat &&
                cityData.lon === savedCities[i].lon
            ){
                isCityAlreadySaved = true;
                break;
            }
        }
        if (!isCityAlreadySaved){
            savedCities.push(cityData);
        }
        
        // savedCities.push(cityData);
    
        // Save the updated data back to local storage
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        displaySavedCities();
    }

    function displaySavedCities() {
        // Retrieve saved cities from local storage
        let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    
        // Get the HTML element to display saved cities
        let savedCitiesElement = document.getElementById('saved-cities');
    
        // Clear existing content
        savedCitiesElement.innerHTML = '';
    
        // Iterate over saved cities and create buttons
        savedCities.forEach(function (cityData) {
            let cityButton = document.createElement('button');
            cityButton.textContent = cityData.name;
            cityButton.addEventListener('click', function () {
                // When a saved city button is clicked, fetch and display its forecast
                getCurrentForecast(cityData.lat, cityData.lon);
            });
    
            // Append the button to the saved cities element
            savedCitiesElement.appendChild(cityButton);
        });
    }

citySearchForm.submit(function(event){
    event.preventDefault();
    console.log('clicked');
    console.log(citySearchValue.val());
    getCoordinates();
    citySearchValue.val('');
});
})

