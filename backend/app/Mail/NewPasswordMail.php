<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * La nueva contraseña del usuario.
     *
     * @var string
     */
    public $newPassword;

    /**
     * Crea una nueva instancia del mensaje.
     *
     * @return void
     */
    public function __construct($newPassword)
    {
        $this->newPassword = $newPassword;
    }

    /**
     * Obtén el sobre del mensaje.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Tu Nueva Contraseña - MatchCup',
        );
    }

    /**
     * Obtén la definición del contenido del mensaje.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            markdown: 'emails.new-password',
            with: [
                'newPassword' => $this->newPassword,
            ],
        );
    }

    /**
     * Obtén los adjuntos del mensaje.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
