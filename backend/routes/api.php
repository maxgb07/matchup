<?php

use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\ClubAdminController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\PlayerAuthController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\TorneoController;
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
Route::get('/ranking', [RankingController::class, 'index']);


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

    Route::get('/player/profile', [PlayerAuthController::class, 'getProfile']);
    Route::post('/player/profile', [PlayerAuthController::class, 'updateProfile']);
    Route::post('/club-admin/torneos/create', [TorneoController::class, 'store']);
    Route::get('/club-admin/torneos/{clubId}', [TorneoController::class, 'showByClub']);
    Route::get('/torneos/{id}/details', [TorneoController::class, 'showDetails']);

});
