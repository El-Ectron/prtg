var datos;
var indexFail=[];
var id=78250;
var durationFail=[];
var fecha=[];
var fechatemp=[];
var horatemp=[];
var t1;
var t2;
var sdate="2021-03-01-12-00";
var edate="2021-03-11-12-00";
var failTotal;
var fechasError=[];
var errorSum=[];

$("#btnGet").on("click",function(){
  id=document.getElementById("deviceid").value;
  sdate=document.getElementById("sdate").value;
  sdate=sdate.split("T").join("-");
  sdate=sdate.split(":").join("-");
  edate=document.getElementById("edate").value;
  edate=edate.split("T").join("-");
  edate=edate.split(":").join("-");
  console.log("http://172.17.255.18/api/historicdata.json?id="+id+"&avg=0&sdate="+sdate+"-00&edate="+edate+"-00&username=alicea&passhash=271417383");
  $.getJSON( "http://172.17.255.18/api/historicdata.json?id="+id+"&avg=0&sdate="+sdate+"-00&edate="+edate+"-00&username=alicea&passhash=271417383", function( data ) {
    datos=data;
    console.log("Got Data")
  });

})
$("#btnFail").on("click",function(){
  durationFail=[];
  fechasError=[];
  for(var i=1;i<datos["histdata"].length;i++){
    //console.log(datos["histdata"][i]);
    if(datos["histdata"][i]["value"]===""){
      indexFail.push(i-1);
      console.log(i);
      console.log("Última conexión exitosa: "+datos["histdata"][i-1]["datetime"]);
      t1=getDate(datos["histdata"][i-1]["datetime"]);
      for(var j=0;j<datos["histdata"].length-i;j++){
        console.log(j);
        if((i+j)===(datos["histdata"].length-1)){
          console.log("xd");
          console.log("Fin de error: "+datos["histdata"][i+j]["datetime"]);
          t2=getDate(datos["histdata"][i+j]["datetime"]);
          durationFail.push(Math.abs(t2-t1));
          i=i+j;
          fechasError.push(t2);
          break;
        }
        else if(datos["histdata"][i+j+1]["value"]!=="" ){
          console.log("Fin de error: "+datos["histdata"][i+j+1]["datetime"]);
          t2=getDate(datos["histdata"][i+j+1]["datetime"]);
          durationFail.push(Math.abs(t2-t1));
          i=i+j;
          fechasError.push(t2);
          break;
        }


      }

    }
    failTotal=durationFail.reduce((a,b)=>a+b,0);
    document.getElementById("failTime").innerHTML=failTotal/60000+" minutos";
  }
  console.log("Done");
  //fechasError=getDay(fechasError);
  errorSum=addPrevious(durationFail);
  createGraph(fechasError,errorSum);
})

function getDate(datos){
  fecha=datos;
  fecha=fecha.split("/");
  fechatemp=fecha[2].split(" ");
  fecha[2]=fechatemp[0];
  fecha[0]=parseInt(fecha[0],10);
  fecha[1]=parseInt(fecha[1],10);
  fecha[2]=parseInt(fecha[2],10);
  horatemp=fechatemp[1].split(":");

  horatemp[0]=parseInt(horatemp[0],10);
  horatemp[1]=parseInt(horatemp[1],10);
  horatemp[2]=parseInt(horatemp[2],10);
  if(fechatemp[2]==="p.m."){
    horatemp[0]+=12;
    if(horatemp[0]===24){
      horatemp[0]=12;
    }
  }
  var d=new Date(fecha[2],fecha[1],fecha[0],horatemp[0],horatemp[1],horatemp[2]);
  return d;
}

/* Graphs*/
function createGraph(fechas, errores){
  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: fechas,
          datasets: [{
              label: 'Tiempo sin conexión (ms)',
              data: errores,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

}
 function getDay(fechas){
   var date=[];
   for(var i=0;i<fechas.length;i++){
     date.push(fechas.getDate);
   }
   return date;
 }

function addPrevious(array){
  var newArray=[array[0]];

  for(var i=0;i<array.length-1;i++){
    newArray.push(newArray[i]+array[i+1]);
  }
  return newArray;
}
