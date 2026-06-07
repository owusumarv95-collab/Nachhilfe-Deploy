/**
 * generate-app.js
 * Liest eine institute.json und generiert eine fertige App.jsx
 * Usage: node scripts/generate-app.js institutes/lernwelt.json
 */

const fs = require('fs');
const path = require('path');

const configFile = process.argv[2];
if (!configFile) { console.error('Usage: node generate-app.js <institute.json>'); process.exit(1); }

const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

// Template App.jsx lesen
const templatePath = path.join(__dirname, '..', 'template', 'App.template.jsx');
let template = fs.readFileSync(templatePath, 'utf-8');

// Standorte generieren
const locationsCode = config.locations.map(loc =>
  `  { id: "${loc.id}", name: "${loc.name}", short: "${loc.short}", color: "${loc.color}" }`
).join(',\n');

// Räume generieren — eindeutige IDs pro Standort
const roomsCode = config.locations.map(loc => {
  const rooms = loc.rooms.map((r, i) => {
    const prefix = loc.id.replace(/[^a-z0-9]/g, '').slice(0, 3);
    return `{id:"${prefix}${i+1}",name:"${r}"}`;
  }).join(',');
  return `  "${loc.id}":[${rooms}]`;
}).join(',\n');

// Demo-Admins generieren
const adminUsersCode = [
  `  { id: "admin_all", name: "Admin", short: "AD", role: "superadmin", locationId: null, email: "${config.demoLogin}", color: "${config.colorPrimary}", title: "Geschaeftsfuehrung" }`,
  ...config.locations.map((loc, i) => {
    const colors = ["#2563EB","#16A34A","#D97706","#DB2777","#0891B2"];
    const color = colors[i] || config.colorPrimary;
    return `  { id: "admin_${loc.id.replace(/[^a-z0-9]/g,'_')}", name: "Standortleitung", short: "SL", role: "loc_admin", locationId: "${loc.id}", email: "${loc.id}@demo.de", color: "${color}", title: "Standortleitung ${loc.name}" }`;
  })
].join(',\n');

// Alle Replacements
const replacements = {
  '%%INSTITUTE_NAME%%':    config.name,
  '%%INSTITUTE_BRAND%%':   config.brand,
  '%%INSTITUTE_SHORT%%':   config.shortName,
  '%%INSTITUTE_CITY%%':    config.city,
  '%%COLOR_PRIMARY%%':     config.colorPrimary,
  '%%COLOR_GRAD%%':        config.colorGrad,
  '%%EMAIL_PLACEHOLDER%%': config.emailPlaceholder,
  '%%DEMO_LOGIN%%':        config.demoLogin,
  '%%LOCATIONS_CODE%%':    locationsCode,
  '%%ROOMS_CODE%%':        roomsCode,
  '%%ADMIN_USERS_CODE%%':  adminUsersCode,
};

for (const [key, value] of Object.entries(replacements)) {
  template = template.split(key).join(value);
}

// Prüfen ob noch Placeholders übrig
const remaining = (template.match(/%%\w+%%/g) || []);
if (remaining.length > 0) {
  console.warn('WARNUNG: Nicht ersetzte Placeholders:', [...new Set(remaining)].join(', '));
}

// Output
const outDir = path.join(__dirname, '..', 'generated', config.id);
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'App.jsx');
fs.writeFileSync(outFile, template);
console.log(`App.jsx generiert: ${outFile}`);
console.log(`Institut: ${config.brand} | Standorte: ${config.locations.length} | Farbe: ${config.colorPrimary}`);
