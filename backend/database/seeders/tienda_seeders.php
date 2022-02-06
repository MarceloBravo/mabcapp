<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tienda;

class tienda_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Tienda::insert([
            'id' => 1,
            'nombre_tienda' => 'Mi tienda Angular',
            'fono_venta' => '09-87654321',
            'email' =>  'tienda@ejemplo.cl',
            'direccion' => '1 Norte 3 y 4 Oriente #123, Talca',
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
        ]);
        //
    }
}
