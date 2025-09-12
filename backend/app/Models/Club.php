<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'CLUBS';

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
        'NOMBRE',
        'SUBDOMINIO',
        'ID_ADMIN',
    ];

    /**
     * Get the user that is the admin of the club.
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'ID_ADMIN', 'ID');
    }

    public function torneos()
    {
        return $this->hasMany(Torneo::class, 'ID_CLUB', 'ID');
    }
}
