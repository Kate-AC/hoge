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

import multer from 'multer'


import { getStorage, ref, uploadBytes, UploadResult } from "firebase/storage"
import { FirebaseClient } from 'infrastructure/firebase/firebase.client';
//const formidable = require('formidable')
const Busboy = require('busboy')
const path = require('path')
const os = require('os')
const fs = require('fs')

export const contentsCreate = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
    console.log('kutayooooooo')

    //cors({origin: true})
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', '*');
      res.set('Access-Control-Allow-Headers', '*');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204)
      res.send('');
      return
    }

    try {
      const client = new FirebaseClient

      const busboy = Busboy({ headers: req.headers })

      const uploads = {};
      const allowMimeTypes = ['image/png', 'image/jpg'];
      // file upload bucket
      //const bucket = client.storage //.bucket(functions.config().fileupload.bucket.name);
    
      // This callback will be invoked for each file uploaded.
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(2222222222222222222222222222222222222)
        console.log(fieldname)
        console.log(filename)
        console.log(file)

        if (!allowMimeTypes.includes(mimetype.toLocaleLowerCase())) {
          console.warn('disallow mimetype: ' + mimetype);
          return;
        }
        // Note that os.tmpdir() is an in-memory file system, so should
        // only be used for files small enough to fit in memory.
        const tmpdir = os.tmpdir();
        const filepath = path.join(tmpdir, filename);
        file.pipe(fs.createWriteStream(filepath));
    
        file.on('end', () => {
          console.log('upload file: ' + filepath + ' metadata: ' + mimetype);
          uploads[fieldname] = { filepath, mimetype };
          console.log(77777777777777777777777777777777777777777777)
          console.log(fieldname)
          console.log(filename)
          console.log(file)
          res.send('つうしん成功')
          /*
          bucket.upload(filepath, { destination: `upload_images/${path.parse(filepath).base}`, metadata: { contentType: mimetype } })
            .then(() => {
              console.log('file upload success: ' + filepath);
              return new Promise((resolve, reject) => {
                fs.unlink(filepath, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
            })
            .catch(err => {
              console.error(err);
              // TODO error handling
            });
                    */
        });
      })
      /*
        const form = formidable()
        form.parse(req, (err, fields, files) => {
            console.log("777777777777777777777777777777")
            console.log(fields);
            console.log(files)

            res.send('つうしん成功')
        });

        console.log(3333333333333333)
        console.log(req.body)
        console.log(req.rawBody.toJSON())
        console.log(req.body.sampleText)
        console.log(req.body.sampleFile)
        console.log(req.file)
        console.log(req.files)
        const client = new FirebaseClient
*/
        /*
        multer().single('sampleFile')
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
