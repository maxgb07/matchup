<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('TORNEOS', function (Blueprint $table) {
            $table->id('ID');
            $table->unsignedBigInteger('ID_CLUB');
            $table->string('NOMBRE');
            $table->date('FECHA_INICIO');
            $table->date('FECHA_FIN');
            $table->date('FECHA_INSCRIPCION_LIMITE');
            $table->decimal('COSTO_POR_PAREJA', 8, 2);
            $table->text('DESCRIPCION')->nullable();
            $table->timestamps();

            // Clave foránea para relacionar el torneo con un club
            $table->foreign('ID_CLUB')->references('ID')->on('CLUBS')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TORNEOS');
    }
};
