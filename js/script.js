// import PubSub from 'pubsub-js'
// const PubSub = require('pubsub-js');

class Runner {
    constructor(bibNumber) {
        this.bibNumber = bibNumber;
        this.lapTimes = [];
    }

    addLap() {
        let d = new Date();
        this.lapTimes.push(d);
        PubSub.publish('Laptime', [this.bibNumber, d]);
    }
}

class Stadium {
    constructor(name, location, capacity) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.competitors = [];
    }

    createCompetitors(n) {
        for (let i = 1; i <= n; i++) {
            this.competitors.push(new Runner(i));
        }
    }
}

let myStadium = new Stadium('Olympisch Stadion', 'Amsterdam', 10000);
myStadium.createCompetitors(8);
// competitors [0..7]
// console.log(myStadium.competitors[7].bibNumber);


var mySubscriber = function (msg, arr) {
    console.log(msg, arr[0], arr[1]);
};

var token = PubSub.subscribe('Laptime', mySubscriber);
myStadium.competitors[0].addLap();