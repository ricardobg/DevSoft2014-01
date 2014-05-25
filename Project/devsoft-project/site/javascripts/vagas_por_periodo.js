/*
 * Scripts for the resumo page.
 */

var meses = new Array();
var anos = new Array(); // É um objeto pois não sabemos quantos anos devemos levar em conta
var quadrimestres = new Array();
// datas no formato: [dia,mes,ano]
var menor_data = [-1,-1,-1], maior_data = [-1,-1,-1];

function create_chart() 
{
  var meses_label = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  var quadrimestres_label = ["1º Quadrimestre","2º Quadrimestre","3º Quadrimestre"];
  var anos_label = new Array();
  for (var i = menor_data[2]; i <= maior_data[2]; i++)
    anos_label[i-menor_data[2]] = i;
  // Create the chart
  var data = {
  labels : $("input[name=agrupamento]:checked").val()=="mes" ? meses_label : $("input[name=agrupamento]:checked").val()=="ano" ? anos_label : quadrimestres_label,
  datasets : [ 
    {
      fillColor : "rgba(151,187,205,0.5)",
      strokeColor : "rgba(151,187,205,1)",
      data : $("input[name=agrupamento]:checked").val()=="mes" ? meses : $("input[name=agrupamento]:checked").val()=="ano" ? anos : quadrimestres,
    }
    ]
 }

  var ctx = $("#chart_vagas").get(0).getContext("2d");
  var my_chart = new Chart(ctx).Bar(data);
}

function max(sequence)
{
  max = 0;
  for (var i = 0; i < sequence.length; i++)
    if (sequence[i] > max)
      max = sequence[i];
}

// Load data when ready
$(document).ready(function(){
  $("#carregando").toggleClass();
  load_json(get);
  
});

// Pega apenas os válidos e a data considerada é a data do anúncio
function get(data)
{
  // inicia datas;
  for (var i = 0; i < 12; i++)
    meses[i] = 0;
  for (var i = 0; i < 3; i++)
    quadrimestres[i] = 0;
  var temp_anos = new Object();
  anos = new Array();

  $.each(data, function(key, field) {
    if (key == "data_coleta" || key == "paginas_acessadas")
    {
      delete data[key];
      return true;
    }

    var valores =  {};
    var vazio = true;
    $.each(field, function(inner_key, inner_field) {
      valores[inner_key] = inner_field;
      if (inner_field != null && inner_field != "" && vazio)
        vazio = false;
    });
    if (!vazio)
    {
      // tenta encontrar campo igual
      var igual = -1;
       $.each(data, function(key_compare, field_compare)
       {
          if (key_compare == key)
            return false;
          var tudo_igual = true;
          $.each(field_compare, function(inner_key_compare, inner_field_compare) {
            if (valores[inner_key_compare] != inner_field_compare)
            {
              tudo_igual = false;
              return false;
            }
          });
          if (tudo_igual)
          {
            igual = key_compare;
            return false;
          }
        });
       // apenas vagas válidas com data
      if (igual == -1)
        if (valores["Data do Anúncio:"] != null && valores["Data do Anúncio:"] != "")
        {

            var dia = parseInt(valores["Data do Anúncio:"].split('/')[0],10);
            var mes = parseInt(valores["Data do Anúncio:"].split('/')[1],10);
            var ano = parseInt(valores["Data do Anúncio:"].split('/')[2],10);
            var quadrimestre = 1 + parseInt((parseInt(valores["Data do Anúncio:"].split('/')[1],10) - 1)/4,10);
            console.log(quadrimestre);
            // seta maior e menor data
            if (menor_data[0] == -1 
              || (ano < menor_data[2]) 
              || (ano == menor_data[2] && mes < menor_data[1])
              || (ano == menor_data[2] && mes == menor_data[1] && dia < menor_data[0])
            )
            {
              menor_data[0] = dia;
              menor_data[1] = mes;
              menor_data[2] = ano;
            }
            if (maior_data[0] == -1 
              || (ano > maior_data[2]) 
              || (ano == maior_data[2] && mes > maior_data[1])
              || (ano == maior_data[2] && mes == maior_data[1] && dia > maior_data[0])
            )
            {
              maior_data[0] = dia;
              maior_data[1] = mes;
              maior_data[2] = ano;
            }
            // índices de meses e quadrimestres = mes/quadrimestre - 1
            meses[mes-1]++;
            quadrimestres[quadrimestre-1]++;
            if (typeof temp_anos[ano] == "undefined")
              temp_anos[ano] = 1;
            else
              temp_anos[ano]++;
        }
    }

  });
  // arruma valores do ano
  for (var i = menor_data[2]; i <= maior_data[2]; i++)
    anos[i-menor_data[2]] = (typeof temp_anos[i] == "undefined") ? 0 : temp_anos[i];
  $("#main-content").toggleClass();
  $("#carregando").toggleClass();
  // Coloca valores na tela
  $("#data_inicial").text((menor_data[0]<10 ? "0" : "") + menor_data[0] + "/" 
                        + (menor_data[1]<10 ? "0" : "") + menor_data[1] + "/" + menor_data[2]);
  $("#data_final").text((maior_data[0]<10 ? "0" : "") + maior_data[0] + "/" 
                        + (maior_data[1]<10 ? "0" : "") + maior_data[1] + "/" + maior_data[2]);

  // desenha
  create_chart();
  $('input[name=agrupamento]').change(
    function(){
        create_chart();  
    }
);   
}

