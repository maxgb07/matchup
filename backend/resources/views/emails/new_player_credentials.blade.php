@component('mail::message')
# ¡Bienvenido a {{ $clubName }}!

Hola {{ $name }},

El club {{ $clubName }} te ha registrado en la plataforma MatchCup. A continuación, te proporcionamos tus credenciales de acceso.

**Credenciales de acceso:**
* **Email:** {{ $email }}
* **Contraseña:** {{ $password }}

Muy pronto compartiremos con ustedes nuestro sitio web, donde podrán ver su ranking, perfil de jugador, Torneos participantes en el ranking.

Siguenos en instagram @matchcupmx para nuevas noticias.

¡Esperamos que disfrutes de la plataforma!

Saludos,
El equipo de {{ $clubName }}
@endcomponent
