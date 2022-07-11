const {google} = require ("googleapis");
require("dotenv").config();
//const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const nodemailer = require("nodemailer");
const oauth_link = "https://developers.google.com/oauthplayground/"
const {OAuth2} = google.auth;
const {CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN,EMAIL} = process.env;
const auth = new OAuth2(CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN,oauth_link)

exports.sendVerificationEmail = (email,name,url)=>{
    auth.setCredentials({
        refresh_token:REFRESH_TOKEN,
    })
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({  // simple mail transfer protocol
        service:"gmail",
        auth:{
            type:"OAuth2",
            user: EMAIL,
            clientId:CLIENT_ID,
            clientSecret:CLIENT_SECRET,
            refreshToken:REFRESH_TOKEN,
            accessToken,
        }
    });

    const mailOptions={
        from:EMAIL,
        to: email,
        subject: "Facebook-clone email verification",
        html:`<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
        <span> Action require:Activate your account. </span>
        </div>
        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto">
        <span>Hello ${name}</span>
        <div style="padding:20px 0">
        <span style="padding:1.5rem 0">
        You recently created facebook-clone profile.To complete
        registration,click on link below.
        </span>
        </div>
        <a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">
        Confirm your account
        </a>
        </div>`
    }
    stmp.sendMail(mailOptions,(err,res)=>{
    if(err)
    console.log(err)
    else
    return res;})
}