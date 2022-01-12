const db = require('electron-db');

class Teste{

    constructor(){
        
        this.initTask()

    }

     initTask(){
         

        if (!db.valid('history')) { 
            db.createTable('history', (succ, msg) => {
                console.log("Success: " + succ);
                console.log("Message: " + msg);
            })
        }
       
    }
}