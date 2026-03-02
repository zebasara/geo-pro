# 🛰️ GEO PRO — Guía completa de instalación y uso

Seguí esta guía de arriba a abajo y en 30 minutos tenés todo funcionando.

---

## 📁 ESTRUCTURA DE ARCHIVOS

Así tiene que quedar tu carpeta cuando termines:

```
geo-pro/
├── public/
│   ├── index.html        ← La landing page (NO tocar)
│   └── logo.png          ← Tu logo
├── server.js             ← El servidor (NO tocar)
├── package.json          ← Dependencias (NO tocar)
├── .env                  ← TUS CLAVES SECRETAS (vos lo creás)
├── .env.example          ← Ejemplo de cómo llenar el .env
└── README.md             ← Esta guía
```

> ⚠️ El archivo `.env` es el único que vos completás con tus datos reales.
> Nunca lo compartas ni lo subas a internet.

---

## 🖥️ PASO 1 — Instalar Node.js en tu computadora

Node.js es el programa que hace correr el servidor. Solo se instala una vez.

1. Entrá a **https://nodejs.org**
2. Descargá la versión que dice **"LTS"** (la recomendada)
3. Instalala como cualquier programa (siguiente, siguiente, finalizar)
4. Para verificar que quedó instalado, abrí una terminal y escribí:
   ```
   node --version
   ```
   Tiene que aparecer algo como `v20.11.0`

**¿Cómo abrir la terminal?**
- En **Windows**: presionás `Windows + R`, escribís `cmd` y Enter
- En **Mac**: buscás "Terminal" en Spotlight (`Cmd + Espacio`)

---

## 📂 PASO 2 — Crear la carpeta del proyecto

1. Creá una carpeta en tu computadora llamada `geo-pro` (donde quieras, por ejemplo en el Escritorio)
2. Dentro de esa carpeta creá otra carpeta llamada `public`
3. Copiá los archivos así:

```
geo-pro/
├── public/
│   ├── index.html     ← Va dentro de public/
│   └── logo.png       ← Tu logo, también dentro de public/
├── server.js          ← Va en la raíz de geo-pro/
├── package.json       ← Va en la raíz de geo-pro/
└── .env.example       ← Va en la raíz de geo-pro/
```

---

## 🔑 PASO 3 — Crear el archivo .env con tus claves

Este archivo guarda tus contraseñas y configuraciones. Nunca lo compartas.

1. En la carpeta `geo-pro`, hacé una copia de `.env.example`
2. Renombrala a `.env` (sin el "example", solo `.env`)
3. Abrila con el Bloc de notas (Windows) o TextEdit (Mac)
4. Completá cada valor según las instrucciones de abajo

---

### 3A — Obtener la clave de MercadoPago

Esta clave le permite a tu web cobrar pagos reales.

1. Entrá a **https://www.mercadopago.com.ar/developers/panel**
   (con tu cuenta de MercadoPago)
2. En el menú izquierdo hacé clic en **"Credenciales"**
3. Primero vas a ver las credenciales de **TEST** (para pruebas)
4. Copiá el **Access Token** que empieza con `TEST-...`
5. Pegalo en el `.env` en la línea `MP_ACCESS_TOKEN=`

```
MP_ACCESS_TOKEN=TEST-1234567890abcdef...
```

> Cuando estés listo para cobrar dinero real, volvé a esta página,
> hacé clic en **"Credenciales de producción"** y reemplazá el token
> por el que empieza con `APP_USR-...`

---

### 3B — Obtener la contraseña de aplicación de Gmail

Gmail no te deja usar tu contraseña normal para enviar emails desde código.
Necesitás generar una "contraseña de aplicación". Tarda 5 minutos.

1. Entrá a **https://myaccount.google.com/security**
   (con tu cuenta geoprotandil@gmail.com)

2. Buscá la sección **"Verificación en 2 pasos"**
   - Si dice "Desactivada", hacé clic y seguí los pasos para activarla
   - Solo necesitás tu celular para confirmar

3. Una vez activada la verificación en 2 pasos, buscá en esa misma página:
   **"Contraseñas de aplicaciones"**
   (a veces hay que buscarla escribiendo en el buscador de la página de Google)

4. En el campo que aparece, escribí: `Geo Pro` y hacé clic en **Crear**

5. Google te va a mostrar una clave de **16 caracteres** (con espacios), por ejemplo:
   ```
   abcd efgh ijkl mnop
   ```

6. Copiá esa clave y pegala en el `.env`:
   ```
   GMAIL_PASS=abcd efgh ijkl mnop
   ```
   (podés dejar los espacios, no importa)

---

### 3C — Cómo tiene que quedar tu .env completo

```
MP_ACCESS_TOKEN=TEST-tu-token-de-mercadopago

GMAIL_USER=geoprotandil@gmail.com
GMAIL_PASS=abcd efgh ijkl mnop

BASE_URL=http://localhost:3000
PORT=3000

PRECIO_MOTO_BASICO=80000
PRECIO_MOTO_COMPLETO=130000
PRECIO_AUTO_BASICO=120000
PRECIO_AUTO_COMPLETO=200000
PRECIO_CAMION_BASICO=200000
PRECIO_CAMION_COMPLETO=380000

PRECIO_MENSUAL=15000
PRECIO_MENSUAL_FLOTA=13500
FLOTA_MINIMO_UNIDADES=30
```

