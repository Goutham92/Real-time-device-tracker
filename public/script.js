let socket;
let map;
let markers = {};
let email = "";

function login() {
  email = document.getElementById("email").value;

  if (!email) {
    alert("Enter email");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("userEmail").innerText = email;

  socket = io();
  socket.emit("login", { email });

  map = L.map('map').setView([17.385, 78.4867], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

  setInterval(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      socket.emit("send-location", {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, 5000);

  socket.on("receive-location", (data) => {
    const key = data.email + "-" + data.deviceNumber;

    if (!markers[key]) {
      markers[key] = L.marker([data.lat, data.lng])
        .addTo(map)
        .bindPopup(key);
    } else {
      markers[key].setLatLng([data.lat, data.lng]);
    }
  });
}

function logout() {
  location.reload();
}
