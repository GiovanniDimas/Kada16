import crypto from "crypto";

const hash = crypto.createHash("sha256");
hash.update(password);
const result = hash.digest("hex");

console.log(result);