const form = document.querySelector(".top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities");
const language = document.querySelector(".languageSelect");

// localStorage.setItem("tokenKey", "");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  const tokenKey = "7e2e1395c34188ede18294c17c2f44be";
  const inputValue = input.value;
  const units = "metric";
  let lang = "tr";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;
  try {
    const response = await fetch(url).then((res) => res.json());
    console.log(response);
    const { main, sys, weather, name } = response;

    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    const cityNameSpans = document.querySelectorAll(".city span");
    const cityNameSpansArray = Array.from(cityNameSpans);
    if (cityNameSpansArray.length > 0) {
      const filteredArray = cityNameSpansArray.filter(
        (span) => span.innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know `;
        setTimeout(() => {
          msg.innerText = "";
        }, 5000);
        form.reset();
        return;
      }
    }

    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${
      sys.country
    }">
                              <span>${name}</span>
                              <sup>${sys.country}</sup>
                        </h2>
                        <div class="city-temp">${Math.round(
                          main.temp
                        )}<sup>°C</sup></div>
                              <figure>
                                  <img class="city-icon" src="${iconUrl}">
                                  <figcaption>${
                                    weather[0].description
                                  }</figcaption>
                              </figure>`;
    list.prepend(createdLi);

    // //!Select Language;
    // language.addEventListener("change", () => {
    //   lang = language.value;
    //   console.log(lang);
    // });

    //!Capturing;
    createdLi.addEventListener("click", (e) => {
      if (e.target.tagName == "IMG") {
        e.target.src = e.target.src == iconUrl ? iconUrlAWS : iconUrl;
      }
    });

    //!Bubbling
    // createdLi.addEventListener("click", (e) => {
    //   alert(`LI element is clicked!!`);
    //   window.location.href = "https://clarusway.com";
    // });
    // createdLi.querySelector("figure").addEventListener("click", (e) => {
    //   alert(`FIGURE element is clicked!!`);
    //   window.location.href = "https://clarusway.com";
    // });

    // createdLi.querySelector("img").addEventListener("click", (e) => {
    //   alert(`IMG element is clicked!!`);
    //   window.location.href = "https://clarusway.com";
    // });
  } catch (error) {
    console.log(error);
    msg.innerText = `404 (City Not Found)`;
    setTimeout(() => {
      msg.innerText = "";
    }, 5000);
  }
  form.reset();
};
