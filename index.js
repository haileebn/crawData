const express = require('express');
const router = express();
const rp = require('request-promise');

const bounds= "-9.96885060854611,64.86328125,53.64463782485651,147.83203125";
const generateKit = "http://118.70.72.15:2223/kit/generate";
const updateKit = "http://118.70.72.15:2223/kit";
const urlAllKit = `https://api.waqi.info/mapq/bounds/?bounds=${bounds}`;
const urlDataKit = "http://118.70.72.15:2223/data";

const port = process.env.PORT || 3000;

const address_host = process.env.HOSTNAME || `https://crawdata.herokuapp.com`;

const optionsLastRecord = function (x) {
    return {
        method: 'GET',
        uri: `https://api.waqi.info/api/widget/@${x}/widget.v1.json`,
        headers: {
            'content-type': 'application/json; charset=utf-8', // Is set automatically
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        },
        resolveWithFullResponse: true,
        json: true // Automatically parses the JSON string in the response
    }
};

const optionsAllKit = {
    method: 'GET',
    uri: urlAllKit,
    headers: {
        'content-type': 'application/json; charset=utf-8', // Is set automatically
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    },
    json: true // Automatically parses the JSON string in the response
};

const optionsGenerateKit = {
    method: 'POST',
    uri: generateKit,
    headers: {
        'content-type': 'application/json; charset=utf-8', // Is set automatically
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    },
    // json: true // Automatically parses the JSON string in the response
};

const optionsUpdateKit = function (kitID, data) {
    // console.log(data);
    return {
        method: 'PUT',
        uri: `${updateKit}/${kitID}`,
        body: data,
        headers: {
            'content-type': 'application/json; charset=utf-8', // Is set automatically
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        },
        json: true // Automatically parses the JSON string in the response
    };
};

const optionsUpdateLastKit = {
        method: 'GET',
        uri: `${address_host}/all`,
        // uri: `${address_host}/all`,
        // body: data,
        headers: {
            'content-type': 'application/json; charset=utf-8', // Is set automatically
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        },
        // json: true // Automatically parses the JSON string in the response
    };

const optionsGetAllKit = {
    method: 'GET',
    uri: `${updateKit}/all`,
    // body: data,
    headers: {
        'content-type': 'application/json; charset=utf-8', // Is set automatically
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    },
    json: true // Automatically parses the JSON string in the response
};

const optionsAddLastDataKit = function(data){
    return {
        method: 'POST',
            uri: urlDataKit,
        body: data,
        headers: {
        'content-type': 'application/json; charset=utf-8', // Is set automatically
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    },
        json: true // Automatically parses the JSON string in the response
    };
};

router.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("Hello!!!");
});


router.get('/all', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let data;
    // rp(optionsAllKit)
    //     .then( result => {
    //         result.forEach((kit, index) => {
    //             // console.log(kit.x);
    //
    //             setTimeout(() => {
    //                 // generate kit
    //                 rp(optionsGenerateKit)
    //                     .then(kitId => {
    //                     console.log(kitId);
    //                     const kitID = JSON.parse(kitId);
    //                     data = {
    //                         "Name": `${kit.x}`,
    //                         "Location": [ kit.lat, kit.lon ]
    //                     };
    //                     console.log(JSON.stringify(data));
    //                     rp(optionsUpdateKit(kitID.KitID, data));
    //                     if(index === result.length - 1)
                            res.send("ok");
        //             });
        //         //     // console.log(index);
        //         }, 500*(index + 1));
        //     });
        // });

    // const data = [
    //     {
    //         "KitID": "FAirKit_000001",
    //         "Name": "Fimo 518",
    //         "Location": [21.038189,105.7827482],
    //         "PM2.5": getRandomInt(40, 500),
    //         "CreatedTime": 1508383622
    //     },
    //     {
    //         "KitID": "FAirKit_000002",
    //         "Name": "Fimo 408",
    //         "Location": [21.038189,105.7837482],
    //         "PM2.5": getRandomInt(40, 100),
    //         "CreatedTime": 1508383620
    //     },
    // ];
    // res.send({data});
});

rp(optionsUpdateLastKit)
    .then( success => {
        if(success === "ok") {
            console.log("\ndone");
            lastDataAllKit();
        }
        else console.log("fail");
    });
function lastDataAllKit() {

    const data = {
        "PM2.5": 0,
        "Temperature": 0,
        "Humidity": 0,
        "PM1.0": 0,
        "PM10": 0,
        "KitID": "",
        "Time" : 0
    };
    console.log("\nNEW DATA");

    // All kit FairNet
    rp(optionsGetAllKit)
        .then((AllKit) => {
            AllKit.forEach((kit, index) => {

                rp(optionsAllKit)
                    .then((kitMap) => {
                        kitMap.forEach((kitmap, index) => {
                            if(kit.Name === kitmap.x){

                                // console.log(kit.Name, kit.KitID, "***" + kitmap.x);
                                // setTimeout(() => {
                                    rp(optionsLastRecord(kitmap.x))
                                        .then( lastdata => {
                                            console.log(kitmap.x, lastdata);
                                            // data["Time"] = lastdata.rxs.obs[0].msg.model.timestamp*1000;
                                            // lastdata.rxs.obs[0].msg.model.iaqi.forEach((iaqi, index) => {
                                            //     data["KitID"] = kit.KitID;
                                            //     if(iaqi.p === "pm1") data["PM1"] = iaqi.v[0];
                                            //     if(iaqi.p === "pm25") data["PM2.5"] = iaqi.v[0];
                                            //     if(iaqi.p === "pm10") data["PM10"] = iaqi.v[0];
                                            //     if(iaqi.p === "t") data["Temperature"] = iaqi.v[0];
                                            //     if(iaqi.p === "h") data["Humidity"] = iaqi.v[0];

                                            //     if(index === lastdata.rxs.obs[0].msg.model.iaqi.length - 1){
                                            //         console.log("Add Success", JSON.stringify(data), "\n");
                                            //         rp(optionsAddLastDataKit(data))
                                            //             .then()
                                            //             .catch((err) => {
                                            //                 console.log("Add Fail");
                                            //             });
                                            //     }
                                            // });
                                            // console.log("+++++++++++");
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                // }, 1000*(1 + index));

                            }
                        });
                    });
            })

        });
    setTimeout(() => {
        console.log("\nend 5minute");
        lastDataAllKit()
    }, 5*60*1000);
}

//
function fakeRecordOneKit(name) {
    let PM = getRandomInt(40, 500),
        temp = getRandomInt(20, 40),
        hud = getRandomInt(40, 80);
    let obj = {
        KitID:  name,
        data: {
            'PM2.5': PM,
            'temp': temp,
            'hud': hud,
        }
    };
    return obj;
}

function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function toDigits(value, option) {
    let result = String(value)
    while(result.length < option) result = '0' + result
    return result
}

router.listen(port, () => {
    console.log(`server: ${port}`);
});