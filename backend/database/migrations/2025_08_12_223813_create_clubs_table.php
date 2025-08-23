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
        Schema::create('CLUBS', function (Blueprint $table) {
            $table->id('ID');
            $table->string('NOMBRE');
            $table->string('SUBDOMINIO')->unique();
            // Clave foránea para el administrador del club
            $table->foreignId('ID_ADMIN')->constrained('USERS')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('CLUBS');
    }
};
