window.onload = function () {
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            $("#request").submit(function(){
                var input = $('.searchinput').val();
                input=input.replace(/\s/g, '_')
                getWeatherByCity(input);
                return false;
            });
        }
    });
    var pos;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("Location permission granted");
            console.log("lat: " + pos.lat + " - lng: " + pos.lng);
            getWeatherByCoords(pos.lat,pos.lng);
            getCityName(pos.lat,pos.lng);
        });

    } else {
        console.log("Location permission denied");
    }
    
}

function getCityName(lat,lng){
    var key = "AIzaSyBS2ixtr-EhD0sAdrQ4OplnTMGUy5Kezzo";
    var apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=" + key;
    console.log( apiUrl );
    $.ajax({
        dataType: "json",
        url: apiUrl,
        reverseGeocode: "",
        success: function () { console.log("Reverse Geocoding Success!") },
        statusCode: {
            400: function () {
                swal({
                    title: "Ops..",
                    text: "Reverse Geocoding not success :(",
                    icon: "error"
                });
            },

            404: function () {
                swal({
                    title: "What?",
                    text: "Reverse Geocoding not success :(",
                    icon: "warning"
                });
            }
        }
    });
    $.getJSON(apiUrl , function (reverseGeocode) {
        setCity(reverseGeocode);
    });
}

function getWeatherByCoords(lat,lng) {
    var key = "44341772f96e40f70064f44a2ef6e629";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&exclude={}&appid=" + key +"&units=metric";
    console.log(apiUrl);
    $.ajax({
        dataType: "json",
        url: apiUrl,
        data: "",
        success: function () { console.log("Open Weather Map data fetched!") },
        statusCode: {
            400: function () {
                swal({
                    title: "Ops..",
                    text: "A quanto pare la tua richiesta non è valida. Prova ad inserire un'altra città!",
                    icon: "error"
                });
            },

            404: function () {
                swal({
                    title: "Cosa?",
                    text: "Non credo di conoscere quella città, sicuro di averla scritta bene?",
                    icon: "warning"
                });
            }
        }
    });

    $.getJSON(apiUrl , function (data) {
        assign(data);
    });
}

function setCity(reverseGeocode){
    // var myAddress = reverseGeocode.results[0].address_components[3].short_name + ", " + reverseGeocode.results[0].address_components[6].short_name;
    var myAddress = reverseGeocode.results[0].formatted_address;
    // var myAddress = reverseGeocode.plus_code.compound_code;
    console.log(myAddress);
    $('.searchinput').attr('placeholder',myAddress);
    $('.searchinput').val("");
}

function assign(data) {
    var iconId = data.current.weather[0].icon ;
    $('.weatherIcon').attr("src","images/weathericons/"+ iconId +".svg")
    if(iconId.includes("01")){
        $('.current').css("background-image", "url(images/sunny.jpg)"); 
    }
    if(iconId.includes("02")){
        $('.current').css("background-image", "url(images/clouds.jpg)"); 
    }
    if(iconId.includes("03")){
        $('.current').css("background-image", "url(images/broken_clouds.jpg)"); 
    }
    if(iconId.includes("04")){
        $('.current').css("background-image", "url(images/broken_clouds.jpg)"); 
    }
    if(iconId.includes("09")){
        $('.current').css("background-image", "url(images/shower_rain.jpg)"); 
    }
    if(iconId.includes("10")){
        $('.current').css("background-image", "url(images/rain.jpg)"); 
    }
    if(iconId.includes("11")){
        $('.current').css("background-image", "url(images/thunderstorm.jpg)"); 
    }
    if(iconId.includes("13")){
        $('.current').css("background-image", "url(images/snow.jpg)"); 
    }
    if(iconId.includes("50")){
        $('.current').css("background-image", "url(images/mist.jpg)"); 
    }
    
    $('.desc').html(data.current.weather[0].description);
    $('div.temp > p').text("TEMP : " + data.current.temp + " °C");
    $('div.perceived > p').text("PERCEIVED : " + data.current.feels_like + " °C");
    $('div.humidity > p').text("HUMIDITY : " + data.current.humidity + " %");
    $('.tempMax').text(' MAX: '+ data.daily[0].temp.max + " °C ");
    $('.tempMin').text('MIN: '+ data.daily[0].temp.min + " °C ");
}

function getWeatherByCity(city){
    var key = "AIzaSyBS2ixtr-EhD0sAdrQ4OplnTMGUy5Kezzo";
    var apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+"&key=" + key;
    console.log( apiUrl );
    $.ajax({
        dataType: "json",
        url: apiUrl,
        geocode: "",
        success: function () { console.log("Geocoding Success!") },
        statusCode: {
            400: function () {
                swal({
                    title: "Ops..",
                    text: "Geocoding not success :(",
                    icon: "error"
                });
            },

            404: function () {
                swal({
                    title: "What?",
                    text: "Geocoding not success :(",
                    icon: "warning"
                });
            }
        }
    });
    $.getJSON(apiUrl , function (geocode) {
        lat = geocode.results[0].geometry.location.lat;
        lng = geocode.results[0].geometry.location.lng;
        getWeatherByCoords(lat,lng);
        setCity(geocode);
    });
}