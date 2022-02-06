<?php

namespace App\Http\Controllers;

use App\Mail\SendMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    //Read more: https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/#ixzz7GdhOx8Xy
    public function sendEmail(Request $request) {
        $tienda = $request->all()['tienda'];
        $cliente = $request->all()['cliente'];
        $carrito = $request->all()['carrito'];
        $total = $request->all()['total'];
        $fecha = $request->all()['fecha'];
        $folio = $request->all()['folio'];

        $title = '[Confirmación] Gracias por su compra.';
        /*
        $customer_details = [
            'name' => $cliente['nombres'].' '.$cliente['apellido1'].' '.$cliente['apellido2'],
            'address' => $cliente['direccion'].', '.$cliente['casa_num'].', '.$cliente['ciudad'].'. '.$cliente['referencia'],
            'phone' => $cliente['fono'],
            'email' => 'mabc@live.cl'
        ];

        $detalle = [];
        foreach($carrito as $item){
            array_push($detalle, [
                'producto' => $item['nombre'].', marca '.$item['marca'],
                'precio' => $item['precio_venta'],
                'cantidad' => $item['cantidad']
            ]);
        }

        $order_details = [
            'detail' => $detalle,
            'SKU' => $folio,
            'Total' => $total,
            'Fecha compra' => $fecha,
        ];
        */
        //dd($title, $customer_details, $order_details);
        $sendmail = Mail::to($cliente['email'])
                        ->send(new SendMail($title, $cliente, $tienda, $carrito, $total, $fecha, $folio));

        if (empty($sendmail)) {
            return response()->json(['message' => 'Mail Sent Sucssfully'], 200);
        }else{
            return response()->json(['message' => 'Mail Sent fail'], 400);
        }
    }


}
