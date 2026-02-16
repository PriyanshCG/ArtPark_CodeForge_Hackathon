const fs = require('fs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Mock environment
const clientID = '389624065290-p47t1gvn1jdalq8endks6j6ndepla0pp.apps.googleusercontent.com';
const clientSecret = 'test-client-secret';
const callbackURL = 'https://adaptive-onboarding-backend.onrender.com/api/auth/google/callback';

// Configure Strategy exactly as in the app
const strategy = new GoogleStrategy(
  {
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    proxy: true,
  },
  (accessToken, refreshToken, profile, done) => {}
);

// Manually trigger the redirect URL generation
const options = {
    scope: ['openid', 'profile', 'email'],
    session: false
};

// Monkey-patch the internal 'redirect' method
strategy.redirect = function(url) {
    console.log('--- PROOF START ---');
    console.log('FULL_URL_START');
    console.log(url);
    console.log('FULL_URL_END');
    console.log('--- PROOF END ---');
    process.exit(0);
};

// Mock request
const req = {
    url: '/api/auth/google',
    headers: {
        host: 'localhost:5000'
    },
    query: {}
};

try {
    strategy.authenticate(req, options);
} catch (e) {
    // console.log('Caught:', e.message);
}
