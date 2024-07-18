import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc, addDoc, collection, collectionData, onSnapshot, getDocs, where, query } from  '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'
import { Observable, from, of } from 'rxjs';
import { Category } from '../models/category.model';
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
        return addDoc(collection(getFirestore(), path), data);
    }

    // ============== Almacenamiento =================
    async uploadStorage(path: string, data_url: string){
        return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
            return getDownloadURL(ref(getStorage(), path))
        })
    }

    async getParams(): Promise<Category[]> {
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

    getJugadoras() {
        const userUid = JSON.parse(localStorage.getItem('user')).uid;
        const usersCollectionRef = collection(getFirestore(), 'users'); // Only 'users' collection path
      
        const playersQuery = query(collection(usersCollectionRef, userUid, 'players'), {} as any); // Access players collection within user document
      
        const jugadorasData = collectionData(playersQuery, { idField: 'id' });
      
        return jugadorasData;
      }
}