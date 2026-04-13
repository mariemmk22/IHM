const app = require("./app");
require("./config/database"); // ✅ Lance createDatabase + sync automatiquement

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});