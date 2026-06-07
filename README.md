# Nachhilfe Portal — Deploy Workflow

## Neues Institut in 3 Minuten

### Schritt 1: institute.json erstellen
Kopiere `institutes/_template.json` und passe an:

```json
{
  "id": "musterschule",
  "name": "Nachhilfe",
  "brand": "Musterschule",
  "shortName": "Musterschule",
  "city": "Berlin",
  "colorPrimary": "#2563EB",
  "colorGrad": "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
  "emailPlaceholder": "name@musterschule.de",
  "demoLogin": "admin@musterschule.de",
  "locations": [
    { "id": "berlin-m", "name": "Berlin Mitte", "short": "Mitte", "color": "#2563EB",
      "rooms": ["Raum 1", "Raum 2", "Raum 3"] }
  ]
}
```

### Schritt 2: Datei pushen
```bash
git add institutes/musterschule.json
git commit -m "New: Musterschule Berlin"
git push
```

### Schritt 3: Fertig
GitHub Actions laeuft automatisch:
- Erstellt Repo `demo-musterschule` aus Template
- Generiert App.jsx mit Musterschule-Branding
- Deployt auf Vercel
- Demo live unter: `demo-musterschule.vercel.app`

## Secrets (einmalig in GitHub setzen)
- `GH_PAT` — GitHub Personal Access Token (repo Rechte)
- `VERCEL_TOKEN` — Vercel API Token

## Struktur
```
deploy-workflow/
  .github/workflows/
    deploy-institute.yml    # Automatischer Workflow
  institutes/
    _template.json          # Vorlage fuer neue Institute
    lernwelt.json           # Lernwelt Demo
  scripts/
    generate-app.js         # Generiert App.jsx aus Config
  template/
    App.template.jsx        # Template mit %%PLACEHOLDERS%%
```
