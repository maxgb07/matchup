@component('mail::message')
# ¡Bienvenido a matchcup!

Hola {{ $name }},

Tu club ha sido creado con éxito. A continuación, te proporcionamos tus credenciales de acceso como administrador del club.

**Credenciales de acceso:**
* **Email:** {{ $email }}
* **Contraseña:** {{ $password }}

Por motivos de seguridad, te recomendamos cambiar tu contraseña en tu primer inicio de sesión.

¡Esperamos que disfrutes de la plataforma!

Saludos,
El equipo de matchcup
@endcomponent
