<?php

namespace App\Http\Controllers;

use App\Models\venta;
use App\Models\VentasClienteTienda;
use App\Models\VentasClienteInvitado;
use Illuminate\Http\Request;
use Validator;
use DB;

class VentaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    public function show(venta $venta)
    {
        //
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

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
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
            $venta = Venta::find($id);
            $res = $venta->delete();
            $mensaje = $res ? 'La venta ha sido eliminada existosamente.' : 'La venta no pudo ser eliminada.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar eliminar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
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
