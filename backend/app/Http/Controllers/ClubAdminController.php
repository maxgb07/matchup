<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Club;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewPlayerCredentials;
use Illuminate\Support\Str;
use App\Models\Jugador;
use App\Mail\NewPasswordMail;

class ClubAdminController extends Controller
{
    public function login(Request $request)
    {
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

        $user = User::where('EMAIL', $request->email)->first();
        if ($user) {
            $user->load('club');
        }

        if (!$user || !Hash::check($request->password, $user->PASSWORD) || $user->TIPO_USUARIO !== 2) {
            return response()->json([
                'message' => 'Credenciales incorrectas o no es un administrador de club.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'club_name' => $user->club ? $user->club->NOMBRE : null,
            'tipo_usuario' => $user->TIPO_USUARIO,
            'id_club' => $user->club->ID
        ]);
    }

    public function createPlayer(Request $request)
    {
        $admin = $request->user();

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:USERS,EMAIL',
                'phone' => 'required|string|max:20',
                'state_id' => 'required|exists:ESTADOS,ID',
                'city_id' => 'required|exists:CIUDADES,ID',
                'category_id' => 'required|exists:CATEGORIAS,ID',
                'position' => 'required|string|in:Derecha,Reves,Ambas',
                'birth_date' => 'required|date',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }

        $password = Str::random(10);
        $hashedPassword = Hash::make($password);

        $user = User::create([
            'EMAIL' => $request->email,
            'PASSWORD' => $hashedPassword,
            'TIPO_USUARIO' => 3,
        ]);

        $club = $admin->club;
        if (!$club) {
            $user->delete();
            return response()->json(['message' => 'El administrador no tiene un club asociado.'], 400);
        }
        $clubId = $club->ID;

        $jugador = Jugador::create([
            'ID_USUARIO' => $user->ID,
            'ID_CLUB' => $clubId,
            'NOMBRE' => $request->name,
            'CELULAR' => $request->phone,
            'POSICION_CANCHA' => $request->position,
            'ID_CATEGORIA' => $request->category_id,
            'ID_CIUDAD' => $request->city_id,
            'ID_ESTADO' => $request->state_id,
            'FECHA_NACIMIENTO' => $request->birth_date,
        ]);

        try {
            Mail::to($user->EMAIL)->send(new NewPlayerCredentials($jugador, $password));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Jugador creado pero el correo no pudo ser enviado.',
                'error_detail' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Jugador creado exitosamente. Se ha enviado un correo con sus credenciales.'
        ], 201);
    }

    public function getPlayers(Request $request)
    {
        $query = Jugador::with(['categoria', 'estado', 'ciudad', 'user', 'club'])->orderBy('ID_CATEGORIA', 'asc');;


        // Filtrar por nombre si se proporciona el parámetro 'player_name'
        if ($request->has('player_name')) {
            $query->where('NOMBRE', 'like', '%' . $request->query('player_name') . '%');
        }

        // Filtrar por categoría (ID) si se proporciona el parámetro 'category_id'
        if ($request->has('category_id')) {
            $query->where('ID_CATEGORIA', $request->query('category_id'));
        }

        $players = $query->get();

        return response()->json($players);
    }

    public function forgotPassword(Request $request)
    {
        // 1. Validar el correo electrónico
        try {
            $request->validate([
                'email' => 'required|email',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }

        // 2. Buscar al usuario por email
        $user = User::where('EMAIL', $request->email)->first();

        // 3. Verificar si el usuario existe
        if (!$user) {
            return response()->json([
                'message' => 'No se encontró un usuario con ese correo electrónico.'
            ], 404);
        }

        // 4. Generar una nueva contraseña aleatoria
        $newPassword = Str::random(10);

        // 5. Actualizar la contraseña del usuario en la base de datos (hasheada)
        $user->PASSWORD = Hash::make($newPassword);
        $user->save();

        // 6. Enviar la nueva contraseña al usuario por correo electrónico
        try {
            Mail::to($user->EMAIL)->send(new NewPasswordMail($newPassword));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Nueva contraseña generada pero el correo no pudo ser enviado.',
                'error_detail' => $e->getMessage()
            ], 500);
        }

        // 7. Retornar una respuesta al frontend con un mensaje de éxito
        return response()->json([
            'message' => 'Se ha enviado la nueva contraseña a tu correo electrónico.',
        ], 200);
    }


}
