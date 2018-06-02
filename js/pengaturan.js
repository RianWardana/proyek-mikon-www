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
    var batasDayaRef = database.ref('batasDaya');
    var batasEnergiRef = database.ref('batasEnergi');

    batasEnergiRef.on('value', data => {
       document.getElementById("batasEnergi").value = data.val(); 
    });

    batasDayaRef.on('value', data => {
       document.getElementById("batasDaya").value = data.val(); 
    });



    ////////////////////////////////////////////////////////////////////////// on button click
    document.getElementById("buttonDaya").onclick = function() {
        var value = Number(document.getElementById("batasDaya").value);
        if ((value != '') && (value >= 5) && (value <= 1000)) {
            batasDayaRef.set(value);
            $.notify(
                { message: "Pengaturan tersimpan." }, 
                { type: 'info',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );
        } else {
            $.notify(
                { message: "Batas daya mulai dari 5W hingga 1000W." }, 
                { type: 'warning',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );
        }
    }



    ////////////////////////////////////////////////////////////////////////// on button click
    document.getElementById("buttonEnergi").onclick = function() {
        var value = Number(document.getElementById("batasEnergi").value);
        if ((value != '') && (value >= 1) && (value <= 1000)) {
            batasEnergiRef.set(value);
            $.notify(
                { message: "Pengaturan tersimpan." }, 
                { type: 'info',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );
        } else {
            $.notify(
                { message: "Batas energi mulai dari 1 Wh hingga 1000 Wh." }, 
                { type: 'warning',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );
        }
    }



    ////////////////////////////////////////////////////////////////////////// on button click
    document.getElementById("buttonHapus").onclick = function() {
        $("#buttonHapus").css('visibility','hidden');
        
        $.post("http://52.230.69.177/mikon-api/setWh", {Wh: 0}, function(result){
            console.log(result);
        });

        $.notify(
            { message: "Akumulasi penggunaan energi terhapus." }, 
            { type: 'info',timer: 2000, placement: { from: 'bottom', align: 'right' } }
        );
    }

}())