<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Validator;

class RolesController extends Controller
{
    private $rowsPerPag = 10;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag = 0)
    {
        $allRol = Role::select(
                            'id',
                            'name',
                            'description',
                            'created_at',
                            'updated_at',
                            'deleted_at'
                        )
                        ->orderBy('name','asc');

        $totReg = count($allRol->get());

        $roles = $allRol->skip($this->rowsPerPag * $pag)
                    ->take($this->rowsPerPag)
                    ->get();

        return response()->json(['data' => $roles->toArray(), 'rows' => $totReg, 'page' => $pag, 'rowsPerPage' => $this->rowsPerPag]);
    }


    public function getAll(){
        $roles = Role::orderBy('name','asc')->get();

        return response()->json($roles->toArray());
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
        $validator = $this->validaDatos($request);
        if($validator->fails()){
            return response(['mensaje' => 'Datos incompletos o no válidos:', 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
        }
        $rol = new Role();
        $res = $rol->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido ingresado.' : 'Ocurrió un error al intentar crear el registro';
        $tipoMensaje = $res ? 'success' : 'danger';
        $id = $res ? $rol->id : -1;

        return response(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rol = Role::find($id);

        return response()->json($rol);
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
        $validator = $this->validaDatos($request, $id);
        if($validator->fails()){
            return response(['mensaje' => 'Datos incompletos o no válidos:', 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
        }
        $rol = Role::find($id);
        $res = $rol->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido actualizado.' : 'Ocurrió un error al intentar actualizar el registro';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $rol = Role::find($id);
        $res = $rol->delete();
        $mensaje = $res ? 'El registro ha sido eliminado.' : 'Ocurrió un error al intentar eliminar el registro';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    private function validaDatos(Request $request, $id = null){
        $rules = [
            'name' => 'required|min:5|max:50|unique:roles,name,'.$id,
            'description' => 'required|min:10|max:150'
        ];

        $messages = [
            'name.required' => 'El nombre del rol es obligatorio.',
            'name.min' => 'El nombre del rol debe tener almenos 5 carácteres, ingrese un nombre más largo.',
            'name.max' => 'El nombre del rol debe tener hasta 50 carácteres, ingrese un nombre más corto.',
            'name.unique' => 'El nombre del rol ya se encuentra registrado. Ingrese un nombre diferente.',

            'description.required' => 'Debes ingresar una descripción para el rol.',
            'description.min' => 'La descripción del rol debe tener almenos 10 carácteres, ingrese una descripción más larga.',
            'description.max' => 'La descripción del rol debe tener hasta 150 carácteres, ingrese una descripción más corta.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }


    public function filter($buscado, $pag = 0){
        $allData = Role::select(
                            'id',
                            'name',
                            'description',
                            'created_at',
                            'updated_at',
                            'deleted_at'
                        )
                        ->where('name','Like','%'.$buscado.'%')
                        ->orWhere('description','Like','%'.$buscado.'%')
                        ->orderBy('name','asc');

        $totReg = count($allData->get());

        $roles = $allData->skip($this->rowsPerPag * $pag)
                        ->take($this->rowsPerPag)
                        ->get();

        return response()->json(['data' => $roles->toArray(), 'rows' => $totReg, 'page' => $pag, 'rowsPerPage' => $this->rowsPerPag]);
    }

}
