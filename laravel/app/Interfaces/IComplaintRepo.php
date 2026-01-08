<?php

namespace App\Interfaces;

interface IComplaintRepo
{
    public function getAll();
    public function getCount();
    public function getById($id);
    public function getWhereEq($col,$data);
    public function getFirstEq($col,$data);
    public function getWhere($col,$op,$data);
    public function getFirst($col,$op,$data);
    public function insert(array $data);
    public function update($id , array $data);
    public function delete($id);


    public function getPendingCnt();
    public function getInProgressCnt();
    public function getResolvedCnt();
    public function getClosedCnt();
    public function getRejectedCnt();
}