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
        return $this->belongsToMany(Torneo::class, 'TORNEO_CATEGORIAS', 'CATEGORIA_ID', 'TORNEO_ID')
                    ->withPivot('GRUPOS', 'PAREJAS_POR_GRUPO');
    }
}
