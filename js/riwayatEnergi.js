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
    var epochStart;
    document.getElementById("terapkan").onclick = function() {
        var counter = 0;
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        
        if ((date == '') || (time == '')) {
            alert('Tidak lengkap');
        } else {
            epochStart = moment(`${date} ${time}`).unix();
            var epochEnd = epochStart + 3600;
            document.getElementById("grafikPerJam").style.display = "block";
            // document.getElementById("cardBpm").style.display = "block";
            // document.getElementById("cardKondisi").style.display = "block";

            dayaRef.orderByKey().startAt(epochStart.toString()).endAt(epochEnd.toString()).once('value', seconds => {
                seconds.forEach(second => {
                    myChart.data.labels.push(second.key);
                    myChart.data.datasets[0].data.push(second.val());
                    
                });
                myChart.update(0);
            });
        }
    }




    ////////////////////////////////////////////////////////////////////////// setup graph
    var ctx = document.getElementById("myChart").getContext('2d');

    var gradientFill = ctx.createLinearGradient(0,0,0,200);
    gradientFill.addColorStop(0, "rgba(241, 241, 241, 0)");
    gradientFill.addColorStop(1, "rgba(41, 128, 185,0.1)");

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: ' Daya',
                data: [],
                borderColor: "#2980b9",
                borderWidth: 2,
                backgroundColor: gradientFill,
                radius: 0
            }]
        },
        options: {
            tooltips: {
                bodySpacing: 4,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
                xPadding: 40,
                yPadding: 20,
                caretPadding: 10,
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = " Daya: "
                        label += tooltipItem.yLabel + "W";
                        return label;
                    },
                    title: function(tooltipItem, data) {
                        var epochJS = Number(tooltipItem[0].xLabel) * 1000;
                        var time = moment(new Date(epochJS)).format('HH:mm:ss');
                        return `Waktu: ${time}`;
                    }
                }
            },
            layout: {
                padding:{left:0,right:0,top:0,bottom:0}
            },
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    // ticks: {
                    //     suggestedMin: 0,
                    //     suggestedMax: 50,
                    //     stepSize: 10
                    // },
                    display:0,
                    gridLines:0,
                    gridLines: {
                        zeroLineColor: "#2980b9",
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    // position: 'top',
                    // ticks: {
                    //     callback: function(value, index, values) {
                    //         return ((value % 2 == 0) ? moment(new Date(value*1000)).format('HH:mm:ss') : '');
                    //         // return moment(new Date(value*1000)).format('HH:mm:ss');
                    //     }
                    // },
                    display: 0,
                    gridLines: 0,
                    ticks: {display: false}
                }]
            },
            legend: {
                display: false
            }
        }
    });
}())