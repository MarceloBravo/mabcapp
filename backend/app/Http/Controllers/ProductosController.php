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
                        ->join(DB::raw('(SELECT source_image, producto_id, id FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL
                                        UNION
                                        SELECT source_image, producto_id, min(id) FROM `imagenes_producto`
                                        WHERE NOT imagen_principal
                                        AND producto_id NOT IN (SELECT producto_id FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL)
                                        AND deleted_at IS NULL
                                        GROUP BY source_image, producto_id
                                        )
                                imagen_producto'),
                            function($join)
                            {
                                $join->on('productos.id', '=', 'imagen_producto.producto_id');
                            })
                        ->select(
                            'productos.id',
                            'productos.nombre',
                            'productos.descripcion',
                            'productos.precio_venta_normal',
                            'productos.precio_costo',
                            'productos.stock',
                            'productos.unidad_id',
                            'productos.descuento_maximo',
                            'unidades.nombre as nombre_unidad',
                            'productos.marca_id',
                            'marcas.nombre as nombre_marca',
                            'productos.categoria_id',
                            'categorias.nombre as nombre_categoria',
                            'productos.sub_categoria_id',
                            'sub_categorias.nombre as nombre_sub_categoria',
                            'productos.created_at',
                            'productos.updated_at',
                            'productos.deleted_at',
                            'imagen_producto.source_image as imagen_principal'
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


    public function getAllFilter($texto){

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
                            'productos.id',
                            'productos.nombre',
                            'productos.descripcion',
                            'productos.precio_venta_normal',
                            'productos.precio_costo',
                            'productos.stock',
                            'productos.unidad_id',
                            'productos.descuento_maximo',
                            'unidades.nombre as nombre_unidad',
                            'productos.marca_id',
                            'marcas.nombre as nombre_marca',
                            'productos.categoria_id',
                            'categorias.nombre as nombre_categoria',
                            'productos.sub_categoria_id',
                            'sub_categorias.nombre as nombre_sub_categoria',
                            'productos.created_at',
                            'productos.updated_at',
                            'productos.deleted_at',
                            )
                        ->orderBy('nombre','asc')
                        ->get();

        return response()->json($allRecords);
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
                $this->registrarImagenes($request, $producto);
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
        $producto = Producto::find($id);
        if(!is_null($producto)){
            $data = $this->camposAdicionales($producto);
            return response()->json($data);
        }
        return response()->json($producto);
    }


    private function camposAdicionales(Producto $data){

        $data['impuestos'] = $data ? $data->impuestos() : [];
        $data['imagenes'] = $data ? $data->imagenes() : [];
        $data['categoria'] = $data ? $data->categoria() : null;
        $data['sub_categoria'] = $data ? $data->subCategoria() : null;
        $data['marca'] = $data ? $data->marca()[0] : null;
        $data['unidad'] = $data ? $data->unidad() : null;

        $data['nombre_categoria'] = $data ? $data->categoria()[0]->nombre : '';
        $data['nombre_sub_categoria'] = $data ? $data->subCategoria()[0]->nombre : '';
        $data['nombre_marca'] = $data ? $data->marca()[0]->nombre : '';
        $data['nombre_unidad'] = $data ? $data->unidad()[0]->nombre : '';
        $data['precios'] = $data->precios();

        return $data;
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
                $res = $this->eliminarImagenes($request);
            }
            if($res){
                $res = $this->registrarImagenes($request, $producto);
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
                        ->join(DB::raw('(SELECT source_image, producto_id, id FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL
                                        UNION
                                        SELECT source_image, producto_id, min(id) FROM `imagenes_producto`
                                        WHERE NOT imagen_principal
                                        AND producto_id NOT IN (SELECT producto_id FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL)
                                        AND deleted_at IS NULL
                                        GROUP BY source_image, producto_id
                                        )
                                imagen_producto'),
                            function($join)
                            {
                                $join->on('productos.id', '=', 'imagen_producto.producto_id');
                            })
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
                            'productos.id',
                            'productos.nombre',
                            'productos.descripcion',
                            'productos.precio_venta_normal',
                            'productos.precio_costo',
                            'productos.stock',
                            'productos.unidad_id',
                            'productos.descuento_maximo',
                            'unidades.nombre as nombre_unidad',
                            'productos.marca_id',
                            'marcas.nombre as nombre_marca',
                            'productos.categoria_id',
                            'categorias.nombre as nombre_categoria',
                            'productos.sub_categoria_id',
                            'sub_categorias.nombre as nombre_sub_categoria',
                            'productos.created_at',
                            'productos.updated_at',
                            'productos.deleted_at',
                            'imagen_producto.source_image as imagen_principal'
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
            'descripcion' => 'required|min:5|max:1000',
            'precio_venta_normal' => 'required|min:0|integer',
            'precio_costo' => 'required|min:0|integer',
            'stock' => 'required|min:0|integer',
            'descuento_maximo' => 'required|min:0|max:100',
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

            'precio_costo.required' => 'Debe ingresar el precio costo del producto.',
            'precio_costo.min' => 'El precio costo debe ser un número positivo.',
            'precio_costo.integer' => 'El precio costo debe ser un número entero',

            'stock.required' => 'Debe ingresar el stock del producto.',
            'stock.min' => 'El stock debe ser un número positivo.',
            'stock.integer' => 'El stock debe ser un número entero',

            'descuento_maximo.required' => 'Debe ingresar el porcentaje máximo de descuento aplicable al producto.',
            'descuento_maximo.min' => 'El porcentaje máxmimo de descuento debe ser un número positivo.',
            'descuento_maximo.max' => 'El porcentaje máxmimo de descuento debe ser ingual o inferior a cien (100).',

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
    //Graba la foto en la carpeta public del backend
    public function uploadImage(Request $request){
        $res = '';
        try{

            if(count($_FILES)>0){
                $files = $_FILES["upload"];
                for($i = 0; $i < count($files['name']); $i++){
                    move_uploaded_file($files["tmp_name"][$i],storage_path().'/app/public/productos/'.$files['name'][$i]);
                }

                $res = 'La foto ha sido actualizada exitosamente.';
            }else{
                $res = 'No se han encontrado archivos.';
            }
            return response()->json(['mensaje' => $res, 'tipoMensaje' => 'success']);
        }catch(Exception $e){
            return response()->json(['mensaje' => 'Ocurrió un error al intentar actualizar la foto: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id'=> $id]);
        }
    }

    private function eliminarImagenes(Request $request){
        $files = $request->imagenes;
        if($files){
            foreach ($files as $imagen){

                if(!is_null($imagen['id']) && !is_null($imagen['deleted_at'])){
                    $producto = ImagenProducto::find($imagen['id']);
                    if(!is_null($producto)){
                        //dd($producto->id, $producto->source_image, $imagen["id"]);

                        if(!$producto->delete()){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }


    private function registrarImagenes(Request $request, Producto $producto){

        //Iterando por las imágenes
        $files = $request->imagenes;
        if($files){
            foreach ($files as $imagen){
                if(!$this->registrarImagen($imagen, $producto)){
                    return false;
                }
            }
        }
        return true;
    }


    private function registrarImagen($imagen, Producto $producto){
        $res = true;
        if(is_null($imagen['deleted_at'])){
            $res = false;
            $imagenProducto = null;
            if(!is_null($imagen['id'])){
                $imagenProducto = ImagenProducto::withTrashed()
                                                ->where('id','=',$imagen['id'])
                                                ->first();
            }
            if(is_null($imagenProducto)){
                $imagenProducto = new ImagenProducto();
            }

            $imagenProducto->producto_id = $producto->id;
            $imagenProducto->source_image = $imagen['source_image'];
            $imagenProducto->deleted_at = null;
            $imagenProducto->imagen_principal = $imagen['imagen_principal'];

            $res = $imagenProducto->save();
        }
       return $res;
   }


   private function actualizarImagenPrincipal($imagen){
       $res = true;
       if(!is_string($imagen) && !is_null($imagen["id"])){
            $imagenProducto = ImagenProducto::find($imagen["id"]);
            if(!is_null($imagenProducto)){
                $imagenProducto->imagen_principal = $imagen["imagen_principal"];
                $res = $ImagenProducto->save();
                if(!$res){
                    return false;
                }
            }
        }
        return $res;
   }

   /* --------------- FIN SUBIR IMÁGENES --------------- */
}
