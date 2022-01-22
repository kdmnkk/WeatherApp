import {Tabs} from "./tabs.js";

window.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.left-block__button'),
        tabsContent = document.querySelectorAll('.left-block__card'),
        tabsParent = document.querySelector('.left-block__buttons');

    const tab = new Tabs(tabsParent, tabButtons, tabsContent);

    tabsParent.addEventListener('click', (e) => tab.toggleTabs(e));

    const serverUrl = 'https://api.openweathermap.org/data/2.5/',
        apiKey = '37ee4295a3585d171683b70968723625';

    const searchInput = document.querySelector('.search'),
        temperature = document.querySelector('.left-block__degrees'),
        cityNameText = document.querySelectorAll('[data-city]'),
        form = document.querySelector('#form'),
        weatherList = document.querySelectorAll('.status-list-item'),
        likeButton = document.querySelector('.like'),
        townList = document.querySelector('.town-list');

    let townArr = [];

    if (localStorage.getItem('lastCity')) {
        getWeatherData(localStorage.getItem('lastCity'));
    } else {
        getWeatherData('London');
    }

    if (localStorage.getItem('TownList')) {
        updateList(localStorage.getItem('TownList').split(','), townList);
        townArr = localStorage.getItem('TownList').split(',');
    }


    function changeWeatherIcon(type, description) {
        const weatherIcon = document.querySelector('.weather-icon');

        weatherIcon.src = `https://openweathermap.org/img/wn/${type}@4x.png`;
        weatherIcon.alt = description;
    }

    function getTimeZero(num) {
        num += '';
        if (num.length === 1) {
            return '0' + num;
        } else return num;
    }

    function timeConvert(time) {
        let date = new Date(time * 1000);
        return `${getTimeZero(date.getHours())}:${getTimeZero(date.getMinutes())}`;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        getWeatherData(searchInput.value);
        searchInput.value = '';
    });

    function updateList(arr, selector) {
        townList.innerHTML = ''

        arr.forEach(el => {
            const li = document.createElement('li');
            li.classList.add('town-list__item');
            li.innerHTML = `<a class="town-list__link" href="#">${el}</a>`;
            selector.append(li);
        });
    }

    likeButton.addEventListener('click', () => {
        if (!townArr.includes(cityNameText[0].textContent)) {
            likeButton.src = './img/fillLike.svg';
            townArr.push(cityNameText[0].textContent);
        } else {
            likeButton.src = './img/Like.svg';
            townArr = townArr.filter(el => el !== cityNameText[0].textContent);
        }

        localStorage.setItem('TownList', townArr.join());
        updateList(townArr, townList);
    });

    function dateConvert(time) {
        let date = new Date(time * 1000),
            day = date.getDate(),
            month = date.getMonth(),
            monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return `${day} ${monthList[month]}`;
    }

    function getWeatherData(cityName) {
        fetch(`${serverUrl}weather?q=${cityName}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(weatherData => {
                cityNameText.forEach((el) => {
                    el.textContent = weatherData.name;
                });

                localStorage.setItem('lastCity', weatherData.name);

                temperature.textContent = Math.round(weatherData.main.temp) + '°';
                changeWeatherIcon(weatherData.weather[0].icon, weatherData.weather[0].description);

                if (townArr.includes(weatherData.name)) {
                    likeButton.src = './img/fillLike.svg';
                } else {
                    likeButton.src = './img/like.svg';
                }

                weatherList[0].textContent = `Temperature: ${Math.round(weatherData.main.temp) + '°'}`;
                weatherList[1].textContent = `Feels like: ${Math.round(weatherData.main.feels_like) + '°'}`;
                weatherList[2].textContent = `Weather: ${weatherData.weather[0].main}`;
                weatherList[3].textContent = `Sunrise: ${timeConvert(weatherData.sys.sunrise)}`;
                weatherList[4].textContent = `Sunset: ${timeConvert(weatherData.sys.sunset)}`;
            })
            .catch(() => alert('что то пошло не так'));

        fetch(`${serverUrl}forecast?q=${cityName}&appid=${apiKey}&units=metric`)
            .then(res => res.json())
            .then(dataFile => {
                for (let i = 0; i < dataFile.list.length; i++) {
                    let card = document.createElement('div');
                    card.classList.add('weather-item');
                    card.innerHTML = `
                <div class="weather-item__period">
                    <div class="weather-item__day">${dateConvert(dataFile.list[i].dt)}</div>
                    <div class="weather-item__time">${timeConvert(dataFile.list[i].dt)}</div>
                </div>
                <div class="weather-item__temp">
                    <div class="weather-item__descr">
                        <ul>
                            <li>Temperature: ${Math.round(dataFile.list[i].main.temp)}°</li>
                            <li>Feels like: ${Math.round(dataFile.list[i].main.feels_like)}°</li>
                        </ul>
                    </div>
                        <div class="weather-item__img">
                            <div class="text"> ${dataFile.list[i].weather[0].main}</div>
                            <img class="img-icon" src="https://openweathermap.org/img/wn/${dataFile.list[i].weather[0].icon}@4x.png\" alt="">
                        </div>
                </div>
                `;
                    document.querySelector('.weather-items').append(card);
                }
            });
    }

    townList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target && e.target.classList.contains('town-list__link')) {
            getWeatherData(e.target.innerText);
        }
    })


})