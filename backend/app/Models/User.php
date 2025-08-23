<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * El nombre de la tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'USERS';

    /**
     * La clave primaria de la tabla.
     *
     * @var string
     */
    protected $primaryKey = 'ID';

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'EMAIL',
        'PASSWORD',
        'TIPO_USUARIO',
    ];

    /**
     * Los atributos que deben ocultarse para las serializaciones.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'PASSWORD',
        'remember_token',
    ];

    /**
     * Los atributos que deben ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'PASSWORD' => 'hashed',
    ];

    /**
     * Get the club associated with the user.
     */
    public function club()
    {
        return $this->hasOne(Club::class, 'ID_ADMIN', 'ID');
    }

     public function jugador()
    {
        return $this->hasOne(Jugador::class, 'ID_USUARIO', 'ID');
    }
}
