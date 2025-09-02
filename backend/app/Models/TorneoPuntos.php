<?php

// app/Models/TorneoPuntos.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TorneoPuntos extends Model
{
    use HasFactory;

    protected $table = 'TORNEO_PUNTOS';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'TORNEO_ID',
        'RONDA_NOMBRE',
        'PUNTOS',
    ];

    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'TORNEO_ID', 'ID');
    }
}
