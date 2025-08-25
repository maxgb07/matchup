<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Jugador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class PlayerAuthController extends Controller
{

     public function login(Request $request)
    {
        // 1. Validar las credenciales
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }

        // 2. Buscar al usuario por email en la tabla USERS
        $user = User::where('EMAIL', $request->email)->first();

        // 3. Verificar si el usuario existe, la contraseña es correcta y es un jugador
        // El TIPO_USUARIO 3 corresponde a un jugador
        if (! $user || ! Hash::check($request->password, $user->PASSWORD) || $user->TIPO_USUARIO !== 3) {
            return response()->json([
                'message' => 'Credenciales incorrectas o el usuario no es un jugador.'
            ], 401);
        }

        // 4. Cargar la relación 'jugador' para obtener los datos específicos del jugador
        $user->load('jugador');

        // 5. Generar el token de autenticación para el usuario
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6. Devolver el token y la información del jugador
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'player' => $user->jugador, // Devuelve el objeto completo del jugador asociado
        ]);
    }

    public function register(Request $request)
    {
        // Validación de los datos
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'nombre' => ['required', 'string', 'max:255'],
            'celular' => ['required', 'string', 'max:20'],
            'estado_id' => ['required', 'exists:estados,id'],
            'ciudad_id' => ['required', 'exists:ciudades,id'],
            'categoria_id' => ['required', 'exists:categorias,id'],
            'posicion' => ['required', 'string'],
            'foto_perfil' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'club_id' => ['required', 'exists:clubs,id'],
        ]);

        // Guardar la foto de perfil si se subió una
        $foto_perfil = null;
        if ($request->hasFile('foto_perfil')) {
            $path = $request->file('foto_perfil')->store('profile_photos', 'public');
            $foto_perfil = basename($path);
        }

        // Crear el usuario en la tabla `users`
        $user = User::create([
            'EMAIL' => $validated['email'],
            'PASSWORD' => Hash::make($validated['password']),
            'TIPO_USUARIO' => 3,
        ]);

        // Crear el jugador en la tabla `jugadores`
        $jugador = Jugador::create([
            'ID_USUARIO' => $user->ID,
            'ID_CLUB' => $validated['club_id'],
            'NOMBRE' => $validated['nombre'],
            'CELULAR' => $validated['celular'],
            'POSICION_CANCHA' => $validated['posicion'],
            'ID_CATEGORIA' => $validated['categoria_id'],
            'ID_CIUDAD' => $validated['ciudad_id'],
            'ID_ESTADO' => $validated['estado_id'],
            'FOTO' => $foto_perfil,
        ]);

        return response()->json([
            'message' => 'Jugador registrado exitosamente.',
            'player' => $jugador
        ], 201);
    }

    /**
     * Obtiene el perfil del jugador autenticado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        if ($user && $user->TIPO_USUARIO === 3) {
            $player = $user->jugador()->with([
                'user', // Relación con el usuario para obtener el email
                'club',
                'categoria',
                'ciudad',
                'estado'
            ])->first();

            if ($player) {
                return response()->json($player);
            }
        }
        return response()->json(['message' => 'Perfil de jugador no encontrado.'], 404);
    }

    /**
     * Actualiza el perfil del jugador autenticado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->TIPO_USUARIO !== 3) {
            return response()->json(['message' => 'Acceso no autorizado.'], 403);
        }

        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'celular' => 'required|string|max:20',
                'posicion_cancha' => 'required|string|in:Derecha,Reves,Ambas',
                'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }

        $player = $user->jugador;
        if (!$player) {
            return response()->json(['message' => 'Perfil de jugador no encontrado.'], 404);
        }

        $player->NOMBRE = $request->nombre;
        $player->CELULAR = $request->celular;
        $player->POSICION_CANCHA = $request->posicion_cancha;

        if ($request->hasFile('foto_perfil')) {
            // Elimina la foto anterior si existe
            if ($player->FOTO_PERFIL) {
                Storage::delete($player->FOTO_PERFIL);
            }
            $path = $request->file('foto_perfil')->store('profile_photos', 'public');
            $player->FOTO_PERFIL = $path;
        }

        $player->save();

        return response()->json(['message' => 'Perfil actualizado exitosamente.', 'player' => $player]);
    }

}
