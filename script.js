var map = L.map('map',{
    center:[51.505, -0.09],
    zoom:13
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function logDetails(inputString) {
    let url = "https://geo.ipify.org/api/v2/country,city";
    let params = {
        apiKey: "at_KtHK8UINgzl98z9hBcaKE2PAgE3zs",
        ipAddress: inputString
    };

    url += "?" + new URLSearchParams(params).toString();

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
}

let curMarker;
const setMap = () => {
    if(curMarker) {
        map.removeLayer(curMarker);
    }
    console.log('submitted');
    let ipAddress = document.querySelector("input[type='search']").value;
    console.log('ip address: ',ipAddress);
    
    setMapForReal(ipAddress);
}

const setMapForReal = (ipAddress) => {
    logDetails(ipAddress)
    .then(result => {
        console.log(result);
        ipDetails = result;
        if( typeof ipDetails !== 'object') {
            // error
            console.log('ERROR WOW');
            return;
        }
        let lat = ipDetails['location']['lat'];
        let lng = ipDetails['location']['lng'];


        map.flyTo([lat, lng]);
        
        var marker = L.marker([lat, lng]);
        marker.setIcon(L.icon({
            iconUrl:'./images/icon-location.svg'
        }));
        marker.addTo(map);
        curMarker = marker;

        document.querySelector('.desc-ip').innerHTML = ipAddress;
        if(ipDetails['location']['city'] && ipDetails['location']['region'] && ipDetails['location']['country']) {
            document.querySelector('.desc-location').textContent = ipDetails['location']['city'] + ', ' + ipDetails['location']['region'] + '\n' + ipDetails['location']['country'];
        }
        else {
            document.querySelector('.desc-location').textContent = ""
        }

        if(ipDetails['location']['timezone']) {
            document.querySelector('.desc-timezone').innerHTML = 'UTC' + ipDetails['location']['timezone'];
        }
        else {
            document.querySelector('.desc-timezone').innerHTML = "";
        }
        
        document.querySelector('.desc-isp').textContent = ipDetails['isp'];
        document.querySelector("input[type='search']").value = '';
    })
    .catch(error => {
        console.log(error);
    });
}

// window.addEventListener('DOMContentLoaded',setMapForReal('0.0.0.0'));
var input = document.getElementById("ip-search");
input.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        setMap();
    }
});