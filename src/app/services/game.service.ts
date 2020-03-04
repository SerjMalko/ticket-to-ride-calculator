import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreCollectionConst } from 'src/app/const/firestore-collection.const';
import { map } from 'rxjs/operators';
import { GameModel } from 'src/app/models/game.model';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralDataModel } from 'src/app/models/general-data.model';

const convertToAppModelFunctions = (item => {
  const data = item.payload.doc.data();
  const id = item.payload.doc.id;
  return {id, ...data};
});

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private afs: AngularFirestore, private authService: AuthService) {
  }

  loadGameResults() {
    return this.afs.collection(FirestoreCollectionConst.GAME_RESULTS.name
      , ref => ref.where('author', '==', this.authService.currentUserUID)
    )
      .snapshotChanges()
      .pipe(
        map(data => data?.map(convertToAppModelFunctions))
      );
  }

  startGame(gameInfo: GameModel) {
    return this.setData(gameInfo, FirestoreCollectionConst.GAME_RESULTS.name);
  }

  addPlayerInfo(playerInfo: any) {
    return this.afs.collection(FirestoreCollectionConst.GAME_RESULTS.name)
      .add(playerInfo);
    // .then(ref => {
    //   ref.set({extraId: ref.id}, {merge: true}).then(() => {
    //     console.log('Your extra id field has been created', ref.id);
    //   });
    // });
  }

  deletePlayer() {

  }

  addPlayer() {

  }

  getGameById(id: string) {
    return this.afs.collection(FirestoreCollectionConst.GAME_RESULTS.name)
      .doc(id).ref.get().then(doc => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
      });
  }

  updateGameInfoById(gameId: string, value: GameModel) {
    return this.afs.collection(FirestoreCollectionConst.GAME_RESULTS.name)
      .doc(gameId)
      .set(JSON.parse(JSON.stringify(value)), { merge: true });
  }

  setData<T extends GeneralDataModel>(data: T, collectionName: string, docId?: string) {

    if (!docId) {
      data.createdAt = new Date();
    }
    data.updateAt = new Date();
    data.author = this.authService.currentUserUID;

    return this.afs.collection<T>(collectionName)
      .add(data).then(ref => {
        return ref.set({id: ref.id}, {merge: true}).then(() => {
          return ref.id;
        });
      });
  }
}
