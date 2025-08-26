<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Club; // Se agregó el modelo Club
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail; // Se agregó la fachada para Mail
use App\Mail\NewClubAdminCredentials; // Se agregó el Mailable

class SuperAdminController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('EMAIL', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->PASSWORD) || $user->TIPO_USUARIO !== 1) {
            return response()->json([
                'message' => 'Credenciales incorrectas o no es un Super Admin.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'tipo_usuario' => $user->TIPO_USUARIO
        ]);
    }

    public function createClub(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'subdomain' => 'required|string|unique:clubs,SUBDOMINIO|regex:/^[a-z0-9]+$/|max:255',
                'email' => 'required|email|unique:users,EMAIL|max:255',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $password = Str::random(10);

            $user = User::create([
                'name' => 'Admin ' . $request->name,
                'EMAIL' => $request->email,
                'PASSWORD' => Hash::make($password),
                'TIPO_USUARIO' => 2, // 1=Super Admin, 2=Admin de Club
            ]);

            $club = Club::create([
                'NOMBRE' => $request->name,
                'SUBDOMINIO' => $request->subdomain,
                'ID_ADMIN' => $user->ID,
            ]);

            DB::commit();

            // Aquí se envía el correo con los datos de acceso
            Mail::to($user->EMAIL)->send(new NewClubAdminCredentials($user, $password));

            return response()->json([
                'message' => 'Club creado con éxito. El administrador ha sido notificado por correo.',
                'club' => $club,
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el club y el administrador.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getClubs()
    {
        // Obtiene todos los clubes con sus administradores
        $clubs = Club::with('admin')->get();

        return response()->json(['clubs' => $clubs], 200);
    }
}
