<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    //Read more: https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/#ixzz7GdiLx3lB
    public $title;
    //public $customer_details;
    //public $order_details;
    public $cliente;
    public $tienda;
    public $carrito;
    public $total;
    public $fecha;
    public $folio;

    /** * Create a new message instance.
     *
     * @return void
     *
     */
    public function __construct($title, $cliente, $tienda, $carrito, $total, $fecha, $folio) {
        //
        $this->cliente = $cliente;
        $this->tienda = $tienda;
        $this->carrito = $carrito;
        $this->total = $total;
        $this->fecha = $fecha;
        $this->folio = $folio;
    }

    /** * Build the message. * * @return $this */
    public function build() {
        return $this->subject($this->title) ->view('customer_mail');
    }


}
