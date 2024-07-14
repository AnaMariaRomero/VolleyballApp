import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc, addDoc, collection } from  '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'

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
}