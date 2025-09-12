<?php

namespace App\Http\Controllers;

use App\Models\Ranking;
use App\Models\Jugador;
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
        $query = Jugador::leftJoin('CATEGORIAS', 'JUGADORES.ID_CATEGORIA', '=', 'CATEGORIAS.ID')
            ->leftJoin('RANKING', 'JUGADORES.ID', '=', 'RANKING.ID_JUGADOR')
            ->select(
                'JUGADORES.ID',
                'JUGADORES.NOMBRE',
                'JUGADORES.ID_CATEGORIA',
                'RANKING.PUNTOS',
                'RANKING.updated_at',
                'CATEGORIAS.NOMBRE as categoria_nombre',
                'CATEGORIAS.GENERO as categoria_genero',
            );

        // Filtrar por categoría
        if ($request->has('category_id')) {
            $query->where('JUGADORES.ID_CATEGORIA', $request->query('category_id'));
        }

        // Filtrar por nombre
        if ($request->has('player_name')) {
            $query->where('JUGADORES.NOMBRE', 'like', '%' . $request->query('player_name') . '%');
        }

        // Ordenar los resultados
        $query->orderBy('JUGADORES.ID_CATEGORIA', 'asc')
            ->orderByRaw('RANKING.PUNTOS IS NULL ASC')
            ->orderBy('RANKING.PUNTOS', 'desc');

        $ranking = $query->get();

        // Asignar posición y manejar puntos nulos
        $rankingWithPosition = $ranking->map(function ($item, $index) {
            $item->posicion = $index + 1;
            $item->PUNTOS = $item->PUNTOS ?? 0;
            return $item;
        });

        return response()->json($rankingWithPosition);
    }

    /**
     * Otorga puntos a un jugador.
     */
    public function addPoints(Request $request)
    {
        // 1. Validar la solicitud
        $request->validate([
            'id_jugador' => 'required|exists:jugadores,ID',
            'id_categoria' => 'required|exists:categorias,ID',
            'puntos' => 'required|integer|min:1',
        ]);

        // 2. Buscar el registro del ranking o crear uno nuevo si no existe
        $rankingEntry = Ranking::firstOrNew([
            'ID_JUGADOR' => $request->id_jugador,
            'ID_CATEGORIA' => $request->id_categoria,
        ]);

        // 3. Sumar los nuevos puntos al registro
        // El operador '?? 0' asegura que si es un registro nuevo, empiece en 0.
        $rankingEntry->PUNTOS = ($rankingEntry->PUNTOS ?? 0) + $request->puntos;

        // 4. Guardar el registro (esto inserta o actualiza)
        $rankingEntry->save();

        return response()->json(['message' => 'Puntos actualizados con éxito.']);
    }
}
