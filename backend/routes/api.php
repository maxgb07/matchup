<?php

use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\ClubAdminController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\PlayerAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí es donde puedes registrar rutas API para tu aplicación. Estas
| rutas son cargadas por el RouteServiceProvider y todas ellas
| serán asignadas al grupo de middleware "api".
|
*/

// Rutas públicas (no requieren autenticación)
Route::post('/super-admin/login', [SuperAdminController::class, 'login']);
Route::post('/club-admin/login', [ClubAdminController::class, 'login']);
Route::post('/player/login', [PlayerAuthController::class, 'login']);
Route::post('/player/register', [PlayerAuthController::class, 'register']);

Route::get('/states', [GeneralController::class, 'getStates']);
Route::get('/cities/{stateId}', [GeneralController::class, 'getCities']);
Route::get('/categories', [GeneralController::class, 'getCategories']);
Route::get('/clubs', [GeneralController::class, 'getClubs']);

// Rutas protegidas (requieren un token de autenticación)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rutas para la gestión de clubes
    Route::post('/super-admin/clubs/create', [SuperAdminController::class, 'createClub']);
    Route::get('/super-admin/clubs', [SuperAdminController::class, 'getClubs']);

    Route::post('/club-admin/players/create', [ClubAdminController::class, 'createPlayer']);
    Route::get('/club-admin/players', [ClubAdminController::class, 'getPlayers']);
});
