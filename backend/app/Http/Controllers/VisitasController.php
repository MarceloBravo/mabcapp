<?php

namespace App\Http\Controllers;

use App\Models\Visitas;
use Illuminate\Http\Request;
use DB;

class VisitasController extends Controller
{

    public function index()
    {
        $visitas = Visitas::first();

        return response()->json($visitas);
    }


    public function update()
    {
        try{
            $visitas = Visitas::first();
            if(is_null($visitas)){
                $visitas = new Visitas();
                $visitas->visitas_mes = 1;
                $visitas->visitas_anio = 1;

            }else{

                $fechaActual = Date('Y-m-d');
                if(strtotime(Date($visitas->updated_at)) > strtotime(Date('Y-m-d', strtotime($fechaActual." - 1 month")))){
                    $visitas->visitas_mes = $visitas->visitas_mes + 1;
                }else{
                    $visitas->visitas_mes = 1;
                }

                if(strtotime(Date($visitas->updated_at)) > strtotime(Date('Y-m-d', strtotime($fechaActual." - 1 year")))){
                    $visitas->visitas_anio = $visitas->visitas_anio + 1;
                }else{
                    $visitas->visitas_anio = 1;
                }

            }
            $res = $visitas->save();
            $mensaje = $res ? 'Visita registrada.' : 'No se pudo registrar la visita.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => 'Visita registrada.', 'tipoMensaje' => 'success', 'id' => 0]);
        }catch(\PDOException $e){
            return response()->json(['mensaje' => 'Erro al registrar la visita: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => 0]);
        }

    }

}
