const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number
  },
  role: {
    type: [{
      type: String,
    }
    ],
    default: ['Developer']
  },
  discordName: {
    type: String,
  },
  discordId: {
    type: String,
  },
  avatar: {
    type: String,
    default: 'default'
  },
  ethWallet: {
    type: String,
  },
  polkaWallet: {
    type: String,
  },
  solanaWallet: {
    type: String,
  },
  btcWallet: {
    type: String,
  },
  cosmosWallet: {
    type: String,
  },
  techStack: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
