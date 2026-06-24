const bcryptjs = require("bcryptjs");

async function generate() {
  const hash = await bcryptjs.hash("Shittu123", 10);
  console.log(hash);
}

generate();