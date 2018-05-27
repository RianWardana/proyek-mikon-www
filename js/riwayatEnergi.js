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



    ////////////////////////////////////////////////////////////////////////// on button click
    document.getElementById("terapkan").onclick = function() {
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        
        if ((date == '') || (time == '')) {
            $.notify(
                { message: "Waktu belum dipilih." }, 
                { type: 'warning',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );
        } else {
            var epochStart = moment(`${date} ${time}`).unix();
            var epochEnd = epochStart + 3600;
            document.getElementById("cardKurvaBebanHarian").style.display = "none";
            document.getElementById("grafikPerJam").style.display = "block";
            document.getElementById("cardDayaAvg").style.display = "block";
            document.getElementById("cardEnergiTerpakai").style.display = "block";

            myChart.data.labels = [];
            myChart.data.datasets[0].data = [];

            dayaRef.orderByKey().startAt(epochStart.toString()).endAt(epochEnd.toString()).once('value', seconds => {
                // for (var now = epochStart; now <= epochEnd; now++) {
                //     let power = (seconds.val()[now] ? seconds.val()[now] : 0);
                //     myChart.data.labels.push(now);
                //     myChart.data.datasets[0].data.push(seconds.val()[now]);
                // }
                
                var counter = 0;
                var totalDaya = 0;
                var totalEnergi = 0;

                seconds.forEach(second => {
                    myChart.data.labels.push(second.key);
                    myChart.data.datasets[0].data.push(second.val());
                    totalDaya += Number(second.val());
                    totalEnergi += ( Number(second.val()) / 3000 );
                    counter++;
                });

                $("#dayaAvg").html((totalDaya/(counter == 0 ? 1 : counter)).toFixed(2));
                $("#energiTerpakai").html(totalEnergi.toFixed(2));
                myChart.update(0);
            });
        }
    }



    ////////////////////////////////////////////////////////////////////////// on button click
    document.getElementById("terapkanKBH").onclick = function() {
        var date = document.getElementById("dateKBH").value;
        
        if (date == '') {
            $.notify(
                { message: "Tanggal belum dipilih." }, 
                { type: 'warning',timer: 2000, placement: { from: 'bottom', align: 'right' } }
            );
        } else {
            var epochStart = moment(date).unix();
            var tanggal = (new Date(epochStart*1000)).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            $("#judulGrafik").html(`Kurva Beban - ${tanggal}`);

            document.getElementById("grafikPerJam").style.display = "block";
            document.getElementById("cardTimePerJam").style.display = "none";
            document.getElementById("cardKurvaBebanHarian").style.display = "block";
            document.getElementById("cardDayaAvg").style.display = "block";
            document.getElementById("cardEnergiTerpakai").style.display = "block";

            myChart.data.labels = [];
            myChart.data.datasets[0].data = [];

            var secondEpochStart = epochStart;
            var secondEpochEnd = secondEpochStart + 300;
            var minuteCount = 0;

            for (minuteCount = 0; minuteCount < 288; minuteCount++) {
                dayaRef.orderByKey().startAt(secondEpochStart.toString()).endAt(secondEpochEnd.toString()).once('value', seconds => {
                    if (seconds.val() == null) {
                        myChart.data.labels.push(secondEpochStart);
                        myChart.data.datasets[0].data.push(0);  
                    } 

                    else {
                        var count = 0;
                        var totalDaya = 0;

                        seconds.forEach(second => {
                            totalDaya += Number(second.val());
                            count++;
                        });

                        var dayaAvg = (totalDaya/count).toFixed(2);
                        myChart.data.labels.push(secondEpochStart);
                        myChart.data.datasets[0].data.push(dayaAvg);
                    }
                    secondEpochStart += 300;
                });
                secondEpochStart += 300;
                secondEpochEnd += 300;
            }

            myChart.update(0);
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
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 50,
                        stepSize: 10
                    },
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