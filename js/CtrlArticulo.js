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

const daoArticulo =getFirestore().collection("Articulo");
const params = new URL(location.href).searchParams;
const inv = params.get("inventario");
const forma = document["forma"];

getAuth().onAuthStateChanged(protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,["Administrador"])) {
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
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const vista = formData.get("vista");
    const inventario = getString(formData, "inventario").trim();  
    const nombre = getString(formData, "nombre").trim();
    const ingreso = getString(formData, "ingreso").trim();
    const estado = getString(formData, "estado").trim();
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
    await daoArticulo.doc(inv).set(modelo);
    await subeStorage(inventario, vista);
    muestraArticulos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " + "eliminación")) {
      await daoArticulo.doc(inv).delete();
      muestraArticulos();
    }
  } catch (e) {
    muestraError(e);
  }
}