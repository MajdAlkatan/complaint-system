<?php 

namespace App\Repositories;

use App\Interfaces\IComplaintRepo;
use App\Models\Complaint;

class ComplaintRepo implements IComplaintRepo
{

    public function getAll(){
        return Complaint::all();
    }
    public function getById($id){
        return Complaint::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return Complaint::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return Complaint::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return Complaint::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return Complaint::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return Complaint::create($data);
    }
    public function update($id, array $data){
        $row =  Complaint::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return Complaint::destroy($id);
    } 
}