import { compare, hash } from "bcryptjs";

const stored = "$2b$12$sS0Penkq8H5J3ouPgAv2gOziAaQQbtBOBKYoyP3PMvHIzX8q7OM26";
const password = "titowardana2415";

console.log("Testing password:", password);
console.log("Against hash:", stored);

const match = await compare(password, stored);
console.log("Match:", match);

const fresh = await hash(password, 12);
console.log("Fresh hash:", fresh);

const match2 = await compare(password, fresh);
console.log("Fresh match:", match2);
