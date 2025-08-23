<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    use HasFactory;
    protected $table = 'CIUDADES';
    protected $primaryKey = 'ID';
    protected $fillable = ['NOMBRE', 'ID_ESTADO'];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'ID_ESTADO', 'ID');
    }
}
