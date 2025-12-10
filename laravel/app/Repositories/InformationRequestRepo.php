<?php 

namespace App\Repositories;

use App\Interfaces\IInformationRequestRepo;
use App\Models\InformationRequest;

class InformationRequestRepo implements IInformationRequestRepo
{

    public function getAll(){
        return InformationRequest::all();
    }
    public function getById($id){
        return InformationRequest::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return InformationRequest::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return InformationRequest::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return InformationRequest::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return InformationRequest::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return InformationRequest::create($data);
    }
    public function update($id, array $data){
        $row =  InformationRequest::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return InformationRequest::destroy($id);
    } 
}