<?php

// En database/migrations/..._add_activo_to_torneos_table.php

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
        Schema::table('TORNEOS', function (Blueprint $table) {
            $table->boolean('ACTIVO')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('TORNEOS', function (Blueprint $table) {
            $table->dropColumn('ACTIVO');
        });
    }
};
