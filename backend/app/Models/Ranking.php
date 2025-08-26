<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ranking extends Model
{
    use HasFactory;

    protected $table = 'RANKING';

    protected $fillable = [
        'ID_JUGADOR',
        'ID_CATEGORIA',
        'PUNTOS',
    ];

    /**
     * Relación con el jugador.
     */
    public function jugador()
    {
        return $this->belongsTo(Jugador::class, 'ID_JUGADOR');
    }

    /**
     * Relación con la categoría.
     */
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'ID_CATEGORIA');
    }
}
