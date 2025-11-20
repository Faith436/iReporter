const bcrypt = require("bcryptjs");

const password = "wisdom1jeremiah123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
