<?php

namespace App\Http\Controllers;

use App\Models\Ranking;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    /**
     * Muestra el ranking de jugadores con filtros opcionales.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Ranking::with(['jugador', 'categoria'])
                        ->orderBy('ID_CATEGORIA', 'asc')
                        ->orderBy('PUNTOS', 'desc');

        // Filtrar por categoría (ID) si se proporciona
        if ($request->has('category_id')) {
            $query->where('ID_CATEGORIA', $request->query('category_id'));
        }

        // Filtrar por nombre del jugador si se proporciona
        if ($request->has('player_name')) {
            $query->whereHas('jugador', function ($q) use ($request) {
                $q->where('NOMBRE', 'like', '%' . $request->query('player_name') . '%');
            });
        }

        $ranking = $query->get();

        return response()->json($ranking);
    }
}
