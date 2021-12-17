import {
  getFirestore
} from "../lib/fabrica.js";
import {
  subeStorage
} from "../lib/storage.js";
import {
  cod, getForánea, muestraError
} from "../lib/util.js";
import {
  muestraArticulos
} from "./navegacion.js";

const firestore = getFirestore();
const daoArticulo = firestore.collection("Articulo");



export async function  guardaArticulo(evt, formData, inv) {
  try {
    evt.preventDefault();
    const inventario = formData.get("inventario");
    const nombre = formData.get("nombre");
    const ingreso = formData.get("ingreso");
    const estado = formData.get("estado");
    const encargado = formData.get("encargado");
    const mantenimiento = formData.get("mantenimiento");
    await daoArticulo.doc(inv).set({
        nombre,
        ingreso,
        estado,
        inventario,
        encargado,
        mantenimiento
      });
    const vista = formData.get("vista");
    await subeStorage(inv, vista);
    muestraArticulos();
  } catch (e) {
    muestraError(e);
  }
}
