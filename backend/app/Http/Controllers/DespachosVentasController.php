<?php

namespace App\Http\Controllers;

use App\Models\DespachosVentas;
use Illuminate\Http\Request;
use Validator;

class DespachosVentasController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $data = DespachosVentas::join('cliente','despachos_ventas.cliente_id','=','cliente_id')
                            ->orderBy('created_at','asc');


        $totRows = count($data->get());

        $datos = $data->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage);

        return response()->json(['data' => $datos, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page'=>$pag, ]);
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
        try{
            $validacion = $this->validaDatos($request);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incopmpletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $valicaion->errors()]);
            }
            $despacho = new DespachosVentas();
            $res = $despacho->fill($request->all())->save();
            $mensaje = $res ? 'El despacho ha sido ingresado exitosamente.' : 'Ocurrió un error al intentar registrar el despacho.';
            $tipoMensaje = $res ? 'success' : 'danger';
            $id = $res ? $despacho->id : -1;

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\DBOException $e){
            return response()->json(['mensaje' => 'Ocurrió un ertor al intentar registrar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            $despacho = DespachosVentas::find($id);
            return response()->json($despacho);
        }catch(\DBOException $e){
            return response()->json(['mensaje' => 'Ocurrió un ertor al buscar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => $id]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function edit(DespachosVentas $despachosVentas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $validacion = $this->validaDatos($request);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incopmpletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $valicaion->errors()]);
            }
            $despacho = DespachosVentas::find($id);
            $res = $despacho->fill($request->all())->save();
            $mensaje = $res ? 'El despacho ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el despacho.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\DBOException $e){
            return response()->json(['mensaje' => 'Ocurrió un ertor al intentar actualizar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => $id]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $despacho = DespachosVentas::find($id);
            $res = $despacho->delete();
            $mensaje = $res ? 'El despacho ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el despacho.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\DBOException $e){
            return response()->json(['mensaje' => 'Ocurrió un ertor al intentar eliminar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }


    public function filter($texto, $pag)
    {
        $data = DespachosVentas::orderBy('created_at','asc')
                            ->where('venta_id','like','%'.$texto.'%')
                            ->orWhere('direccion','like','%'.$texto.'%')
                            ->orWhere('ciudad','like','%'.$texto.'%')
                            ->orWhere('casa_num','like','%'.$texto.'%')
                            ->orWhere('block_num','like','%'.$texto.'%')
                            ->orWhere('referencia','like','%'.$texto.'%')
                            ->orWhere('ciudad','like','%'.$texto.'%');

        $totRows = count($data->get());

        $datos = $data->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage);

        return response()->json(['data' => $datos, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page'=>$pag, ]);
    }


    private function validaDatos(Request $request){
        $rules = [
            'venta_id' => 'required|exits:ventas,id',
            'direccion' => 'required|min:5|max:255',
            'region' => 'required|max:10',
            'provincia' => 'required|max:10',
            'comuna' => 'required|max:10',
            'ciudad' => 'required|max:20',
            'casa_num' => 'required|max:10',
            'block_num' => 'max:10',
            'referencia' => 'min:5|max:255'
        ];

        $messages = [
            'venta_id.required' => 'El código de la venta es obligatorio. El despacho no está asociado a ningina venta.',
            'venta_id.exists' => 'El código de la venta no es válido o la venta no exioste.',

            'direccion.required' => 'La dirección de despacho es obligatoria.',
            'direccion.min' => 'La dirección debe tener almenos 5 carácteres. Ingresa una dirección más larga.',
            'direccion.max' => 'La dirección debe tener hasta 255 carácteres. Ingresa una dirección más corta.',

            'region.required' => 'Debe seleccionar la región de despacho.',
            'region.max' => 'El código de la región debe tener hasta 10 carácteres. Ingresa una código más corto.',

            'provincia.required' => 'Debe seleccionar la provincia de despacho.',
            'provincia.max' => 'El código de la provincia debe tener hasta 10 carácteres. Ingresa una código más corto.',

            'comuna.required' => 'Debe seleccionar la comuna de despacho.',
            'comuna.max' => 'El código de la comuna debe tener hasta 10 carácteres. Ingresa una código más corto.',

            'ciudad.required' => 'Debe ingresar la ciudad de despacho.',
            'ciudad.max' => 'La ciudad debe tener hasta 20 carácteres. Ingresa un nombre de ciudad más corto.',

            'casa_num.required' => 'El númerop de casa es obligatorio.',
            'casa_num.max' => 'El número de casa debe tener un máximo de 10 carácteres. Ingresa un número de casa más corto.',

            'block_num.max' => 'El número de block debe tener un máximo de 10 carácteres. Ingresa un número de block más corto.',

            'referencia.min' => 'La referencia debe tener almenos 5 carácteres. Ingresa una referencia más larga.',
            'referencia.max' => 'La referencia debe tener hasta 255 carácteres. Ingresa una referencia más corta.',
        ];

        return Validator::make($rules, $messages, $request->all());
    }
}
