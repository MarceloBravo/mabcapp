<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class menus_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Menu::insert([
            'id' => 1,
            'nombre' => 'Pantallas',
            'url' => 'pantallas',
            'menu_padre_id' => 0,
            'posicion' => 0,
            'created_at' => Date('Y-m-d'),
            'upated_at' => Date('Y-m-d'),
            'deleted_at' => null,
        ]);

        Menu::insert([
            'id' => 2,
            'nombre' => 'Roles',
            'url' => 'roles',
            'menu_padre_id' => 0,
            'posicion' => 30,
            'created_at' => Date('Y-m-d'),
            'upated_at' => Date('Y-m-d'),
            'deleted_at' => null,
        ]);

        Menu::insert([
            'id' => 3,
            'nombre' => 'Usuarios',
            'url' => 'usuarios',
            'menu_padre_id' => 0,
            'posicion' => 40,
            'created_at' => Date('Y-m-d'),
            'upated_at' => Date('Y-m-d'),
            'deleted_at' => null,
        ]);

        Menu::insert([
            'id' => 4,
            'nombre' => 'Menús',
            'url' => 'menus',
            'menu_padre_id' => 0,
            'posicion' => 10,
            'created_at' => Date('Y-m-d'),
            'upated_at' => Date('Y-m-d'),
            'deleted_at' => null,
        ]);

        Menu::insert([
            'id' => 5,
            'nombre' => 'Permisos',
            'url' => 'permisos',
            'menu_padre_id' => 0,
            'posicion' => 50,
            'created_at' => Date('Y-m-d'),
            'upated_at' => Date('Y-m-d'),
            'deleted_at' => null,
        ]);
    }
}
