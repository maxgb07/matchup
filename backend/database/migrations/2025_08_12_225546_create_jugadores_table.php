<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('JUGADORES', function (Blueprint $table) {
            $table->id('ID');
            // Clave foránea para el usuario Jugador
            $table->foreignId('ID_USUARIO')->constrained('USERS')->onDelete('cascade');
            // Clave foránea para el club al que pertenece el jugador
            $table->foreignId('ID_CLUB')->constrained('CLUBS')->onDelete('cascade');
            $table->string('NOMBRE');
            $table->string('CELULAR')->nullable();
            $table->string('FOTO_PERFIL')->nullable();
            $table->string('POSICION_CANCHA');
            // Claves foráneas para información de referencia
            $table->foreignId('ID_CATEGORIA')->constrained('CATEGORIAS');
            $table->foreignId('ID_CIUDAD')->constrained('CIUDADES');
            $table->foreignId('ID_ESTADO')->constrained('ESTADOS');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('JUGADORES');
    }
};
