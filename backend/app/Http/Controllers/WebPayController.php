<?php

//https://www.youtube.com/watch?v=2ukG7ue6GzQ
//Obs.: Para interactuar con webpay, levantar el servidor artisan en un puerto público
//P.ej: 192.168.43.118:3000

//https://www.miip.cl/ = 181.203.48.208
//ipconfig              = ipv4   192.168.43.118:3000
//php artisan serve --host=0.0.0.0 --port=8080      //https://stackoverflow.com/questions/17990820/set-port-for-php-artisan-php-serve
namespace App\Http\Controllers;

use App\Models\WebPay;
use App\Models\Venta;
use Illuminate\Http\Request;

//instalar dependecias de Transbak: composer require transbank/transbank-sdk:~2.0
use Transbank\Webpay\WebpayPlus;
use Transbank\Webpay\WebpayPlus\Transaction;

class WebPayController extends Controller
{
    public function __constructor(){
        if(app()->enviroment('production')){
            WebpayPlus::configureForProduction(
                env('webpay_plus_cc'),
                env('webpay_plus_api_key')
            );
        }else{
            WebpayPluss::configureForTesting();
        }
    }


    public function startTransaction(Request $request){
        $nuevaVenta = new Webpay();
        $nuevaVenta->fill($request->all())->save();
        $url_to_pay = self::startWebpayPlusTransaction($nuevaVenta);
        return $url_to_pay;
    }


    public function startWebpayPlusTransaction($nuevaVenta){
        //dd(var_dump(openssl_get_cert_locations()));
        $transaction = (new Transaction)->create(
            $nuevaVenta->id,
            $nuevaVenta->session_id,
            $nuevaVenta->ammount,
            route('wp/confirmar_transaccion')
        );
        $url = $transaction->getUrl().'?token_ws='.$transaction->getToken();
        return $url;
    }



    public function confirmPay(Request $request){

        if($request->token_ws){
            $confirmacion = (new Transaction)->commit($request->token_ws);

            $wp = Webpay::where('id',$confirmacion->buyOrder)->first();
            $wp->venta_id = self::registrarVenta($wp->ammount);
            $wp = self::actualizaDatosTransaccion($wp, $confirmacion);
            $wp->update();


            if($confirmacion->isApproved()){
                return redirect(env('URL_FRONTEND_AFTER_PAYMENT')."/{$wp->id}/{$wp->status}/{$wp->venta_id}");
            }else{
                return redirect(env('URL_FRONTEND_AFTER_PAYMENT')."/{$wp->id}/{$confirmacion->status}/{$wp->venta_id}");
            }
        }else{
            return redirect(env('URL_FRONTEND_AFTER_PAYMENT'));
        }
    }


    public function cancelPay(Request $request){

        return redirect(env('URL_FRONTEND_AFTER_PAYMENT')."/{$wp->id}/{$confirmacion->status}/{$wp->venta_id}");

    }


    private function actualizaDatosTransaccion($venta, $confirmacion){
        $venta->vci = $confirmacion->vci;
        $venta->status = $confirmacion->status;
        $venta->response_code = $confirmacion->responseCode;
        $venta->authorization_code = $confirmacion->authorizationCode;
        $venta->account_date = $confirmacion->accountingDate;
        $venta->vci = $confirmacion->vci;
        $venta->installments_numbers = $confirmacion->installmentsNumber;
        $venta->buy_order = $confirmacion->buyOrder;
        $venta->card_number = $confirmacion->cardNumber;
        $venta->transaccion_date = $confirmacion->transactionDate;
        $venta->payment_type_code = $confirmacion->paymentTypeCode;
        $venta->card_detail = json_encode($confirmacion->cardDetail);

        return $venta;
    }


    public function show($id){
        $venta = Webpay::find($id);

        return response()->json($venta);
    }

    private function registrarVenta($monto){
        $venta = new Venta();
        $venta->fecha_venta_tienda = Date('Y-m-d');
        $venta->total = $monto;
        $res = $venta->save();
        return $res ? $venta->id : -1;
    }
}

/*
Solición al problema del certificado SSL
https://newbedev.com/uncaught-guzzlehttp-exception-requestexception-curl-error-60-ssl-certificate-problem-unable-to-get-local-issuer-certificate-see-https-curl-haxx-se-libcurl-c-libcurl-errors-html-for-code-example

1. Download the certificate bundle.

2. Put it somewhere. In my case, that was c:\wamp\ directory (if you are using
	Wamp 64 bit then it's c:\wamp64\).

3. Enable mod_ssl in Apache and php_openssl.dll in php.ini (uncomment them by
	removing ; at the beginning). But be careful, my problem was that I had two
	php.ini files and I need to do this in both of them. One is the one you get
	from your WAMP taskbar icon, and another one is, in my case, in
	C:\wamp\bin\php\php5.5.12\

4. Add these lines to your cert in both php.ini files:
	curl.cainfo="C:/wamp/cacert.pem"
    openssl.cafile="C:/wamp/cacert.pem"

5. Restart Wamp services.

Obtención del certificado SSL
https://raw.githubusercontent.com/bagder/ca-bundle/master/ca-bundle.crt
*/
