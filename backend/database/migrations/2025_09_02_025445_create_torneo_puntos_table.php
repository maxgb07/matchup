<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('TORNEO_PUNTOS', function (Blueprint $table) {
            $table->id('ID');
            $table->foreignId('TORNEO_ID')->constrained('TORNEOS', 'ID')->onDelete('cascade');
            $table->string('RONDA_NOMBRE');
            $table->integer('PUNTOS');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('TORNEO_PUNTOS');
    }
};
