<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;    //composer require laravel/ui

class user_seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::insert([
            'email' => 'mabc@live.cl',
            'password' => Hash::make('admin'),
            'name' => 'Administrator',
            'created_at' => Date('Y-m-d'),
            'updated_at' => Date('Y-m-d'),
        ]);
    }
}
