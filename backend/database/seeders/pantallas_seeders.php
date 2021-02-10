<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pantalla;

class pantallas_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Pantalla::insert([
            'nombre' => 'Menús',
            'menus_id' => 4,
            'permite_crear' => true,
            'permite_modificar' => true,
            'permite_eliminar' => true,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Pantalla::insert([
            'nombre' => 'Usuarios',
            'menus_id' => 3,
            'permite_crear' => true,
            'permite_modificar' => true,
            'permite_eliminar' => true,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Pantalla::insert([
            'nombre' => 'Roles',
            'menus_id' => 2,
            'permite_crear' => true,
            'permite_modificar' => true,
            'permite_eliminar' => true,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Pantalla::insert([
            'nombre' => 'Pantallas',
            'menus_id' => 1,
            'permite_crear' => true,
            'permite_modificar' => true,
            'permite_eliminar' => true,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Pantalla::insert([
            'nombre' => 'Permisos',
            'menus_id' => 5,
            'permite_crear' => true,
            'permite_modificar' => true,
            'permite_eliminar' => true,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);
    }
}
