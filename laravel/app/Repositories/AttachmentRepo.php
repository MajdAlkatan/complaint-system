<?php 

namespace App\Repositories;

use App\Interfaces\IAttachmentRepo;
use App\Models\Attachment;

class AttachmentRepo implements IAttachmentRepo
{

    public function getAll(){
        return Attachment::all();
    }
    public function getById($id){
        return Attachment::findOrFail($id);
    }
    public function getWhereEq($col,$data){
        return Attachment::Where($col , $data)->get();
    }
    public function getFirstEq($col,$data){
        return Attachment::FirstWhere($col , $data);
    }
    public function getFirst($col,$op,$data){
        return Attachment::FirstWhere($col ,$op, $data);
    }
    public function getWhere($col,$op,$data){
        return Attachment::Where($col , $op , $data)->get();
    }
    public function insert(array $data){
        return Attachment::create($data);
    }
    public function update($id, array $data){
        $row =  Attachment::findOrFail($id);
        $row->update($data);
        return $row;
    }
    public function delete($id){
        return Attachment::destroy($id);
    } 
}