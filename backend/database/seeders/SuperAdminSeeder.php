<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'EMAIL' => 'admin@matchup.com',
            'PASSWORD' => Hash::make('123456'),
            'TIPO_USUARIO' => 1, // 1 para SuperAdmin
        ]);
    }
}
