<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\SendRecoveryPasswordMail as SendMail;
use Illuminate\Support\Facades\Mail;

class PasswordResetMailController extends Controller
{
    public function sendEmail(Request $request){
        $usuario = $request->usuario;
        $tienda = $request->tienda;
        $url = $request->url;
        $title = $request->title;

        $sendMail = Mail::to($usuario['email'])->send(new SendMail($usuario, $tienda, $url, $title));

        if(empty($sendEmail)){
            return response()->json(['mensaje' => 'El email ha sido enviado.', 'tipoMensaje' => 'success']);
        }else{
            return response()->json(['mensaje' => 'Ocurrió un error al intentar enviar el correo electrónico', 'tipoMensaje' => 'danger']);
        }
    }
}
