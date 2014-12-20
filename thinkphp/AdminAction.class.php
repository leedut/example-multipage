<?php
    class AdminAction extends BaseAction{
        
        public function index(){
            $pagename = '';
            $scriptname = 'admin.index';
            $this->display();
        }
        
        public function adduser(){
            $pagename = '';
            $scriptname = 'admin.adduser';
            $this->display();
        }
        
        //省略不计
        
    }