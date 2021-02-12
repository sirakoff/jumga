import {toaster} from 'evergreen-ui';
import {includes} from 'lodash';
import filesize from 'filesize';
import {v4 as uuid} from 'uuid';
import getFirebase from './firebase/client';



export const fileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

export const onFileChange = (e) => {

    const file = Array.isArray(e) ? e[0]: e.target.files[0];
    const size = filesize(file.size, {exponent: 2, output: 'object'});

    if (!includes(fileTypes, file.type)) {

        toaster.danger('Invalid file type');

        return false;

    } else if (size.value > 5) {

        toaster.danger('Filesize exceeds the limit of 5MB');

        return false;


    } else {

        //upload

        return file;

    }

};

export const uploadImage = (file, cb) => {

    const firebase = getFirebase();

    const storageRef = firebase.storage().ref('images');
    const fileId = uuid();
    const ref = storageRef.child(`${fileId}`);

    ref.put(file).then(async (snapshot) => {

        return cb(await snapshot.ref.getDownloadURL());

    });

}