const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.registerUser = functions.auth.user().onCreate((user) => {
  if('displayName' in user && user.displayName!==null){
    var userData={
      name:user.displayName,
      timestamp:Date.now()
    }
    if('photoURL' in user && user.photoURL!==null)
      userData['image']=user.photoURL
    return admin.firestore().collection('profile').doc(user.uid).set(userData).then(()=>{
      return console.log('use added, uid->'+user.uid)
    }).catch(err=>{
      return console.log(err)
    })
  }
});
