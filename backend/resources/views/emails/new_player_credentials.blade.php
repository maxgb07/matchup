@component('mail::message')
# ¡Bienvenido a {{ $clubName }}!

Hola {{ $name }},

El club {{ $clubName }} te ha registrado en la plataforma. A continuación, te proporcionamos tus credenciales de acceso.

**Credenciales de acceso:**
* **Email:** {{ $email }}
* **Contraseña:** {{ $password }}

Por motivos de seguridad, te recomendamos cambiar tu contraseña en tu primer inicio de sesión.

¡Esperamos que disfrutes de la plataforma!

Saludos,
El equipo de {{ $clubName }}
@endcomponent
