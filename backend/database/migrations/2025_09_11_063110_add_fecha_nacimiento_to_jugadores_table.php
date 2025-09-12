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
        Schema::table('JUGADORES', function (Blueprint $table) {
            $table->date('FECHA_NACIMIENTO')->nullable()->after('ID_ESTADO');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('JUGADORES', function (Blueprint $table) {
            $table->dropColumn('FECHA_NACIMIENTO');
        });
    }
};
