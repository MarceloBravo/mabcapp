<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;
use Validator;

class ClientesController extends Controller
{
    private $rowsPerPage = 10;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $records = Cliente::orderBy('apellido1', 'asc')
                        ->orderBy('apellido2', 'asc')
                        ->orderBy('nombres','asc');

        $totRows = count($records->get());

        $data = $records->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rows' => $totRows, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag]);
    }


    public function getAll(){
        $records = Cliente::all();

        return response()->json($records->toArray());
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
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }

        $cliente = new Cliente();

        $cliente = $this->subirImagen($request, $cliente);

        $res = $cliente->fill($request->all())->save();
        $mensaje = $res ? 'El cliente ha sido ingresado.' : 'Ocurrió un error al intentar ingresar el cliente.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $newId = $res ? $cliente->id : -1;

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $newId]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $cliente = Cliente::find($id);

        return response()->json($cliente);
    }


    public function findByRut($rut){
        $cliente = Cliente::where('rut','=',$rut)->first();

        return response()->json($cliente);
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
        $validacion = $this->validaDatos($request, $id);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        $cliente = Cliente::find($id);

        $cliente = $this->subirImagen($request, $cliente);

        $res = $cliente->fill($request->all())->save();
        $mensaje = $res ? 'El cliente ha sido actualizado.' : 'Ocurrió un error al intentar actualizar el cliente.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $cliente = Cliente::find($id);
        $res = $cliente->delete();
        $mensaje = $res ? 'El cliente ha sido eliminado.' : 'Ocurrió un error al intentar eliminar el cliente.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    public function filter($texto, $pag){
        $records = Cliente::where('rut','like','%'.$texto.'%')
                        ->orWhere('nombres','like','%'.$texto.'%')
                        ->orWhere('apellido1','like','%'.$texto.'%')
                        ->orWhere('apellido2','like','%'.$texto.'%')
                        ->orWhere('ciudad','like','%'.$texto.'%')
                        ->orWhere('ciudad','like','%'.$texto.'%')
                        ->orWhere('direccion','like','%'.$texto.'%')
                        ->orWhere('email','like','%'.$texto.'%')
                        ->orWhere('fono','like','%'.$texto.'%')
                        ->orWhere('casa_num','like','%'.$texto.'%')
                        ->orWhere('block_num','like','%'.$texto.'%')
                        ->orWhere('referencia','like','%'.$texto.'%')
                        ->orWhere('created_at','like','%'.$texto.'%')
                        ->orWhere('updated_at','like','%'.$texto.'%')
                        ->orderBy('apellido1', 'asc')
                        ->orderBy('apellido2', 'asc')
                        ->orderBy('nombres','asc');


        $totRows = count($records->get());

        $data = $records->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rows' => $totRows, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'rut' => 'required|min:9|max:13',
            'nombres' => 'required|min:2|max:50',
            'apellido1' => 'required|min:2|max:50',
            'cod_region' => 'required',
            'cod_provincia' => 'required',
            'cod_comuna' => 'required',
            'ciudad' => 'required|min:2|max:20',
            'direccion' => 'required|min:2|max:255',
            'email' => 'required|email|max:255',
            'fono' => 'required|min:8|max:20',
            'casa_num' => 'required|max:10',
            'referencia' => 'max:255'
        ];

        if($request['apellido2']){
            $rules += ['apellido2' => 'min:2|max:50'];
        }

        if(!$request['id'] || ($request['id'] && $request['password'])){
            $rules += ['password' => 'required|min:6|max:20'];
        }

        if($request['block_num']){
            $rules += ['block_num' => 'min:1|max:10'];
        }

        if($request['foto']){
            $rules += ['foto' => 'max:255'];
        }

        $messages = [
            'rut.required' => 'El rut del cliente es obligatorio.',
            'rut.min' => 'El rut debe tener un mínimo de 9 carácteres. Ingresa un rut más largo',
            'rut.max' => 'El rut debe tener un máximo de 13 carácteres. Ingresa un rut más corto',

            'nombres.required' => 'El nombre del cliente es obligatorio.',
            'nombres.min' => 'El nombre debe tener un mínimo de 2 carácteres. Ingresa un nombre más largo',
            'nombres.max' => 'El nombre debe tener un máximo de 50 carácteres. Ingresa un nombre más corto',

            'apellido1.required' => 'El primer apellido es obligatorio.',
            'apellido1.min' => 'El primer apellido debe tener un mínimo de 2 carácteres. Ingresa un apellido más largo',
            'apellido1.max' => 'El primer apellido debe tener un máximo de 50 carácteres. Ingresa un apellido más corto',

            'cod_region.required' => 'Debe seleccionar una región válida',
            'cod_provincia.required' => 'Debe seleccionar una provincia válida',
            'cod_comuna.required' => 'Debe seleccionar una comuna válida',

            'ciudad.required' => 'Debe ingresar el nombre de la ciudad',
            'ciudad.min' => 'El nombre de la ciudad debe tener un mínimo de 2 carácteres. Ingresa un nombre más largo',
            'ciudad.max' => 'El nombre de la ciudad debe tener un máximo de 20 carácteres. Ingresa un nombre más corto',

            'direccion.required' => 'La dirección es obligatoria.',
            'direccion.min' => 'La dirección debe tener un mínimo de 2 carácteres. Ingresa una dirección más larga',
            'direccion.min' => 'La dirección debe tener un máxima de 255 carácteres. Ingresa una dirección más corta',

            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'El correo electrónico ingresado no es válido',
            'direccion.min' => 'El correo electronico debe tener un máxima de 255 carácteres. Ingresa un email más corto',

            'fono.required' => 'Debe ingresar un número de treléfono.',
            'fono.min' => 'El número de teléfono debe tener un mínimo de 8 cifras. Ingresa un número más largo',
            'fono.max' => 'El número de teléfono debe tener un máximo de 20 cifras. Ingresa un número más corto',

            'casa_num.required' => 'El número de casa es obligatorio.',
            'casa_num.max' => 'El número de casa no debe exceder los 10 carácteres. Ingresa un valor más corto',

            'referencia.max' => 'La referencia no puede exceder los 255 carácteres. Ingresa un texto más breve.'
        ];

        if($request['apellido2']){
            $messages += [
                'apellido2.min' => 'El segundo apellido debe tener un mínimo de 2 carácteres. Ingresa un apellido más largo.',
                'apellido2.max' => 'El segundo apellido debe tener un máximo de 50 carácteres. Ingresa un apellido más corto.'
            ];
        }

        if(!$request['id'] || ($request['id'] && $request['password'])){
            $messages += [
                'password.required' => 'Debe ingresar una contraseña.',
                'password.min' => 'La contraseña debe tener un mínimo de 6 carácteres. Ingresa una contraseña más larga.',
                'password.max' => 'La contraseña debe tener un máximo de 20 carácteres. Ingresa una contraseña más corta.'
            ];
        }

        if($request['block_num']){
            $messages += [
                'block_num.max' => 'El número de block no debe exceder los 10 carácteres. Ingresa un valor más corto',
            ];
        }

        if($request['foto']){
            $messages += ['foto.max' => 'La ruta de la foto es demasiado largo. Copia la imágen a una ruta más corta',];
        }

        return Validator::make($request->all(), $rules, $messages);
    }


    private function subirImagen(Request $request, Cliente $cliente){
         // script para subir la imagen
         if($request->hasFile("foto")){
            $imagen = $request->file("foto");
            $nombreimagen = Str::slug($request->nombre).".".$imagen->guessExtension();
            $ruta = public_path();

            //$imagen->move($ruta,$nombreimagen);
            copy($imagen->getRealPath(),$ruta.$nombreimagen);

            $cliente->foto = $nombreimagen;
        }

        return $cliente;
    }
}
