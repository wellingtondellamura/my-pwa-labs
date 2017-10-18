var cardMap = new Map();

//******************************************************************************

//** REGISTRO DE EVENTOS *******************************************************

var dialog = document.getElementById('dlgAdd');
var btnAdd = document.getElementById('btnAdd');
var btnRefresh = document.getElementById('btnRefresh');
var btnModalOk = document.getElementById('btnModalOk');
var btnModalCancel = document.getElementById('btnModalCancel');

btnAdd.addEventListener('click', function() {
   dialog.showModal();
});

btnRefresh.addEventListener('click', function() {
   console.log("btnRefresh click");
});

btnModalOk.addEventListener('click', function() {
   var city = document.getElementById('selCity');
   getWeatherData(city.value);
   dialog.close();
});

btnModalCancel.addEventListener('click', function() {
  dialog.close();
});

//******************************************************************************

//** FUNÇÕES DE INTERFACE ******************************************************

var updateWeatherCard = function(card, data){
   var weatherCity = card.querySelector(".weather-city");
   var weatherImage = card.querySelector(".weather-image");
   var weatherTemp = card.querySelector(".weather-temp");
   var weatherUpdate = card.querySelector(".weather-update");
   var weatherText = card.querySelector(".weather-text");
   weatherCity.textContent = data.city;
   weatherImage.src = data.image;
   weatherTemp.textContent = data.temperature;
   weatherUpdate.textContent = "Atualizado em "+ data.lastUpdate.toLocaleString();
   weatherText.textContent = data.text;
}

var getCard = function(city){
   if (cardMap.has(city)){
      return cardMap.get(city);
   } else {
      var cards = document.getElementById('cards');
      var baseCard = document.getElementById('base-card');
      var card = baseCard.cloneNode(true);
      card.removeAttribute('hidden');
      cards.appendChild(card);
      cardMap.set(city, card);
      return card;
   }

}

//** INFORMAÇÕES ***************************************************************

var testData = {
   city : "Bandeirantes-PR",
   temperature: "31",
   image : "images/sunny1.png",
   lastUpdate: new Date(),
   text : "Normal"
}

var getWeatherData = function(city){
   var card = getCard(city);
   var status = card.querySelector(".weather-update");
   status.textContent = "atualizando...";
   var query = "select item.condition, location from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+city+"') and u='c'";
   var str = "https://query.yahooapis.com/v1/public/yql?q="+query+"&format=json";

   if ('caches' in window) {
      caches.match(str).then(function(response) {
        if (response) {
          //console.log('Achei no cache ', str);
          response.json().then(function updateFromCache(json) {
             updateWeather(json, card);
          });
        }
      });
    }

   fetch(str)
      .then(function(response){
         response.json().then(function updateFromCache(json) {
           updateWeather(json, card);
         });
      })
      .catch(function(error){
         //tratar
      });
}

var updateWeather = function(json, card){
   var info = json.query.results.channel;
   var data = {
      city : info.location.city + ", " + info.location.region + ", " + info.location.country,
      temperature: info.item.condition.temp,
      image : "images/"+getImageFromCode(info.item.condition.code)+".png",
      lastUpdate:  new Date(),
      text : getTextFromCode(info.item.condition.code)
   };
   updateWeatherCard(card, data);
}

//******************************************************************************

//** FUNÇÕES AUXILIARES ********************************************************

var getImageFromCode = function(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: // cold
      case 32: // sunny
      case 33: // fair (night)
      case 34: // fair (day)
      case 36: // hot
      case 3200: // not available
        return 'sunny1';
      case 0: // tornado
      case 1: // tropical storm
      case 2: // hurricane
      case 6: // mixed rain and sleet
      case 8: // freezing drizzle
      case 9: // drizzle
      case 10: // freezing rain
      case 11: // showers
      case 12: // showers
      case 17: // hail
      case 35: // mixed rain and hail
      case 40: // scattered showers
        return 'rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 37: // isolated thunderstorms
      case 38: // scattered thunderstorms
      case 39: // scattered thunderstorms (not a typo)
      case 45: // thundershowers
      case 47: // isolated thundershowers
        return 'thunderstorm';
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return 'snowy';
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return 'fog';
      case 24: // windy
      case 23: // blustery
        return 'windy';
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return 'sunny2';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'cloudy1';
    }
};

var getTextFromCode = function(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: return "Frio";
      case 32:
      case 33:
      case 34:
      case 36:
         return "Ensolarado";// sunny
      case 3200:
         return "Indisponível";
      case 0: return "Tornado";
      case 1: return "Tempestade Tropical";
      case 2: return "Furacão";
      case 6: return "Chuva Mista e Aguaceiro";
      case 8: return "Chuvisco Gelado";
      case 9:  return "Chuvisco";
      case 10: return "Chuva Congelante";
      case 11: return " Aguaceiro";
      case 12: return "Pé d'agua";
      case 17:  return "Granizo";
      case 35:  return "Chuva e Granizo";
      case 40:  return "Chuva dispersa";
        return 'rain';
      case 3:
      case 4:
      case 37:
      case 38:
      case 39:
      case 45:
      case 47:
        return "Trovoadas";
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return "Nevando";
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return "Neblina";
      case 24: // windy
      case 23: // blustery
        return "Ventania";
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return "Nublado";
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return "Parcialmente Nublado";
    }
};

//******************************************************************************

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}
