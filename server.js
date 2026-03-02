require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const nodemailer = require('nodemailer');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app  = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════
// MERCADO PAGO
// ══════════════════════════════════════════════════════
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// ══════════════════════════════════════════════════════
// NODEMAILER — Gmail
// ══════════════════════════════════════════════════════
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.warn('\n⚠️  Email: no se pudo conectar con Gmail. Revisá GMAIL_USER y GMAIL_PASS en el .env\n');
  } else {
    console.log(`✅ Email: conectado como ${process.env.GMAIL_USER}`);
  }
});

async function enviarEmail(opciones) {
  try { await transporter.sendMail(opciones); }
  catch (err) { console.error('Error al enviar email:', err.message); }
}

const $$ = (n) => '$' + Number(n).toLocaleString('es-AR');

// ══════════════════════════════════════════════════════
// PRECIOS — un valor por vehículo, desde el .env
// Para actualizar: editá el .env y reiniciá con npm start
// ══════════════════════════════════════════════════════
const PRECIOS = {
  moto:   parseInt(process.env.PRECIO_MOTO)   || 80000,
  auto:   parseInt(process.env.PRECIO_AUTO)   || 120000,
  camion: parseInt(process.env.PRECIO_CAMION) || 200000,
};

const MENSUAL = {
  precio_standard:       parseInt(process.env.PRECIO_MENSUAL)         || 15000,
  precio_flota:          parseInt(process.env.PRECIO_MENSUAL_FLOTA)   || 13500,
  flota_minimo_unidades: parseInt(process.env.FLOTA_MINIMO_UNIDADES)  || 30,
};

// ══════════════════════════════════════════════════════
// MIDDLEWARE
// ══════════════════════════════════════════════════════
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════════════════
// RUTAS
// ══════════════════════════════════════════════════════

// Config — la landing carga precios desde acá
app.get('/api/config', (req, res) => {
  res.json({ precios: PRECIOS, mensual: MENSUAL });
});

