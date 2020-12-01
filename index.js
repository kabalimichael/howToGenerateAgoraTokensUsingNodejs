
const express = require('express');
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')

const PORT = 8081;const APP_ID ="d3b6bfe3b8bc4346a0e24da48eb426d6"; // process.env.APP_ID;
const APP_CERTIFICATE = '976c2e9f13304323ab2f0a54a15ddd90'; //process.env.APP_CERTIFICATE;
const app = express();

const generateAccessToken = (req, resp) => {
  console.log('.......... Called GET WAY API .....................');
    try {
    resp.header('Access-Control-Allow-Origin', '*');
    const channelName = req.query.channelName;
    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
      }

        // get uid 
  let uid = req.query.uid;
  if(!uid || uid == '') {
    uid = 0;
  }
  // get role
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role == 'publisher') {
    role = RtcRole.PUBLISHER;
  }
  // get the expire time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

  return resp.json({ 'token': token });
} catch(e){
    console.log(e);
}

 };

 const nocache = (req, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
  };

app.get('/access_token', nocache, generateAccessToken);



// Rtc Examples
// const appID = 'd3df5d4f9cfe4d33a41b3d839272c45a';
// const appCertificate = '976c2e9f13304323ab2f0a54a15ddd90';
// const channelName = 'flutter_live_stream'; // must be the same as the user 
// const uid = 2882341273;
// const account = "2882341273";
// const role = RtcRole.PUBLISHER;

// const expirationTimeInSeconds = 3600

// const currentTimestamp = Math.floor(Date.now() / 1000)

// const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

// // Build token with uid
// const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
// console.log("Token With Integer Number Uid: " + tokenA);

// // Build token with user account
// const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
// console.log("Token With UserAccount: " + tokenB);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
  