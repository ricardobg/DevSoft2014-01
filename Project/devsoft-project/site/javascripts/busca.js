
var comparacao = new Object();
var resultados = new Object();
var start_time = 0, end_time = 0;
var MAX_RESULTADOS = 30;
function search()
{
  start_time = new Date().getTime();
  $("#resultados").css({display:'none',visibility:'hidden'});
  $("#inner_resultados").css({display:'none',visibility:'hidden'});
  $("#muitos_resultados").css({display:'none',visibility:'hidden'});
  $("#inner_resultados").empty();
  $("#pesquisando").toggleClass();
  comparacao = new Object();
  var valor = $("#texto_busca").val();
  // figure out fields
  var inputs = $("input[type=checkbox]:checked");
  for (var i = 0; i < inputs.length; i++)
  {
    var field = inputs[i];
    switch (field.name)
    {
      case "habilitacao":
        comparacao["Habilitação Para o Estágio:"] = valor;
        break;
      case "empresa":
        comparacao["Empresa:"] = valor;
        break;
      case "descricao":
        comparacao["Descrição:"] = valor;
        break;
      case "beneficios":
        comparacao["Benefícios:"] = valor;
        break;
      case "numero_de_vagas":
        comparacao["Número de vagas:"] = valor;
        break;
      case "titulo":
        comparacao["Título:"] = valor;
        break;
      case "area_de_atuacao":
        comparacao["Área de Atuação do Estágio:"] = valor;
        break;
      case "requisitos":
        comparacao["Requisitos:"] = valor;
        break;
      case "contatos":
        comparacao["Contatos:"] = valor;
        break;
    }
  }
  load_json(get);
}

// Pega apenas os válidos e a data considerada é a data do anúncio
function get(data)
{
  resultados = new Object();
  var n_resultados = 0;
  $.each(data, function(key, field) {
    if (key == "data_coleta")
      return true;
    if (key == "paginas_acessadas")
      return true;

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
       // apenas vagas válidas
      if ((igual != -1 && key < igual) || igual == -1)
      {
        var filtro_bate = false;
        for (var comp in comparacao)
          if (valores[comp].toLowerCase().search(comparacao[comp].toLowerCase()) != -1)
          {
            filtro_bate = true;
            break;
          }
        // adiciona na lista
        if (filtro_bate)
        {
          n_resultados++;
          resultados[key] = valores;
        }
      }
    }

  });
 $("#pesquisando").toggleClass();
  // imprime resultados
  if (n_resultados <= MAX_RESULTADOS)
  {
    for (var prop in resultados)
    {
      var article = document.createElement("article");
      var p = document.createElement("p");
      var vaga = document.createElement("h3");
      vaga.appendChild(document.createTextNode("Vaga #" + prop))
      p.appendChild(vaga);
      p.appendChild(document.createElement("br"));
      for (var inner_prop in resultados[prop])
      {
        var b = document.createElement("b");
        b.appendChild(document.createTextNode(inner_prop + " "));
        p.appendChild(b);
        p.appendChild(document.createTextNode(resultados[prop][inner_prop]));
        p.appendChild(document.createElement("br"));
      }
      article.appendChild(p);
      $("#inner_resultados").append(article);
    }
    if (n_resultados > 0)
      $("#inner_resultados").css({display:'block',visibility:'visible'});
  
  }
  else
    $("#muitos_resultados").css({display:'inline',visibility:'visible'});
  // coloca na tela os resultados
  end_time = new Date().getTime();
  var execution_time = parseInt((end_time - start_time)/1000,10);
  $("#resultados").css({display:'inherit',visibility:'inherit'});
  $("#tempo_busca").text(execution_time + "s");
  $("#vagas_encontradas").text(n_resultados);
 
}