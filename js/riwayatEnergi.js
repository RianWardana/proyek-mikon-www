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

    var signalData = [];



    ////////////////////////////////////////////////////////////////////////// setup graph

    document.getElementById("terapkan").onclick = function() {
        var counter = 0;
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        
        if ((date == '') || (time == '')) {
            alert('Tidak lengkap');
        } else {
            var epochStart = moment(`${date} ${time}`).unix();
            var epochEnd = epochStart + 3600;
            document.getElementById("elektrokardiogram").style.display = "block";
            document.getElementById("cardBpm").style.display = "block";
            document.getElementById("cardKondisi").style.display = "block";

            ecgRef.orderByKey().startAt(epochStart.toString()).endAt(epochEnd.toString()).once('value', seconds => {
                seconds.forEach(second => {
                    second.val().forEach(sample => {
                        myChart.data.labels.push(counter.toString());
                        myChart.data.datasets[0].data.push(sample);
                        counter++;
                    });
                });
                myChart.update(0);
            });

            bpmRef.orderByKey().startAt(epochStart.toString()).endAt(epochEnd.toString()).once('value', seconds => {
                var total = 0;
                var count = 0;
                var bpm = 0;
                seconds.forEach(second => {
                    total = total + parseInt(second.val());
                    count++;
                });
                bpm = Math.floor(total / count);
                document.getElementById("denyut").innerHTML = bpm;
                if ((bpm < 40) || (bpm > 110)) {
                    document.getElementById("denyut").style.color = '#f44336';
                    document.getElementById("kondisi").style.color = "#f44336";
                    document.getElementById("kondisi").innerHTML = '<h1 class="card-title" style="margin: 0;"><i class="now-ui-icons health_ambulance"></i></h1>';
                    document.getElementById("kondisiStatus").innerHTML = '<i class="now-ui-icons ui-1_simple-remove"></i> Kritis';
                } else {
                    document.getElementById("denyut").style.color = '#4caf50';
                    document.getElementById("kondisi").style.color = "#4caf50";
                    document.getElementById("kondisi").innerHTML = '<h1 class="card-title" style="margin: 0;"><i class="now-ui-icons emoticons_satisfied"></i></h1>';
                    document.getElementById("kondisiStatus").innerHTML = '<i class="now-ui-icons ui-2_like"></i> Normal';
                }
            });
        }
    }




    ////////////////////////////////////////////////////////////////////////// setup graph
    var ctx = document.getElementById("myChart").getContext('2d');

    var gradientFill = ctx.createLinearGradient(0,0,0,200);
    gradientFill.addColorStop(0, "rgba(241, 241, 241, 0)");
    gradientFill.addColorStop(1, "rgba(22, 160, 133, 0.10)");

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                borderColor: "#000",
                borderWidth: 2,
                backgroundColor: gradientFill,
                radius: 0
            }]
        },
        options: {
            layout:{
                padding:{left:0,right:0,top:0,bottom:0}
            },
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    display:0,
                    gridLines:0,
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        zeroLineColor: "transparent",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    display: 0,
                    gridLines: 0,
                    ticks: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}())