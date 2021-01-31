<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RoleUser;
use Validator;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag = 0)
    {
        $allData = User::select(
                        'id',
                        'name',
                        'a_paterno',
                        'a_materno',
                        'email',
                        'direccion',
                        'created_at',
                        'updated_at',
                        'deleted_at'
                    )
                    ->orderBy('name','asc');

        $totRows = count($allData->get());

        $users = $allData->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $users->toArray(), 'rows' => $totRows, 'page' => $pag, 'rowsPerPage' => $this->rowsPerPage]);
    }

    public function getAll(){
        $users = User::orderBy('name','ASC')
                    ->orderBy('a_paterno','ASC')
                    ->orderBy('a_materno','ASC')
                    ->get();

        return response()->json($users->toArray());
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
        $validator = $this->validaDatos($request, null);
        if($validator->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.','tipoMensaje'=>'danger','errores'=>$validator->errors()]);
        }
        try{
            DB::beginTransaction();
            $user = new User();
            $res = $user->fill($request->all())->save();
            $id = $res ? $user->id : -1;

            if($res){
                $res = $this->saveRol($request->roles, $id);
            }
            $mensaje = $res ? 'El registro ha sido creado exitosamente.' : 'Ocurrió un error al intentar crear el registro.';
            $tipoMensaje = $res ? 'success' : 'danger';

            if($res){
                DB::commit();
            }else{
                DB::rollback();
            }

        }catch(\PDOException $e){
            $mensaje = 'Error al intentar crear el registro.';
            $tipoMensaje = 'danger';
            $id = -1;
            DB::rollback();
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        $user['roles'] = $user->roles();

        return response()->json($user->toArray());
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
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.','tipoMensaje'=>'danger','errores'=>$validator->errors()]);
        }
        try{
            DB::beginTransaction();
            $user = User::find($id);
            if($request->all()['password']){
                $res = $user->fill($request->all())->save();
            }else{
                $res = $user->fill($request->except(['password']))->save();
            }
            if($res){
                $res = $this->saveRol($request->roles, $id);
            }
            $mensaje = $res ? 'El usuario ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el usuario.';
            $tipoMensaje = $res ? 'success' : 'danger';
            if($res){
                DB::commit();
            }else{
                DB::rollback();
            }

        }catch(\DBException $e){
            $mensaje = 'Error al intentar crear el registro.';
            $tipoMensaje = 'danger';
            $id = -1;
            DB::rollback();
        }

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
        $user = User::find($id);
        $res = $user->delete();
        $mensaje = $res ? 'El usuario ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el usuario.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($buscado, $pag = 0){
        $allData = User::select(
                            'id',
                            'name',
                            'a_paterno',
                            'a_materno',
                            'email',
                            'direccion',
                            'created_at',
                            'updated_at',
                            'deleted_at'
                        )
                        ->where('name','Like','%'.$buscado.'%')
                        ->orWhere('email','Like','%'.$buscado.'%')
                        ->orWhere('a_paterno','Like','%'.$buscado.'%')
                        ->orWhere('a_materno','Like','%'.$buscado.'%')
                        ->orderBy('name','asc');

        $totRows = count($allData->get());

        $users = $allData->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $users->toArray(), 'rows' => $totRows, 'page' => $pag, 'rowsPerPage' => $this->rowsPerPage]);
    }


    private function saveRol($roles, $idUser){
        $rolesId = [];
        foreach($roles as $rol){
            array_push($rolesId, $rol['id']);
        }
        $rolesUser = RoleUser::where('user_id','=',$idUser)->whereNotIn('role_id',$rolesId);
        if(count($rolesUser->get()) > 0){
            if(!$rolesUser->delete()){return false;}
        }

        foreach($roles as $rol){
            if(!$this->insertRol($rol["id"], $idUser)){return false;};
        }

        return true;
    }


    private function insertRol($idRol, $idUser){
        $res = true;
        $rolesUser = RoleUser::where('user_id','=',$idUser)->where('role_id',$idRol);
        if(count($rolesUser->get()) == 0){
            $rol = new RoleUser();
            $res = $rol->fill(['role_id' => $idRol, 'user_id' => $idUser])->save();
        }
        return $res;
    }


    private function updateRol($idRol, $idUser){
        $res = true;
        $rol = RoleUser::where('role_id','=',$idRol)->where('role_id','=',$idUser);
        if($rol != null){
            $res = $rol->fill($rolUser)->save();
        }

        return $res;
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'name' => 'required|min:5|max:50',
            'email' => 'required|email|unique:users,email,'.$id,
            'a_paterno' => 'required|min:2|max:50',
            'a_materno' => 'required|min:2|max:50',
            'direccion' => 'required|min:10|max:150',
        ];

        if(!$id){
            $rules += ['password' => 'required|min:6|max:20'];
        }

        $messages = [
            'name.required' => 'El nombre del usuario es obligatorio.',
            'name.min' => 'El nombre del usuario debe tener un mínimo de 5 carácteres. Ingresa un nombre más largo.',
            'name.max' => 'El nombre del usuario debe tener un máximo de 50 carácteres. Ingresa un nombre más corto.',

            'email.required' => 'El email del usuario es obligatorio.',
            'email.min' => 'El email debe tener un mínimo de 5 carácteres. Ingresa un email más largo.',
            'email.max' => 'El email debe tener un máximo de 50 carácteres. Ingresa un email más corto.',
            'email.unique' => 'El email ya se encuentra registrado por otro usuario. Ingresa una dirección de email diferente.',

            'a_paterno.required' => 'El apellido Paterno es obligatorio.',
            'a_paterno.min' => 'El apellido Paterno debe tener un mínimo de 5 carácteres. Ingresa un apellido más largo.',
            'a_paterno.max' => 'El apellido Paterno debe tener un máximo de 50 carácteres. Ingresa un apellido más corto.',

            'a_materno.required' => 'El apellido Materno es obligatorio.',
            'a_materno.min' => 'El apellido Materno debe tener un mínimo de 5 carácteres. Ingresa un apellido más largo.',
            'a_materno.max' => 'El apellido Materno debe tener un máximo de 50 carácteres. Ingresa un apellido más corto.',

            'direccion.required' => 'La dirección es obligatoria.',
            'direccion.min' => 'La dirección debe tener un mínimo de 10 carácteres. Ingresa una dirección más largo.',
            'direccion.max' => 'La dirección debe tener un máximo de 150 carácteres. Ingresa una dirección más corto.',
        ];

        if(!$id){
            $rules += [
                'password.required' => 'La contraseña es obligatoria.',
                'password.min' => 'La contraseña debe tener un mínimo de 6 carácteres. Ingresa una contraseña más larga.',
                'password.max' => 'La contraseña debe tener un máximo de 20 carácteres. Ingresa una contraseña más corta.'
            ];

        }

        return Validator::make($request->all(), $rules, $messages);
    }

}
