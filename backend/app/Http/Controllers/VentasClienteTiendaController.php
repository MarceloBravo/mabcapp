<?php

namespace App\Http\Controllers;

use App\Models\VentasClienteTienda;
use Illuminate\Http\Request;

class VentasClienteTiendaController extends Controller
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
            $venta = new VentasClienteTienda();
            $res = $venta->fill($request->all())->save();
            $mensaje = $res ? 'La venta ha sido registrada existosamente.' : 'La venta no se pudo registrar.';
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
     * @param  \App\Models\ventas_cliente_tienda  $ventas_cliente_tienda
     * @return \Illuminate\Http\Response
     */
    public function show(ventas_cliente_tienda $ventas_cliente_tienda)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ventas_cliente_tienda  $ventas_cliente_tienda
     * @return \Illuminate\Http\Response
     */
    public function edit(ventas_cliente_tienda $ventas_cliente_tienda)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ventas_cliente_tienda  $ventas_cliente_tienda
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $validacion = $this->validaDatos($request, $id);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMemnsaje' => 'danger', 'errores' => $validacion->errors()]);
            }
            $venta = VentasClienteTienda::find($id);
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
     * @param  \App\Models\ventas_cliente_tienda  $ventas_cliente_tienda
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $venta = new VentasClienteTienda($id);
            $res = $venta->delete();
            $mensaje = $res ? 'La venta ha sido eliminada existosamente.' : 'La venta no se pudo eliminar.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al intentar eliminar los datos de la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }

    private function validaDatos(Rquest $request, $id = null){
        $rules = [
            'cliente_id' => 'require|exists:clientes,id',
            'venta_id' => 'require|exists:ventas,id'
        ];

        $messages = [
            'cliente_id.require' => 'Debe especificar el cliente de la venta.',
            'cliente_id.exists' => 'El cliente especificado no existe en la base ed datos.',

            'venta_id.require' => 'Debe especificar el código de la venta.',
            'venta_id.exists' => 'La venta registrada no existe.'
        ];

        return Validate::make($rules, $messages, $request->all());
    }
}
