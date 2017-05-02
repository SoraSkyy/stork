const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// TODO: Decide the structure of the User model
const UserSchema = Schema(
  {
    email: { type: String, required: true, max: 100 },
    password: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    profile_id: { type: String, max: 100 },
    profile_name: { type: String, required: false, max: 100 },
  },
);

// Virtual for author's URL to obtain the particular instance
UserSchema.virtual('url').get(() => `/profile/ ${this.profile_id}`);

// Export model
module.exports = mongoose.model('User', UserSchema);
