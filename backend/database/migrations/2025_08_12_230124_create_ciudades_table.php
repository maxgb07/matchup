<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('CIUDADES', function (Blueprint $table) {
            $table->id('ID');
            $table->string('NOMBRE');
            // Clave foránea al estado al que pertenece la ciudad
            $table->foreignId('ID_ESTADO')->constrained('ESTADOS');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('CIUDADES');
    }
};
