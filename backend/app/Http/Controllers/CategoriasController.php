<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;
use Validator;

class CategoriasController extends Controller
{
    private $rowsPerPage = 10;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $data = Categoria::orderBy('nombre', 'asc');

        $totReg = count($data->get());

        $dataPage = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $dataPage,  'rowsPerPage' => $this->rowsPerPage, 'rows' => $totReg, 'page' => $pag]);
    }


    public function getAll(){
        $data = Categoria::orderBy('nombre','asc')->get();
        foreach($data as $categoria){
            $categoria['subcategorias'] = $categoria->subCategorias();
        }

        return response()->json($data->toArray());
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
        $validate = $this->validaDatos($request);
        if($validate->fails()){
            return response()->json(['mensaje' => 'Datos no válidos o incompletos.', 'tipoMensaje' => 'danger', 'errores' => $validate->errors()]);
        }
        $categoria = new Categoria();
        $res = $categoria->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido creado exitosamente.' : 'Ocurrio un error al intentar crear el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $newId = $res ? $categoria->id : -1;

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
        $categoria = Categoria::find($id);

        return response()->json($categoria);
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
        $validate = $this->validaDatos($request, $id);
        if($validate->fails()){
            return response()->json(['mensaje' => 'Datos no válidos o incompletos.', 'tipoMensaje' => 'danger', 'errores' => $validate->errors()]);
        }
        $categoria = Categoria::find($id);
        if($categoria){
            $res = $categoria->fill($request->all())->save();
            $mensaje = $res ? 'El registro ha sido actualizado exitosamente.' : 'Ocurrio un error al intentar actualizar el registro.';
            $tipoMensaje = $res ? 'success' : 'danger';
        }else{
            $mensaje = 'El registro no ha sido encontrado. Imposible actualizar los datos';
            $tipoMensaje = 'danger';
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
        $categoria = Categoria::find($id);
        $res = $categoria->delete();
        $mensaje = $res ? 'El registro ha sido eliminado.' : 'Ocurrió un error al intentar eliminar el registro';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($texto, $pag){
        $data = Categoria::orderBy('nombre','asc')
                        ->where('nombre','like','%'.$texto.'%');

        $totReg = count($data->get());

        $categorias = $data->skip($this->rowsPerPage * $pag)
                            ->take($this->rowsPerPage)
                            ->get();

        return response()->json(['data' => $categorias, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totReg, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:categorias,nombre,'.$id,
            'src_imagen' => 'max:500',
            'link' => 'max:500'
        ];

        $messages = [
            'nombre.required' => 'El nombre de la categoría es obligatorio.',
            'nombre.min' => 'El nombre de la categoría debe tener almenos 3 carácteres. Ingresa unnombre más largo.',
            'nombre.max' => 'El nombre de la categoría debe tener hasta 50 carácteres. Ingresa unnombre más corto.',
            'nombre.unique' => 'El nombre ingresado ya se encuentra registrado. Ingresa un nombre diferente.',

            'src_imagen.max' => 'La ruta de la imagen debe tener un máximo de 500 carácteres. Ingresa una imagen con una ruta más corta.',

            'link.max' => 'El hipervínculo debe tener un máximo de 500 carácteres. Ingresa un link más corto.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }

    //Graba la foto en la carpeta public del backend
    public function uploadImage(Request $request){
        $res = '';
        try{
            if(count($_FILES)>0){
                move_uploaded_file($_FILES["upload"]["tmp_name"],storage_path().'/app/public/categorias/'.$_FILES['upload']['name']);

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
