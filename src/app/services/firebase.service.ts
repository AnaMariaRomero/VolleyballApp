import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc, addDoc, collection, collectionData, onSnapshot, getDocs, where, query } from  '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'
import { Category } from '../models/category.model';
import { SetGame } from '../models/set-game.model';
import { Player } from '../models/player.model';


@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
 
    auth = inject(AngularFireAuth);
    firestores = inject(AngularFirestore);
    utilsSvc = inject(UtilsService);

    // =================== Autenticación ==================================
    getAuth(){
        return getAuth();
    }

// =================== USUARIO ==========================
    //================= Ingreso ===================
    signIn(user: User) {
        return signInWithEmailAndPassword(getAuth(),user.email, user.password);
    }

    // =================== Registrarse ==========================
    signUp(user: User) {
        return createUserWithEmailAndPassword(getAuth(),user.email, user.password);
    }

    // =================== Actualizar Usuario ==================
    updateUser(displayName: string) {
        return updateProfile(getAuth().currentUser, { displayName })
    }

    // ================= Enviar email para reestablecer la contraseña =================
    sendRecoveryEmail(email: string){
        return sendPasswordResetEmail(getAuth(), email)
    }

    // ================== Cerrar Sesión ================
    signOut(){
        getAuth().signOut();
        localStorage.removeItem('user');
        this.utilsSvc.routerLink('/auth');
    }
// ================== Base de Datos ===============

    // ======== Setear un documento ================
    setDocument(path: string, data: any){
        return setDoc(doc(getFirestore(), path), data);
    }

    // ============ Obtener un documento ==============
    async getDocument(path: string) { 
        //sacamos la informacion del documento directamente con .data()
        return (await getDoc(doc(getFirestore(), path))).data();
    }
    // ============ Agregar un documento ==============
    // se le pasa por parametro el path de lo que queremos agregar, en este caso es users
    addDocument(path:string, data: any){
        console.log("DATOS: ", data)
        return addDoc(collection(getFirestore(), path), data);
    }

    // ============== Almacenamiento =================
    async uploadStorage(path: string, data_url: string){
        return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
            return getDownloadURL(ref(getStorage(), path))
        })
    }

    async getParams(): Promise<Category[]> { //parametros/categorías/datos
        //primero traemos la coleecion
        const paramsCollectionRef = collection(getFirestore(), 'parametros'); 
        //luego traemos la referencia al documento con la referencia parametro
        const categoriesDocRef = doc(paramsCollectionRef, 'categorías');
        // luego traemos la informacion del documento
        const categoriesDoc = await getDoc(categoriesDocRef);
      
        if (categoriesDoc.exists()) {
            // luego sacamos la info y la castemos al modelo de categoría
            const data = categoriesDoc.data();
            const categories: Category[] = [];
      

            for (const categoryId in data) {
                const categoryName = data[categoryId];
                const category: Category = {
                    id: categoryId, // casteamos id
                    name: categoryName // casteamos name
                };
                categories.push(category);
            }
      
          return categories;
        } else {
          console.error('No se encontraron categorías');
          return [];
        }
    }

    getPlayers() {
        //otra forma de obtener datos sin utilizar el getDocument()
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        // coleccion unica para el usuario
        const usersCollectionRef = collection(getFirestore(), 'users'); 
        // Acceder a las coleccion de jugadoras con el documento del user
        const playersQuery = query(collection(usersCollectionRef, userUid, 'players'), {} as any); 
        const jugadorasData = collectionData(playersQuery, { idField: 'id' });
      
        return jugadorasData;
    }

    async getPlayersById(playersIds: string[]){
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const promises = playersIds.map(async (playerId) => {
            const docRef = doc(getFirestore(), `users/${userUid}/players/${playerId}`);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              return data;
            } else {
              console.warn(`No se encontró el documento para el jugador ${playerId}`);
              return null;
            }
          });
      
          // Esperamos a que todas las promesas se resuelvan y filtramos los resultados nulos
          const results = Promise.all(promises);
          return (await results).filter(value => value !== null) as Player[];
    }

    getMatches(){
        //otra forma de obtener datos sin utilizar el getDocument()
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        // coleccion unica para el usuario
        const usersCollectionRef = collection(getFirestore(), 'users'); 
        // Acceder a las coleccion de partidos con el documento del user
        const matchesQuery = query(collection(usersCollectionRef, userUid, 'matches'), {} as any);
        const matchesData = collectionData(matchesQuery, { idField: 'id' });
        // con este tengo que hacer un subscribe porque es un Observable
        return matchesData;
    }

    getMatch(matchId:string){
        //otra forma de obtener datos con el getDocument()
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const path = `users/${userUid}/matches/${matchId}`;
        const datos = this.getDocument(path);
        // con este tengo que hacer un then porque es un Promise
        return datos;
    }
}

/**************************************************************
Promise
    Un Promise representa una operación asincrónica que puede completarse con éxito o con un error,
    y que puede tener un solo valor de retorno. Cuando utilizas un Promise, 
    generalmente esperas que la operación se complete en algún momento en el futuro y,
    una vez que se resuelva, no hay más valores que observar. Puedes manejar el resultado o error usando .then() y .catch() o 
    utilizando la sintaxis async/await.

Observable
    Un Observable es más poderoso y flexible que un Promise, 
    ya que puede manejar flujos de datos que pueden emitir múltiples valores a lo largo del tiempo. 
    Son útiles para manejar eventos o secuencias de datos que cambian con el tiempo, 
    como datos de formularios o datos de una conexión de WebSocket.
    Para obtener los valores emitidos por un Observable, debes suscribirte a él usando .subscribe(). 
    La suscripción se ejecuta cada vez que el Observable emite un nuevo valor, 
    y puedes manejar la emisión de datos, errores y la finalización del flujo de datos.
************************************************************** */