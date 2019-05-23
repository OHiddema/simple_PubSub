// creates a filled div element in a grid
function createDiv(gridName, node) {
    grid = document.getElementById(gridName);
    newDiv = document.createElement('div');
    node = document.createTextNode(node);
    newDiv.appendChild(node);
    grid.appendChild(newDiv);
}

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
        let lastLaptimes = new Map();
        let startTimes = new Map();

        var mySubscriber = function (msg, map) {
            let name = map.get('name');
            let bib = map.get('bib');
            let timestamp = map.get('timestamp');
            let gridName = 'grid-container';

            if (typeof lastLaptimes.get(bib) === "undefined") {
                startTimes.set(bib, timestamp);
            } else {
                lapTime = timestamp - lastLaptimes.get(bib);
                totalTime = timestamp - startTimes.get(bib);
                createDiv(gridName, bib);
                createDiv(gridName, name);
                createDiv(gridName, lapTime);
                createDiv(gridName, totalTime);
            }
            lastLaptimes.set(bib, timestamp);
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
        let startTimes = new Map();
        let countLaps = new Map();

        var mySubscriber = function (msg, map) {
            let name = map.get('name');
            let bib = map.get('bib');
            let timestamp = map.get('timestamp');
            let gridName = 'raceResults';

            if (typeof countLaps.get(bib) === "undefined") {
                startTimes.set(bib, timestamp);
                countLaps.set(bib, 0);
            } else {
                if (countLaps.get(bib) == 1) { //athlete reaches finish
                    if (countFinished == 0) { //first athlete finishes                        
                        timestampFirstFinished = timestamp;
                        timeGap = 0;
                    } else {
                        timeGap = timestamp - timestampFirstFinished;
                    }
                    countFinished++;
                    createDiv(gridName, countFinished);
                    createDiv(gridName, name);
                    createDiv(gridName, timestamp - startTimes.get(bib));
                    createDiv(gridName, timeGap);
                } else {
                    countLaps.set(bib, countLaps.get(bib)+1);
                }
            }
        };
        var token = PubSub.subscribe('Laptime', mySubscriber);
    }
}

// The subscriber subscribes :-)
subscriberResults.subscribe();

