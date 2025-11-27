import type { LegalProfile } from '../database/schema'

export function generateImpressum(profile: LegalProfile): string {
  return `
# Impressum

## Angaben gemäß § 5 TMG

**${profile.companyName}**

Vertreten durch: ${profile.ownerName}

**Kontakt:**
${profile.address}

E-Mail: ${profile.email}
Telefon: ${profile.phone}
${profile.vatId ? `Umsatzsteuer-ID: ${profile.vatId}` : ''}

## Haftungsausschluss

### Haftung für Inhalte

Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.

### Haftung für Links

Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.

## Urheberrecht

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
`.trim()
}

export function generatePrivacyPolicy(profile: LegalProfile): string {
  return `
# Datenschutzerklärung

## 1. Datenschutz auf einen Blick

### Allgemeine Hinweise

Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.

## 2. Verantwortliche Stelle

Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:

**${profile.companyName}**
${profile.ownerName}
${profile.address}

E-Mail: ${profile.email}
Telefon: ${profile.phone}

## 3. Datenerfassung auf dieser Website

### Server-Log-Dateien

Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:

- Browsertyp und Browserversion
- verwendetes Betriebssystem
- Referrer URL
- Hostname des zugreifenden Rechners
- Uhrzeit der Serveranfrage
- IP-Adresse

Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.

### Kontaktformular

Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.

## 4. Ihre Rechte

Sie haben jederzeit das Recht:

- Auskunft über Ihre gespeicherten Daten zu erhalten
- Berichtigung unrichtiger Daten zu verlangen
- Löschung Ihrer Daten zu verlangen
- Einschränkung der Datenverarbeitung zu verlangen
- Widerspruch gegen die Verarbeitung einzulegen
- Datenübertragbarkeit zu verlangen

## 5. SSL-Verschlüsselung

Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-Verschlüsselung.

Stand: ${new Date().toLocaleDateString('de-DE')}
`.trim()
}
