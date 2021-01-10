const axios = require("axios");
const {exec} = require("child_process");
const { send } = require("process");
var fs = require('fs');
var filename='./paidlikes.txt';
let zaddrs;

fs.readFile(filename, 'utf8', function(err, data) {
        if (err) return err;
        let paidlikes = JSON.parse(data)

        axios.get("https://be.zecpages.com/board/payableposts")
            .then(r => {
                let newlikes = r.data.total_likes;
                let payments = {}
                Object.keys(newlikes).forEach(zaddr => {
                    var difference;
                    if (!paidlikes[zaddr]) {
                        difference = +newlikes[zaddr]
                    } else {
                        difference = +newlikes[zaddr] - +paidlikes[zaddr]
                    }
                    if (difference > 0) payments[zaddr] = difference;
                })

                payLikes(payments, newlikes)
            })
            .catch(err => console.log(err))

});


function payLikes(zaddr_likes, newlikes) {
    if (Object.keys(zaddr_likes).length === 0) return
    const zaddrs = Object.keys(zaddr_likes)
    const sendParams = []
    zaddrs.forEach(zaddr => {
        sendParams.push({
            address: zaddr,
            amount: (50000 * +zaddr_likes[zaddr]),
            memo: `Zecpages Like Payout - ${new Date().toDateString()}`
        })
    })

    // overwrite with new like totals - Logfile holds more verbose, auditable chain
exec(`echo "${JSON.stringify(JSON.stringify(newlikes))}" > paidlikes.txt`, (err, stdout, stderr) => {})

    exec(`/home/ubuntu/memo-monitor-lite/src/zecwallet-cli send ${JSON.stringify(JSON.stringify(sendParams))}`, (err, stdout, stderr) => {
        console.log(err)
        console.log(stdout)
        console.log(stderr)
    })
}