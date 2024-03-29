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
    public function getPermisos(Request $arrRoles, $url)
    {
        $res = Permisos::join('pantallas','permisos.pantallas_id','=','pantallas.id')
                        ->join('menus','pantallas.menus_id','=','menus.id')
                        ->select('acceder', 'crear','modificar','eliminar')
                        ->whereIn('roles_id',$arrRoles)
                        ->where('url','=',$url)
                        //->whereIsNull('permisos.deleted_at')
                        ->get();

        return response()->json($res);

        /*
        $data = Role::orderBy('name','asc')
                    ->whereNull('deleted_at');

        $totRows = count($data->get());

        $permisos = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $permisos, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
        */
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
                $validator = $this->validaDatos($permiso, $request->id);
                if($validator->fails()){
                    //dd($permiso);
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
        $record = null;
        if(!is_null($permiso['id'])){
            $record = Permisos::find($permiso['id']);
        }

        if(!$record){
            $record = new Permisos();
        }

        $datos = array_diff($permiso,['created_at','updated_at','deleted_at']);
        $res = $record->fill($datos)->save();

        return $res;
    }

    /*
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
    */

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
                            pt.id AS pantallas_id,
                            pt.nombre AS pantalla,
                            roles_id,
                            acceder,
                            crear,
                            modificar,
                            eliminar,
                            pt.permite_crear,
                            pt.permite_modificar,
                            pt.permite_eliminar,
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
                                AND deleted_at IS NULL
                        ) p
                        RIGHT JOIN (
                            SELECT
                                id,
                                nombre,
                                permite_crear,
                                permite_modificar,
                                permite_eliminar
                            FROM
                                pantallas
                            WHERE
                                deleted_at IS NULL
                        ) AS pt ON p.pantallas_id = pt.id'
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

    /*
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
    */


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
