import {
  getAuth, 
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import { 
  muestraError
} from "../lib/util.js";
import {
  muestraArticulos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
    guardaArticulo
} from "./articulo.js";

const params = new URL(location.href).searchParams;
const inv = params.get("inventario");
const daoArticulo =getFirestore().collection("Articulo");
const forma = document["forma"];
const img = document.querySelector("vista");
getAuth().onAuthStateChanged(protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,["Cliente"])) {
    busca();
  }
}
/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc = await daoArticulo.doc(inv).get();
    if (doc.exists) {
      const data = doc.data();
      img.src = await urlStorage(inv);
      forma.inventario.value = data.inventario;
      forma.nombre.value = data.nombre || "";
      forma.ingreso.value = data.ingreso || "";
      forma.estado.value = data.estado || "";
      forma.encargado.value = data.encargado || "";
      forma.mantenimiento.value = data.mantenimiento || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error("No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraArticulos();
  }
}

async function guarda(evt) {
  await guardaArticulo(evt,
    new FormData(forma), inv);
}

async function elimina() {
  try {
    if (confirm("Confirmar la " + "eliminación")) {
      await daoArticulo.doc(inv).delete();
      await eliminaStorage(inv);
      muestraArticulos();
    }
  } catch (e) {
    muestraError(e);
  }
}
