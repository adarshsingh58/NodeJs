const {parse} = require('csv-parse')
const fs = require('fs')
const path = require('path')

const result = [];

function isHabitable(planetData) {
    if (planetData['koi_disposition'] === 'CONFIRMED' && planetData['koi_insol'] > 0.36 && planetData['koi_insol'] > 1.11
    && planetData['koi_prad'] < 1.6)
        return true;
    else
        return false;
}

fs.createReadStream(path.join("cumulative_2025.03.21_22.43.16.csv"))
    .pipe(parse(
        {
            comment: '#',
            columns: true
        }
    ))
    .on("data", (data) => {
        if (isHabitable(data))
            result.push(data);

    }).on("end", () => {
    console.log(`We have found ${result.length} habitable planets`);
    console.log(result.map((planet) =>{
        return planet['kepler_name'];
    }));
    console.log("No more data to read");
}).on("error", (error) => {
    console.log(`soome error occured ${error} here`);
});

parse()