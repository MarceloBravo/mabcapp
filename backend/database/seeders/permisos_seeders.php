<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permisos;

class permisos_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permisos::insert([
            'roles_id' => 1,
            'pantallas_id' => 1,
            'acceder' => 1,
            'crear' => 1,
            'modificar' => 1,
            'eliminar' => 1,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Permisos::insert([
            'roles_id' => 1,
            'pantallas_id' => 2,
            'acceder' => 1,
            'crear' => 1,
            'modificar' => 1,
            'eliminar' => 1,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Permisos::insert([
            'roles_id' => 1,
            'pantallas_id' => 3,
            'acceder' => 1,
            'crear' => 1,
            'modificar' => 1,
            'eliminar' => 1,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Permisos::insert([
            'roles_id' => 1,
            'pantallas_id' => 4,
            'acceder' => 1,
            'crear' => 1,
            'modificar' => 1,
            'eliminar' => 1,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);

        Permisos::insert([
            'roles_id' => 1,
            'pantallas_id' => 5,
            'acceder' => 1,
            'crear' => 0,
            'modificar' => 1,
            'eliminar' => 0,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);
    }
}
