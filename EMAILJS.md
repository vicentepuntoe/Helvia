# 📧 Configuración Completa de EmailJS

## ⚠️ Estado Actual
El formulario está funcionando en **modo simulación** porque EmailJS no está configurado. Para que los emails se envíen realmente, sigue estos pasos:

## 🚀 Pasos de Configuración (5 minutos)

### 1. Crear cuenta en EmailJS
1. Ve a https://www.emailjs.com
2. Haz clic en "Sign Up" (es gratis, permite 200 emails/mes)
3. Crea tu cuenta con tu email

### 2. Configurar Servicio de Email
1. En el dashboard, ve a **"Email Services"** (menú lateral)
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"** (o tu proveedor preferido)
4. Conecta tu cuenta de Gmail
5. **Copia el Service ID** (ejemplo: `service_abc123`)

**Nota sobre correo genérico:**
- Puedes usar un alias de Gmail (ej: `contacto@tudominio.com` o `tuemail+helvia@gmail.com`)
- O configurar un correo genérico en "From Email" del servicio (ej: `contacto@helvia.com`, `hola@helvia.com`)

### 3. Crear Plantilla de Email
1. Ve a **"Email Templates"** (menú lateral)
2. Haz clic en **"Create New Template"**
3. Configura la plantilla así:

**Asunto:**
```
Confirmación de contacto - Helvia
```

**Contenido:**
```
Hola {{to_name}},

{{confirmation_message}}

Detalles de tu consulta:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Nombre: {{user_name}}
📧 Email: {{user_email}}
🏢 Empresa: {{user_company}}
💬 Mensaje: {{user_message}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Un ejecutivo se pondrá en contacto contigo pronto.

Saludos,
El equipo de Helvia
```

4. En **"Settings"** de la plantilla (MUY IMPORTANTE):
   - **To Email**: `{{to_email}}` ⚠️ (debe ser exactamente así, con las llaves dobles)
   - **From Name**: `{{from_name}}`
   - **Reply To**: `{{reply_to}}`

5. **Copia el Template ID** (ejemplo: `template_xyz789`)

### 4. Obtener Public Key
1. Ve a **"Account"** → **"General"** (menú lateral)
2. **Copia tu Public Key** (ejemplo: `abcdefghijklmnop`)

### 5. Configurar en el Proyecto
1. Crea un archivo `.env` en la raíz del proyecto (mismo nivel que `package.json`)
2. Agrega estas líneas (reemplaza con tus valores reales):

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

**Ejemplo real:**
```env
VITE_EMAILJS_SERVICE_ID=service_gmail123
VITE_EMAILJS_TEMPLATE_ID=template_helvia456
VITE_EMAILJS_PUBLIC_KEY=user_abc123def456ghi789
```

### 6. Reiniciar el Servidor
1. Detén el servidor (Ctrl+C)
2. Inicia de nuevo: `npm run dev`
3. Prueba el formulario

## ✅ Verificar que Funciona

1. Abre la consola del navegador (F12)
2. Envía un mensaje desde el formulario
3. Deberías ver: `"Enviando email con EmailJS..."` y `"Email enviado exitosamente"`
4. Revisa tu bandeja de entrada (y spam) del email que ingresaste

## 🐛 Problemas Comunes y Soluciones

### "EmailJS no está configurado"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que las variables empiezan con `VITE_`
- Reinicia el servidor después de crear/modificar `.env`

### "Error al enviar email"
- Verifica que el Service ID, Template ID y Public Key son correctos
- Verifica que la plantilla tiene `{{to_email}}` en "To Email"
- Revisa la consola del navegador para ver el error específico

### "No llega el email" o "Llega al email incorrecto"
- **IMPORTANTE:** Verifica que en "Settings" de la plantilla, el campo "To Email" es exactamente `{{to_email}}` (con las llaves dobles)
- ❌ **Incorrecto:** `mcarrasco@ejemplo.com` (email personal hardcodeado)
- ❌ **Incorrecto:** `{{email}}` (variable incorrecta)
- ✅ **Correcto:** `{{to_email}}` (variable correcta)
- Revisa la carpeta de spam
- Verifica que el email ingresado es correcto
- Verifica que el servicio de email está conectado correctamente en EmailJS

## 📋 Variables Disponibles en el Template

El código envía estas variables que puedes usar en tu plantilla:
- `{{to_name}}` - Nombre del usuario
- `{{to_email}}` - Email del usuario (usar en "To Email")
- `{{from_name}}` - "Helvia"
- `{{user_name}}` - Nombre del usuario
- `{{user_email}}` - Email del usuario
- `{{user_company}}` - Empresa (o "No especificada")
- `{{user_message}}` - Mensaje del usuario
- `{{reply_to}}` - Email para responder
- `{{confirmation_message}}` - Mensaje de confirmación traducido

## 📝 Notas Importantes

- El plan gratuito permite **200 emails/mes**
- Los emails se envían **directamente desde el navegador** (no necesitas backend)
- El email se envía al **usuario que completa el formulario** (no a ti)
- Si quieres recibir una copia, crea una segunda plantilla o usa un webhook
- El mensaje de confirmación está traducido según el idioma seleccionado

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env` a GitHub
- El archivo `.env` ya está en `.gitignore` por seguridad
- Las credenciales son públicas en el frontend (esto es normal para EmailJS)
