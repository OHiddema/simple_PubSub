class Runner {
    constructor(bibNumber) {
        this.bibNumber = bibNumber;
        this.lapTimes = [];
    }

    addLap() {
        let d = new Date();
        lapTimes.push(d);
    }
}

class Stadium {
    constructor(name, location, capacity) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.competitors = [];
    }

    createCompetitors(n){
        for (let i = 1; i <= n; i++) {
            this.competitors.push(new Runner(i));
        }
    }
}

let myStadium = new Stadium('Olympisch Stadion', 'Amsterdam', 10000);
myStadium.createCompetitors(8);
// competitors [0..7]
console.log(myStadium.competitors[7].bibNumber);