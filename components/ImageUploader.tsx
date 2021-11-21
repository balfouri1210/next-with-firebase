import { useState } from 'react';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Loader from './Loader';

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e) => {
    const file: any = Array.from(e.target.files)[0];
    
    const extension = file.type.split('/')[1];

    const imageRef = ref(
      storage,
      `uplaods/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );

    setUploading(true);

    const uploadTask = uploadBytesResumable(imageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        console.error(error);
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          setUploading(false);
        });
      }
    );
  }

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  )
}

export default ImageUploader;