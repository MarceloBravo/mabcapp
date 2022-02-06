<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConfigOfertaPrincipal;
use Validator;

class ConfigImagenPrincipalController extends Controller
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
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            $reg = new ConfigOfertaPrincipal();
            $res = $reg->fill($request->all())->save();
            $mensaje = $res ? 'El registro ha sido creado.' : 'Ocurrió un error al intentar crear el registro';
            $tipoMensaje = $res ? 'success' :'danger';
            $id = $res ? $reg->id : -1;

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(Exception $e){
            return response()->json(['mensaje' => 'Ocurrió un error al intentar actualizar la foto: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id'=> $id]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $data = ConfigOfertaPrincipal::first();

        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            $reg = ConfigOfertaPrincipal::find($id);
            $res = $reg->fill($request->all())->save();
            $mensaje = $res ? 'El registro ha sido actualizado.' : 'Ocurrió un error al intentar actualizar el registro';
            $tipoMensaje = $res ? 'success' :'danger';
            $id = $reg->id;

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(Exception $e){
            return response()->json(['mensaje' => 'Ocurrió un error al intentar actualizar la foto: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id'=> $id]);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $reg = ConfigOfertaPrincipal::find($id);
            $res = $reg->delete();
            $mensaje = $res ? 'El registro ha sido eliminado.' : 'Ocurrió un error al intentar eliminar el registro';
            $tipoMensaje = $res ? 'success' :'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(Exception $e){
            return response()->json(['mensaje' => 'Ocurrió un error al intentar actualizar la foto: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id'=> $id]);
        }
    }

    private function ValidaDatos(Request $request){
        $rules = [
            'texto1' => 'max:50',
            'texto2' => 'max:50',
            'texto_boton' => 'max:50',
            'src_imagen' => 'required|max:500',
            'link' => 'max:500',
            'posicion_horizontal' => 'required|max:10',
            'posicion_vertical' => 'required|max:10'
        ];

        $messages = [
            'texto1.max' => 'El texto 1 de la oferta principal debe tener un máximo de 50 carácteres. Ingresa un texto más corto.',

            'texto2.max' => 'El texto 2 de la oferta principal debe tener un máximo de 50 carácteres. Ingresa un texto más corto.',

            'texto_boton.max' => 'El texto del boton de la oferta principal debe tener un máximo de 50 carácteres. Ingresa un texto más corto.',

            'src_imagen.required' => 'La imagen para la oferta principal es obligatoria',
            'src_imagen.max' => 'La url de la imagen debe tener un máximo de 500 carácteres. Selecciona una imagen con un nombre más corto.',
            'link.max' => 'La url de destino del botón debe tener un máximo de 500 carácteres. Ingresa una url más corta.',

            'posicion_horizontal.required' => 'La posición horizontal del texto de la imagen es obligatoria.',
            'posicion_horizontal.max' => 'La posición horizontal del texto no debe superar los 10 carácteres. Ingresa un texto más corto.',

            'posicion_vertical.required' => 'La posición vertical del texto de la imagen es obligatoria.',
            'posición_vertical.max' => 'La posición vertical del texto no debe superar los 10 carácteres. Ingresa un texto más corto.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }

    public function uploadImage(Request $request){
        $res = '';
        try{
            if(count($_FILES)>0){
                move_uploaded_file($_FILES["upload"]["tmp_name"],storage_path().'/app/public/oferta_home/'.$_FILES['upload']['name']);

                $res = 'La imagen ha sido subida exitosamente.';
            }else{
                $res = 'No se han encontrado archivos.';
            }
            return response()->json(['mensaje' => $res, 'tipoMensaje' => 'success']);
        }catch(Exception $e){
            return response()->json(['mensaje' => 'Ocurrió un error al intentar actualizar la imagen: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id'=> $id]);
        }
    }

}
