<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'TORNEOS';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'ID';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ID_CLUB',
        'NOMBRE',
        'FECHA_INICIO',
        'FECHA_FIN',
        'FECHA_INSCRIPCION_LIMITE',
        'COSTO_POR_PAREJA',
        'DESCRIPCION',
        'ACTIVO'
    ];

    /**
     * Get the club that owns the tournament.
     */
    public function club()
    {
        return $this->belongsTo(Club::class, 'ID_CLUB', 'ID');
    }

    /**
     * The categories that belong to the tournament.
     */
    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'TORNEO_CATEGORIA', 'ID_TORNEO', 'ID_CATEGORIA')
                    ->using(TorneoCategoria::class)
                    ->withPivot('CUPO_PAREJAS')
                    ->withTimestamps();
    }
}
