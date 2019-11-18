"use strict";
//import * as ahorcado_class from './ahorcado_class';
//ajax Asynchronous JAvascript + XML
var juego = undefined; //objeto Ahoracado con que se incializa el juego
var palabrasA = []; //almacenamos las palabras candidatas para adivinar
var casilleroE = null; //elemento div donde se pondrán las casillas de las letras adivinadas
var ELEMENTOS = ["cuerda", "cabeza", "tronco", "brazo-izquierdo", "brazo-derecho", "pie-izquierdo", "pie-derecho"];
var boton = document.querySelector("#b1");
var reseteoE = null;
/* Botón de inicio de juego */
boton.addEventListener("click", function (e) {
    if (typeof juego !== "object") {
        peticionHttp(empiezaJuego); //conectamos con el servidor para obtener el fichero de texo para almacenar en el array palabrasA
        //console.log(palabrasA);		
    }
    else {
        aJugar();
        console.log(juego.getPalabraArray);
        if (!juego.aciertos.includes(undefined)) { //includes busca en un array 
            casilleroE.appendChild(document.createElement("div").appendChild(document.createTextNode("Ganaste!!!")));
            window.setTimeout(hacerReseteo, 3000);
        }
        //rematamos el juego
        //juego comprueba si existe el objeto
        //buscar que siga todo el array de aciertos sin completar
        //límiete de fallos
        if (juego && juego.aciertos.includes(undefined) && juego.contadorFallos === 6) {
            casilleroE.appendChild(document.createElement("div").appendChild(document.createTextNode("game over!. La palabra era \"" + juego.palabra + "\"")));
            window.setTimeout(hacerReseteo, 4000);
        }
    }
    document.querySelector("#letra").value = "";
    document.querySelector("#letra").focus();
});
/*
* Función callback para que se pueda cargar el juego en modo síncrono
*
* @param Array de String. Palabras contenidas en el fichero externo
*/
var empiezaJuego = function (palabras) {
    palabrasA = palabras;
    boton.textContent = "Jugar";
    juego = new Ahorcado(palabrasA);
    console.log(juego.palabra);
    crearCasillero();
};
/*
* Función para empezar de nuevo eljueto
*
*/
var hacerReseteo = function () {
    if (casilleroE && casilleroE.parentNode) {
        console.log(casilleroE);
        casilleroE.parentNode.removeChild(casilleroE);
        document.querySelector("#ahorcado").innerHTML = "";
        juego = undefined;
        boton.innerHTML = "Empezar";
    }
};
/* Botón reseteo */
reseteoE = document.createElement("button");
reseteoE.className = "boton";
reseteoE.innerHTML = "Resetear";
document.querySelector(".article-1 .contenido__item").appendChild(reseteoE);
reseteoE.addEventListener("click", hacerReseteo);
/*
* Función para crear el casillero inicial con las letras del juego
*
* @param function donde se van realizando las tiradas para jugar
*
*/
var crearCasillero = function () {
    casilleroE = document.createElement("div");
    var spanE = null;
    casilleroE.id = "casillero";
    document.querySelector(".article-1").appendChild(casilleroE);
    for (var i = 0; i < juego.getPalabraArray.length; i++) {
        spanE = document.createElement("span");
        spanE.className = "casilla" + (i + 1);
        casilleroE.appendChild(spanE);
    }
};
/*
* Función en que se hacen las tiradas de juego
*
*/
var aJugar = function () {
    var indices = null;
    indices = juego.hacerTirada(document.querySelector("#letra").value.toLowerCase()); //devuelve un array con las letras acertadas
    if (indices.length) { //Aciertos
        //console.log(indices)
        for (var i = 0; i < indices.length; i++) {
            document.querySelector(".casilla" + (indices[i] + 1)).textContent = document.querySelector("#letra").value.toUpperCase();
        }
    }
    else {
        pintarAhorcado(ELEMENTOS[juego.contadorFallos]);
    }
};
/*
* Función que pinta la figura del ahorcado en el DOM
* @param String. Nombre de la clase del elemento
*/
var pintarAhorcado = function (nombreClase) {
    console.log(juego.contadorFallos);
    var padre = (juego.contadorFallos < 3) ? "#ahorcado" : ".tronco"; //determinamos el padre del elementos
    var elementoDiv = document.createElement("div");
    elementoDiv.className = nombreClase;
    document.querySelector(padre).appendChild(elementoDiv);
};
/*
* Función que quita los espacios adicionales
* a un String, por ejemplo " Xurxo           González    "
* lo deja en "Xurxo González"
*
* @param String: cadena a limpiar
* @return String: cadena liberado de espacios adicionales
*
*/
var limpiarBlancos = function (cadena) {
    var primerBlanco = /^ /;
    var ultimoBlanco = / $/;
    var variosBlancos = /[ ]+/g; //g significa global 
    // "g" fai que reemplácese tódalas coindencias e non só unha: 
    // u sexa reemplazará en tódolos lugares que haxa un o máis espazos
    //
    // "+" Busca el carácter precedente 1 o más veces. Es equivalente a {1,}.
    //replace
    cadena = cadena.replace(variosBlancos, " "); //onde exista un o máis espazos o sustituímos por un
    cadena = cadena.replace(primerBlanco, ""); //ao principio de cadea un espazo llo quitamos
    cadena = cadena.replace(ultimoBlanco, ""); //ao final de cadea un espazo llo quitamos
    return cadena;
};
/*
* Función para leer el archivo de las palabras candidatas para empezar el juego.
* Es necesario que el script se ejecute desde el servidor para usar ajax.
*
*/
var peticionHttp = function (callback) {
    var index = null;
    var method = "GET";
    var url = "palabras.txt";
    var peticion = new XMLHttpRequest();
    var palabrasAString;
    peticion.onreadystatechange = function () {
        if (peticion.readyState === XMLHttpRequest.DONE && peticion.status == 200) {
            palabrasAString = limpiarBlancos(peticion.responseText); //limpiamas espacios en blanco adicionales
            palabrasA = palabrasAString.split(" ");
            callback(palabrasA); //convertimos el texto en una cadena de texto
        }
    };
    //apertura del fichero
    peticion.open(method, url, true);
    peticion.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    //envío de la petición
    peticion.send();
};
