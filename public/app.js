///// User Authentication /////

const auth = firebase.auth();
const analytics = firebase.analytics();
const remoteConfig = firebase.remoteConfig();

remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
remoteConfig.defaultConfig = {
    'welcome_message': 'Welcome'
  };
remoteConfig.fetchAndActivate();
const welcomeMessage = remoteConfig.getString("welcome_messsage");

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>${welcomeMessage} ${user.displayName}??</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});



///// Firestore /////

const db = firebase.firestore();

const createPatient = document.getElementById('createPatient');
const patientsList = document.getElementById('patientsList');


let patientsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('patients')

        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            patientsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
            const item_jeggings = {
                idPatient: 'SKU_123',
                cpfPatient: 'jeggings',
                namePatient: 'pants',
                phonePatient: 'pants',
                dobPatient: 'black',
                occupationPatient: 'Google',
                agePatient: '2012',
                idReferer: 'N/A',
                likes: 'soccer and nintendo',
                healthInsurance: 'NotreDame',
                healthInsuranceId: '1548650487'
            };
            analytics.logEvent('add_patient');
        }


        // Query
        unsubscribe = patientsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${ doc.data().name }</li>`

                });

                thingsList.innerHTML = items.join('');

            });



    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});
