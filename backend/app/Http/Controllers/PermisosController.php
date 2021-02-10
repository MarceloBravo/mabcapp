<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Permisos;
use App\Models\Role;
use Validator;

class PermisosController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag = 0)
    {

        $data = Role::orderBy('name','asc')
                    ->whereNull('deleted_at');

        $totRows = count($data->get());

        $permisos = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $permisos, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }


    //Retorna todos los permisos
    public function getAll()
    {
        $data = Permisos::all();
        return response()->json($data->toArray());
    }


    //Recibe y valida los datos de los permisos asociados a un rol por post, para posteriormente ser grabados
    public function save(Request $request)
    {
        try{
            DB::beginTransaction();
            foreach($request->permisos as $permiso ){
                //Validando datos
                //$permiso['roles_id'] = $request->id;
                $validator = $this->validaDatos($permiso, $request->id);
                if($validator->fails()){
                    dd($permiso);
                    return response()->json(['mensaje' => 'Datos incompletos o no válidos', 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
                }

                if(!$this->store($permiso))
                {
                    throw new Exception('Error  al registrar los permisos.');
                }
            }
            DB::commit();
            return response()->json(['mensaje' => 'Los permisos han sido registrados exitosamente', 'tipoMensaje' => 'success']);
        }catch(Exception $ex){
            DB::rollback();
            return response()->json(['mensaje' => 'Ocurrió un error  al intrentar registrar los permisos', 'tipoMensaje' => 'danger', 'errores' => $ex->message()]);
        }
        return response()->json(['mensaje' => 'No se detectaron datos para grabar.','tipoMensaje'=>'success']);

    }


    //Graba los permisos asociados a un rol
    private function store($permiso)
    {
        $found = null;
        if(!is_null($permiso['id'])){
            $found = Permisos::find($permiso['id']);
        }

        if($found){
            return $this->update($permiso);
        }else{
            return $this->insert($permiso);
        }

    }

    //Actualiza en la base de datos, los permisos asociados a un rol
    private function update($permiso)
    {
        $record = Permisos::find($permiso['id']);
        $res = $record->fill($permiso)->save();
        return $res;
    }

    //Ingresa a la base de datos, los permisos asociados a un rol
    private function insert($permiso)
    {
        $record = new Permisos();
        $res = $record->fill($permiso)->save();
        return $res;
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = DB::select('SELECT
                            p.id,
                            pantallas.id as pantallas_id,
                            pantallas.nombre as pantalla,
                            roles_id,
                            acceder,
                            crear,
                            modificar,
                            eliminar,
                            pantallas.permite_crear,
                            pantallas.permite_modificar,
                            pantallas.permite_eliminar,
                            p.created_at,
                            p.updated_at,
                            p.deleted_at
                        FROM
                        (
                            SELECT
                                id,
                                roles_id,
                                pantallas_id,
                                acceder,
                                crear,
                                modificar,
                                eliminar,
                                created_at,
                                updated_at,
                                deleted_at
                            FROM
                                permisos
                            WHERE
                                permisos.roles_id =  '.$id.'
                        ) p
                        RIGHT JOIN pantallas ON p.pantallas_id = pantallas.id '
                    );
    /*
        $data = Permisos::rightJoin('roles','permisos.roles_id','=','roles.id')
                        ->rightJoin('pantallas','permisos.pantallas_id','=','pantallas.id')
                        ->select('permisos.*','roles.name as rol','pantallas.nombre as pantalla')
                        ->where('roles.id','=',$id)
                        ->whereNull('roles.deleted_at')
                        ->whereNull('pantallas.deleted_at')
                        //->get();
                        ->toSql();
    */
        return response()->json($data);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function filter($texto, $pag = 0)
    {
        $data = Permisos::join('roles','permisos.roles_id','=','roles.id')
                        ->leftJoin('pantallas','permisos.pantallas_id','=','pantallas.id')
                        ->select('permisos.roles_id','roles.name as rol')
                        ->where('roles.name','Like','%'.$texto.'%')
                        ->orWhere('pantallas.nombre','Like','%'.$texto.'%')
                        ->whereNull('roles.deleted_at')
                        ->whereNull('pantallas.deleted_at')
                        ->orderBy('roles.name','asc')
                        ->groupBy('permisos.roles_id','roles.name');

        $totRows = count($data->get());

        $permisos = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $permisos, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }


    private function validaDatos($permisos, $id)
    {
        $rules = [
            'pantallas_id' => 'required|exists:pantallas,id'
        ];

        $messages = [
            'pantallas_id.required' => 'Debe seleccionar una panatalla de la aplicaión.',
            'pantallas_id.exists' => 'La pantalla seleccionada no existe o no fue encontrada.',
        ];

        return Validator::make($permisos,$rules,$messages);
    }
}
