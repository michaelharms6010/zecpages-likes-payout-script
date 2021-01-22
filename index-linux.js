const axios = require("axios");
const {exec} = require("child_process");
const { send } = require("process");
var fs = require('fs');
var filename='/home/ubuntu/sender/paidlikes.txt';

fs.readFile(filename, 'utf8', function(err, data) {
        if (err) return;
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
                console.log(payments)
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
            memo: `Zecpages Like Payout - ${new Date().toUTCString()}`
        })
    })


exec(`echo "${JSON.stringify(JSON.stringify(newlikes))}" > /home/ubuntu/sender/paidlikes.txt`, (err, stdout, stderr) => {})
    exec(`/home/ubuntu/memo-monitor-lite/src/zecwallet-cli --server=https://lightwalletd.zecpages.com:443 send ${JSON.stringify(JSON.stringify(sendParams))} >> /home/ubuntu/sender/cronrun.log`, (err, stdout, stderr) => {
        if (err) console.log(err)
        console.log(stdout)
        console.log(err)
        console.log(stderr)

    })
}