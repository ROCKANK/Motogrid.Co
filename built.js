//loader//
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
  loader.style.display = "none";
});
let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

// searchbar//
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  const categories = {
    // Home//
    Home: "motogrid.html",
    Motogrid: "motogrid.html",
    // car//
    Car: "cars_category.html",
    // audi//
    Audi: "audi.html",
    Audi_A4: "Audi A4 sedan.html",
    Audi_Q7: "Audi Q7.html",
    Audi_Q8: "Audi Q8.html",
    Audi_S5_Sportback: "Audi S5 Sportback.html",
    // BMW//
    BMW: "bmw.html",
    // Landrover//
    Landrover: "landrover.html",
    // Mahindra//
    Mahindra: "mahindra.html",
    // Mercedes//
    Mercedes_Benz: "mercedes.html",
    Mercedes: "mercedes.html",
    // Tata//
    Tata: "tata.html",
    // Toyota//
    Toyota: "toyota.html",
    // Volkswagen//
    Volkswagen: "volkswagen.html",
    // bike//
    Bike: "bike_category.html",
    Motorcycle: "bike_category.html",
    // bajaj//
    Bajaj: "bajaj.html",
    Bajaj_CT110x: "Bajaj CT 110x.html",
    Bajaj_Avenger: "Bajaj Avenger Cruise.html",
    Bajaj_Pulsar: "Bajaj Palsur NS.html",
    Bajaj_Dominar: "Bajaj Dominar 400.html",
    // hero//
    Hero: "hero.html",
    Hero_HF_Delux: "Hero HF Delux.html",
    Hero_Marvik: "Hero Marvik 440.html",
    Hero_Xtreme_125: "Hero Xtreme 125R.html",
    Hero_Xtreme_250: "Hero Xtreme 250R.html",
    // RoyalEnfield//
    RoyalEnfield: "royal_enfield.html",
    RoyalEnfield_Hunter: "Royal Enfield Hunter 350.html",
    RoyalEnfield_Continental: "Royal Enfield Continental GT 650.html",
    RoyalEnfield_Meteor: "Royal Enfield Meteor 350.html",
    RoyalEnfield_Scram: "Royal Enfield Scram 440.html",
    // TVS//
    TVS: "tvs.html",
    TVS_Apache_RR_310: "TVS Apache RR 310.html",
    TVS_Raider_125: "TV Raider 125.html",
    TVS_Ronin: "TVS Ronin.html",
    TVS_Sport: "TVS Sport.html",
    // aerospace//
    Aerospace: "aerospace.html",
    Aeroplane: "aerospace.html",
    Helicopter: "aerospace.html",
  };

  const topSearches = ["Hero", "Bajaj", "Tata", "RoyalEnfield"];

  function getRecentSearches() {
    const recents = localStorage.getItem("recentSearches");
    return recents ? JSON.parse(recents) : [];
  }

  function setRecentSearches(arr) {
    localStorage.setItem("recentSearches", JSON.stringify(arr));
  }

  function addRecentSearch(term) {
    if (!term) return;
    let recents = getRecentSearches();

    recents = recents.filter(
      (item) => item.toLowerCase() !== term.toLowerCase()
    );
    recents.unshift(term);
    if (recents.length > 5) recents.pop();

    setRecentSearches(recents);
  }

  // Helper to create a titled section with clickable items
  function createSuggestionSection(title, items, onClickHandler) {
    const container = document.createDocumentFragment();

    if (items.length) {
      const titleDiv = document.createElement("div");
      titleDiv.textContent = title;
      titleDiv.style.fontWeight = "bold";
      titleDiv.style.padding = "6px 12px";
      titleDiv.style.borderBottom = "1px solid #ddd";
      container.appendChild(titleDiv);

      items.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = item;
        div.className = "suggestion-item";
        div.onclick = () => onClickHandler(item);
        container.appendChild(div);
      });
    }

    return container;
  }

  function showCombinedSuggestions() {
    suggestions.innerHTML = "";

    const recents = getRecentSearches();

    if (recents.length) {
      suggestions.appendChild(
        createSuggestionSection("Recent Searches", recents, onSuggestionClick)
      );
    }

    // Show top searches always below recent searches (even if no recents)
    suggestions.appendChild(
      createSuggestionSection("Top Searches", topSearches, onSuggestionClick)
    );

    suggestions.style.display = "block";
  }

  function showSuggestions(matches) {
    suggestions.innerHTML = "";

    if (matches.length) {
      matches.forEach((cat) => {
        const div = document.createElement("div");
        div.textContent = cat;
        div.className = "suggestion-item";
        div.onclick = () => {
          addRecentSearch(cat);
          window.location.href = categories[cat];
        };
        suggestions.appendChild(div);
      });
    } else {
      const div = document.createElement("div");
      div.textContent = `Sorry, we couldn't find "${input.value}"`;
      div.className = "no-match";
      suggestions.appendChild(div);
    }
    suggestions.style.display = "block";
  }

  function onSuggestionClick(term) {
    input.value = term;
    addRecentSearch(term);
    window.location.href = categories[term];
  }

  function hideSuggestions() {
    suggestions.style.display = "none";
    suggestions.innerHTML = "";
  }

  input.addEventListener("focus", () => {
    if (!input.value.trim()) {
      showCombinedSuggestions();
    }
  });

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase().trim();

    if (!val) {
      showCombinedSuggestions();
      return;
    }

    const matched = Object.keys(categories).filter((cat) =>
      cat.toLowerCase().includes(val)
    );

    showSuggestions(matched);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const val = input.value.toLowerCase().trim();
      if (!val) return;

      const exactMatch = Object.keys(categories).find(
        (cat) => cat.toLowerCase() === val
      );

      if (exactMatch) {
        addRecentSearch(exactMatch);
        window.location.href = categories[exactMatch];
      } else {
        suggestions.innerHTML = "";
        const div = document.createElement("div");
        div.textContent = `Sorry, we couldn't find "${input.value}"`;
        div.className = "no-match";
        suggestions.appendChild(div);
        suggestions.style.display = "block";
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target !== input && !suggestions.contains(e.target)) {
      hideSuggestions();
    }
  });

  window.addEventListener("scroll", () => {
    hideSuggestions();
    input.blur();
  });
  window.addEventListener("pageshow", () => {
    const input = document.getElementById("searchInput");
    const suggestions = document.getElementById("suggestions");
    if (input) {
      input.value = "";
      suggestions.style.display = "none";
    }
  });
});

//swiper//
var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

//vehicle swiper//
let currentSlide = 0;

function slide(direction) {
  const slider = document.getElementById("slider");
  const totalSlides = slider.children.length;
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

//menu button reveal//
menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};
window.onscroll = () => {
  menu.classList.remove("bx-x");
  navbar.classList.remove("active");
};

//scrollreveal//
const sr = ScrollReveal({
  distance: "60px",
  delay: 400,
  reset: true,
});

sr.reveal(".text", { delay: 200, origin: "top" });
sr.reveal(".heading", { delay: 800, origin: "top" });
sr.reveal(".info-container .box", { delay: 600, origin: "top" });
sr.reveal(".bike-container .box", { delay: 600, origin: "top" });
sr.reveal(".car-container .car-box", { delay: 600, origin: "top" });
sr.reveal(".aerospace-container .aerospace-box", { delay: 600, origin: "top" });
sr.reveal(".review-container", { delay: 600, origin: "top" });
sr.reveal(".connect .box", { delay: 400, origin: "bottom" });
