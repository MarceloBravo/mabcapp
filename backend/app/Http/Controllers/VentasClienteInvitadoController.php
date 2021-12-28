<?php

namespace App\Http\Controllers;

use App\Models\VentasClienteInvitado;
use Illuminate\Http\Request;

class VentasClienteInvitadoController extends Controller
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
            $venta = new VentasClienteInvitado();
            $res = $venta->fill($request->all())->save();
            $mensaje = $res ? 'Los datos de la venta ha sido registrada existosamente.' : 'No fue posible actualizar los datos de la venta.';
            $tipoMensaje = $res ? 'success' : 'danger';
            $id = $res ? $venta->id : -1;

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar registrar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ventasClienteInvitado  $ventasClienteInvitado
     * @return \Illuminate\Http\Response
     */
    public function show(ventasClienteInvitado $ventasClienteInvitado)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ventasClienteInvitado  $ventasClienteInvitado
     * @return \Illuminate\Http\Response
     */
    public function edit(ventasClienteInvitado $ventasClienteInvitado)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ventasClienteInvitado  $ventasClienteInvitado
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $validacion = $this->validaDatos($request);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMemnsaje' => 'danger', 'errores' => $validacion->errors()]);
            }
            $venta = VentasClienteInvitado::find($id);
            $res = $venta->fill($request->all())->save();
            $mensaje = $res ? 'Los datos de la venta ha sido actualizada existosamente.' : 'No fue posible actualizar los datos de la venta.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar registrar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ventasClienteInvitado  $ventasClienteInvitado
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $venta = VentasClienteInvitado::find($id);
            $res = $venta->delete();
            $mensaje = $res ? 'Los datos de la venta han sido eliminados.' : 'No fue posible eliminar los datos de la venta.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar eliminar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }
}
