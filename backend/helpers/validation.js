const User = require("../models/User");

exports.validateEmail = ((email) => {
    return String(email).toLowerCase().match(/^([a-z\d\.-]+)@([a-z\d\.-]+)\.([a-z]{2,12})$/)
})

exports.validateLength = (text, min, max) => {
    if (text.length > max || text.length < min) {
        return false;
    } return true;
}

exports.validateUsername = async (username) => {
    let a = false;
    do {
        let check = await User.findOne({ username })
        if (check) {
            //change username
            username += (+new Date() * Math.random()).toString().substring(0, 1);
            // +new Date() .Dates written as numbers, specifies the number of milliseconds since January 1, 1970, 00:00:00.
            // substring(0,1) implies index 0 included , 1 not included.
            a = true;
        } else {
            a = false
        }
    } while (a)
    return username;
}