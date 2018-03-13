const rp = require('request-promise');

const bounds= "0.17578097424708533,10.1953125,49.03786794532644,161.19140625";
// const bounds= "-9.96885060854611,64.86328125,53.64463782485651,147.83203125";
// const bounds= "21.891128553399447,108.57341766357422,22.024863869070725,108.73546600341797";
const generateKit = "http://118.70.72.15:2223/kit/generate";
const updateKit = "http://118.70.72.15:2223/kit";
const urlAllKit = `https://api.waqi.info/mapq/bounds/?bounds=${bounds}`;
const urlDataKit = "http://118.70.72.15:2223/data";
const token_admin = "293c1d517597670899f99b1d678d0877eaa882d9829ad2e67e450f78db7044811d2b41f12fdf42eab9eb8f2a39a3750a27f2fb4e605447b49449bfdcc8c87f92";
const token_user = "f24e04379ff1cc6c50a93dd3fd93921e2a3b672eec517e1e5c168fc5bfd5080a79638ff24c94d79a46fcae92bd7d24fb6b9641c60d022d46636557c87332b904";

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
    body: {
      token: token_admin
    },
    json: true // Automatically parses the JSON string in the response
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


let data;
rp(optionsAllKit)
.then( result => {
    result.forEach((kit, index) => {
        // console.log(kit.x);

        setTimeout(() => {
            // generate kit
            rp(optionsGenerateKit)
                .then(kitID => {
                data = {
                    "Name": `${kit.x}`,
                    "Location": [ kit.lat, kit.lon ],
                    "token": token_user
                };
                console.log(JSON.stringify(data));
                rp(optionsUpdateKit(kitID.KitID, data));
                if(index === result.length - 1)
                    console.log("\ndone");
            });
            // console.log(index);
        }, 500*(index + 1));
    });
});
