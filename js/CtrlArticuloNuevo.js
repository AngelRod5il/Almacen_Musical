import {
  getAuth, getFirestore
} from "../lib/fabrica.js";
import {
  getString, muestraError
} from "../lib/util.js";
import {
  muestraArticulos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  subeStorage
} from "../lib/storage.js";

const daoArticulo = getFirestore().collection("Articulos");

const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

async function protege(usuario){
  if (tieneRol(usuario, ["Administrador"])){
    forma.addEventListener("submit", guarda);
  }
}

async function guarda(evt){
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const vista = formData.get("vista");
    const nombre = getString(formData, "nombre").trim();
    const ingreso = getString(formData, "ingreso").trim();
    const estado = getString(formData, "estado").trim();
    const inventario = getString(formData, "inventario").trim();  
    const encargado = getString(formData, "encargado").trim();
    const mantenimiento = getString(formData, "mantenimiento").trim();
    const modelo = {
      nombre,
      ingreso,
      estado,
      inventario,
      encargado,
      mantenimiento
    };
    await subeStorage(inventario, vista);
    await daoArticulo.add(modelo);
    muestraArticulos();
  } catch(e){
    muestraError(e);
  }
}