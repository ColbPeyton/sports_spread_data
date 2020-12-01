const dotenv = require('dotenv');
dotenv.config();

const key = process.env.KEY;
const axios = require('axios');
const fs = require('fs');


const sport = 'basketball_ncaab';
const region = 'us';
const mkt = 'spreads'

const exclude = ["PointsBet (US)", "LowVig.ag", "SugarHouse", "Unibet", "BetRivers"]

const sports = `https://api.the-odds-api.com/v3/sports/?apiKey=${key}`;
const basketball = `https://api.the-odds-api.com/v3/odds/?apiKey=${key}&sport=${sport}&region=${region}&mkt=${mkt}`;
async function makeRequest(){
    await axios.get(basketball, {
        headers: {
          'Access-Control-Allow-Origin': true,
        },
        })
    .then((response)=>{
        const data = response.data.data;
        const output = [];
        data.forEach(d => {
            const team1 = d.teams[0];
            const team2 = d.teams[1];
            let choice = {name: '', point: 0};
            const sites = [];

            if(d.sites.length > 0){
                for(let i = 0; i < d.sites.length; i++){
                    if(!exclude.includes(d.sites[i].site_nice)){
                        sites.push(
                            {
                                name : d.sites[i].site_nice,
                                odds : d.sites[i].odds.spreads.odds,
                                points : d.sites[i].odds.spreads.points
                            }
                        )
                    }
                }
            }
            output.push(
                {
                    team1: team1,
                    team2: team2,
                    sites: sites,
                    choice: choice
                })
        })

        createFile(output);
        
    })
    .catch((error)=>{
        console.log(error)
    })
}


function createFile(arr){
    var filename = 'data.json';
    var str = JSON.stringify(arr, null, 4);
    
    fs.writeFile(filename, str, function(err){
        if(err) {
            console.log(err)
        } else {
            console.log('File written!');
        }
    });
}
makeRequest()
