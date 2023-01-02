import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { AuthPresenter } from 'presenter/auth.presenter'


admin.initializeApp();

/**
 * Login
 */

const authPresenter = new AuthPresenter()

export const authRedirect = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
    await authPresenter.redirect(req, res)
})

export const authCallback = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
    await authPresenter.callback(req, res)
})

/**
 * Content
 */

import { getStorage, ref, uploadBytes, UploadResult } from "firebase/storage"
import { FirebaseClient } from 'infrastructure/firebase/firebase.client';

export const contentsCreate = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', '*');
        res.set('Access-Control-Allow-Headers', '*');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204)
        res.send('');
        return
    }

    try {
      console.log(999999999999999999999)
      console.log(req.body.sampleText)
      console.log(req.body.sampleFile)
      /*
        const client = new FirebaseClient
        const storageRef = ref(client.storage, 'hoge/' + req.file.originalname)
        uploadBytes(storageRef, req.file.buffer)
            .then(() => {
                res.send('あっぷろーど成功')
            })
            .catch(() => {
                res.send("エラー：アップロードできませんでした。")
            })
      */
    } catch (error) {
        console.log('=================')
        console.log(error)
    }

    //res.send('つうしん成功')
})
