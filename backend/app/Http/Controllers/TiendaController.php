<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tienda;
use Validator;

class TiendaController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $tienda = Tienda::first();

        return response()->json($tienda);
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
        $validacion = $this->validaDatos($request, $id);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Existen datos no válidos o incompletos.', 'tipoMensaje' =>'danger', 'errores' => $validacion->error()]);
        }
        $tienda = Tienda::first();
        $res = $tienda->fill($request->all())->save();
        $mensaje = $res ? 'Los datos de la tienda han sido actualizados.' : 'Ocurrió un error al intentar actualizar los datos de la tienda.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre_tienda' => 'required|min:3|max:100|unique:tienda,id,'.$id,
            'fono_venta' => 'required|min:6|max:30',
            'email' => 'required|email|max:150',
            'direccion' => 'required|min:8|max:255',
        ];

        $messages = [
            'nombre_tienda.required' => 'El nombre de la tienda es obligatorio. Ingrese un nombre para la tienda.',
            'nombre.min' => 'El nombre de la tienda debe tener almenos 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre de la tienda debe tener hasta 100 carácteres. Ingresa un nombre más corto.',
            'nombre_tienda.unique' => 'El nombre de la tienda ya se encuentra en uso, Ingresa un nombre diferente.',

            'fono_venta.required' => 'El fono de ventas es obligatorio. Ingrese el teléfono de ventas.',
            'fono_ventas.min' => 'El fono de ventas debe tener almenos 6 carácteres. Ingresa un fono más largo.',
            'fono_ventas.max' => 'El fono de ventas debe tener hasta 30 carácteres. Ingresa un fono más corto.',

            'email.required' => 'El correo lectrónico es obligatorio. Ingrese el email de contacto.',
            'email.email' => 'El correo electrónio ingresado no es válido.',
            'email.max' => 'El correo electrónico debe tener un máximo de 150 carácteres. Ingresa un email más corta.',

            'direccion.required' => 'La dirección de la teinda es obligatoria.',
            'direccion.min' => 'La dirección debe tener almenos 8 carácteres. Ingresa una dirección más larga.',
            'direccion.max' => 'La dirección debe tener hasta 255 carácteres. Ingresa una dirección más corta.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
