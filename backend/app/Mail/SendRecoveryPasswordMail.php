<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendRecoveryPasswordMail extends Mailable
{
    use Queueable, SerializesModels;
    private $title;
    public $usuario;
    public $tienda;
    public $url;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($usuario, $tienda, $url, $title = 'Restauración de contraseña')
    {
        $this->title = $title;
        $this->usuario = $usuario;
        $this->tienda = $tienda;
        $this->url = $url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->view('reset_password_email');
    }
}
