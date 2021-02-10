<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Model\GrupoMenu;

class grupos_menus_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        GrupoMenu::insert([
            'id' => 1,
            'nombre' => 'Sin agrupar',
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
            'deleted_at' => Date('Y-m-d'),
        ]);
    }
}
