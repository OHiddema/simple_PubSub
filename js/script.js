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


// var mySubscriber = function (msg, arr) {
//     var lastLap = arr[2][arr[2].length-1];
//     console.log(msg, arr[0], arr[1], lastLap);
// };

// var token = PubSub.subscribe('Laptime', mySubscriber);

// ---------------------------------------------------------------------------------

var subscriber = {
    subscribe: function() {
        var mySubscriber = function (msg, data) {
            console.log(msg, data.name, data.bib, data.timestamp);
        };
    var token = PubSub.subscribe('Laptime', mySubscriber);
    }
}

subscriber.subscribe();

for (let i=0; i< athlete.length; i++) {
    athlete[i].addLap();
}