<?php 

namespace App\Repositories;

use App\Interfaces\ICitizenRepo;
use App\Models\Citizen;

class CitizenRepo implements ICitizenRepo
{

    public function getAll(){
        return Citizen::all();
    }
    public function getById($id){
        return Citizen::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return Citizen::Where($col , $data)->get();
    }
        public function getFirstEq($col,$data){
        return Citizen::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return Citizen::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return Citizen::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return Citizen::create($data);
    }
    public function update($id, array $data){
        $row =  Citizen::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return Citizen::destroy($id);
    } 
}