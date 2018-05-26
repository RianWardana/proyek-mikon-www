(function() {
    setInterval(function(){
        document.getElementById("daya").innerHTML = Math.floor(Math.random()*99)+40;
        document.getElementById("waktu").innerHTML = (new Date()).toLocaleTimeString('en-ID', { hour12: false });
    }, 1000);

    

    var signalData = [];

    
    ////////////////////////////////////////////////////////////////////////// setup database
    // var config = {
    //     apiKey: "AIzaSyAi2CvFxsApe8Kf21RDD_XuXGLm2egtQXw",
    //     authDomain: "proyek-mikon.firebaseapp.com",
    //     databaseURL: "https://proyek-mikon.firebaseio.com",
    //     projectId: "proyek-mikon",
    //     storageBucket: "proyek-mikon.appspot.com",
    //     messagingSenderId: "361165341127"
    // };

    // firebase.initializeApp(config);
    // var database = firebase.database();
    // var dayaRef = database.ref('daya');
    // var energiRef = database.ref('energi');

    

    ////////////////////////////////////////////////////////////////////////// setup MQTT
    client = new Paho.MQTT.Client("52.230.69.177", Number(1884), Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({onSuccess:onConnect});

    function onConnect() {
        console.log("MQTT connected");
        client.subscribe("mikon/daya");
        client.subscribe("mikon/toServer");
        startTimer();
    }

    function onConnectionLost() {
        alert("Koneksi terputus.");
    }

    function onMessageArrived(message) {
        updateTimer();
        let topic = message.destinationName;
        let payload = message.payloadString;
        
        if (topic == "mikon/daya") {
            signalData.unshift(Number(payload));
        } 

        else if (topic == "mikon/toServer") {
            if (payload == "1") {
                tombolNyalakan.style.display = 'none';
                tombolMatikan.style.display = 'block';
            } 
            else if (payload == 0) {
                tombolNyalakan.style.display = 'block';
                tombolMatikan.style.display = 'none';
            }
        }
    }



    ////////////////////////////////////////////////////////////////////////// setup device status
    var status = "online";
    var timeoutObj;
    
    var startTimer = function() {
        timeoutObj = setTimeout(setDeviceOffline, 5000);
    };
    
    var updateTimer = function() {
        clearTimeout(timeoutObj);
        timeoutObj = setTimeout(setDeviceOffline, 5000);
        setDeviceOnline();
    }

    var setDeviceOffline = function() {
        statusPerangkat.innerHTML = "<i class='now-ui-icons ui-1_simple-remove'></i> Perangkat offline";
        $("#tombolNyalakan").addClass('disabled');
        $("#tombolMatikan").addClass('disabled');
        $.notify(
            { message: "Perangkat offline" }, 
            { type: 'danger',timer: 2000, placement: { from: 'bottom', align: 'right' } }
        );
        status = "offline";
    }

    var setDeviceOnline = function() {
        statusPerangkat.innerHTML = "<i class='now-ui-icons ui-1_check'></i> Perangkat online";
        $("#tombolNyalakan").removeClass('disabled');
        $("#tombolMatikan").removeClass('disabled');
        if (status == 'offline') {
            $.notify(
                { message: "Perangkat online" }, 
                { type: 'info',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );   
        }
        status = "online";
    }



    ////////////////////////////////////////////////////////////////////////// setup switch
    var nyalakan = function() {
        var message = new Paho.MQTT.Message("1");
        message.destinationName = "mikon/fromServer";
        client.send(message);
    }

    var matikan = function() {
        var message = new Paho.MQTT.Message("0");
        message.destinationName = "mikon/fromServer";
        client.send(message);
    }

    tombolNyalakan.addEventListener("click", nyalakan);
    tombolMatikan.addEventListener("click", matikan);



    ////////////////////////////////////////////////////////////////////////// setup graph
    var ctx = document.getElementById('myChart').getContext('2d');
    var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: "Daya",
                borderColor: "#fff",
                borderWidth: 2,
                fill: true,
                backgroundColor: gradientFill,
                radius: 0,
                data: []
            }]
        },
        options: {
            layout: {
                padding: {
                    left: 0
                }
            },
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    display: false
                }],
                xAxes: [{
                    gridLines: {display: false},
                    ticks: {
                        padding: 10,
                        fontColor: "rgba(255,255,255,0.4)",
                        fontStyle: "bold"
                    },
                    type: 'realtime'
                }]
            },
            plugins: {
                streaming: {
                    refresh: 1000,
                    duration: 30000,
                    frameRate: 30,
                    delay: 2000,
                    onRefresh: function(chart) {
                        chart.data.datasets[0].data.push({
                            x: Date.now(),
                            y: Math.floor(Math.random()*99)
                            // y: signalData.pop()
                        });
                    }
                }
            }
        }
    });
}())