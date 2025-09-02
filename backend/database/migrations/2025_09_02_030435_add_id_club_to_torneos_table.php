<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('TORNEOS', function (Blueprint $table) {
            // Agrega la nueva columna. Usamos `foreignId` para la relación con la tabla de clubes.
            $table->foreignId('ID_CLUB')->constrained('CLUBES', 'ID')->after('ID');
        });
    }

    public function down(): void
    {
        Schema::table('TORNEOS', function (Blueprint $table) {
            $table->dropForeign(['ID_CLUB']);
            $table->dropColumn('ID_CLUB');
        });
    }
};
