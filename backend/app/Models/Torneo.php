<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    protected $table = 'TORNEOS';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'NOMBRE',
        'FECHA_INICIO',
        'FECHA_FIN',
        'COSTO',
        'ESTADO',
        'ID_CLUB'
    ];

    public function club()
    {
        return $this->belongsTo(Club::class, 'ID_CLUB', 'ID');
    }

    public function puntosPorRonda()
    {
        return $this->hasMany(TorneoPuntos::class, 'TORNEO_ID', 'ID');
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'TORNEO_CATEGORIAS', 'TORNEO_ID', 'CATEGORIA_ID')
                    ->withPivot('GRUPOS', 'PAREJAS_POR_GRUPO');
    }
}