---

## 📦 PASO 4 — Instalar las dependencias

Las dependencias son las librerías que usa el servidor (MercadoPago, email, etc.)

1. Abrí la terminal
2. Navegá hasta tu carpeta `geo-pro`. Por ejemplo si la pusiste en el Escritorio:
   - **Windows:**
     ```
     cd Desktop\geo-pro
     ```
   - **Mac:**
     ```
     cd ~/Desktop/geo-pro
     ```
3. Ejecutá este comando:
   ```
   npm install
   ```
4. Va a aparecer texto descargándose. Cuando termine y vuelva el cursor, listo.
   (Se crea una carpeta `node_modules` — es normal, no la toques)

---

## 🚀 PASO 5 — Arrancar el servidor

1. En la misma terminal, ejecutá:
   ```
   npm start
   ```

2. Vas a ver algo así:
   ```
   🛰️  Geo Pro Server → http://localhost:3000
   ✅ Email: conectado como geoprotandil@gmail.com
   ✅ MP Token configurado

   Precios activos:
   Moto    $80.000 – $130.000
   Auto    $120.000 – $200.000
   Camión  $200.000 – $380.000
   Mensual $15.000 (flota +30 unid.: $13.500)
   ```

3. Abrí tu navegador y entrá a: **http://localhost:3000**
   ¡Ahí está tu landing page funcionando!

> Para detener el servidor: en la terminal presionás `Ctrl + C`
> Para volver a iniciarlo: `npm start`

---

## ✏️ PASO 6 — Actualizar precios

Cuando quieras cambiar cualquier valor (precio de instalación o arancel mensual):

1. Abrí el archivo `.env`
2. Cambiá el número que corresponde, por ejemplo:
   ```
   PRECIO_MOTO_BASICO=95000
   ```
3. Guardá el archivo
4. En la terminal, detené el servidor con `Ctrl + C`
5. Volvé a iniciarlo con `npm start`
6. Los nuevos valores ya aparecen en la web automáticamente

---

## 📧 PASO 7 — Qué emails vas a recibir

**Cuando alguien completa el formulario de consulta:**
- Recibís un email con nombre, teléfono, email, vehículo y mensaje
- Incluye un botón que abre WhatsApp con el cliente directamente

**Cuando alguien inicia un pago por MercadoPago:**
- Recibís un email con todos los datos del cliente
- La solución que contrató, el monto abonado y la dirección de instalación
- Un botón directo de WhatsApp para coordinar la instalación

**El cliente también recibe:**
- Un email confirmando que recibiste su consulta o compra
- Con el resumen de lo que contrató y tu número de WhatsApp

---

## 🌐 PASO 8 — Poner la web en internet (cuando estés listo)

Por ahora la web funciona solo en tu computadora (`localhost`).
Para que cualquiera pueda verla desde internet necesitás publicarla.

La opción más fácil y gratuita para empezar es **Railway**:

1. Entrá a **https://railway.app** y creá una cuenta gratis
2. Conectá tu proyecto (podés subir la carpeta o usar GitHub)
3. Railway detecta el `package.json` y arranca automáticamente
4. Te da una URL pública como `https://geo-pro.up.railway.app`
5. Copiá esa URL y ponela en el `.env`:
   ```
   BASE_URL=https://geo-pro.up.railway.app
   ```
6. También tenés que cargar todas las variables del `.env` en el panel de Railway
   (hay una sección "Variables" donde las pegás una por una)

> Cuando tengas un dominio propio (ej: geopro.com.ar), simplemente
> apuntás el dominio a Railway y actualizás `BASE_URL`.

---

## ❓ PROBLEMAS FRECUENTES

**"El email no llega"**
→ Revisá que `GMAIL_PASS` sea la contraseña de aplicación de 16 caracteres, no tu contraseña normal de Gmail.
→ Verificá que la verificación en 2 pasos esté activada en tu cuenta Google.

**"Error de MercadoPago"**
→ Verificá que el token en `MP_ACCESS_TOKEN` esté completo y sin espacios al final.
→ Recordá que el token de TEST solo funciona para pruebas, no cobra dinero real.

**"No carga la página"**
→ Verificá que el servidor esté corriendo (`npm start`) y que entrés a `http://localhost:3000`

**"npm no se reconoce como comando"**
→ Node.js no quedó instalado correctamente. Volvé al Paso 1 y reinstalalo.

---

## 📞 RESUMEN RÁPIDO

```
1. Instalar Node.js desde nodejs.org
2. Crear carpeta geo-pro con los archivos en su lugar
3. Copiar .env.example → .env y completar con tus claves
4. cd geo-pro → npm install
5. npm start
6. Abrir http://localhost:3000
```

---

Geo Pro · geoprotandil@gmail.com · 249 4207145 · Tandil, Buenos Aires
