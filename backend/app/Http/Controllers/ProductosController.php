<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\ImagenProducto;
use App\Models\ProductoImpuesto;
use Illuminate\Support\Facades\DB;
use Validator;

class ProductosController extends Controller
{
    private $rowsPerPage = 10;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $allRecords = Producto::join('producto_impuesto','productos.id','=','producto_impuesto.producto_id')
                        ->join('impuestos','producto_impuesto.impuesto_id','=','impuestos.id')
                        ->join('marcas','productos.marca_id','=','marcas.id')
                        ->join('categorias','productos.categoria_id','=','categorias.id')
                        ->join('sub_categorias','productos.sub_categoria_id','=','sub_categorias.id')
                        ->join('unidades','productos.unidad_id','=','unidades.id')
                        ->select(
                            'productos.nombre',
                            'productos.descripcion',
                            'productos.precio_venta_normal',
                            'productos.stock',
                            'productos.unidad_id',
                            'productos.marca_id',
                            'productos.categoria_id',
                            'productos.sub_categoria_id',
                            'productos.created_at',
                            'productos.updated_at',
                            'productos.deleted_at',
                            )
                        ->orderBy('nombre','asc');

        $totReg = count($allRecords->get());

        $data = $allRecords->skip($this->rowsPerPage * $pag)
                            ->take($this->rowsPerPage)
                            ->get();

