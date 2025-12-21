import { db } from "../db";

async function checkDatabase() {
  try {
    await db.execute("SELECT 1");
    console.log("Database is available");
    return true;
  } catch (error) {
    console.log(
      "Database is not available:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

if (require.main === module) {
  checkDatabase().then((available) => {
    process.exit(available ? 0 : 1);
  });
}

export { checkDatabase };
