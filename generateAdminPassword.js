import bcrypt from "bcryptjs";

const password = "Mummys"; // The password the admin will actually use
const saltRounds = 10;

// Generate the hash synchronously
const hash = bcrypt.hashSync(password, saltRounds);

console.log("Hashed password to store in DB:", hash);
   