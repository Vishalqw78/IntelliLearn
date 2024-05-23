
import nodemailer from 'nodemailer'; 
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    try {
      const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
 
        oauth2Client.setCredentials({
          refresh_token: process.env.Refresh_token,
        });
 
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              console.log("*ERR: ", err)
              reject();
            }
            resolve(token); 
          });
        });
 
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.usermail,
            accessToken : accessToken.token,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.Refresh_token,
          },
        });
        return transporter;
    } catch (err) {
      return err
    }
  };
  const sendVerificationEmail = async (toEmail, url) => {
    const mailConfigurations = {
        from: process.env.usermail, // Your sender email
        to: toEmail,
        subject: 'Email Verification',
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               ${url} 
               Thanks`
    };
    try {
 
      let emailTransporter = await createTransporter();
      const info = await emailTransporter.sendMail(mailConfigurations);
      console.log('Email Sent Successfully');
        console.log(info);

    } catch (err) {
      console.log("ERROR: ", err)
    }
  };
export default sendVerificationEmail;