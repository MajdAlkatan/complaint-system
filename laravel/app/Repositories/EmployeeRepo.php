<?php 

namespace App\Repositories;

use App\Interfaces\IEmployeeRepo;
use App\Models\Employee;

class EmployeeRepo implements IEmployeeRepo
{

    public function getAll(){
        return Employee::all();
    }
    public function getCount(){
        return Employee::count();
    }
    public function getById($id){
        return Employee::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return Employee::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return Employee::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return Employee::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return Employee::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return Employee::create($data);
    }
    public function update($id, array $data){
        $row =  Employee::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return Employee::destroy($id);
    } 
}