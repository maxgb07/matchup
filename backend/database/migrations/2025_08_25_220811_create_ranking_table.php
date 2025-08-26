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
        Schema::create('RANKING', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ID_JUGADOR')->constrained('JUGADORES');
            $table->foreignId('ID_CATEGORIA')->constrained('CATEGORIAS');
            $table->integer('PUNTOS')->default(0);
            $table->timestamps();

            $table->unique(['ID_JUGADOR', 'ID_CATEGORIA']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('RANKING');
    }
};
