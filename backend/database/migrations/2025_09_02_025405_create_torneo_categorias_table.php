<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('TORNEO_CATEGORIAS', function (Blueprint $table) {
            $table->foreignId('TORNEO_ID')->constrained('TORNEOS', 'ID')->onDelete('cascade');
            $table->foreignId('CATEGORIA_ID')->constrained('CATEGORIAS', 'ID')->onDelete('cascade');
            $table->integer('GRUPOS')->nullable();
            $table->integer('PAREJAS_POR_GRUPO')->nullable();
            $table->primary(['TORNEO_ID', 'CATEGORIA_ID']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('TORNEO_CATEGORIAS');
    }
};
