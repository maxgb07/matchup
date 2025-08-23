<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('CATEGORIAS', function (Blueprint $table) {
            $table->id('ID');
            $table->string('NOMBRE');
            $table->string('GENERO');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('CATEGORIAS');
    }
};
