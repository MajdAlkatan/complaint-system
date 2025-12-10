<?php 

namespace App\Repositories;

use App\Interfaces\IGovernmentEntityRepo;
use App\Models\GovernmentEntity;

class GovernmentEntityRepo implements IGovernmentEntityRepo
{

    public function getAll(){
        return GovernmentEntity::all();
    }
    public function getById($id){
        return GovernmentEntity::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return GovernmentEntity::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return GovernmentEntity::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return GovernmentEntity::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return GovernmentEntity::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return GovernmentEntity::create($data);
    }
    public function update($id, array $data){
        $row =  GovernmentEntity::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return GovernmentEntity::destroy($id);
    } 
}