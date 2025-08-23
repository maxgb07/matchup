<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPlayerCredentials extends Mailable
{
    use Queueable, SerializesModels;

    public $jugador; // Se cambia de $user a $jugador
    public $password;

    public function __construct($jugador, $password)
    {
        $this->jugador = $jugador;
        $this->password = $password;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Credenciales de acceso para la plataforma de tu club',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.new_player_credentials',
            with: [
                // Se accede a las propiedades del objeto Jugador
                'name' => $this->jugador->NOMBRE,
                'email' => $this->jugador->user->EMAIL, // Se accede al email a través de la relación 'user'
                'password' => $this->password,
                'clubName' => $this->jugador->club ? $this->jugador->club->NOMBRE : null, // Se accede al club a través de la relación 'club'
            ],
        );
    }
}
