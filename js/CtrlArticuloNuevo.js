import {
  getAuth
} from "../lib/fabrica.js";
import {
  getString, muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";
import{
    guardaArticulo
} from "./articulos.js";

const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

async function protege(usuario){
  if (tieneRol(usuario, ["Cliente"])){
    forma.addEventListener("submit", guarda);
  }
}

async function guarda(evt){
    const formData = new FormData(forma);
    const inv = getString(formData, "inventario").trim();
    await guardaArticulo(evt, formData, id);
}
