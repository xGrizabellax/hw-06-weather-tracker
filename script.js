/* link js to html
create a buttom element
get access to
*/
var page = document.querySelector('.weather-page')
page.setAttribute('style', 'text-align: center')
var display = document.querySelector('.display')
var inputField = document.querySelector('#city-input')
var button = document.querySelector('#get-weather')
var historyPanel = document.querySelector('.past-cities')
var pin = document.querySelector('.pin')
console.log(inputField)
console.log(button)
var pastCityArray = []


if (JSON.parse(localStorage.getItem('weather-history')) !== null) {
    pastCityArray = JSON.parse(localStorage.getItem('weather-history'))
}
console.log(pastCityArray)
function remakeButtons(){
    for (i = 0; i < pastCityArray.length; i++) {
        var cityButton = document.createElement('button');
        cityButton.setAttribute('class', 'city-button')
        var buttonName = pastCityArray[i]
        cityButton.textContent = buttonName
        historyPanel.prepend(cityButton)

        cityButton.addEventListener('click', function (event) {
            event.preventDefault()
            recallCity(this)

        })

        function recallCity(target) {
            var newCity = target.textContent
            console.log(newCity)
            fetchData(newCity)
            historyPanel.removeChild(target)
        }

    }
}


remakeButtons()


function fetchData(newCity) {
    // event.preventDefault()
    pin.innerHTML = ""
    var cityName = inputField.value || newCity
    var apiKey = 'af64df3fe4272a2257c01c9b701f1a9b'
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=' + apiKey
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })

        .then(function (weatherData) {
            console.log(weatherData)
            console.log(weatherData.coord.lat)
            console.log(weatherData.coord.lon)
            var latitude = weatherData.coord.lat
            var longitude = weatherData.coord.lon
            var todayDate = moment().format('L')
            var displayCity = document.querySelector('.current-city')
            var displayIcon = document.querySelector('.current-icon')
            var temperature = document.querySelector('.temp')
            var wind = document.querySelector('.wind')
            var humidity = document.querySelector('.humidity')
            var uvIndex = document.querySelector('.uv-index')
            var fiveDayTitle = document.querySelector('.five-day')
            var todayDisplay = document.querySelector('.forecast')
            displayCity.setAttribute('style', 'text-align: center; font-weight: 50px;')
            inputField.value = ""



            requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly&appid=' + apiKey
            fetch(requestUrl)
                .then(function (response) {
                    return response.json()
                })

                .then(function (fiveDayData) {
                    console.log(fiveDayData)

                    todayDisplay.setAttribute('style', 'margin-top: 20px; border: solid 1px black;');
                    displayCity.textContent = weatherData.name + ' - ' + todayDate;
                    var currentIcon = fiveDayData.daily[0].weather[0].icon
                    displayIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + currentIcon + '@2x.png')
                    var currentTemp = weatherData.main.temp
                    temperature.textContent = 'Temp: ' + currentTemp + '°F';
                    var currentWind = weatherData.wind.speed
                    wind.textContent = 'Wind: ' + currentWind + ' MPH';
                    var currentHumidity = weatherData.main.humidity
                    humidity.textContent = 'Humidity: ' + currentHumidity + '%';
                    var indexSpan = document.createElement('span')
                    indexSpan.textContent = fiveDayData.daily[0].uvi
                    uvIndex.textContent = 'UV Index: '
                    uvIndex.append(indexSpan)

                    if (fiveDayData.daily[0].uvi < 3) {
                        indexSpan.setAttribute('style', 'background-color: green; color: white;')
                    } else if (fiveDayData.daily[0].uvi >= 3 && fiveDayData.daily[0].uvi < 5) {
                        indexSpan.setAttribute('style', 'background-color: yellow; color: black;')
                    } else {
                        indexSpan.setAttribute('style', 'background-color: red; color: white;')
                    }

                    fiveDayTitle.textContent = "5-Day Forecast: "

                    var forecast = document.createElement('div')
                    forecast.setAttribute('class', 'col d-flex flex-row')
                    pin.append(forecast)


                    for (var i = 1; i < 6; i++) {
                        var oneDayForecast = document.createElement('article')
                        var date = document.createElement('h4')
                        var dayIcon = document.createElement('img')
                        var dayTemp = document.createElement('p')
                        var dayWind = document.createElement('p')
                        var dayHumidity = document.createElement('p')

                        var icon = fiveDayData.daily[i].weather[0].icon
                        var kTemp = fiveDayData.daily[i].temp.day
                        var fTemp = ((kTemp - 273.15) * 9 / 5 + 32).toFixed(2)


                        oneDayForecast.setAttribute('style', 'display: flex; flex-direction: column; padding: 10px; border-radius: 10px; background-color: rgb(19, 19, 94); color: white;')

                        date.textContent = moment().add(i, 'day').format('L')
                        dayIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')
                        dayTemp.textContent = 'Temp: ' + fTemp + '°F'
                        dayWind.textContent = 'Wind: ' + fiveDayData.daily[i].wind_speed + ' MPH'
                        dayHumidity.textContent = 'Humidity: ' + fiveDayData.daily[i].humidity + '%'

                        forecast.setAttribute('style', 'justify-content: space-between;')
                        date.setAttribute('style', 'font-weight: 10px; font-size: 25px');
                        dayTemp.setAttribute('style', 'font-size: 20px; color: rgb(253, 255, 119);');
                        dayWind.setAttribute('style', 'font-size: 20px; color: rgb(253, 255, 119);');
                        dayHumidity.setAttribute('style', 'font-size: 20px; color: rgb(253, 255, 119);');

                        oneDayForecast.append(date)
                        oneDayForecast.append(dayIcon)
                        oneDayForecast.append(dayTemp)
                        oneDayForecast.append(dayWind)
                        oneDayForecast.append(dayHumidity)

                        forecast.append(oneDayForecast)


                    }

                    var cityButton = document.createElement('button');
                    cityButton.setAttribute('class', 'city-button')
                    var buttonName = weatherData.name
                    cityButton.textContent = buttonName
                    historyPanel.prepend(cityButton)
                    pastCityArray.push(buttonName)
                    localStorage.setItem('weather-history', JSON.stringify(pastCityArray))
                    
                    console.log(cityButton)

                    cityButton.addEventListener('click', function (event) {
                        event.preventDefault()
                        recallCity(this)

                    })

                    function recallCity(target) {
                        var newCity = target.textContent
                        console.log(newCity)
                        fetchData(newCity)
                        historyPanel.removeChild(target)
                    }

                })

        })

}

button.addEventListener('click', fetchData)
