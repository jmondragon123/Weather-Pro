function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function success(position) {
    let key;
    if(weather_key.length > 1){
        key = weather_key;
    }
    else {
        key = process.env.WEATHER_KEY;
    }
    
    getCity(key,position.coords.latitude, position.coords.longitude);
    getWeather(key,position.coords.latitude, position.coords.longitude);
}

function getCity(key,lat,long) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=imperial`;
    fetch(url)
        .then(respone => respone.json())
        .then(data => {
            const loc = document.querySelector('#location');
            const temps_min = document.querySelector('#temp_min');
            const temps_max = document.querySelector('#temp_max');
            loc.innerHTML = data.name;
            temps_max.innerHTML = "High  " + (data.main.temp_max).toFixed(0) + "\u00B0";
            temps_min.innerHTML = "Low   " + (data.main.temp_min).toFixed(0) + "\u00B0";
        })
    .catch(err => {
            throw (`Sorry, and error occured ${err}`);
        })
} 

function unixDate_current(unix_time){
    const dateObject = new Date(unix_time * 1000);
    const options = {hour: 'numeric', minute: 'numeric' , month: 'short', day: 'numeric' };
    let date_formated = dateObject.toLocaleString("en-US", options);
    return date_formated;
}

function unixDate_forecast(unix_time){
    const dateObject = new Date(unix_time * 1000);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    let date_formated = dateObject.toLocaleString("en-US", options);
    return date_formated;
}

function addForecast(dict){
    const forecast_div = document.querySelector('.weather_forecast');
    
    var forecasts_div = document.createElement('div');
    forecasts_div.setAttribute('class', 'forecast');
    forecast_div.appendChild(forecasts_div);

    var forecasts_div2 = document.createElement('div');
    forecasts_div2.setAttribute('class', 'forecast_info');
    

    var p_date = document.createElement("P");
    var text_date = document.createTextNode(unixDate_forecast(dict.dt));
    p_date.appendChild(text_date);

    var img = document.createElement('img');
    const img_icon_fore = dict.weather[0].icon;
    img.src = `https://openweathermap.org/img/wn/${img_icon_fore}.png`

    var p_min_max = document.createElement("P");
    var text_min_max = document.createTextNode((dict.temp.max).toFixed(0) + "/" + (dict.temp.min).toFixed(0) + "\u00B0F");
    p_min_max.appendChild(text_min_max);

    var p_cond = document.createElement("P");
    var text_cond = document.createTextNode(dict.weather[0].description);
    p_cond.appendChild(text_cond);


    forecasts_div.appendChild(p_date);
    forecasts_div.appendChild(forecasts_div2);
    forecasts_div2.appendChild(img);
    forecasts_div2.appendChild(p_min_max);
    forecasts_div2.appendChild(p_cond);
}


function getWeather(key,lat,long) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=imperial&appid=${key}`;
    fetch(url)
        .then(respone => respone.json())
        .then(data => {
            var event = new Date()
            const cur_date = document.querySelector('#date');
            const conditions = document.querySelector('#conditions');
            const temperature = document.querySelector('#temperature');
            const feels_likes = document.querySelector('#feels_like');
            const humidities = document.querySelector('#humidity');
            const img_icon = document.querySelector('#icon');

            cur_date.innerHTML = unixDate_current(data.current.dt);
            conditions.innerHTML = data.current.weather[0].description;
            temperature.innerHTML = (data.current.temp).toFixed(0) + "\u00B0";
            feels_likes.innerHTML = "Feels like: " + (data.current.feels_like).toFixed(0) + "\u00B0";
            humidities.innerHTML = "Humidity: " + data.current.humidity + "%";
            const weather_icon = data.current.weather[0].icon;
            img_icon.src = `https://openweathermap.org/img/wn/${weather_icon}@4x.png`;
            
            const forecast_array = data.daily;
            forecast_array.forEach(forecast_element => {
                addForecast(forecast_element);
            });


        })
        .catch(err => {
            throw (`Sorry, and error occured ${err}`);
        })
}

getLocation();
