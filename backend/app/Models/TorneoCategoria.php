<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TorneoCategoria extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'TORNEO_CATEGORIA';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ID_TORNEO',
        'ID_CATEGORIA',
        'CUPO_PAREJAS'
    ];

    /**
     * The tournament associated with the pivot table.
     */
    public function torneo()
    {
        return $this->belongsTo(Torneo::class, 'ID_TORNEO', 'ID');
    }

    /**
     * The category associated with the pivot table.
     */
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'ID_CATEGORIA', 'ID');
    }
}
