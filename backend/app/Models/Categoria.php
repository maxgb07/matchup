<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;
    protected $table = 'CATEGORIAS';
    protected $primaryKey = 'ID';
    protected $fillable = ['NOMBRE', 'GENERO'];

    public function torneos()
    {
        return $this->belongsToMany(Torneo::class, 'TORNEO_CATEGORIA', 'ID_CATEGORIA', 'ID_TORNEO')
                    ->using(TorneoCategoria::class)
                    ->withPivot('CUPO_PAREJAS')
                    ->withTimestamps();
    }
}
