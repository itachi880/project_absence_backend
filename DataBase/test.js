const dotenv = require("dotenv"); // Ensure dotenv is loaded to access environment variables
const User = require("../Models/User"); // Adjust the path to your User model
const { HashPass } = require("../utils/hashPass"); // Path to the file where HashPass is defined
const connectDB = require("./index"); // Adjust path to your connectDB file

dotenv.config({ path: "../.env" }); // Load environment variables

async function updateUserPasswords() {
  try {
    // Find all users (including deleted ones)
    const users = await User.find();

    // Loop through each user
    for (let user of users) {
      // Convert CIN to uppercase
      const updatedCin = user.cin.toUpperCase();

      // Hash the uppercase CIN to set as the password
      const hashedPassword = HashPass(updatedCin);

      // Update the user's CIN and password
      user.cin = updatedCin;
      user.password = hashedPassword;

      // Save the user with the updated CIN and password
      await user.save();

      console.log(`User ${user.login} updated successfully.`);
    }

    console.log("All user passwords have been updated.");
  } catch (error) {
    console.error("Error updating users:", error);
  }
}

// Connect to MongoDB and run the update function
connectDB() // Use your connection logic
  .then(() => {
    console.log("Connected to MongoDB");
    updateUserPasswords();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
