const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios=require('axios');

admin.initializeApp();

const SQL_LOG_URL='http://buetedu1-env.eba-zxgyn7t7.ap-south-1.elasticbeanstalk.com/author/addNew'

exports.registerUser = functions.auth.user().onCreate((user) => {
  if('displayName' in user && user.displayName!==null){
    //console.log(user)
    var userData={
      name:user.displayName,
      timestamp:Date.now()
    }
    if('photoURL' in user && user.photoURL!==null)
      userData['image']=user.photoURL
    return admin.firestore().collection('profile').doc(user.uid).set(userData).then(()=>{
      var postData={
        author_id:user.uid,
        name:user.displayName,
        contact:user.email,
        image:user.photoURL
      }
      return axios.post(SQL_LOG_URL,postData).then(res=>{
        console.log(postData)
        console.log(res.data)
        return console.log('user added, uid - '+user.uid)
      }).catch(err=>{
        return console.log(err)
      })
    }).catch(err=>{
      return console.log(err)
    })
  }
});
