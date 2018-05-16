"use strict"

// Declaración de variales globales

var appid = "479092b77bcf850403cb2aeb1a302425", 
    longitud, 
    latitud, 
    urlTiempo, 
    urlFija = "https://api.openweathermap.org/data/2.5/forecast/daily?q=Alcobendas,es&lang=es&units=metric&mode=xml&appid=479092b77bcf850403cb2aeb1a302425",
    horaReferencia, 
    arrayObjetos = [],
    xmlData;


// Función asíncrona que funciona como controlador

async function appTiempo() {
    var localiza = await localizacion();
    var xml = await obtenerXML();
    var arrayObjetos = await recogeInfo(xmlData);
    drawInfo(arrayObjetos);
    console.log(urlTiempo);
}

// Esta función solicita permisos al usuario a través del navegador para acceder a su longitud y latitud. Como el controlador es una función asíncrona, es necesario que en esta función se cree una promesa que si el usuario permite su localización devuelve la url y si no lo permite, se  asigna una url fija de la localización de Alcobendas.

function localizacion() {

    return new Promise (resolve => {
        navigator.geolocation.getCurrentPosition(function (posicion){
            longitud = posicion.coords.longitude;
            latitud = posicion.coords.latitude;
            urlTiempo = "https:api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitud + "&lon=" + longitud + "&lang=es&units=metric&mode=xml&appid=" + appid;
            resolve(urlTiempo);

        }, function(){
            resolve(urlTiempo = urlFija);
        });
    });

}

//Una vez que se el controlador tiene la url se solicitan los datos de la misma a la API que devuelve un xml, con esta función recogemos todos los datos del xml y llama a la función de recogeInfo() con estos datos. 

function obtenerXML(){
    return new Promise(resolve => {
        var  xhttp = new XMLHttpRequest();
        xhttp.addEventListener('readystatechange', function() {
            if(this.readyState == 4 && this.status == 200) {
                resolve(xmlData = this.responseXML);
            }
        });
        xhttp.open("GET", urlTiempo, true);
        xhttp.send();

    });
}

function recogeInfo(xml){

    var tiempos = xml.getElementsByTagName("time");
    arrayObjetos.push(xml.getElementsByTagName("name")[0].textContent);

    var diaDate;

    for(var i = 0; i < tiempos.length; i++){
        //Creamos objeto Tiempo vacío
        var info = new objetoTiempo();

        info.dia = tiempos[i].getAttribute("day");

        diaDate = new Date(info.dia);

        var weekday = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");

        info.diaS = weekday[diaDate.getDay()];

        info.windSpeed = tiempos[i].getElementsByTagName("windSpeed")[0].getAttribute("mps");

        info.temperature = tiempos[i].getElementsByTagName("temperature")[0].getAttribute("day") + "ºC";

        info.min = tiempos[i].getElementsByTagName("temperature")[0].getAttribute("min") + "ºC";

        info.max = tiempos[i].getElementsByTagName("temperature")[0].getAttribute("max") + "ºC";

        info.pressure = tiempos[i].getElementsByTagName("pressure")[0].getAttribute("value") + "%";

        info.humidity = tiempos[i].getElementsByTagName("humidity")[0].getAttribute("value") + "%";

        info.clouds = tiempos[i].getElementsByTagName("clouds")[0].getAttribute("all") + "%";

        info.symbol = tiempos[i].getElementsByTagName("symbol")[0].getAttribute("var");
        info.symbol = "http://openweathermap.org/img/w/" + info.symbol + ".png";

        arrayObjetos.push(info);
    }

    return arrayObjetos;

    //        drawInfo(arrayObjetos);
}

// Constructor

function objetoTiempo(dia, diasS, windSpeed, temperature, min, max, pressure, humidity, clouds, symbol){
    this.dia = dia;
    this.diaS = diasS;
    this.windSpeed = windSpeed;
    this.temperature = temperature;
    this.min = min;
    this.max = max;
    this.pressure = pressure;
    this.humidity = humidity;
    this.clouds = clouds;
    this.symbol = symbol;
}

// Imprime la función y a su vez crea la estructura del HTML con DOM

function drawInfo(arrObjetos){

    var info = document.getElementById("tablaTiempo"),
        cabecera = document.createElement("div"),
        titulo = document.createElement("p"),
        contenido = "", infoResumida;

    cabecera.setAttribute("class", "cabecera");

    titulo.innerHTML = "Previsión meteorológica para los próximos 7 días en <br> <span>" + arrObjetos[0] + "</span>";
    cabecera.appendChild(titulo);
    info.innerHTML = "";
    info.appendChild(cabecera);


    for(var i = 1; i < arrObjetos.length; i++){

        var contentAll = document.createElement("div");
        contentAll.setAttribute("id", "contentAll-" + i);
        contentAll.setAttribute("class", "contentAll");

        infoResumida = document.createElement("p");
        infoResumida.setAttribute("infoResumida", i);
        infoResumida.setAttribute("class", "infoResumida");

        var contenido = arrObjetos[i].diaS + "&nbsp;&nbsp;" + arrObjetos[i].dia + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>" + arrObjetos[i].temperature + "</b>";

        var simbolo = document.createElement("img");
        simbolo.setAttribute("src", arrObjetos[i].symbol);

        infoResumida.innerHTML = contenido;
        infoResumida.appendChild(simbolo);
        contentAll.appendChild(infoResumida);

        var infoMas = document.createElement("div");
        infoMas.setAttribute("class", "infoMas");

        contenido = "Máxima: " + arrObjetos[i].max + "<br>";
        contenido += "Mínima: " + arrObjetos[i].min +  "<br>";
        contenido += "Nubosidad: " + arrObjetos[i].clouds + "<br>";
        contenido += "Humedad: " + arrObjetos[i].humidity + "<br>";
        contenido += "Presión Atomosférica: " + arrObjetos[i].pressure + "<br>";
        contenido += "Velocidad del viento: " + arrObjetos[i].windSpeed;

        // Este evento añade y quita una clase para que se oculte y se muestre la información ampliada

        infoResumida.addEventListener("click", function(){
            var aux = this.getAttribute("infoResumida");
            var aux2 = document.getElementById("contentAll-" + aux);
            var clase = aux2.getAttribute("class");

            if(clase.indexOf("visto") ==  -1){
                aux2.classList.add("visto");
            } else{
                aux2.classList.remove("visto");
            }
        });

        infoMas.innerHTML = contenido;
        contentAll.appendChild(infoMas);

        info.appendChild(contentAll);
    }   
}










