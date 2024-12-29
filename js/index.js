

//-----swip Slider start

var swiper = new Swiper(".mySwiper", {
   slidesPerView: 4,
   slidesPerGroup: 1,
   centeredSlides: false,
   loop: true,
   slideToClickedSlide: true,
   spaceBetween: 10,
   pagination: {
      el: ".swiper-pagination",
      clickable: true,
   },
   // Navigation arrows
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   },
});

// ---swip Slider End


let searchTXT = document.getElementById('search-txt');
let urlSearch;
let searchLogo = document.getElementById('search-Logo');
let CountrySearch = 'Alexandria';
let urlForecast;
let CountriesCount = 0;
let countryIndex = 0;

searchLogo.addEventListener('click', function () {

   urlSearch = 'http://api.weatherapi.com/v1/search.json?key=3b0057b5a3a146ab83f92201242312&q=' + searchTXT.value;

   //console.log('Search ', urlSearch)

   fetch(urlSearch)
      .then(function (response) { return response.json() })
      .then(function (data) {
         console.log('Search Data ', data);
         //console.log('CountryName', data[0].name);
         CountriesCount = data.length
         if (CountriesCount == 0) {
            alert('check country spelling and try again')
         } else if (countryIndex < CountriesCount) {
            CountrySearch = data[countryIndex].name;
             console.log('Country ',CountrySearch)
               urlForecast = `http://api.weatherapi.com/v1/forecast.json?key=3b0057b5a3a146ab83f92201242312&q=${CountrySearch}&days=4&aqi=no&alerts=no`;
               console.log('CountryIndex : ' ,countryIndex ,'of CountriesCount : ', CountriesCount)
               LoadDataFunction(urlForecast);
               countryIndex ++;
         }else{
            countryIndex=0;
               console.log('reset countries count',countryIndex)
         }   
      })
});

CountrySearch = 'Alexandria'
urlForecast = `http://api.weatherapi.com/v1/forecast.json?key=3b0057b5a3a146ab83f92201242312&q=${CountrySearch}&days=4&aqi=no&alerts=no`;
//console.log('Default url Forecast', urlForecast);
LoadDataFunction(urlForecast);

function LoadDataFunction(url) {
   let currentForecast = document.getElementById('currentForecast');
   if (currentForecast) {
      fetch(url)
         .then(function (response) { return response.json() })
         .then(function (data) {

            //console.log(data.forecast.forecastday[0])
            document.getElementById('CurrentDate').innerText = data.forecast.forecastday[0].date

            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var d = new Date(data.forecast.forecastday[0].date);
            var dayName = days[d.getDay()];

            //CurrentData
            document.getElementById('CurrentDay').innerText = dayName

            document.getElementById('country').innerText = data.location.name + ' , ' + data.location.country
            document.getElementById('region').innerText = data.location.region
            document.getElementById('currentTemp').innerHTML = `${data.current.temp_c}<sup>o</sup>C`
            document.getElementById('currentImg').src = data.current.condition.icon
            document.getElementById('conditionTxt').innerText = data.current.condition.text
            document.getElementById('rain').innerText = data.current.precip_mm
            document.getElementById('windKph').innerText = data.current.wind_kph + 'km/h'
            document.getElementById('windDir').innerText = data.current.wind_dir
            //---End of CurrentData

            let hourData = data.forecast.forecastday[0].hour
            //console.log('Forecast Data ', hourData);
            //console.log(hourData.length);

            let htmlCollection = ``;

            let index = 0
            for (const element of hourData) {

               // const d = new Date(hourData[index].time);
               // let timeAmPm = d.toLocaleTimeString();

               const dd = new Date(hourData[index].time);
               let time24 = dd.getHours();
               //console.log(time24)

               if (time24 < 10) {
                  time24 = '0' + time24
               }
               //console.log(time24);

               htmlCollection += `
            <div class="slide1 col-md-3 mt-4 swiper-slide">
                <div class="text-center">
                  <div>
                    <img src="${hourData[index].condition.icon}" style="width:50%;">
                  </div>
                  <div>
                    <p class="fs-4">${time24}:00</p>
                  </div>
                  <div>
                    <p class="fs-4">${hourData[index].condition.text}, ${Math.round(hourData[index].temp_c)}<sup>o</sup></p>
                  </div>

                  <div class="d-flex gap-2 justify-content-center">
                    <span class="fs-4"><i class="fa-solid fa fa-umbrella"></i></span>
                    <p class="fs-4">${hourData[index].uv}%</p>
                  </div>
                </div>
              </div>
            `
               index++
            }
            currentForecast.innerHTML = htmlCollection;

            //-------------


            //console.log(data.forecast);
            //console.log('day1 data',data.forecast.forecastday[1].day);
            let dayesCount = data.forecast.forecastday.length;
            //console.log('count of dayes' ,dayesCount)

            let dayData = data.forecast.forecastday[0];
            let htmlCollection2 = ``;
            let forecastDay = document.getElementById('forecastDayes');

            if (forecastDay) {
               for (let index = 1; index < dayesCount; index++) {

                  const dayData = data.forecast.forecastday[index].day;

                  htmlCollection2 += `
   <div class="dforecast dark-style font-Color col-md-3">
      <div class="text-center fs-4 fw-bold text-secondary darkLight-color">
        <p>${data.forecast.forecastday[index].date}</p>
      </div>
      <div class="text-center">
        <img src="${dayData.condition.icon}" style="width:20%;">
      </div>
      <div class="d-flex gap-3 justify-content-center">
        <h3>${Math.round(dayData.maxtemp_c)}<sup>o</sup></h3>
        <h5 class="pt-2">${Math.round(dayData.mintemp_c)}<sup>o</sup></h5>
      </div>
      <div class="d-flex gap-2 justify-content-center">
        <span class="fs-4"><i class="fa-solid fa fa-umbrella"></i></span>
        <p class="fs-4">${Math.round(dayData.uv)}%</p>
      </div>
      <div class="text-center fs-4 text-primary fw-bold">
        <p class="">${dayData.condition.text}</p>
      </div>
   </div>`
                  forecastDay.innerHTML = htmlCollection2;

                  // if (index % 2 > 0) {
                  //    console.log(document.querySelectorAll('.dayForecastDiv'));
                  //    document.getElementsByClassName('dayForecastDiv').classList.remove('dark-style');
                  // } else {
                  //    document.getElementsByClassName('dayForecastDiv').classList.add('dark-style');
                  // }

               }
            }
            //---------
         })
   }

}
//-------------------------

// const parent= document.getElementById('forecastDayes');
// console.log(parent);


// let children = document.querySelectorAll('.dforecast');
// console.log(children);
// children[1].style.backgroundColor = "red";


// for (const forecastDay of forecastDays) {
//    // if (index % 2 > 0) {
//    //    console.log('t',forecastDay);
//    //    forecastDay.classList.add('dark-style');
//    // } else {
//       //forecastDay.classList.remove('dark-style');
//       console.log('f')//,forecastDay);
//    // }
//    index++
// }



