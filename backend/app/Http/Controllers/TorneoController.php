<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Torneo;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class TorneoController extends Controller
{
    public function index()
    {
        // Carga ansiosa para el club y las categorías
        $tournaments = Torneo::with(['club', 'categorias' => function ($query) {
            $query->withPivot('CUPO_PAREJAS');
        }])->where('ACTIVO', 1)->get();
        return response()->json($tournaments);
    }
    /**
     * Create a new tournament.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createTournament(Request $request)
    {
        try {
            // 1. Validar los datos de la solicitud
            $request->validate([
                'ID_CLUB' => 'required|exists:CLUBS,ID',
                'NOMBRE' => 'required|string|max:255',
                'FECHA_INICIO' => 'required|date',
                'FECHA_FIN' => 'required|date|after_or_equal:FECHA_INICIO',
                'FECHA_INSCRIPCION_LIMITE' => 'required|date|before_or_equal:FECHA_INICIO',
                'COSTO_POR_PAREJA' => 'required|numeric|min:0',
                'DESCRIPCION' => 'nullable|string',
                'CATEGORIAS' => 'required|array|min:1',
                'CATEGORIAS.*.ID_CATEGORIA' => 'required|exists:CATEGORIAS,ID',
                'CATEGORIAS.*.CUPO_PAREJAS' => 'required|integer|min:2',
            ]);

            DB::beginTransaction();

            // 2. Crear el registro del torneo principal
            $torneo = Torneo::create([
                'ID_CLUB' => $request->ID_CLUB,
                'NOMBRE' => $request->NOMBRE,
                'FECHA_INICIO' => $request->FECHA_INICIO,
                'FECHA_FIN' => $request->FECHA_FIN,
                'FECHA_INSCRIPCION_LIMITE' => $request->FECHA_INSCRIPCION_LIMITE,
                'COSTO_POR_PAREJA' => $request->COSTO_POR_PAREJA,
                'DESCRIPCION' => $request->DESCRIPCION,
            ]);

            // 3. Preparar los datos de las categorías para la tabla pivote
            $categoriasParaPivot = [];
            foreach ($request->CATEGORIAS as $categoria) {
                $categoriasParaPivot[$categoria['ID_CATEGORIA']] = ['CUPO_PAREJAS' => $categoria['CUPO_PAREJAS']];
            }

            // 4. Adjuntar las categorías al torneo usando el método de relación y la tabla pivote
            $torneo->categorias()->sync($categoriasParaPivot);

            DB::commit();

            return response()->json([
                'message' => 'Torneo creado exitosamente.',
                'torneo' => $torneo
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el torneo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all tournaments for a specific club.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTournamentsByClub(Request $request)
    {
        $request->validate([
            'ID_CLUB' => 'required|exists:CLUBS,ID',
        ]);

        $tournaments = Torneo::with('categorias')
                            ->where('ID_CLUB', $request->ID_CLUB)
                            ->where('ACTIVO', 1)
                            ->get();

        return response()->json($tournaments);
    }

    public function updateTournament(Request $request, $id)
    {
        try {
            // 1. Validar los datos de la solicitud
            $request->validate([
                'NOMBRE' => 'required|string|max:255',
                'DESCRIPCION' => 'nullable|string',
                'FECHA_INICIO' => 'required|date',
                'FECHA_FIN' => 'required|date|after_or_equal:FECHA_INICIO',
                'FECHA_INSCRIPCION_LIMITE' => 'required|date|before:FECHA_INICIO',
                'COSTO_POR_PAREJA' => 'required|numeric',
                'categorias' => 'required|array',
                'categorias.*.ID_CATEGORIA' => 'required|integer|exists:CATEGORIAS,ID',
                'categorias.*.CUPO_PAREJAS' => 'required|integer|min:1',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación.', 'errors' => $e->errors()], 422);
        }

        // 2. Encontrar el torneo o devolver un error si no existe
        $torneo = Torneo::find($id);

        if (!$torneo) {
            return response()->json(['message' => 'Torneo no encontrado.'], 404);
        }

        // 3. Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // 4. Actualizar los campos principales del torneo
            $torneo->update([
                'NOMBRE' => $request->NOMBRE,
                'DESCRIPCION' => $request->DESCRIPCION,
                'FECHA_INICIO' => $request->FECHA_INICIO,
                'FECHA_FIN' => $request->FECHA_FIN,
                'FECHA_INSCRIPCION_LIMITE' => $request->FECHA_INSCRIPCION_LIMITE,
                'COSTO_POR_PAREJA' => $request->COSTO_POR_PAREJA,
            ]);

            // 5. Sincronizar las categorías del torneo
            // El método `sync` eliminará las categorías no listadas y adjuntará las nuevas
            $categoriasData = collect($request->categorias)->mapWithKeys(function ($item) {
                return [$item['ID_CATEGORIA'] => ['CUPO_PAREJAS' => $item['CUPO_PAREJAS']]];
            })->toArray();

            $torneo->categorias()->sync($categoriasData);

            // 6. Confirmar la transacción
            DB::commit();

            return response()->json(['message' => 'Torneo actualizado exitosamente.', 'torneo' => $torneo]);
        } catch (\Exception $e) {
            // 7. Revertir la transacción en caso de error
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar el torneo.', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteTournament($id)
    {
        $torneo = Torneo::find($id);

        if (!$torneo) {
            return response()->json(['message' => 'Torneo no encontrado.'], 404);
        }

        // Soft delete: Actualizamos el campo ACTIVO a 0 en lugar de eliminar
        $torneo->update(['ACTIVO' => 0]);

        return response()->json(['message' => 'Torneo eliminado exitosamente.']);
    }
}
