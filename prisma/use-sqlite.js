const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.prisma');
const mysqlSchemaPath = path.join(__dirname, 'schema.mysql.prisma');
const configPath = path.join(__dirname, '../prisma.config.ts');
const mysqlConfigPath = path.join(__dirname, '../prisma.config.mysql.ts');
const envPath = path.join(__dirname, '../.env.local');

// 1. Backup and modify schema.prisma
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  if (!fs.existsSync(mysqlSchemaPath)) {
    fs.writeFileSync(mysqlSchemaPath, schemaContent, 'utf8');
    console.log('Backed up MySQL schema to schema.mysql.prisma');
  }

  let newSchema = schemaContent;
  
  // Replace provider
  newSchema = newSchema.replace(/provider\s*=\s*"mysql"/g, 'provider = "sqlite"');
  
  // Set engineType to library for SQLite
  newSchema = newSchema.replace(/provider\s*=\s*"prisma-client-js"/g, 'provider = "prisma-client-js"\n  engineType = "library"');
  
  // Remove MySQL-specific attributes (@db.Text, @db.Decimal(10, 2), etc.)
  newSchema = newSchema.replace(/@db\.[A-Za-z0-9_]+(?:\([0-9, ]+\))?/g, '');
  
  fs.writeFileSync(schemaPath, newSchema, 'utf8');
  console.log('Successfully updated schema.prisma for SQLite!');
}

// 2. Backup and modify prisma.config.ts
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');

  if (!fs.existsSync(mysqlConfigPath)) {
    fs.writeFileSync(mysqlConfigPath, configContent, 'utf8');
    console.log('Backed up MySQL config to prisma.config.mysql.ts');
  }

  let newConfig = configContent;
  // Replace connection URL to local SQLite file in config
  newConfig = newConfig.replace(/url:\s*process\.env\["DATABASE_URL"\],?/g, 'url: "file:./dev.db",');

  fs.writeFileSync(configPath, newConfig, 'utf8');
  console.log('Successfully updated prisma.config.ts for SQLite!');
}

// 3. Update .env.local to point to SQLite
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace DATABASE_URL line
  envContent = envContent.replace(/DATABASE_URL\s*=\s*"mysql:[^"]*"/g, 'DATABASE_URL="file:./dev.db"');
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('Successfully updated .env.local for SQLite!');
}
