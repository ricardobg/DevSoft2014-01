/*
 * Scripts for the resumo page.
 */




var total_vagas = 0, validas = 0, em_branco = 0, duplicadas = 0;
var data_coleta = "?", paginas_acessadas = "?";
function create_chart()
{
  // Create the chart
  var data = [
  {
    label : 'Válidas',
    labelColor : 'white',
    labelFontSize : '16',
    value: validas,
    color:"#F38630"
  },
  {
    label : 'Em Branco',
    labelColor : 'white',
    labelFontSize : '16',
    value : em_branco,
    color : "#E0E4CC"
  },
  {
    label : 'Duplicadas',
    labelColor : 'white',
    labelFontSize : '16',
    value : duplicadas,
    color : "#69D2E7"
  }     
  ]

  var ctx = $("#chart_resumo").get(0).getContext("2d");
  new Chart(ctx).Pie(data);
}
applyTemplate = function(msg) {
   return;
}
// Load data when ready
$(window).load(function() {
    $("#carregando").toggleClass();
    load_json(get); 
});


function get(data)
{
  
  $.each(data, function(key, field) {
    if (key == "data_coleta")
    {
      data_coleta = field;
      return true;
    }
    if (key == "paginas_acessadas")
    {
      paginas_acessadas = field;
      return true;
    }
    total_vagas++;
    var valores =  {};
    var vazio = true;
    $.each(field, function(inner_key, inner_field) {
      valores[inner_key] = inner_field;
      if (inner_field != null && inner_field != "" && vazio)
        vazio = false;
    });
    if (vazio)
      em_branco++;
    else
    {
      // tenta encontrar campo igual
      var igual = -1;
       $.each(data, function(key_compare, field_compare)
       {
          if (key_compare == key || key_compare == "data_coleta" || key_compare == "paginas_acessadas")
            return true;
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
       // encontrou igual
       if (igual != -1)
       {
          // vaga ainda não marcada como válida
          if (key < igual)
            validas++;
          else
            duplicadas++;
       }
       // vaga única
       else
          validas++;
    }

  });
  $("#carregando").toggleClass();
  $("#main-content").toggleClass();
  // Coloca valores na tela
  $("#data_coleta").text(data_coleta);
  $("#paginas_acessadas").text(paginas_acessadas);
  $("#span_total").text(total_vagas);
  $("#span_validas").text(validas);
  $("#span_em_branco").text(em_branco);
  $("#span_duplicadas").text(duplicadas);

  // desenha
  create_chart();
}
