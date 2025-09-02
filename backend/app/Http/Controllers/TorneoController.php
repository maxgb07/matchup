<?php
// app/Http/Controllers/TorneoController.php

namespace App\Http\Controllers;

use App\Models\Torneo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TorneoController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_club' => 'required|exists:CLUBES,ID',
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'costo' => 'required|numeric|min:0', // Nueva regla de validación
            'categorias' => 'required|array|min:1',
            'categorias.*' => 'exists:CATEGORIAS,ID',
            'config_grupos' => 'required|array',
            'config_grupos.*.grupos' => 'required|integer|min:1',
            'config_grupos.*.parejas_por_grupo' => 'required|integer|min:1',
            'rondas' => 'required|array|min:1',
            'rondas.*.puntos' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Error de validación', 'errors' => $validator->errors()], 422);
        }

        try {
            $torneo = Torneo::create([
                'NOMBRE' => $request->nombre,
                'FECHA_INICIO' => $request->fecha_inicio,
                'FECHA_FIN' => $request->fecha_fin,
                'COSTO' => $request->costo, // Se incluye el costo
                'ID_CLUB' => $request->id_club,
            ]);

            $categoriasConConfig = [];
            foreach ($request->categorias as $categoriaId) {
                $config = $request->config_grupos[$categoriaId];
                $categoriasConConfig[$categoriaId] = [
                    'GRUPOS' => $config['grupos'],
                    'PAREJAS_POR_GRUPO' => $config['parejas_por_grupo']
                ];
            }
            $torneo->categorias()->sync($categoriasConConfig);

            foreach ($request->rondas as $ronda) {
                $torneo->puntosPorRonda()->create([
                    'RONDA_NOMBRE' => $ronda['nombre'],
                    'PUNTOS' => $ronda['puntos']
                ]);
            }

            return response()->json(['message' => 'Torneo creado con éxito', 'data' => $torneo], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear el torneo: ' . $e->getMessage()], 500);
        }
    }

    public function showByClub($clubId)
    {
        try {
            $torneos = Torneo::where('ID_CLUB', $clubId)
                            ->orderBy('FECHA_INICIO', 'desc')
                            ->get();

            if ($torneos->isEmpty()) {
                return response()->json(['message' => 'No se encontraron torneos para este club.'], 404);
            }

            return response()->json($torneos);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener los torneos: ' . $e->getMessage()], 500);
        }
    }

    public function showDetails($id)
    {
        try {
            $torneo = Torneo::with('categorias', 'puntosPorRonda')
                            ->where('ID', $id)
                            ->first();

            if (!$torneo) {
                return response()->json(['message' => 'Torneo no encontrado.'], 404);
            }

            return response()->json($torneo);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener los detalles del torneo: ' . $e->getMessage()], 500);
        }
    }
}
