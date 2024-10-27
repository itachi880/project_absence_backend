const crypto = require("crypto"); // Function to hash the password
const HashPass = (pass) => {
  return crypto
    .createHash("sha512")
    .update(pass + process.env.SALT_JWT)
    .digest("hex");
};

// Function to verify the password hash
const VerifyHash = (hash, pass) => {
  return HashPass(pass) === hash; // Compare the hashed input with the stored hash
};

// Export the functions
module.exports = {
  HashPass,
  VerifyHash,
};
