import bcrypt from "bcryptjs";

const password = "adminkiwenda"; // your desired admin password
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("✅ Hashed password:", hash);
