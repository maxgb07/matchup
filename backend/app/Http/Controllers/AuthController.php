<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Club;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $club = Club::where('EMAIL_ADMIN', $request->email)->first();

        if (! $club || ! Hash::check($request->password, $club->PASSWORD_ADMIN)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $token = $club->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
