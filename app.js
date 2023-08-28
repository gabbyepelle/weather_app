const API_KEY = "18fed1e54ca24f01a7a212833231708";
const form = document.querySelector("#form");
let currentCity = "";
const fButton = document.querySelector("#farenheit");
const cButton = document.querySelector("#celsius");


function clearPage(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayWeather(data, units){
    const container = document.querySelector(".header-container");
    const city = document.createElement("h1");
    city.innerHTML = `${data.location.name}`;
    container.appendChild(city);
    const temp = document.createElement("p");
    
    
    const condition = document.createElement("p");
    condition.innerHTML = `${data.current.condition.text}`;
    const icon = document.createElement("img");
    icon.src = `${data.current.condition.icon}`;
    
    const details = document.querySelector(".details");
    const feelsLike = document.createElement("p");
    
   
    const humidity = document.createElement("p");
    humidity.innerHTML = `hunidity: ${data.current.humidity}%`;
    
    const uv = document.createElement("p");
    uv.innerHTML = `UV index: ${data.current.uv}`;
    temp.classList.add("temp");
    const min = document.createElement("p");
    const max = document.createElement("p");
    
    if(units === "f"){
        temp.innerHTML = `${data.current.temp_f}&deg`;
        feelsLike.innerHTML = `feels like: ${data.current.feelslike_f}&deg;`;
        min.innerHTML = `low: ${data.forecast.forecastday[0].day.mintemp_f}&deg;`;
        max.innerHTML = `high: ${data.forecast.forecastday[0].day.maxtemp_f}&deg;`;
    }else if(units === "c"){
        temp.innerHTML = `${data.current.temp_c}&deg`;
        feelsLike.innerHTML = `feels like: ${data.current.feelslike_c}&deg`;
        min.innerHTML = `low: ${data.forecast.forecastday[0].day.mintemp_c}&deg;`;
        max.innerHTML = `high: ${data.forecast.forecastday[0].day.maxtemp_c}&deg;`;
    }
    container.appendChild(temp);
    container.appendChild(icon);
    container.appendChild(condition);
    details.appendChild(feelsLike);
    details.appendChild(humidity);
    details.appendChild(uv);
    details.appendChild(min);
    details.appendChild(max); 
}


function displayHourlyWeather(data, units){
    const forecast = document.querySelector(".forecast");
    const today = new Date();
    const currentHr = today.getHours();

    for(let i=currentHr; i<24; i++){
        let d = document.createElement("div");
        d.classList.add("hourly");
        forecast.appendChild(d);
        let hr = document.createElement("p");
        let currentHour = convertTime(data.forecast.forecastday[0].hour[i].time_epoch);
        if(currentHour < 10){
            currentHour = "0" + currentHour;
        }

        hr.innerHTML = currentHour;
        d.appendChild(hr);
        let pic = document.createElement("img");
        pic.src = data.forecast.forecastday[0].hour[i].condition.icon;
        d.appendChild(pic);
        let t = document.createElement("p");
        if(units ==="f"){
            t.innerHTML= `${data.forecast.forecastday[0].hour[i].temp_f}&deg;`;
        }else if(units === "c"){
            t.innerHTML= `${data.forecast.forecastday[0].hour[i].temp_c}&deg;`;
        }
        d.appendChild(t);
        
    }
    // get weather forcast for second day 
    for(let i=0; i<21; i++){
        let d = document.createElement("div");
        d.classList.add("hourly");
        forecast.appendChild(d);
        let hr = document.createElement("p");
        let currentHour = convertTime(data.forecast.forecastday[0].hour[i].time_epoch);
        if(currentHour < 10){
            currentHour = "0" + currentHour;
        }
        hr.innerHTML = currentHour;
        d.appendChild(hr);
        let pic = document.createElement("img");
        pic.src = data.forecast.forecastday[0].hour[i].condition.icon;
        d.appendChild(pic);
        let t = document.createElement("p");
        if(units ==="f"){
            t.innerHTML= `${data.forecast.forecastday[0].hour[i].temp_f}&deg;`;
        }else if(units === "c"){
            t.innerHTML= `${data.forecast.forecastday[0].hour[i].temp_c}&deg;`;
        }
        d.appendChild(t);
    }
}

function convertTime(num){
    const date = new Date(num * 1000);
    const hours = date.getHours();
   return hours
}


async function getCurrentWeather(city, units){
    const error = document.querySelector(".error-display");
    clearPage(error);
    try{
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`,{mode: "cors"}
    
       );
        const data = await response.json();
        currentCity = data.location.name;
        console.log(currentCity);
        console.log(data);
        displayWeather(data, units);
        displayHourlyWeather(data, units);
}catch(e){
    console.log(e);
    const container = document.querySelector(".header-container");
    const forecast = document.querySelector(".forecast");
    const details = document.querySelector(".details");
    clearPage(container);
    clearPage(forecast);
    clearPage(details);
    getCurrentWeather("Charlotte", "f");
    const errorDisplay = document.querySelector(".error-display");
    const p = document.createElement("p");
    p.innerHTML = "No matching location found"
    errorDisplay.appendChild(p);
} 
}






getCurrentWeather("Charlotte", "f");

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const container = document.querySelector(".header-container");
    const forecast = document.querySelector(".forecast");
    const details = document.querySelector(".details");
    const city = document.querySelector("#city");
    console.log(city.value);
    clearPage(container);
    clearPage(forecast);
    clearPage(details);
    getCurrentWeather(city.value, "f");
    city.value = "";
})


fButton.addEventListener("click", ()=>{
    const container = document.querySelector(".header-container");
    const forecast = document.querySelector(".forecast");
    const details = document.querySelector(".details");
    clearPage(container);
    clearPage(forecast);
    clearPage(details);
    getCurrentWeather(currentCity, "f");
})

cButton.addEventListener("click", ()=>{
    const container = document.querySelector(".header-container");
    const forecast = document.querySelector(".forecast");
    const details = document.querySelector(".details");
    clearPage(container);
    clearPage(forecast);
    clearPage(details);
    getCurrentWeather(currentCity, "c");
})