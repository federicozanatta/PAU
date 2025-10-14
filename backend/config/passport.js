const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Cliente = require('../models/cliente.model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Cliente.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const nombre = profile.displayName;

        let cliente = await Cliente.findOne({ where: { email } });

        if (!cliente) {
          cliente = await Cliente.create({
            nombre,
            email,
            googleId: profile.id,
            authProvider: 'google',
          });
        } else if (!cliente.googleId) {
          await cliente.update({
            googleId: profile.id,
            authProvider: cliente.authProvider ? `${cliente.authProvider},google` : 'google',
          });
        }

        return done(null, cliente);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
