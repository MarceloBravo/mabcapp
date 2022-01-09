<?php

namespace App\Http\Controllers;

use App\Models\venta as Venta;
use App\Models\VentasClienteTienda;
use App\Models\VentasClienteInvitado;
use App\Models\Producto;
use App\Models\DespachosVentas;
use App\Models\DetalleVenta;
use App\Models\WebPay;
use Illuminate\Http\Request;
use Validator;
use DB;

class VentaController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $registros = Venta::join('despachos_ventas','ventas.id','=','despachos_ventas.venta_id')
                            ->join(DB::raw(
                                    "(
                                    SELECT venta_id, rut, nombres, apellido1, apellido2 FROM `ventas_cliente_tienda`
                                    INNER JOIN clientes ON ventas_cliente_tienda.cliente_id = clientes.id
                                    UNION
                                    SELECT venta_id, rut, nombres, apellido1, apellido2 FROM ventas_cliente_invitado
                                    ) as ventas_cliente"
                                ),'ventas_cliente.venta_id','=','ventas.id')
                            ->join('web_pay','ventas.id','=','web_pay.venta_id')
                            ->select(
                                'ventas.*',
                                'web_pay.buy_order as orden_compra',
                                'ventas_cliente.rut',
                                DB::raw("CONCAT(ventas_cliente.nombres,' ',ventas_cliente.apellido1,' ',ventas_cliente.apellido2) as cliente"),
                                'despachos_ventas.fecha_despacho',
                                'despachos_ventas.direccion',
                                'despachos_ventas.ciudad',
                                'despachos_ventas.casa_num',
                                'despachos_ventas.block_num',
                                )
                            ->orderBy('created_at','asc')
                            ->distinct();

        //dd($registros->toSql());
        $totRows = count($registros->get());

        $data = $registros->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $validacion = $this->validaDatos($request);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMemnsaje' => 'danger', 'errores' => $validacion->errors()]);
            }
            $venta = new Venta();
            $res = $venta->fill($request->all())->save();
            $mensaje = $res ? 'La venta ha sido registrada existosamente.' : 'La venta no se pudo registrar.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar registrar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }


    private function registrarClienteTienda(Request $request, $id){
        $venta = new VentasClienteTienda();
        $venta->fill($request->all()['cliente_tienda']);
        $venta->venta_id = $id;
        return $venta->save();

    }


    private function registrarClienteInvitado(Request $request, $id){
        $venta = new VentasClienteInvitado();
        $venta->fill($request->all()['cliente_invitado']);
        $venta->venta_id = $id;
        return $venta->save();
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $venta = Venta::find($id);

        return response()->json($venta);
    }

    public function getCliente($id){
        $venta = Venta::find($id);
        if(!is_null($venta)){
            $cliente = $venta->clienteTienda();
            $venta['cliente'] = !is_null($cliente) ? $cliente : $venta->clienteInvitado();
        }

        return response()->json($venta);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function edit(venta $venta)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $validacion = $this->validaDatos($request);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMemnsaje' => 'danger', 'errores' => $validacion->errors()]);
            }
            $venta = Venta::find($id);
            $res = $venta->fill($request->all())->save();
            $mensaje = $res ? 'La venta ha sido actualizada existosamente.' : 'La venta no se pudo actualizar.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar actualizar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            DB::beginTransaction();
            $venta = Venta::find($id);
            $res = $venta->delete();
            $mensaje = $res ? 'La venta ha sido eliminada existosamente.' : 'La venta no pudo ser eliminada.';
            $tipoMensaje = $res ? 'success' : 'danger';
            if($res){
                $res = $this->anularDespacho($id);
                if(!$res){
                    $mensaje = "Ocurrio un error al intentar anular el despacho.";
                    $tipoMensaje = 'danger';
                }
            }
            if($res){
                $res = $this->borrarVentaCliente($id);
                if(!$res){
                    $mensaje = "Ocurrio un error al intentar eliminar los datos de la venta del despacho.";
                    $tipoMensaje = 'danger';
                }
            }
            if($res){
                $res = $this->actualizarStockCarrito($id);
                if(!$res){
                    $mensaje = "Ocurrio un error al intentar actualizar el stock de los productos.";
                    $tipoMensaje = 'danger';
                }
            }
            if($res){
                $res = $this->borrarWebpay($id);
                if(!$res){
                    $mensaje = "Ocurrio un error al intentar borrar los registros de webpay.";
                    $tipoMensaje = 'danger';
                }
            }

            if($res){
                DB::commit();
            }else{
                DB::rollBack();
            }
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar eliminar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }


    public function anularDespacho($id)
    {
        $despachos = DespachosVentas::where('venta_id','=',$id);
        if(count($despachos->get()) > 0){
            if(!$despachos->delete()){
                return false;
            }
        }
        return true;
    }


    public function borrarVentaCliente($idVenta)
    {
        if(!$this->borrarVentaClienteTienda($idVenta)){
            return false;
        }

        if(!$this->borrarVentaClienteInvitado($idVenta)){
            return false;
        }

        return true;
    }


    private function borrarVentaClienteTienda($idVenta){
        $ventaCli = VentasClienteTienda::where('venta_id','=',$idVenta);
        if(count($ventaCli->get()) > 0){
            if(!$ventaCli->delete()){
                return false;
            }
        }
        return true;
    }

    private function borrarVentaClienteInvitado($id){
        $ventaCli = VentasClienteInvitado::where('venta_id','=',$id);
        if(count($ventaCli->get()) > 0){
            if(!$ventaCli->delete()){
                return false;
            }
        }
        return true;
    }



    private function actualizarStockCarrito($idVenta)
    {
        $registros = DetalleVenta::where('venta_id','=',$idVenta);

        foreach($registros->get() as $item){
            $res = $this->actualizarStockProducto($item);
            if(!$res){
                return false;
            }
        }

        if(count($registros->get()) > 0 && !$this->borrarDetalleVenta($registros)){
            return false;
        }
        return true;
    }


    private function borrarDetalleVenta($registros)
    {
        if(!$registros->delete()){
            return false;
        }
        return true;
    }


    private function actualizarStockProducto($prod){
        $producto = Producto::find($prod->producto_id);
        if($producto){
            $producto->stock = $producto->stock + $prod->cantidad;
            if(!$producto->save()){
                return false;
            }
        }
        return true;
    }


    private function borrarWebpay($id){
        $webPay = WebPay::where('venta_id','=',$id);

        if(count($webPay->get()) > 0){
            return $webPay->delete();
        }
        return false;
    }


    private function validaDatos($venta){
        $rules = [
            'fecha_venta_tienda' => 'required',
            'total' => 'required',
        ];

        $messages = [
            'fecha_venta_tienda.required' => 'El campo fecha venta es obligatorio.',
            'total.require' => 'El total es obligatorio'
        ];

        return Validator::make($venta, $rules, $messages);
    }


    /*
    private function validaDatosClienteTienda($cliente){
        $rules = [
            'cliente_id' => 'required|exists:clientes,id',
        ];

        $messages = [
            'cliente_id.required' => 'El cliente es obligatorio.',
            'cliente_id.exists' => 'El cliente no se encuentra registrado o no existe.',
        ];


        return Validator::make($cliente, $rules, $messages);
    }


    private function validaDatosClienteInvitado($cliente){
        $rules = [
            'rut' => 'required|min:9|max:13',
            'nombres' => 'required|min:2|max:50',
            'apellido1' => 'required|min:2|max:50',
            'apellido2' => 'min:2|max:50',
            'fono' => 'required|min:6|max:20',
            'email' => 'required|email|max:255'
        ];

        $messages = [

            'rut.required' => 'El rut del cliente es oligatorio.',
            'rut.min' => 'El rut debe tener almenos 9 carácteres. Ingresa un rut mas largo',
            'rut.max' => 'El rut debe tener un máximo de 13 carácteres. Ingresa un rut mas corto.',

            'nombres.required' => 'El nombre del cliente es obligatorio.',
            'nombres.min' => 'El nombre del cliente debe tener almenos 2 carácteres. Ingresa un nombre mas largo.',
            'nombres.max' => 'El nombre del cliente debe tener hasta 50 carácteres. Ingresa un nombre mas corto',

            'apellido1.required' => 'El primer apellido es obligatorio.',
            'apellido1.min' => 'El primer apellido debe tener almenos 2 carácteres. Ingresa un apellido mas largo.',
            'apellido1.max' => 'El primer apellido debe tener hasta 50 carácteres. Ingresa un apellido mas corto',

            'apellido2.min' => 'El segundo apellido debe tener almenos 2 carácteres. Ingresa un apellido mas largo.',
            'apellido2.max' => 'El segundo apellido debe tener hasta 50 carácteres. Ingresa un apellido mas corto',

            'fono.required' => 'El teléfono del cliente es obligatorio.',
            'fono.min' => 'El teléfono debe tener almenos 6 carácteres. Ingresa un telefono mas largo',
            'fono.max' => 'El teléfono debe tener hasta 20 carácteres. Ingresa un teléfono mas largo',

            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El correo electrónico no es válido.',
            'email.max' => 'El email debe tener hasta 255 carácteres. Ingresa un corre electrónico mas corto.',
        ];

        return Validator::make($cliente, $rules, $messages);
    }
    */
}
