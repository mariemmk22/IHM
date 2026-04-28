const bcrypt = require("bcryptjs");
const sequelize = require("./src/config/bd");
const Admin = require("./src/models/admin");

async function createAdmin() {
  await sequelize.authenticate();

  const nom = "Admin";
  const email = "admin@admin.com";
  const motDePasse = "admin123";

  const hashedPassword = await bcrypt.hash(motDePasse, 10);

  const [admin, created] = await Admin.findOrCreate({
    where: { email },
    defaults: { nom, motDePasse: hashedPassword },
  });

  if (created) {
    console.log("✅ Compte admin créé :");
  } else {
    console.log("ℹ️  Admin déjà existant :");
  }

  console.log(`   Email    : ${email}`);
  console.log(`   Password : ${motDePasse}`);

  await sequelize.close();
}

createAdmin().catch(console.error);
