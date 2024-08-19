import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc, getDocs, addDoc, collection, collectionData, query, DocumentData, updateDoc } from  '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'
import { Category } from '../models/category.model';
import { SetGame } from '../models/set-game.model';
import { Player } from '../models/player.model';
import { Statistics } from '../models/statistics.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Position } from '../models/position.model';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Match } from '../models/match.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
 
    auth = inject(AngularFireAuth);
    firestores = inject(AngularFirestore);
    utilsSvc = inject(UtilsService);
    storage = inject(AngularFireStorage);

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

     // ======== Updetear un documento ================
     updateDocument(path: string, data: any){
        return updateDoc(doc(getFirestore(), path), data);
    }

    // ============ Obtener un documento ==============
    async getDocument(path: string) { 
        //sacamos la informacion del documento directamente con .data()
        return (await getDoc(doc(getFirestore(), path))).data();
    }

    getCollectionData(path: string, collectionQuery?: any) {
        const ref = collection(getFirestore(), path);
        return collectionData(ref, { idField: 'id' });
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

    // Tomar seleccionar una imagen
    async uploadImage(path: string, data_url: string){
        return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
            return getDownloadURL(ref(getStorage(), path))
        })
    }

    async getParams(tipoParametro: string): Promise<Category[]> { //parametros/categorías/datos
        //primero traemos la coleecion
        const paramsCollectionRef = collection(getFirestore(), 'parametros'); 
        //luego traemos la referencia al documento con la referencia parametro
        let promise: any;
        if (tipoParametro == 'categorías'){
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
        
                promise = categories;
            } else {
            console.error('No se encontraron categorías');
            return [];
            }
        } else {
            const positionsDocRef = doc(paramsCollectionRef, 'posiciones');
            // luego traemos la informacion del documento
            const positionsDoc = await getDoc(positionsDocRef);
        
            if (positionsDoc.exists()) {
                // luego sacamos la info y la castemos al modelo de posicion
                const data = positionsDoc.data();
                const positions: Position[] = [];
        

                for (const positionId in data) {
                    const positionName = data[positionId];
                    const position: Position = {
                        id: positionId, // casteamos id
                        name: positionName // casteamos name
                    };
                    positions.push(position);
                }
        
                promise = positions;
            } else {
            console.error('No se encontraron categorías');
            return [];
            }
        }
        return promise;
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
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        //otra forma de obtener datos con el getDocument()
        const path = `users/${userUid}/matches/${matchId}`;
        const datos = this.getDocument(path);
        // con este tengo que hacer un then porque es un Promise
        return datos;
    }

    async getSetsGameByMatchId(matchId: string): Promise<Observable<SetGame[]>> {
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const path = `users/${userUid}/matches/${matchId}/sets`;
        const setsCollectionRef = collection(getFirestore(), path);
        const setsSnapshot = await getDocs(setsCollectionRef);
        
        return await this.getCollectionData(path).pipe(
            map((documents: DocumentData[]) =>
            documents.map((doc: DocumentData) => ({
                id: doc['id'], // Acceder al ID como parte de los datos
                number: doc['number'],
                matchId: doc['matchId'],
                players: doc['players'],
                pointsFavor: doc['pointsFavor'],
                pointsAgainst: doc['pointsAgainst'],
                setFinish: doc['setFinish']
            }) as SetGame)
            )
        );
      }
      
    updateSetGame(setGame:SetGame){
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const path =  `users/${userUid}/matches/${setGame.matchId}/sets/${setGame.id}`;

        this.updateDocument(path, setGame);
    }

    updateSetMatch(match:Match){
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const path =  `users/${userUid}/matches/${match.id}`;

        this.updateDocument(path, match);
    }

    async addArraySetsGameForMatch(matchId: string) {
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const path = `users/${userUid}/matches/${matchId}/sets`;
    
        // Buscar si ya existen sets en la base de datos
    const existingSets = this.getCollectionData(path);
    const sets = await firstValueFrom(existingSets);
    
        if (sets && sets.length > 0) {
            console.log("Sets ya existentes: ", sets);
            return sets;
        }
    
        // Si no hay sets, crearlos
        const newSets = [
            { number: 1, matchId: matchId, players: [], pointsFavor: 0, pointsAgainst: 0, setFinish: false },
            { number: 2, matchId: matchId, players: [], pointsFavor: 0, pointsAgainst: 0, setFinish: false },
            { number: 3, matchId: matchId, players: [], pointsFavor: 0, pointsAgainst: 0, setFinish: false },
            { number: 4, matchId: matchId, players: [], pointsFavor: 0, pointsAgainst: 0, setFinish: false },
            { number: 5, matchId: matchId, players: [], pointsFavor: 0, pointsAgainst: 0, setFinish: false }
        ];
    
        const promises = newSets.map(setData => this.addDocument(path, setData));
        await Promise.all(promises);
        
        return newSets;
    }
     
    finishSet(setGame:SetGame,statisticsPlayersArray: Statistics[]) {
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const path =  `users/${userUid}/matches/${setGame.matchId}/sets/${setGame.id}/statistics`;

        statisticsPlayersArray.forEach(setData => {
            this.addDocument(path, setData)
            .then(() => {
                console.log(`Statistics añadido: `, setData.setId);
            })
            .catch(error => {
                console.error('Error añadiendo el statistics: ', error);
            });
        });

        // updetear el set: 
        this.updateSetGame(setGame);

        const datos = this.getDocument(path);
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