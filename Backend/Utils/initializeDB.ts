const bcrypt = require("bcryptjs");

export async function initializeDB(pool: any) {
  const createCompaniesTable = `
    CREATE TABLE IF NOT EXISTS Utilizatori (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nume VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      parola VARCHAR(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.execute(createCompaniesTable);
  console.log("Utilizatori table created or already exists.");

  // Tabela NOUĂ: Masini
  const createCarsTable = `
    CREATE TABLE IF NOT EXISTS Masini (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nume_proprietar VARCHAR(100) NOT NULL,
      numar_inmatriculare VARCHAR(10) NOT NULL UNIQUE,
      activ TINYINT(1) DEFAULT 1,
      data_creare TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.execute(createCarsTable);
  console.log("Masini table created or already exists.");

  await insertInitialAdminUser(pool);
  console.log("All tables checked/created successfully.");
}

async function insertInitialAdminUser(pool: any) {
  try {
    const email = "admin@smart.com";
    const name = "Admin";
    const plainPassword = "admin123";

    const [existingAdmins] = await pool.execute("SELECT * FROM Utilizatori");

    if (existingAdmins.length > 0) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const insertQuery = `
      INSERT INTO Utilizatori (email, nume, parola)
      VALUES (?, ?, ?)
    `;
    await pool.execute(insertQuery, [email, name, hashedPassword]);

    console.log("Admin user inserted successfully.");
  } catch (err) {
    console.error("Error inserting admin user:", err);
  }
}
