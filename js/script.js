class Runner {
    constructor(bibNumber, name) {
        this.name = name;
        this.bibNumber = bibNumber;
        this.lapTimes = [];
    }

    addLap() {
        let d = new Date();
        this.lapTimes.push(d);
        PubSub.publish('Laptime', [this.name, this.bibNumber, d]);
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


var mySubscriber = function (msg, arr) {
    console.log(msg, arr[0], arr[1], arr[2]);
};

var token = PubSub.subscribe('Laptime', mySubscriber);

for (let i=0; i< athlete.length; i++) {
    athlete[i].addLap();
}
