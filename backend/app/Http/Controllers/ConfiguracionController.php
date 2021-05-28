<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Configuracion;
use Validator;

class ConfiguracionController extends Controller
{
    public function index()
    {
        $data = Configuracion::skip(0)->take(1)->get();

        return response()->json($data);
    }


    public function store(Request $request)
    {
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje'=> 'Datos incompletos o no válidos.','tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        $reg = Configuracion::skip(0)->take(1)->get();
        $config = Configuracion::find($reg[0]['id']);
        $res = $config->fill($request->all())->save();
        $mensaje = $res ? 'Los datos han sido actualizadios.' : 'Ocurrió un error al intentar actualizar los datos.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $reg[0]['id']]);
    }


    private function validaDatos(Request $request)
    {
        $rules = [
            'nombre_app' => 'required|min:3|max:15'
        ];

        $messages = [
            'nombre_app.required' => 'El nombre de la aplicación es obligatorio.',
            'nombre_app.min' => 'El nombre de la aplicación debe tener almenos 3 carácteres. Ingresa un nombre más largo.',
            'nombre_app.max' => 'El nombre de la aplicación debe tener hasta 15 carácteres. Ingresa un nombre más corto.',
        ];

        return Validator::make($request->all(),$rules, $messages);
    }
}
