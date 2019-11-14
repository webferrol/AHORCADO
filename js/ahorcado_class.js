"use strict";
 /**
 * Clase Ahorcado. Juego del ahorcado

 * @author: Xurxo González Tenreiro

 * @version: 1.0 31/10/2019

 * @see <a href = "http://www.webferrol.com" /> https://www.webferrol.com </a>

 */
class Ahorcado{
	/**
	* Constructor Cargamos un array de palabras candidatas
	* @param Array de String Palabras candidatas para adivinar la palabra
	*/
	constructor(palabrasA=["ejemplo"]){
		this.palabrasA=palabrasA;
		this.contadorFallos=-1;//inicializamos el contador. -1 no empezó el juego
		this.palabra=this.getPalabraAleatoria;//cargamos una palabra aleatoria (getter)
		this.aciertos=this.getAciertos;//guarda los aciertos (boolean) en un array (getter)
	}
	/**
	* getter que devuelve una palabra aleatoria almacenadas en el campo array palabrasA
	* @return String Palabra aleatoria
	*/
	get getPalabraAleatoria(){
		return this.palabrasA[Math.floor(Math.random()*this.palabrasA.length)];
	}
	/**
	* getter Obtenemos array con size la palabra a adivinar
	* @return Array undefined
	*/
	get getAciertos(){
		return new Array(this.palabra.length);
	}
	/**
	* getter que devuelve un array con las letras de una palabra pasada a minúsculas y sin acentos
	* @return Array de String
	*/
	get getPalabraArray(){
		let caracteres={	//JSON
			"á":"a","é":"e","í":"i","ó":"o","ú":"u",
			"à":"a","è":"e","ì":"i","ò":"o","ù":"u",
			"Á":"A","É":"E","Í":"I","Ó":"O","Ú":"U",
			"À":"A","È":"E","Ì":"I","Ò":"O","Ù":"U",
		}
		let expresionRegular=/[áàéèíìóòúù]/ig; //i->para no distinguir  mayúsculas y minúsculas //g suplir las reiteraciones
		return this.palabra.replace(expresionRegular,(campo)=>caracteres[campo]).toLowerCase().split("");
	}

	/**
	* Función que representa una jugada o tiradas en el juego
	* @return Array de enteros. Contiene los índices de los aciertos. En caso de no haber aciertos lo devuelve vacío.
	*/
	hacerTirada(letra){
		let array=this.getPalabraArray;
		
		let indices = [], i = -1;
    	while ((i = array.indexOf(letra, i+1)) != -1){
        	indices.push(i);
        	this.aciertos[i]=true;
    	}
        if(!indices.length) this.contadorFallos++;
        return indices;
	}
	
}
		