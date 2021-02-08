<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class roles_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::insert([
            'name' => 'admin',
            'description' => 'Administrador',
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
        ]);

        Role::insert([
            'name' => 'user',
            'description' => 'Usuario',
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
        ]);
    }
}
