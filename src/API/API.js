//const loki = require('lokijs')
const db = require('electron-db');
const moment = require('moment');
const path = require('path')

class API{

    constructor(){

        this.location = path.join(__dirname, 'DB')
       

        this.initTask()

    }
    
    
     initTask(){
        
        
        if (!db.valid('history',this.location)) { 
       
            db.createTable('history',this.location, (succ, msg) => {
                console.log("Success: " + succ);
                console.log("Message: " + msg);
            })
        }
    

        if (!db.valid('tasks',this.location)) { 
       
            db.createTable('tasks',this.location, (succ, msg) => {
                console.log("Success: " + succ);
                console.log("Message: " + msg);
            })

        }

      
       
    }

    buscar(id){
        var res = []
       
        db.search("tasks",this.location,'task',id,(succ, data) => {
            res = data
        })
        
        return res
    }


    salvar(id) {

       

    }

    getTasksAbertas(){

        var res = []

        db.search('tasks',this.location,'completed',false,function(succ, data){ res = data })

        return res

    }

   

    deleteAll(){
        db.clearTable('tasks',this.location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    }

    salvarHistorico(History){

        db.insertTableContent('history',this.location, History, function (succ, msg){});

    }

    salvarTask(todo){

        db.insertTableContent('tasks',this.location, todo, function (succ, msg){});

    }

    updateTask( where , set){
        
        db.updateRow('tasks',this.location, where, set, (succ, msg) => {});
        

    }

}



