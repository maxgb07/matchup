<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('TORNEOS', function (Blueprint $table) {
            $table->decimal('COSTO', 8, 2)->after('FECHA_FIN');
        });
    }

    public function down(): void
    {
        Schema::table('TORNEOS', function (Blueprint $table) {
            $table->dropColumn('COSTO');
        });
    }
};
