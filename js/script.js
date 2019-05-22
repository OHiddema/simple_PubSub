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
let athlete = [];
athlete.push(new Runner(1, 'Nijel Amos'));
athlete.push(new Runner(2, 'Emmanuel Kipkurui Korir'));
athlete.push(new Runner(3, 'Donavan Brazier'));
athlete.push(new Runner(4, 'Abubaker Haydar Abdalla'));
athlete.push(new Runner(5, 'Jonathan Kitilit'));
athlete.push(new Runner(6, 'Cornelius Tuwei'));
athlete.push(new Runner(7, 'Adam Kszczot'));
athlete.push(new Runner(8, 'Wyclife Kinyamal'));

// Subscriber object
var subscriber = {
    subscribe: function () {
        var lapTime;
        var totalTime;
        lastLaptimes = [];
        startTimes = [];
        var mySubscriber = function (msg, data) {

            var grid, newDiv, node;

            if (typeof lastLaptimes[data.bib] === "undefined") {
                console.log('bibnr ' + data.bib + ' has started');
                startTimes[data.bib] = data.timestamp;
            } else {
                lapTime = data.timestamp - lastLaptimes[data.bib];
                totalTime = data.timestamp - startTimes[data.bib];
                console.log('bibnr: ' + data.bib, 'lap time: ' + lapTime, 'total time: ' + totalTime);

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

subscriber.subscribe();

function startMatch() {
    function getRandomInterval(min, max) {
        return Math.random() * (max - min) + min;
    }    
    // the athletes start
    for (let i = 0; i < athlete.length; i++) {
        setTimeout(function () { athlete[i].addLap() }, 0);
    }
    // first round
    for (let i = 0; i < athlete.length; i++) {
        setTimeout(function () { athlete[i].addLap() }, getRandomInterval(1500, 2500));
    }
    // second round
    for (let i = 0; i < athlete.length; i++) {
        setTimeout(function () { athlete[i].addLap() }, getRandomInterval(3000, 5000));
    }    
}

startMatch();
