<?php

namespace App\Http\Controllers;
use App\Interfaces\IInformationRequestRepo;
use Illuminate\Http\Request;

class InformationRequestController extends Controller
{
    private IInformationRequestRepo $informationRequestRepo;

    public function __construct(IInformationRequestRepo $informationRequestRepo1){
        $informationRequestRepo = $informationRequestRepo1;
    }

    public function index(){
        $data = $this->informationRequestRepo->getAll();
        return response()->json($data);
    }

    public function getById($id){
        $data = $this->informationRequestRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->informationRequestRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        //
    }

    public function update($id , Request $request){
        $this->informationRequestRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }
}