        return response()->json(['data' => $data,  'rowsPerPage' => $this->rowsPerPage, 'rows' => $totReg, 'page' => $pag]);
    }


    public function getAll(){
        $data = Producto::all();

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
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            DB::beginTransaction();
            $producto = new Producto();
            $res = $producto->fill($request->all())->save();
            if($res){
                $this->subirImagenes($request, $producto);
            }
            if($res){
                $res = $this->registrarImpuestos($request, $producto);
            }
            $mensaje = $res ? 'El producto ha sido registrado exitosamente.' : 'Ocurrió un error al intentar ingresar el producto.';
            $tipoMensaje = $res ? 'success' : 'danger';
            $newId = $producto->id;

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
        $data = Producto::find($id);
        $data['impuestos'] = $data->impuestos();
        $data['imagenes'] = $data->imagenes();
        $data['categoria'] = $data->categoria();
        $data['sub_categoria'] = $data->subCategoria();
        $data['marca'] = $data->marca();
        $data['unidad'] = $data->unidad();

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
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            DB::beginTransaction();
            $producto = Producto::find($id);
            $res = $producto->fill($request->all())->save();
            if($res){
                $res = $this->subirImagenes($request, $producto);
            }
            if($res){
                $res = $this->registrarImpuestos($request, $producto);
            }
            $mensaje = $res ? 'El producto ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el producto.';
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            DB::beginTransaction();
            $producto = Producto::find($id);
            $res = $producto->delete();
            if($res){
                ImagenProducto::where('producto_id','=',$id)->delete();
            }
            $mensaje = $res ? 'El producto ha sido eliminado.' : 'Ocurrió un error al intentar eliminar el producto.';
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

    public function filter($texto, $pag){
        $allRecords = Producto::join('producto_impuesto','productos.id','=','producto_impuesto.producto_id')
                        ->join('impuestos','producto_impuesto.impuesto_id','=','impuestos.id')
                        ->join('marcas','productos.marca_id','=','marcas.id')
                        ->join('categorias','productos.categoria_id','=','categorias.id')
                        ->join('sub_categorias','productos.sub_categoria_id','=','sub_categorias.id')
                        ->join('unidades','productos.unidad_id','=','unidades.id')
                        ->where('productos.nombre','like','%'.$texto.'%')
                        ->orWhere('productos.descripcion','like','%'.$texto.'%')
                        ->orWhere('precio_venta_normal','like','%'.$texto.'%')
                        ->orWhere('stock','like','%'.$texto.'%')
                        ->orWhere('marcas.nombre','like','%'.$texto.'%')
                        ->orWhere('categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('sub_categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('impuestos.nombre','like','%'.$texto.'%')
                        ->orWhere('unidades.nombre','like','%'.$texto.'%')
                        ->select(
                            'productos.nombre',
                            'productos.descripcion',
                            'productos.precio_venta_normal',
                            'productos.stock',
                            'productos.unidad_id',
                            'productos.marca_id',
                            'productos.categoria_id',
                            'productos.sub_categoria_id',
                            'productos.created_at',
                            'productos.updated_at',
                            'productos.deleted_at',
                            )
                        ->orderBy('nombre','asc');

        $totReg = count($allRecords->get());

        $data = $allRecords->skip($this->rowsPerPage * $pag)
                            ->take($this->rowsPerPage)
                            ->get();

        return response()->json(['data' => $data,  'rowsPerPage' => $this->rowsPerPage, 'rows' => $totReg, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:3|max:255',
            'descripcion' => 'required|min:5|max:100',
            'precio_venta_normal' => 'required|min:0|integer',
            'stock' => 'required|min:0|integer',
            'unidad_id' => 'required|exists:unidades,id',
            'marca_id' => 'required|exists:marcas,id',
            'categoria_id' => 'required|exists:categorias,id',
            'sub_categoria_id' => 'required|exists:sub_categorias,id',
        ];

        $messages = [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'nombre.min' => 'El nombre del producto debe tener almenos de 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre del producto debe tener hasta 255 carácteres. Ingresa un nombre más corto.',

            'descripcion.required' => 'El campo descripción del producto es obligatorio.',
            'descripcion.min' => 'La descripción debe tener almenos de 5 carácteres. Ingresa una descripción más larga.',
            'descripcion.min' => 'La descripción debe tener hasta de 1000 carácteres. Ingresa una descripción más corta.',

            'precio_venta_normal.required' => 'Debe ingresar el precio de venta normal.',
            'precio_venta_normal.min' => 'El precio de venta normal debe ser un número positivo.',
            'precio_venta_normal.integer' => 'El precio de venta debe ser un número entero',

            'stock.required' => 'Debe ingresar el stock del producto.',
            'stock.min' => 'El stock debe ser un número positivo.',
            'stock.integer' => 'El stock debe ser un número entero',

            'unidad_id.required' => 'Debe seleccionar la unidad.',
            'unidad.exists' => 'La unidad no existe o no es válida.',

            'marca_id.required' => 'Debe seleccionar la marca del producto.',
            'marca_id.exists' => 'La marca no existe o no es válida.',

            'categoria_id.required' => 'Debe seleccionar la categoría a la que pertenece el tipo de producto.',
            'categoria_id.exists' => 'La categoría no existe o no es válida.',

            'sub_categoria_id.required' => 'Debe seleccionar la sub-categoría a la que pertenece el tipo de producto.',
            'sub_categoria_id.exists' => 'La sub-categoría no existe o no es válida.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }


    /* --------------- REGISTRAR IMPUESTOS --------------- */
    private function registrarImpuestos(Request $request, Producto $producto){
        ProductoImpuesto::where('producto_id','=',$producto->id)->delete();
        foreach($request->impuestos as $impuesto){
            if(!$this->grabarImpuesto($impuesto, $producto)){
                return false;
            }
        }
        return true;
    }


    private function grabarImpuesto($impuestoId, Producto $producto){

        $impuesto = ProductoImpuesto::withTrashed()
                                    ->where('producto_id','=',$producto->id)
                                    ->where('impuesto_id','=',$impuestoId)
                                    ->first();

        if($impuesto){
            $impuesto->deleted_at = null;
        }else{
            $impuesto = new ProductoImpuesto();
            $impuesto->producto_id = $producto->id;
            $impuesto->impuesto_id = $impuestoId;
        }
        $res = $impuesto->save();
        return $res;
    }
    /* --------------- FIN REGISTRAR IMPUESTOS --------------- */


    /* --------------- SUBIR IMÁGENES --------------- */
    private function subirImagenes(Request $request, Producto $producto){
        ImagenProducto::where('producto_id','=',$producto->id)->delete();
        //Iterando por las imágenes
        $files = $request->file('fotos');
        if($files){
            foreach ($files as $imagen){
                if(!$this->subirImagen($imagen, $producto)){
                    return false;
                }
            }
        }
        return true;
    }


    private function subirImagen($imagen, Producto $producto){
        $res = false;
        // script para subir la imagen
        if($request->hasFile("foto")){
           $imagen = $request->file("foto");
           $nombreimagen = Str::slug($request->nombre).".".$imagen->guessExtension();
           $ruta = public_path()."/productos";

           copy($imagen->getRealPath(),$ruta."/".$nombreimagen);

           $ImagenProducto = ImagenProducto::withTrashed()
                                            ->where('producto_id','=',$producto->id)
                                            ->where('source_image','=',$ruta)
                                            ->where('deleted_at')
                                            ->first();
           if(!$ImagenProducto){
                $ImagenProducto = new ImagenProducto();
                $ImagenProducto->producto_id = $producto_id;
                $ImagenProducto->source_image = $ruta;
           }else{
               $imageProducto->deleted_at = null;
           }
           $ImagenProducto->imagen_principal = $nombreimagen === $producto->imagen_principal;
           $res = $imageProducto->save();
       }

       return $res;
   }
   /* --------------- FIN SUBIR IMÁGENES --------------- */
}
