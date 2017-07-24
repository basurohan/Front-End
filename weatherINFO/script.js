$(document).ready(function(countryCode) {

    function loadCity(countryCode) {
        city_list = [];
        $.each(city, function(index, val) {
            if(val.country == countryCode)
                city_list.push(val.name);
        });
        $("#city").append("<option value='NONE'>Select City</option>");
        $.each(city_list, function(index, val) {
            $("#city").append("<option value="+val+">"+val+"</option>");
        });
    }


    function loadCoords(cityName) {
        var latitude, longitude;
        try {
            $.each(city, function(index, val) {
                if(val.name == cityName) {
                    latitude = val.coord["lat"];
                    longitude = val.coord["lon"];
                    throw BreakException;
                }
            });
        }
        catch (e) {
            $("#lat").val(latitude);
            $("#long").val(longitude);
        }
    }


    $("#countrySelect").change(function() {
        if($("#countrySelect").val() != 'NONE') {
            $("#city").empty();
            $("#city").prop('disabled', false);
            loadCity($("#countrySelect").val());
            $("#lat").val("");
            $("#long").val("");
        }
        else if($("#countrySelect").val() == 'NONE') {
            $("#city").prop('disabled', true);
            $("#city").empty();
            $("#lat").val("");
            $("#long").val("");
        }
    });


    $("#city").change(function() {
        if($("#city").val() != 'NONE') {
            loadCoords($("#city").val());
        }
        else if($("#city").val() == 'NONE') {
            $("#lat").val("");
            $("#long").val("");
        }
    });


    function loadGeoDetails(data) {
        $("#countrySelect").append(countryList);
        $("#countrySelect").val(data.countryCode);
        $("#city").prop('disabled', false);
        loadCity(data.countryCode);
        $("#city").val(data.city);
        loadCoords(data.city);
    }


    function getMyLocation() {
        $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
            loadGeoDetails(data);
        });
    }


    getMyLocation();

    $("#cent").click(function() {
        $('#fahr').prop('disabled', false);
        $("#fahr").toggleClass("btn-secondary btn-info");

        $('#cent').prop('disabled', true);
        $("#cent").toggleClass("btn-info btn-secondary");

        $("#getWeather").html("Get Weather in Centigrade");
        $("#getWeather").val("C");
    });


    $("#fahr").click(function() {
        $('#fahr').prop('disabled', true);
        $("#fahr").toggleClass("btn-secondary btn-info");

        $('#cent').prop('disabled', false);
        $("#cent").toggleClass("btn-info btn-secondary");

        $("#getWeather").html("Get Weather in Fahrenheit");
        $("#getWeather").val("F");
    });

    
    function retrieveWeather(lat, long, mode) {
        reqURL = "https://fcc-weather-api.glitch.me/api/current?lat="+lat+"&lon="+long;
        var temp_curr = 0;
        var temp_min = 0;
        var temp_max = 0;

        $.ajax({
            type: "GET",
            url: reqURL,
            dataType: 'jsonp',
            success: function(response) {
                var condition = response.weather[0].main;
                var description = response.weather[0].description;
                if (mode === "C") {
                    temp_curr = (parseFloat(response.main.temp)).toFixed(2);
                    temp_min = (parseFloat(response.main.temp_min)).toFixed(2);
                    temp_max = (parseFloat(response.main.temp_max)).toFixed(2);
                }
                else {
                    temp_curr = (parseFloat(response.main.temp) * 1.8 + 32).toFixed(2);
                    temp_min = (parseFloat(response.main.temp_min) * 1.8 + 32).toFixed(2);
                    temp_max = (parseFloat(response.main.temp_max) * 1.8 + 32).toFixed(2);
                }
                
                var icon = response.weather[0].icon;
                
                HTML = "<strong>"+temp_curr+mode+"</strong>";
                HTML += "<img src="+icon+"><strong>"+condition+"</strong><br>";
                // HTML += "Current: "+temp_curr+"<br>";
                HTML += "<strong>Min: "+temp_min+mode+" - Max: "+temp_max+mode+"</strong><br>";
                // HTML += "Max: "+temp_max+"<br>";

                $("#result").html(HTML);
            }
        });
    }


    $("#getWeather").click(function(e) {
        
        if($("#countrySelect").val() == 'NONE' || $("#city").val() == 'NONE'){
            $("#errMsg").css({"display":"block"});
            $("#errMsg").html("<strong>Please select a Country and a City!</strong>");
        } 
        else {
            $("#errMsg").css({"display":"none"});
            var lat = $("#lat").val();
            var long = $("#long").val();
            var mode = $("#getWeather").val();
            var weather =  [];

            e.preventDefault();
            weather.push(retrieveWeather(lat, long, mode));
        }
        
    });


});
