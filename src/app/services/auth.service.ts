import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<UserModel>;

  user: User;

  constructor(private  afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }

  get currentUserUID() {
    return this.afAuth.auth.currentUser.uid;
  }

  async loginByEmail(userData: { email: string, password: string }) {

    const credential = await this.afAuth.auth.signInWithEmailAndPassword(userData.email, userData.password);

    console.log('result from ->', credential);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = credential.credential;
    // The signed-in user info.
    const user = credential.user;

    console.log('result ->', token, user);

    return this.updateUserData(credential.user);

  }

  async loginByFb() {
    const fbProvider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(fbProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = credential.credential;
    // The signed-in user info.
    const user = credential.user;

    console.log('result ->', token, user);

    return this.updateUserData(credential.user);

  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<Partial<User>> = this.afs.doc<User>(`users/${user.uid}`);
    const data: Partial<User> = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid
    };

    return userRef.set(data, {merge: true});
  }

  async logout() {
    await this.afAuth.auth.signOut();
  }
}
