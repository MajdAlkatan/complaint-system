<?php 

namespace App\Repositories;

use App\Interfaces\ILoginAttemptRepo;
use App\Models\LoginAttempt;

class LoginAttemptRepo implements ILoginAttemptRepo
{

    public function getAll(){
        return LoginAttempt::all();
    }
    public function getById($id){
        return LoginAttempt::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return LoginAttempt::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return LoginAttempt::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return LoginAttempt::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return LoginAttempt::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return LoginAttempt::create($data);
    }
    public function update($id, array $data){
        $row =  LoginAttempt::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id): int{
        return LoginAttempt::destroy($id);
    } 
}