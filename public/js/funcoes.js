


document.getElementById("criar").addEventListener("click", salvar);


var APIs = new API()
var agora = moment().format("YYYY-MM-DD HH:mm:ss")

function finalizar(task){

	APIs.updateTask({"task":task.toString()}, {"completed":true} )

	var History = {
		task:task.trim(),
		acao:"Finalizado",
		data:agora,
	}

	APIs.salvarHistorico(History)
	getTaks()

}


function salvar(){

	var id = document.getElementById("taksId").value
	if(id == ''){
		return
	}

	if(buscarInfos(id).length > 0 ){
		console.log("ja tem")
		return 
	}

	
       
	var tsk = {
		task: id.trim(),
		completed: false,
		time: '00:00:00',
		iniciado: true,
		dataInicio: agora
	};

	var History = {
		task:id.trim(),
		acao:"Criado e Inicado",
		data:agora,
	}
	
	APIs.salvarTask(tsk)
	APIs.salvarHistorico(History)

    getTaks()

	document.getElementById("taksId").value = ''

}

function pausar(task){
	
	var infos = buscarInfos(task)
	
	startTime = moment(infos[0].dataInicio)
	endTime = moment()
	var duration = moment.duration(endTime.diff(startTime));

	var day = duration.days() * 24
	var hor = duration.hours() + day
	var minutos = duration.minutes()
	var segundos = duration.seconds()

	var timeAtual = infos[0].time
	var timeAnterio = hor+":"+minutos+":"+segundos

	var timInsert = somarTempo( timeAnterio, timeAtual)
	var set = {
		time: timInsert,
		dataInicio: null,
		iniciado:false
	} 
	
	APIs.updateTask({"task":task.toString()}, set )

	delete array[task]

	var History = {
		task:task.trim(),
		acao:"Pausado",
		data:agora,
	}

	APIs.salvarHistorico(History)

	getTaks()

}

function somarTempo(tempo1,tempo2){

	var array1 = tempo1.split(':');

	if(array1[0] == 'NaN'){
		array1[0] = '00'
	}

	if(array1[1] == 'NaN'){
		array1[1] = '00'
	}

	if(array1[2] == 'NaN'){
		array1[2] = '00'
	}
	
	var tempo_seg1 = (parseInt(array1[0]) * 3600) + (parseInt(array1[1]) * 60) + parseInt(array1[2]);

	var array2 = tempo2.split(':');
	if(array2[0] == 'NaN'){
		array2[0] = '00'
	}

	if(array2[1] == 'NaN'){
		array2[1] = '00'
	}

	if(array2[2] == 'NaN'){
		array2[2] = '00'
	}
	
	var tempo_seg2 = (parseInt(array2[0]) * 3600) + (parseInt(array2[1]) * 60) + parseInt(array2[2]);

	var tempofinal = parseInt(tempo_seg1) + parseInt(tempo_seg2);

	var hours = Math.floor(tempofinal / (60 * 60));

	var divisorMinutos = tempofinal % (60 * 60);

	var minutes = Math.floor(divisorMinutos / 60);

	var divisorSeconds = divisorMinutos % 60;

	var seconds = Math.ceil(divisorSeconds);

	var contador = "";

	if (hours < 10) { contador = "0" + hours + ":"; } else { contador = hours + ":"; }

	if (minutes < 10) { contador += "0" + minutes + ":"; } else { contador += minutes + ":"; }

	if (seconds < 10) { contador += "0" + seconds; } else { contador += seconds; }

	return contador;

}

function iniciar(task){

	var set = {
		dataInicio: agora,
		iniciado:true
	} 

	APIs.updateTask({"task":task.toString()}, set )

	var History = {
		task:task.trim(),
		acao:"Reiniciado",
		data:agora,
	}

	APIs.salvarHistorico(History)

	getTaks()

}

function buscar(){

	var id = document.getElementById("taskBuscar").value
	if(id == ''){
		return
	}
	createTable(APIs.buscar(id))
	

}


function buscarInfos(task){
	return APIs.buscar(task)
}

function getTaks(){

	var tasks = APIs.getTasksAbertas()

	createTable(tasks)

	initCron()
}

function createTable(data){
        
	var table = ""
					
				    data.forEach(function(value){
						table +="<tr>\
									<td>"+value.task+"</td>"
									if(value.iniciado){
										table +="<td ><span class='timeUpdate' id='"+value.task+"' >"+value.time+"</span></td>"
									}else{
										table +="<td >"+value.time+"</td>"
									}
									table +="<td>"
										if(!value.iniciado){
											table +="<button type='button'  class='btn'  onclick=\"iniciar(\'"+value.task+"\')\" >Iniciar</button>\
													<button type='button' class='finalizar btn'  onclick=\"finalizar(\'"+value.task+"\')\" >Finalizar</button>"
										}else{
											table +="<button type='button'   class='btn' onclick=\"pausar(\'"+value.task+"\')\" >Pausar</button>"
										}
									table +="<button type='button'   class='btn' onclick=\"verHistorico(\'"+value.task+"\')\" >Ver Historico</button>\
									</td>\
								</tr>"
					})
			
	document.getElementById('bodyTable').innerHTML = table
}


function resetDataBase(){
	APIs.deleteAll()
	getTaks()
}


function timer(hour,minute,second) {
	second = parseInt(second)
	minute = parseInt(minute)
	hour = parseInt(hour)

	if ((second += 1)  == 60) {
		second = 0;
		minute++;
	}

	if (minute == 60) {
		minute = 0;
		hour++;
	}
	
	return returnData(hour)+":"+returnData(minute)+":"+returnData(second);

}

function returnData(input) {
	
	if(input === '00' || input >= 10 ){
		return input

	}else{ 

		return `0${input}`
	}

	
}
var array = {}
var elements = {}
var cron

function initCron(){
	clearInterval(cron);
	
	elements = document.getElementsByClassName('timeUpdate')

	for (var i = 0; i < elements.length; i++) {
		
		var t = elements[i].innerHTML
		
		if(t){

			t = t.split(':')
			
			elements[i].innerHTML = timer(t[0],t[1],t[2])
			array[elements[i].id] = timer(t[0],t[1],t[2])

		}
	
	}
	
	if(elements.length >= 1 ){
		cron = setInterval(() => { timer2(); }, 1000);
	}
		
	
	
}

function timer2(){

	for (var i = 0; i <  Object.keys(array).length; i++) {

		var t = array[elements[i].id]
		
		if(t){

			t = t.split(':')
			elements[i].innerHTML = timer(t[0],t[1],t[2])
			array[elements[i].id] = timer(t[0],t[1],t[2])
			
		}
	
	}
	
}



getTaks()
