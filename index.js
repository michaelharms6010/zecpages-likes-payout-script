const axios = require("axios");
const {exec} = require("child_process");
const { send } = require("process");
let zaddrs;

exec("C:\\Users\\BrunchTime\\src\\likepayscript\\zecwallet-cli.exe sync", (err, stdout, stderr) => {
    if (err) return

    
    axios.get("https://be.zecpages.com/board/dailylikes")
    .then(r => {
        zaddrs = r.data;
        payLikes(zaddrs);
    })
    .catch(err => console.log(err))
        
    // payLikes({"zs18j6k3llzrtnepw3hl3cufu6lg2zy5nhg7knda9vc3smjjpl9n8y6w69cjp7fj020m4wd76kvyg7": 1})
})

function payLikes(zaddr_likes) {
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

    console.log(`zecwallet-cli.exe send ${JSON.stringify(JSON.stringify(sendParams))}`)
    exec(`C:\\Users\\BrunchTime\\src\\likepayscript\\zecwallet-cli.exe send ${JSON.stringify(JSON.stringify(sendParams))}`, (err, stdout, stderr) => {
        console.log(err)
        console.log(stdout)
        console.log(stderr)
    })
}