<?php

namespace App\Http\Controllers;

use App\Models\Estado;
use App\Models\Ciudad;
use App\Models\Categoria;
use App\Models\Club;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function getStates()
    {
        $states = Estado::all();
        return response()->json($states);
    }

    public function getCities($stateId)
    {
        $cities = Ciudad::where('ID_ESTADO', $stateId)->get();
        return response()->json($cities);
    }

    public function getCategories()
    {
        $categories = Categoria::all();
        return response()->json($categories);
    }

    public function getClubs()
    {
        $clubs = Club::all(['ID', 'NOMBRE']);
        return response()->json($clubs);
    }
}
