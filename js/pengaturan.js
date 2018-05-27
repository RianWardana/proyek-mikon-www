(function() {

    ////////////////////////////////////////////////////////////////////////// setup database
    var config = {
        apiKey: "AIzaSyAi2CvFxsApe8Kf21RDD_XuXGLm2egtQXw",
        authDomain: "proyek-mikon.firebaseapp.com",
        databaseURL: "https://proyek-mikon.firebaseio.com",
        projectId: "proyek-mikon",
        storageBucket: "proyek-mikon.appspot.com",
        messagingSenderId: "361165341127"
    };

    firebase.initializeApp(config);
    var database = firebase.database();
    var dayaRef = database.ref('daya');
    var energiRef = database.ref('energi');



    ////////////////////////////////////////////////////////////////////////// on button click
    // document.getElementById("terapkan").onclick = function() {
        
    // }



    ////////////////////////////////////////////////////////////////////////// on button click
    document.getElementById("buttonHapus").onclick = function() {
        $("#buttonHapus").css('visibility','hidden');
        energiRef.set(0);
        $.notify(
            { message: "Akumulasi penggunaan energi terhapus." }, 
            { type: 'info',timer: 2000, placement: { from: 'bottom', align: 'right' } }
        );
    }

}())