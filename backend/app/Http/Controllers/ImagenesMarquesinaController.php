<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImagenMarquesina;
use Illuminate\Support\Facades\DB;
use Validator;

class ImagenesMarquesinaController extends Controller
{
    public function getAll(){
        $imagenes = ImagenMarquesina::all();

        return response()->json($imagenes->toArray());
    }


    public function store(Request $request)
    {
        $errores = $this->validaDatos($request->imagenes);
        if(!is_null($errores)){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.','tipoMensaje' => 'danger', 'errores' => $errores]);
        }
        $res = true;
        try{
            DB::beginTransaction();
            if(count($request->deleted) > 0){
                $res = $this->eliminarImagenes($request->deleted);
            }
            $res = $this->grabarImagenes($request->imagenes);

            if($res){
                DB::commit();
                $mensaje = 'Las imagenes han sido actualizadas.';
                $tipoMensaje = 'success';
                $id = 0;
            }else{
                DB::rollback();
                $mensaje = 'No fue posible actualizar las imagenes. La acción no se ha llevado a cabo.';
                $tipoMensaje = 'danger';
                $id = -1;
            }
        }catch(\PDOException $e){
            $mensaje = 'Error al actualizar los precios: '.$e->getMessage();
            $tipoMensaje = 'danger';
            $id = -1;
            DB::rollback();
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    private function eliminarImagenes($idEliminados){

        foreach($idEliminados as $id){
            $imagen = ImagenMarquesina::find($id);
            if(!is_null($imagen)){
                $res = $imagen->delete();
                if(!$res){
                    return false;
                }
            }
        }
        return true;
    }



    private function grabarImagenes($imagenes){
        foreach($imagenes as $item){
            $imagen = ImagenMarquesina::find($item['id']);
            $res = is_null($imagen) ? $this->ingresarImagen($item) : $this->actualizarImagen($imagen, $item);
            if(!$res){
                return false;
            }
        }
        return true;
    }


    private function actualizarImagen($imagen, $data){
        $res = $imagen->fill($data)->save();
        return $res;
    }


    private function ingresarImagen($data){
        $imagen = new ImagenMarquesina();
        $res = $imagen->fill($data)->save();
        return $res;
    }


    private function ValidaDatos($data){
        foreach($data as $item){
            $res = $this->validarCampos($item);
            if($res->fails()){
                return $res->errors();
            }
        }
        return null;
    }

    private function validarCampos($item){
        $rules = [
            'src_imagen' => 'required|max:500' ,
            'texto' => 'max:200',
            'link' => 'max:255',
            'posicion' => 'required|min:0'
        ];

        $messages = [
            'src_imagen.required' => 'Debe seleccionar una imágen.',
            'src_imagen.max' => 'La ruta de la imagen es demasiado larga. seleccione una imagen en una ruta más corta',
            'texto.max' => 'El texto de la imagen debe tener un máximo de 200 carácteres. Ingrese un texto más corto. ',
            'link.max' => 'El link de la imagen debe tener un máximo de 255 carácteres. Ingrese un link más corto. ',
            'posicion.required' => 'La posicuón de la imagen es obligatoria.',
            'posición.min' => 'La posición debe ser un valor positivo.',
        ];

        return Validator::make($item, $rules, $messages);
    }


    /* --------------- SUBIR IMÁGENES --------------- */
    //Graba la foto en la carpeta public del backend
    public function uploadFiles(Request $request){
        $res = '';
        try{

            if(count($_FILES)>0){
                $files = $_FILES["upload"];
                for($i = 0; $i < count($files['name']); $i++){
                    move_uploaded_file($files["tmp_name"][$i],storage_path().'/app/public/marquesina/'.$files['name'][$i]);
                }

                $res = 'Las imagenes han sido subidas exitosamente.';
            }else{
                $res = 'No se han encontrado archivos.';
            }
            return response()->json(['mensaje' => $res, 'tipoMensaje' => 'success']);
        }catch(Exception $e){
            return response()->json(['mensaje' => 'Ocurrió un error al intentar actualizar la foto: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id'=> $id]);
        }
    }


}
