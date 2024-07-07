import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc } from  '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
 
    auth = inject(AngularFireAuth);
    firestores = inject(AngularFirestore);

// =================== Autenticación ==================================

// =================== Acceder ==========================

    signIn(user: User) {
        return signInWithEmailAndPassword(getAuth(),user.email, user.password);
    }
// =================== Registrarse ==========================
    signUp(user: User) {
        return createUserWithEmailAndPassword(getAuth(),user.email, user.password);
    }

    updateProfile(displayName: string) {
        return updateProfile(getAuth().currentUser, { displayName })
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
}