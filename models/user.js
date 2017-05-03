const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// TODO: Decide the structure of the User model
const UserSchema = Schema({
    email: { type: String, required: true, max: 100 },
    password: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    profile_id: { type: String, max: 100 },
    profile_name: { type: String, required: true, max: 100 },
  }
);

// Virtual for author's URL to obtain the particular instance
// TODO: Assert that profile_name has no spaces
UserSchema.virtual('url').get(() => `/profile/ ${this.profile_name}`);

// Called in user creation to generate a hash for the password.
UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Called when verifying if the password is the same as the hashed password.
UserSchema.methods.validPassword = (password) => {
  return bcrypt.compare(password, this.password);
};

// Export model
module.exports = mongoose.model('User', UserSchema);