// Consulta
app.post('/api/consulta', async (req, res) => {
  const { nombre, telefono, email, vehiculo, mensaje } = req.body;
  if (!nombre || !telefono) {
    return res.status(400).json({ error: 'Nombre y teléfono son requeridos.' });
  }

  const ahora = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
  console.log(`\n📩 NUEVA CONSULTA — ${ahora}`);
  console.log(`   Nombre:   ${nombre}`);
  console.log(`   Teléfono: ${telefono}`);
  console.log(`   Email:    ${email || '—'}`);
  console.log(`   Vehículo: ${vehiculo || '—'}`);
  console.log(`   Mensaje:  ${mensaje || '—'}\n`);

  // Email a Geo Pro
  await enviarEmail({
    from:    `"Geo Pro Web" <${process.env.GMAIL_USER}>`,
    to:      process.env.GMAIL_USER,
    subject: `📩 Nueva consulta de ${nombre} — Geo Pro`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#f4f6fb;padding:24px;border-radius:12px;">
        <div style="background:#1a4fa0;border-radius:8px 8px 0 0;padding:20px 24px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">🛰️ Geo Pro</h2>
        </div>
        <div style="background:#fff;border-radius:0 0 8px 8px;padding:28px 24px;">
          <h2 style="color:#0d1120;margin:0 0 4px;">Nueva consulta recibida</h2>
          <p style="color:#7a86a0;font-size:13px;margin:0 0 24px;">${ahora}</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;width:130px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#0d1120;">${nombre}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Teléfono</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;"><a href="https://wa.me/549${telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(nombre)}%2C%20te%20contacto%20desde%20Geo%20Pro" style="color:#2563eb;font-weight:600;">${telefono} — Abrir WhatsApp ↗</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1120;">${email ? `<a href="mailto:${email}" style="color:#2563eb;">${email}</a>` : '—'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Vehículo</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1120;">${vehiculo || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#7a86a0;font-size:13px;vertical-align:top;">Consulta</td><td style="padding:10px 0;color:#0d1120;">${mensaje || '—'}</td></tr>
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="https://wa.me/549${telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(nombre)}%2C%20te%20contacto%20desde%20Geo%20Pro" style="background:#25d366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">💬 Responder por WhatsApp</a>
          </div>
        </div>
        <p style="text-align:center;color:#aab;font-size:11px;margin-top:16px;">Geo Pro · Tandil · geoprotandil@gmail.com</p>
      </div>
    `,
  });

  // Confirmación al cliente (solo si dejó email)
  if (email) {
    await enviarEmail({
      from:    `"Geo Pro" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: `Recibimos tu consulta — Geo Pro`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#f4f6fb;padding:24px;border-radius:12px;">
          <div style="background:#1a4fa0;border-radius:8px 8px 0 0;padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">🛰️ Geo Pro</h2>
          </div>
          <div style="background:#fff;border-radius:0 0 8px 8px;padding:28px 24px;">
            <h2 style="color:#0d1120;margin:0 0 12px;">¡Hola, ${nombre}!</h2>
            <p style="color:#444;line-height:1.7;">Recibimos tu consulta y un asesor se va a comunicar con vos en menos de 2 horas en horario hábil.</p>
            <p style="color:#444;line-height:1.7;">Si necesitás una respuesta inmediata, escribinos por WhatsApp:</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="https://wa.me/542494207145" style="background:#25d366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">💬 249 4207145</a>
            </div>
            <p style="color:#7a86a0;font-size:13px;">— El equipo de Geo Pro</p>
          </div>
          <p style="text-align:center;color:#aab;font-size:11px;margin-top:16px;">Geo Pro · Tandil, Buenos Aires · geoprotandil@gmail.com</p>
        </div>
      `,
    });
  }

  res.json({ ok: true });
});

// Crear pago
app.post('/api/crear-pago', async (req, res) => {
  const { nombre, email, telefono, servicio, servicio_label, precio_original, direccion, nota } = req.body;

  if (!nombre || !email || !servicio || !precio_original) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  // Precio siempre desde el servidor — ignora lo que manda el cliente
  const montoOriginal = PRECIOS[servicio] || parseInt(precio_original);
  const montoFinal    = Math.round(montoOriginal * 0.90);
  const BASE_URL      = process.env.BASE_URL || `http://localhost:${PORT}`;
  const ahora         = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

  try {
    const preference = new Preference(mpClient);
    const response   = await preference.create({
      body: {
        items: [{
          id:          'gps-instalacion',
          title:       `Geo Pro – ${servicio_label || servicio}`,
          description: 'Instalación GPS · 10% descuento web + primer mes de servicio sin cargo',
          quantity:    1,
          currency_id: 'ARS',
          unit_price:  montoFinal,
        }],
        payer: { name: nombre, email },
        back_urls: {
          success: `${BASE_URL}?pago=ok`,
          failure: `${BASE_URL}?pago=error`,
          pending: `${BASE_URL}?pago=pendiente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'GEO PRO GPS',
        metadata: { nombre, telefono, email, servicio: servicio_label || servicio, montoOriginal, montoFinal, direccion, nota },
      },
    });

    console.log(`\n💳 PAGO INICIADO — ${ahora}`);
    console.log(`   Cliente:   ${nombre} | ${telefono} | ${email}`);
    console.log(`   Solución:  ${servicio_label || servicio}`);
    console.log(`   Valor:     ${$$(montoOriginal)} → con descuento ${$$(montoFinal)}`);
    console.log(`   Dirección: ${direccion || '—'}\n`);

    // Email a Geo Pro
    await enviarEmail({
      from:    `"Geo Pro Web" <${process.env.GMAIL_USER}>`,
      to:      process.env.GMAIL_USER,
      subject: `💳 Nuevo pago — ${nombre} — ${servicio_label || servicio}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#f4f6fb;padding:24px;border-radius:12px;">
          <div style="background:#1a4fa0;border-radius:8px 8px 0 0;padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">🛰️ Geo Pro</h2>
          </div>
          <div style="background:#fff;border-radius:0 0 8px 8px;padding:28px 24px;">
            <h2 style="color:#0d1120;margin:0 0 4px;">💳 Nuevo pago iniciado</h2>
            <p style="color:#7a86a0;font-size:13px;margin:0 0 24px;">${ahora}</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;width:140px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#0d1120;">${nombre}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Teléfono</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;"><a href="https://wa.me/549${telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(nombre)}%2C%20te%20contacto%20por%20tu%20compra%20en%20Geo%20Pro" style="color:#2563eb;font-weight:600;">${telefono} — Abrir WhatsApp ↗</a></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Solución</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1120;">${servicio_label || servicio}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Valor de lista</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1120;text-decoration:line-through;">${$$(montoOriginal)}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Total abonado</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:700;color:#16a34a;font-size:16px;">${$$(montoFinal)}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#7a86a0;font-size:13px;">Dirección</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1120;">${direccion || '—'}</td></tr>
              <tr><td style="padding:10px 0;color:#7a86a0;font-size:13px;vertical-align:top;">Observaciones</td><td style="padding:10px 0;color:#0d1120;">${nota || '—'}</td></tr>
            </table>
            <div style="background:#fff8e1;border:1px solid #fbbf24;border-radius:8px;padding:14px 18px;margin:24px 0 0;">
              <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">⚡ Acción requerida</p>
              <p style="margin:6px 0 0;font-size:13px;color:#92400e;">Una vez que MercadoPago confirme el pago, contactá al cliente para coordinar la instalación a domicilio.</p>
            </div>
            <div style="margin-top:20px;text-align:center;">
              <a href="https://wa.me/549${telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(nombre)}%2C%20te%20contacto%20desde%20Geo%20Pro%20para%20coordinar%20la%20instalaci%C3%B3n" style="background:#25d366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">💬 Contactar por WhatsApp</a>
            </div>
          </div>
          <p style="text-align:center;color:#aab;font-size:11px;margin-top:16px;">Geo Pro · Tandil · geoprotandil@gmail.com</p>
        </div>
      `,
    });

    // Confirmación al cliente
    await enviarEmail({
      from:    `"Geo Pro" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: `Confirmación de tu contratación — Geo Pro`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#f4f6fb;padding:24px;border-radius:12px;">
          <div style="background:#1a4fa0;border-radius:8px 8px 0 0;padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">🛰️ Geo Pro</h2>
          </div>
          <div style="background:#fff;border-radius:0 0 8px 8px;padding:28px 24px;">
            <h2 style="color:#0d1120;margin:0 0 12px;">¡Gracias por elegir Geo Pro, ${nombre}!</h2>
            <p style="color:#444;line-height:1.7;">Recibimos tu solicitud. Una vez acreditado el pago, un asesor se comunica con vos para coordinar la instalación a domicilio.</p>
            <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px 20px;margin:20px 0;">
              <p style="margin:0 0 8px;font-weight:700;color:#15803d;">Resumen de tu contratación</p>
              <p style="margin:0;font-size:14px;color:#166534;">📦 ${servicio_label || servicio}</p>
              <p style="margin:4px 0 0;font-size:14px;color:#166534;">💰 Total abonado: <strong>${$$(montoFinal)}</strong> (10% dto. web aplicado)</p>
              <p style="margin:4px 0 0;font-size:14px;color:#166534;">🎉 Primer mes de monitoreo: <strong>sin cargo</strong></p>
            </div>
            <p style="color:#444;line-height:1.7;">¿Tenés alguna duda? Escribinos:</p>
            <div style="text-align:center;margin:20px 0;">
              <a href="https://wa.me/542494207145" style="background:#25d366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">💬 249 4207145</a>
            </div>
            <p style="color:#7a86a0;font-size:13px;">— El equipo de Geo Pro</p>
          </div>
          <p style="text-align:center;color:#aab;font-size:11px;margin-top:16px;">Geo Pro · Tandil, Buenos Aires · geoprotandil@gmail.com</p>
        </div>
      `,
    });

    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error('Error MercadoPago:', error);
    res.status(500).json({ error: 'Error al procesar el pago.', detalle: error.message });
  }
});

// Webhook MercadoPago
app.post('/api/webhook', (req, res) => {
  const { type, data } = req.body;
  if (type === 'payment') console.log(`\n✅ PAGO CONFIRMADO — ID: ${data?.id}\n`);
  res.sendStatus(200);
});

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Arranque
app.listen(PORT, () => {
  console.log(`\n🛰️  Geo Pro Server → http://localhost:${PORT}`);
  console.log(`   MP Token: ${process.env.MP_ACCESS_TOKEN ? '✅ configurado' : '❌ falta en .env'}`);
  console.log(`   Gmail:    ${process.env.GMAIL_USER ? `✅ ${process.env.GMAIL_USER}` : '❌ falta en .env'}`);
  console.log(`\n   Valores activos:`);
  console.log(`   GPS Moto:   ${$$(PRECIOS.moto)}`);
  console.log(`   GPS Auto:   ${$$(PRECIOS.auto)}`);
  console.log(`   GPS Camión: ${$$(PRECIOS.camion)}`);
  console.log(`   Mensual:    ${$$(MENSUAL.precio_standard)} (flota +${MENSUAL.flota_minimo_unidades} unid.: ${$$(MENSUAL.precio_flota)})\n`);
});