/* global Promise */
import{
  getAuth, getFirestore
} from "../lib/fabrica.js";
import{
  cod, muestraError
} from "../lib/util.js";
import{
  tieneRol
} from "./seguridad.js";
import {
  urlStorage
} from "../lib/storage.js";

const lista = document.querySelector("#lista");
const firestore = getFirestore();
const daoArticulo = getFirestore().collection("Articulo");

getAuth().onAuthStateChanged(protege, muestraError);

async function protege(usuario){
  if (tieneRol(usuario, ["Cliente"])){
    consulta();
  }
}

function consulta(){
  daoArticulo.onSnapshot(htmlLista, errConsulta);
}
/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap){
  let html = "";
  if (snap.size > 0){
      /** @type {
          Promise<string>[]} */
  let articulos = [];
  snap.forEach(doc => articulos.push(htmlFila(doc)));
  const htmlFilas = 
    await Promise.all(articulos);
  html += htmlFilas.join("");
}else{
    html += 
      `<li class="vacio">
        -- No hay artículos en existencia. --
      </li>`;
  }
  lista.innerHTML = html;
}

async function htmlFila(doc) {
  const data = doc.data();
  const img = cod(await urlStorage(doc.inv));
  const articulo = await buscaArticulo(data.inv);
  const parámetros = new URLSearchParams();
  parámetros.append("inventario", doc.inv);
  return (/* html */
    `<li>
      <a class="fila conImagen"
          href=
    "articulo.html?${parámetros}">
        <span class="marco">
          <img src="${img}"
            alt="Falta el Avatar">
        </span>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.inv)}
          </strong>
          <span class="secundario">
            ${articulo}
          </span>
        </span>
      </a>
    </li>`);
}
async function buscaArticulo(inv){
    if(inv){
        const doc = await daoArticulo.doc(inv).get();
        if(doc.exists){
            const data = doc.data();
            return(
            `${cod(data.nombre)}<br>
             ${cod(data.ingreso)}<br>
             ${cod(data.estado)}<br>
             ${cod(data.encargado)}<br>
             ${cod(data.mantenimiento)}<br>
             `
        );
        }
    }
    return " ";
}

function errConsulta(e) {
  muestraError(e);
  consulta();
}
