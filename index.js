const axios = require("axios");
const {exec} = require("child_process");
const { send } = require("process");
let zaddrs;

axios.get("https://be.zecpages.com/board/dailylikes")
.then(r => {
    zaddrs = r.data;
    payLikes(zaddrs);
})
.catch(err => console.log(err))

function payLikes(zaddr_likes) {
    const zaddrs = Object.keys(zaddr_likes)
    const sendParams = []
    zaddrs.forEach(zaddr => {
        sendParams.push({
            address: zaddr,
            amount: (50000 * +zaddr_likes[zaddr]),
            memo: `Zecpages Like Payout - ${new Date().toDateString()}`
        })
    })

    console.log(`zecwallet-cli.exe send ${JSON.stringify(JSON.stringify(sendParams))}`)
    exec(`zecwallet-cli send ${JSON.stringify(JSON.stringify(sendParams))}`, (err, stdout, stderr) => {
        console.log(err)
        console.log(stdout)
        console.log(stderr)
    })
}