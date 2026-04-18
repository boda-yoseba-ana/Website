// ================================================================
//  ADRIÁN CARMONA — Portfolio Contact Form → Google Sheets
//
//  INSTRUCCIONES DE INSTALACIÓN:
//  1. Ve a https://script.google.com → "Nuevo proyecto"
//  2. Pega este código (reemplaza todo el contenido)
//  3. Cambia SHEET_ID por el ID de tu hoja de cálculo de Google
//     (el ID está en la URL: docs.google.com/spreadsheets/d/[ID aquí]/edit)
//  4. Haz clic en "Guardar" (icono del disquete o Ctrl+S)
//  5. Ve a "Implementar" → "Nueva implementación"
//  6. Tipo: "Aplicación web"
//  7. Ejecutar como: "Yo (tu cuenta de Google)"
//  8. Quién puede acceder: "Cualquier usuario (incluso anónimos)"
//  9. Haz clic en "Implementar" → COPIA la URL que aparece
// 10. Pega esa URL en main.js donde pone APPS_SCRIPT_URL
//
//  OJO: Si modificas el código, debes hacer una NUEVA implementación
//  (no actualizar la existente) para que los cambios surtan efecto.
// ================================================================

const SHEET_ID     = 'PEGA_AQUÍ_EL_ID_DE_TU_HOJA';   // ← cambia esto
const NOTIFY_EMAIL = 'adriancarmonacordoba@gmail.com';
const SHEET_NAME   = 'Contactos';

// ── POST: recibe el formulario del portfolio ─────────────────────
function doPost(e) {
  try {
    let name, email, message;

    // El body llega como text/plain con JSON dentro
    if (e.postData && e.postData.contents) {
      const data = JSON.parse(e.postData.contents);
      name    = data.name    || '';
      email   = data.email   || '';
      message = data.message || '';
    } else {
      // Fallback: parámetros de formulario URL-encoded
      name    = e.parameter.name    || '';
      email   = e.parameter.email   || '';
      message = e.parameter.message || '';
    }

    guardarYNotificar(name, email, message);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error en doPost: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET: alternativa de prueba desde el navegador ───────────────
function doGet(e) {
  const name    = e.parameter.name    || 'Test';
  const email   = e.parameter.email   || 'test@test.com';
  const message = e.parameter.message || 'Prueba desde GET';

  try {
    guardarYNotificar(name, email, message);
    return ContentService
      .createTextOutput('OK — fila añadida correctamente.')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService
      .createTextOutput('ERROR: ' + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// ── Función principal: guardar en Sheet + enviar email ───────────
function guardarYNotificar(name, email, message) {
  const date = new Date();

  // 1. Abrir (o crear) la hoja
  const ss  = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = sheet.getRange(1, 1, 1, 4);
    headers.setValues([['Fecha', 'Nombre', 'Email', 'Mensaje']]);
    headers.setFontWeight('bold');
    headers.setBackground('#E05010');
    headers.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 500);
  }

  // 2. Añadir fila
  sheet.appendRow([
    Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss'),
    name,
    email,
    message
  ]);

  // 3. Enviar email de notificación
  const subject = '📩 Nuevo contacto en tu portfolio — ' + name;
  const body = [
    'Nuevo mensaje recibido en adriancarmona.portfolio\n',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '  Nombre : ' + name,
    '  Email  : ' + email,
    '  Fecha  : ' + Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'),
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    'Mensaje:',
    message,
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Responder a: ' + email,
    'Ver en Sheets: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit'
  ].join('\n');

  MailApp.sendEmail({
    to:      NOTIFY_EMAIL,
    subject: subject,
    body:    body,
    replyTo: email
  });
}

// ── Test manual desde el editor (ejecuta esta función) ──────────
function testManual() {
  guardarYNotificar('Usuario Prueba', 'prueba@ejemplo.com', 'Este es un mensaje de prueba desde el editor de Apps Script.');
  Logger.log('Test completado — revisa la hoja y tu email.');
}
