<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('TORNEOS', function (Blueprint $table) {
            $table->id('ID');
            $table->string('NOMBRE');
            $table->date('FECHA_INICIO');
            $table->date('FECHA_FIN');
            $table->string('ESTADO')->default('INSCRIPCION');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('TORNEOS');
    }
};
