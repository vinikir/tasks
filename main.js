const { app,  BrowserWindow } = require('electron')

const modal = require('electron-modal');
app.on('ready', () => {
 
  
    modal.setup();
   

   
});

function createWindow () {
    const win = new BrowserWindow({
      //width: 550,
      //height: 350,
       width: 1200,
      height: 1200,
      x:970,
      y:450,
      movable:true,
      minimizable :true,
      maximizable :false,
      //closable :false,
      //alwaysOnTop :true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    }
    })
      
    win.loadFile('src/index.html')

}



app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('minimize ', function () {
    console.log(win.isVisible())
   
    win.setSize(550, 10, true)
   
})



