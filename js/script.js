// Runners are Publishers
class Runner {
    constructor(bibNumber, name) {
        this.name = name;
        this.bibNumber = bibNumber;
        this.lapTimes = [];
    }

    addLap() {
        let d = new Date().getTime();  //time in milliseconds since 1-1-1970
        this.lapTimes.push(d);
        PubSub.publish('Laptime', { name: this.name, bib: this.bibNumber, timestamp: d });
    }
}

// create an array of 8 runners
let athletes = [];
athletes.push(new Runner(1, 'Nijel Amos'));
athletes.push(new Runner(2, 'Emmanuel Kipkurui Korir'));
athletes.push(new Runner(3, 'Donavan Brazier'));
athletes.push(new Runner(4, 'Abubaker Haydar Abdalla'));
athletes.push(new Runner(5, 'Jonathan Kitilit'));
athletes.push(new Runner(6, 'Cornelius Tuwei'));
athletes.push(new Runner(7, 'Adam Kszczot'));
athletes.push(new Runner(8, 'Wyclife Kinyamal'));

// Subscriber object
var subscriber = {
    subscribe: function () {
        var lapTime;
        var totalTime;
        lastLaptimes = [];
        startTimes = [];
        var mySubscriber = function (msg, data) {

            // console.log('Test first');

            var grid, newDiv, node;

            if (typeof lastLaptimes[data.bib] === "undefined") {
                startTimes[data.bib] = data.timestamp;
            } else {
                lapTime = data.timestamp - lastLaptimes[data.bib];
                totalTime = data.timestamp - startTimes[data.bib];

                grid = document.getElementById('grid-container');

                newDiv = document.createElement('div');
                node = document.createTextNode(data.bib);
                newDiv.appendChild(node);
                grid.appendChild(newDiv);

                newDiv = document.createElement('div');
                node = document.createTextNode(data.name);
                newDiv.appendChild(node);
                grid.appendChild(newDiv);

                newDiv = document.createElement('div');
                node = document.createTextNode(lapTime);
                newDiv.appendChild(node);
                grid.appendChild(newDiv);

                newDiv = document.createElement('div');
                node = document.createTextNode(totalTime);
                newDiv.appendChild(node);
                grid.appendChild(newDiv);
            }
            lastLaptimes[data.bib] = data.timestamp;
        };
        var token = PubSub.subscribe('Laptime', mySubscriber);
    }
}

// The subscriber subscribes :-)
subscriber.subscribe();

// This function is triggered from the button on the page
function startMatch() {
    function getRandomInterval(min, max) {
        return Math.random() * (max - min) + min;
    }

    // the athletes start
    for (let i = 0; i < athletes.length; i++) {
        setTimeout(function () { athletes[i].addLap() }, 0);
    }

    // first round
    for (let i = 0; i < athletes.length; i++) {
        setTimeout(function () { athletes[i].addLap() }, getRandomInterval(2500, 3500));
    }

    // second round
    for (let i = 0; i < athletes.length; i++) {
        setTimeout(function () { athletes[i].addLap() }, getRandomInterval(5500, 6500));
    }
}

// Define a second subscriber
// - Save the start time of each athlete
// - Keep track of the number of laps for each athlete
// - Race ends at 2 laps. When first athlete reaches 2 laps, save its finish time,
// to calculate the gaps of the other athletes.
var subscriberResults = {
    subscribe: function () {
        var lapTime;
        var totalTime;
        var countFinished = 0;
        var timestampFirstFinished = 0;
        var timeGap = 0;
        lastLaptimes = [];
        startTimes = [];
        countLaps = [];
        var mySubscriber = function (msg, data) {

            var grid, newDiv, node;

            console.log('Test!!!!');

            if (typeof countLaps[data.bib] === "undefined") {
                startTimes[data.bib] = data.timestamp;
                countLaps[data.bib] = 0;
            } else {
                if (countLaps[data.bib] == 2) { //athlete reaches finish
                    if (countFinished == 0) {
                        // first athlete finishes
                        timestampFirstFinished = data.timestamp;
                        timeGap = 0;
                    } else {
                        timegap = data.timestamp -timestampFirstFinished;
                    }
                    countFinished++;
                    // output data to screes
                    console.log(data.name +  ' Finished!');
                } else {
                    countLaps[data.bib]++;
                }
                // lapTime = data.timestamp - lastLaptimes[data.bib];
                // totalTime = data.timestamp - startTimes[data.bib];

                // grid = document.getElementById('grid-container');

                // newDiv = document.createElement('div');
                // node = document.createTextNode(data.bib);
                // newDiv.appendChild(node);
                // grid.appendChild(newDiv);

                // newDiv = document.createElement('div');
                // node = document.createTextNode(data.name);
                // newDiv.appendChild(node);
                // grid.appendChild(newDiv);

                // newDiv = document.createElement('div');
                // node = document.createTextNode(lapTime);
                // newDiv.appendChild(node);
                // grid.appendChild(newDiv);

                // newDiv = document.createElement('div');
                // node = document.createTextNode(totalTime);
                // newDiv.appendChild(node);
                // grid.appendChild(newDiv);
            }
            lastLaptimes[data.bib] = data.timestamp;
        };
        var token = PubSub.subscribe('Laptime', mySubscriber);
    }
}

// The subscriber subscribes :-)
subscriberResults.subscribe();
