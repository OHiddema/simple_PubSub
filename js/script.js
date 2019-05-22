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
        PubSub.publish('Laptime', {name:this.name, bib:this.bibNumber, timestamp:d});
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

var subscriber = {
    subscribe: function() {
        var lapTime;
        lastLaptimes = [];
        var mySubscriber = function (msg, data) {
            if (typeof lastLaptimes[data.bib] === "undefined") {
                lapTime = 0; //athlete has started
                console.log(msg, data.name +  ' has started');
            } else {
                lapTime = data.timestamp - lastLaptimes[data.bib];
                console.log(msg, data.name, data.bib, lapTime);
            }
            lastLaptimes[data.bib] = data.timestamp;
        };
    var token = PubSub.subscribe('Laptime', mySubscriber);
    }
}

subscriber.subscribe();


var myLoop = setInterval(addlapForAll, 2000);
var lapCounter = 0;

function addlapForAll() {
    for (let i=0; i< athlete.length; i++) {
        athlete[i].addLap();
    }
    lapCounter++;
    if (lapCounter>2) {clearInterval(myLoop)}
}
