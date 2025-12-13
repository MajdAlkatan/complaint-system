<?php 

namespace App\Repositories;

use App\Interfaces\IComplaintTypeRepo;
use App\Models\ComplaintType;

class ComplaintTypeRepo implements IComplaintTypeRepo
{

    public function getAll(){
        return ComplaintType::all();
    }
    public function getById($id){
        return ComplaintType::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return ComplaintType::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return ComplaintType::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return ComplaintType::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return ComplaintType::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return ComplaintType::create($data);
    }
    public function update($id, array $data){
        $row =  ComplaintType::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return ComplaintType::destroy($id);
    } 
}