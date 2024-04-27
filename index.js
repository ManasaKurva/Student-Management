 import { initializeApp } from 'firebase/app';
import {
        getFirestore,
        collection,
        addDoc,
        serverTimestamp,
        getDocs,
        query,
        deleteDoc,
        where,
        updateDoc,
    } from 'firebase/firestore'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDN924_YO9YCqGN2iUWFRvHf_npLNKuy2Y",
  authDomain: "studentfirebase-c85cd.firebaseapp.com",
  databaseURL: "https://studentfirebase-c85cd-default-rtdb.firebaseio.com",
  projectId: "studentfirebase-c85cd",
  storageBucket: "studentfirebase-c85cd.appspot.com",
  messagingSenderId: "88248041844",
  appId: "1:88248041844:web:48360e6d174c9e9356ec21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
//creating the collection ref
const db = getFirestore(app)
const colRef = collection(db,'student');
  
//sign up
const signupForm = document.querySelector('.signup')
signupForm?.addEventListener('submit',(e) => {
    e.preventDefault()
    const displayerror = document.querySelector('.displayerror')
    const email = signupForm.email.value
    const password = signupForm.password.value
    console.log("came to signup" );
    createUserWithEmailAndPassword(auth,email,password)
    .then((cred) => {
        signupForm.reset()
        //redirect to dashboard.html page
        window.location.href = 'index.html';
    })
    .catch((err) => {
        displayerror.innerHTML = "Already Registered!,Please login.."
        console.log(err.message);
        console.log("Unable to signup using the credentials");

    })
})


//login
const loginForm = document.querySelector('.login')
loginForm?.addEventListener('submit',(e) => {
    e.preventDefault()
    const displayerror = document.querySelector('.displayerror')
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth,email,password)
    .then((cred) => {
        console.log('user logged in',cred.user);
        loginForm.reset()
        window.location.href = 'index.html';
    })
    .catch((err) => {
        displayerror.innerHTML = "Invalid Login Credentials.."
        console.log(err.message);
        console.log("Unable to login")
    })
})

//dashboard
//adding student details
const submitForm = document.querySelector(".submitForm");

submitForm?.addEventListener('submit',(e)=>{
    e.preventDefault() 
    const name = submitForm.querySelector("#name").value
    const rollno = submitForm.querySelector("#rollno").value
    const branch = submitForm.querySelector("#branch").value
    const section = submitForm.querySelector("#section").value
    const phone = submitForm.querySelector("#phnno").value
    const email = submitForm.querySelector("#email").value
    const cgpa = submitForm.querySelector("#cgpa").value
    const address = submitForm.querySelector("#address").value
    const startyear = submitForm.querySelector("#starting_year").value
    addDoc(colRef,{
        name,
        rollno,
        branch,
        section,
        phone,
        email,
        cgpa,
        address,
        startyear,
        createdAt:serverTimestamp()
    })
    .then(()=> {
        alert("data added successfully")
        submitForm.reset()
    })
    .catch((err)=>{
        console.log(err.message);
    })
})


//delete student data 
const deleteForm=document.querySelector('.deleteform')
deleteForm?.addEventListener('submit',(e)=>{
    e.preventDefault()
    const rollno=deleteForm.querySelector('#rollno').value
    const queryRef= query(colRef, where("rollno", "==", rollno));
    getDocs(queryRef)
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            // Delete the document
            deleteDoc(doc.ref)
            .then(() => {
                alert("Document successfully deleted!");
                deleteStudentForm.reset(); // Reset the form
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });
});


//get the data from firebase and display
const displaystudent = document.querySelector('.display');
const retrieveForm = document.querySelector('.retrieveform');

retrieveForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const rollno = retrieveForm.querySelector("#rollno").value;

    // Query Firestore to retrieve student data based on roll number
    const queryRef = query(colRef, where("rollno", "==", rollno));
    getDocs(queryRef)
    .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                displaystudent.querySelector('.name').textContent = data.name;
                displaystudent.querySelector('.rollno').textContent = data.rollno;
                displaystudent.querySelector('.email').textContent = data.email;
                displaystudent.querySelector('.phone').textContent = data.phone;
                displaystudent.querySelector('.branch').textContent = data.branch;
                displaystudent.querySelector('.section').textContent = data.section;
                displaystudent.querySelector('.cgpa').textContent = data.cgpa;
                displaystudent.querySelector('.address').textContent = data.address;
        })
    })
     .catch((error) => {
        console.error("Error retrieving student data:", error);
      });
      retrieveForm.reset()
});


// Update student details
const updateForm1 = document.querySelector('.updateform1');
const updateForm = document.querySelector('.updateform');

updateForm1?.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    // Get the roll number input value
    const rollno = updateForm.querySelector('#rollno').value;

    // Query to find the document with the specified roll number
    const queryRef = query(colRef, where("rollno", "==", rollno));

    // Get the document reference and update the fields
    getDocs(queryRef)
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Get the current data of the document
            const currentData = doc.data();
            
            // Get the updated values from the form
            const name = updateForm1.querySelector("#name").value  || currentData.name;
            const branch = updateForm1.querySelector("#branch").value  || currentData.branch;
            const section = updateForm1.querySelector("#section").value  || currentData.section;
            const phone = updateForm1.querySelector("#phnno").value  || currentData.phone;
            const email = updateForm1.querySelector("#email").value  || currentData.email;
            const cgpa = updateForm1.querySelector("#cgpa").value  || currentData.cgpa;
            const address = updateForm1.querySelector("#address").value  || currentData.address;
            const startyear = updateForm1.querySelector("#starting_year").value || currentData.startyear;

            // Update only the fields that have changed
            updateDoc(doc.ref, {
                name,
                branch,
                section,
                phone,
                email,
                cgpa,
                address,
                startyear,
                createdAt:serverTimestamp()
            })
            .then(() => {
                alert("Document successfully updated!");
                updateForm.reset(); // Reset the form
                updateForm1.reset(); // Reset the form
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
        });
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });
});
 