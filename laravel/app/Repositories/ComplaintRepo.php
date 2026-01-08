<?php 

namespace App\Repositories;

use App\Interfaces\IComplaintRepo;
use App\Models\Complaint;

class ComplaintRepo implements IComplaintRepo
{

    public function getAll(){
        return Complaint::all();
    }
    public function getCount(){
        return Complaint::count();
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






    public function getPendingCnt(){
        return Complaint::where('status', 'pending')->count();
    }
    public function getInProgressCnt(){
        return Complaint::where('status', 'in_progress')->count();
    }
    public function getResolvedCnt(){
        return Complaint::where('status', 'resolved')->count();
    }
    public function getClosedCnt(){
        return Complaint::where('status', 'closed')->count();
    }
    public function getRejectedCnt(){
        return Complaint::where('status', 'rejected')->count();
    }
}