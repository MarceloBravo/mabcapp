<?php

namespace App\Http\Controllers;

use App\Models\venta;
use Illuminate\Http\Request;
use Validate;

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
            $id = $res ? $venta->id : -1;

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipomensaje, 'id' => $id]);
        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al registrar la venta: '.$e->getMessage();
            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => 'danger', 'id' => -1]);
        }
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


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'fecha_venta_tienda' => 'require',
            'total' => 'require',
        ];

        $messages = [
            'fecha_venta_tienda.require' => 'El campo fecha venta es obligatorio.',
            'total.require' => 'El total es obligatorio'
        ];

        return Validate::make($rules, $messages, $request->all());
    }
}
