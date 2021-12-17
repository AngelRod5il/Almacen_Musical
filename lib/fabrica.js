/** Conexión a la base de datos
 * de Firebase.
 *  @returns {
      import("./tiposFire").
      Firestore} */
export function getFirestore() {
  return firebase.firestore();
}

/** Conexión al sistema de
 * autenticación de Firebase.
 *  @returns {
      import("./tiposFire").
      Auth} */
export function getAuth() {
  return firebase.auth();
}

/** Conexión al sistema de
 * storage de Firebase.
 *  @returns {
      import("./tiposFire").
      Storage} */
export function getStorage() {
  return firebase.storage();
}
