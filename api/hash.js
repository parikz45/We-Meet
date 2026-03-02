const bcrypt = require("bcrypt");

async function generate() {
  const hash = await bcrypt.hash("Shittu123", 10);
  console.log(hash);
}

generate();