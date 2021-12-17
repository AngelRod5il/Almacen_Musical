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
const daoArticulo = getFirestore().collection("Articulo");

getAuth().onAuthStateChanged(protege, muestraError);

async function protege(usuario){
  if (tieneRol(usuario, ["Administrador"])){
    consulta();
  }
}

function consulta(){
  daoArticulo.orderBy("nombre").onSnapshot(htmlLista, errConsulta);
}

function htmlLista(snap){
  let html = "";
  if (snap.size > 0){
    snap.forEach(doc => html += htmlFila(doc));
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
  const nombre = cod(data.nombre);
  var ing = cod(data.ingreso);
  const estado = cod(data.estado);
  const inventario = cod(data.inventario);
  const encargado = cod(data.encargado);
  var mant = cod(data.mantenimiento);
  const vista = cod(await urlStorage(doc.inventario));
  var ingreso  = new Date(ing);
  var mantenimiento = new Date(mant);
  var formatoingreso = [ingreso.getDate()+1,ingreso.getMonth()+1, ingreso.getFullYear()].join('/');
  var formatomantenimiento = [mantenimiento.getDate()+1,mantenimiento.getMonth()+1, mantenimiento.getFullYear()].join('/');
  var fsf= cod(data.fecha);
  var fecha = new Date(fsf);
  const parámetros = new URLSearchParams();
  parámetros.append("inventario", doc.inventario);
  return( 
    `<li>
      <a class="fila conImagen"
          href= "articulo.html?${parámetros}">
        <span class="marco">
          <img src="${vista}" alt="No hay una imagen disponible">
        </span>
        <span class="texto">
          <strong class="primario">
            ${cod(doc.nombre)}
          </strong>
          <span class="secundario">
            ${formatoingreso}<br>
            ${estado}<br>
            ${inventario}<br>
            ${encargado}<br>
            ${formatomantenimiento}<br>
          </span>
        </span>
      </a>
    </li>`);
}

function errConsulta(e) {
  muestraError(e);
  consulta();
}