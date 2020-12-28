 const firebaseConfig = {
    apiKey: "AIzaSyB5qbkZpcTQMIVYc69O4qJwEehui8OQ5Ms",
    authDomain: "test-fire-store-f3f2f.firebaseapp.com",
    databaseURL: "https://test-fire-store-f3f2f.firebaseio.com",
    projectId: "test-fire-store-f3f2f",
    storageBucket: "test-fire-store-f3f2f.appspot.com",
    messagingSenderId: "327238529405",
    appId: "1:327238529405:web:d9c7c3c3b816aa321f9c14"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
 

const db = firebase.firestore();

const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
let btn = document.getElementById('btn');
let x;

//create element and render cafe 
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span'); 
    let city = document.createElement('span') ;
    let cross = document.createElement('div') ;

    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().Name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //deleting data 
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let con = confirm("Do you want to delete this?")
        if(con){
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
       // x = setTimeout(reloadFun, 1000);
        }
    })
    
}
//adding settings
db.settings({timestampsInSnapshots: true});

//getting data
/*    db.collection('cafes').orderBy('Name').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderCafe(doc);
        });
    });
*/
//real-time listner

db.collection('cafes').orderBy('Name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc)
        }else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']')
            cafeList.removeChild(li);
        }
    })
})

//saving data in front-end

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    db.collection('cafes').add({
        Name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
    
});

/*function reloadFun() {
window.location.reload();
}
let myVar;
btn.addEventListener('click', () => {
    myVar = setTimeout(reloadFun, 1000);
});
*/





