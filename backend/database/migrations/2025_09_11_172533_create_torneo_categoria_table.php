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
        Schema::create('TORNEO_CATEGORIA', function (Blueprint $table) {
            $table->id('ID'); // ID autoincrementable
            $table->unsignedBigInteger('ID_TORNEO');
            $table->unsignedBigInteger('ID_CATEGORIA');
            $table->integer('CUPO_PAREJAS');
            $table->timestamps();

            // Definir las claves foráneas
            $table->foreign('ID_TORNEO')->references('ID')->on('TORNEOS')->onDelete('cascade');
            $table->foreign('ID_CATEGORIA')->references('ID')->on('CATEGORIAS')->onDelete('cascade');

            // Asegurar que la combinación de torneo y categoría sea única
            $table->unique(['ID_TORNEO', 'ID_CATEGORIA']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TORNEO_CATEGORIA');
    }
};
