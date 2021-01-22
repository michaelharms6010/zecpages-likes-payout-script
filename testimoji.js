const Base64 = require("js-base64");

const testString = "hi there 🧓👨👨"


console.log(testString)

var str = Base64.encode(testString)



console.log(testString === Base64.decode(str))
