<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'JUGADORES';

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
        'ID_USUARIO',
        'ID_CLUB',
        'NOMBRE',
        'CELULAR',
        'FOTO_PERFIL',
        'POSICION_CANCHA',
        'ID_CATEGORIA',
        'ID_CIUDAD',
        'ID_ESTADO',
    ];

    /**
     * Get the user associated with the player.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'ID_USUARIO', 'ID');
    }

    /**
     * Get the club that the player belongs to.
     */
    public function club()
    {
        return $this->belongsTo(Club::class, 'ID_CLUB', 'ID');
    }

    /**
     * Get the category of the player.
     */
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'ID_CATEGORIA', 'ID');
    }

    /**
     * Get the city of the player.
     */
    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class, 'ID_CIUDAD', 'ID');
    }

    /**
     * Get the state of the player.
     */
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'ID_ESTADO', 'ID');
    }
}
