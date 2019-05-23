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

        // create MAP object for publushing the data
        let myMap = new Map();
        myMap.set('name', this.name);
        myMap.set('bib', this.bibNumber);
        myMap.set('timestamp', d);
        PubSub.publish('Laptime', myMap);
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
        var mySubscriber = function (msg, map) {

            let name = map.get('name');
            let bib = map.get('bib');
            let timestamp = map.get('timestamp');

            var grid, newDiv, node;

            if (typeof lastLaptimes[bib] === "undefined") {
                startTimes[bib] = timestamp;
            } else {
                lapTime = timestamp - lastLaptimes[bib];
                totalTime = timestamp - startTimes[bib];

                grid = document.getElementById('grid-container');

                newDiv = document.createElement('div');
                node = document.createTextNode(bib);
                newDiv.appendChild(node);
                grid.appendChild(newDiv);

                newDiv = document.createElement('div');
                node = document.createTextNode(name);
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
            lastLaptimes[bib] = timestamp;
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
        setTimeout(function () { athletes[i].addLap() }, getRandomInterval(1000, 2000));
    }

    // second round
    for (let i = 0; i < athletes.length; i++) {
        setTimeout(function () { athletes[i].addLap() }, getRandomInterval(3000, 4000));
    }
}

// Define a second subscriber
var subscriberResults = {
    subscribe: function () {
        var countFinished = 0;  //number of athletes that have finished the race
        var timestampFirstFinished = 0;
        var timeGap = 0;
        startTimes = [];
        countLaps = [];
        var mySubscriber = function (msg, map) {

            let name = map.get('name');
            let bib = map.get('bib');
            let timestamp = map.get('timestamp');

            var grid, newDiv, node;

            if (typeof countLaps[bib] === "undefined") {
                startTimes[bib] = timestamp;
                countLaps[bib] = 0;
            } else {
                if (countLaps[bib] == 1) { //athlete reaches finish
                    if (countFinished == 0) { //first athlete finishes                        
                        timestampFirstFinished = timestamp;
                        timeGap = 0;
                    } else {
                        timeGap = timestamp -timestampFirstFinished;
                    }
                    countFinished++;

                    // write output to grid in HTML file
                    grid = document.getElementById('raceResults');

                    newDiv = document.createElement('div');
                    node = document.createTextNode(countFinished);
                    newDiv.appendChild(node);
                    grid.appendChild(newDiv);
    
                    newDiv = document.createElement('div');
                    node = document.createTextNode(name);
                    newDiv.appendChild(node);
                    grid.appendChild(newDiv);
    
                    newDiv = document.createElement('div');
                    node = document.createTextNode(timestamp-startTimes[bib]);
                    newDiv.appendChild(node);
                    grid.appendChild(newDiv);
    
                    newDiv = document.createElement('div');
                    node = document.createTextNode(timeGap);
                    newDiv.appendChild(node);
                    grid.appendChild(newDiv);
                } else {
                    countLaps[bib]++;
                }
            }
        };
        var token = PubSub.subscribe('Laptime', mySubscriber);
    }
}

// The subscriber subscribes :-)
subscriberResults.subscribe();