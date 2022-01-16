<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Visitas;

class VisitasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Visitas::insert([
            'visitas' => 0,
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
        ]);
    }
}
