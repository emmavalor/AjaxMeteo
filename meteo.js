const form = document.querySelector("form");
const city = document.querySelector("#city");
const p = document.getElementsByTagName("p")[0];
const p1 = document.getElementsByTagName("p")[1];
const p2 = document.getElementsByTagName("p")[2];
const iconTemps = document.querySelector("#iconTemps");
const temp = document.getElementById("temp");
const tempo = document.querySelector(".tempo");
const previsionLi = document.querySelectorAll("li");
const canva = document.querySelector("canvas");
const reducer = (accumulator, currentValue) => accumulator + currentValue;
var cityName = "";
var chart;

// on écoute l'événement submit sur le formulaire et on exécute la fonction callback
form.addEventListener(
  "submit",
  function (event) {
    // on empêche la soumission normale du formulaire (comportement normal du form en HTML)
    event.preventDefault();
    cityName = city.value;

    // on envoie les données du formulaire à notre script PHP en utilisant la technologie AJAX
    // pour ça on utilise la méthode JS fetch()
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=fa070e6659907396f536081796acbb2e`
    )
      .then(
        // on récupère la réponse du serveur en JSON et on la transforme en objet Javascript
        function (response) {
          return response.json(); // retourne un objet javascript
        }
      )
      .then(function (data) {
        tempo.style.visibility = "visible";
        canva.style.visibility = "visible";
        bgColor(data.weather[0].main);


        p.textContent = `Weather is : ${data.weather[0].main}`; // on affiche les infos dans le HTML
        p1.textContent = `More informations about the current weather : ${data.weather[0].description}`;
        p2.textContent = Math.round(data.main.temp) + "°C";

        iconTemps.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        let tempPerCent = Math.round((data.main.temp / 50) * 100);
        temp.style.backgroundImage = `linear-gradient(white ${
          100 - tempPerCent
        }%, red ${100 - tempPerCent}%)`;

        return data;
      });
  },
  false
);

function bgColor(temps) {
  switch (temps) {
    case "Clouds":
      document.body.style.background = "url('image/cloud.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Clear":
      document.body.style.background = "url('image/clear.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Snow":
      document.body.style.background = "url('image/snow.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Rain":
      document.body.style.background = "url('image/rain.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Fog":
      document.body.style.background = "url('image/fog.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Thunderstrom":
      document.body.style.background = "url('image/thunderstrom.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Drizzle":
      document.body.style.background = "url('image/drizzle.gif')";
      document.body.style.backgroundSize = "cover";
      break;
    case "Haze":
      document.body.style.background = "url('image/haze.gif')";
      document.body.style.backgroundSize = "cover";
      break;
  }
}

form.addEventListener(
  "submit",
  function (event) {
    // on empêche la soumission normale du formulaire (comportement normal du form en HTML)
    event.preventDefault();
    cityName = city.value;
    Array.from(document.getElementsByTagName("section")).forEach((element) => {
      element.style.visibility = "visible";
    });
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=ef26cf5490de6b66210d6f104cb4641e`
    )
      .then(
        // on récupère la réponse du serveur en JSON et on la transforme en objet Javascript
        function (response) {
          return response.json(); // retourne un objet javascript
        }
      )
      .then(function (data) {
        z = 1;
        for (let i = 8; i < data.list.length; i += 8) {
          const element = data.list[i];
          previsionLi[
            (i + 2 * z) / 10 - 1
          ].textContent = `${element.dt_txt} weather is : ${element.weather[0].main}`;
          z++;
        }

        var ctx = document.querySelector("#chart").getContext("2d");
        var date = new Date();
        var jour = date.getDay();
        var jours = new Array(
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
          "Samedi",
          "Dimanche"
        );

        Chart.defaults.datasets.line.showLine = true;

        // This chart would show a line only for the third dataset

        let tab = [];
        var tabFinal = [];

        for (var i = 0; i < data.list.length; i++) {
          var element = data.list[i];
          tab.push(element.main.temp);
        }

        for (var j = 0; j < tab.length; j += 8) {
          var tab1 = tab.slice(j, j + 8);
          tabFinal.push(tab1);
        }

        for (var i = 0; i < tabFinal.length; i++) {
          tabFinal[i] = Math.round(
            tabFinal[i].reduce(reducer) / tabFinal[i].length
          );

        }
        if (chart) {
          chart.destroy();
        }
console.log(jours[jour]);
console.log(jours[jour - 4]);

        chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [
              jours[quelJour(jour, 0)],
              jours[quelJour(jour, 1)],
              jours[quelJour(jour, 2)],
              jours[quelJour(jour, 3)],
            ],
            datasets: [
              {
                backgroundColor: 'red',
                borderColor: 'red',
                label: `Température moyenne de ${cityName} en °C`,
                data: tabFinal,
              },
            ],
          },
          options: {
          scales: {
            y: {
              min: -20,
              max: 50
            },
          },
        },
        });
        // return data;
      });
  },
  false
);


function quelJour(a, b) {   
    if (a + b > 6) {     
      return a - 7 + b;   
    } 
    else {     
      return a + b;   
    } 
  }


