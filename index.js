let mymap = L.map("mapid").setView([49.8217096, 19.054798], 15);
let activeLocation = null;
let markers = loadMarkers();

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(mymap);

markers.forEach(renderMarker);

function showModal() {
  let modal = document.querySelector(".modal");
  modal.className = "modal active";
}

function hideModal() {
  let modal = document.querySelector(".modal");
  modal.className = "modal";

  document.querySelector("input[name=reason]").value = "";
}

function renderMarker({ lat, lng, reason }) {
  let marker = L.marker([lat, lng]).addTo(mymap);
  marker.bindPopup(`<span class="popup">${reason}</span>`).openPopup();
}

function markPlace(reason) {
  renderMarker({ lat: activeLocation.lat, lng: activeLocation.lng, reason });
  saveMarker(activeLocation.lat, activeLocation.lng, reason);
}

function handleFormSubmit(e) {
  let reason = e.target.querySelector("input").value;

  e.preventDefault();
  markPlace(reason);
  hideModal();
}

let popup = L.popup();

function onMapClick(e) {
  activeLocation = e.latlng;
  showModal();
}

function saveMarker(lat, lng, reason) {
  markers.push({ lat, lng, reason });
  localStorage.setItem("markers", JSON.stringify(markers));
}

function loadMarkers() {
  let markersAsString = localStorage.getItem("markers");
  let markers = JSON.parse(markersAsString);

  return markers || [];
}

mymap.on("click", onMapClick);

document.querySelector(".modal__close").addEventListener("click", hideModal);
document.querySelector("form").addEventListener("submit", handleFormSubmit);
