/*
 * Scripts for the resumo page.
 */

var MIN_PALAVRAS = 40;
var MIN_TERMOS = 10;
var MAX_TERMOS_PALAVRAS = 2;


var palavras_chave = new Object();
var termos_chave = new Object();


$.fn.tagcloud.defaults = {
  size: {start: 10, end: 32, unit: 'pt'},
  color: {start: '#cde', end: '#f52'}
};



$(document).ready(function(){
  $("#carregando").toggleClass();
  load_json(get);
  
});

// Pega apenas os válidos e a data considerada é a data do anúncio
function get(data)
{
  // termos
  var temp_palavras_chave = new Object();
  var temp_termos_chave = new Object();

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
       // apenas vagas válidas com requisitos
      if ((igual != -1 && key < igual) || igual == -1)
        if (valores["Requisitos:"] != null && valores["Requisitos:"] != "")
        {
        	// le palavras
        	var palavras_sep = valores["Requisitos:"].toString().toLowerCase().replace(/[\.,:•\*]/g," ").replace(/\-(?=[^a-z\u00C0-\u00ff]{0,})/g," ").replace(/\s{2,}/g," ").split(" ");
          for (var i = 0; i < palavras_sep.length; i++)
        	{
        		if (temp_palavras_chave[palavras_sep[i]] == "")
        			continue;
        		// vê se não é termo inválido
        		var igual = false
        		for (var j = 0; j < desconsiderados.length; j++)
        			if (palavras_sep[i]  == desconsiderados[j])
        			{
        				igual = true;
        				break;
        			}
        		if (igual)
        			continue;
        		if (typeof temp_palavras_chave[palavras_sep[i]] == "undefined")
        			temp_palavras_chave[palavras_sep[i]] = 1;
        		else
        			temp_palavras_chave[palavras_sep[i]]++;
        	}
        	// cria os termos fazendo todas as combinações
          var termos_sep = valores["Requisitos:"].toString().toLowerCase().match(/([a-z\u00C0-\u00ff]+)|([\.\,])/g);
          if (termos_sep == null)
            return 1;
          for (var i = 2; i <= MAX_TERMOS_PALAVRAS; i++)
        	{
            for (var j = 0; j < termos_sep.length; j++)
            {
              var termo = "";

              for (k = j; k < termos_sep.length && (k-j+1) <= i; k++)
              {
                if (termos_sep[k].match(/[\.\,]/g) != null)
                  break;
                termo = termo + termos_sep[k] + " ";
              }
              // termo válido
              if (termo.trim().split(" ").length == i)
              {
                termo = termo.trim();
                if (typeof temp_termos_chave[termo] == 'undefined')
                  temp_termos_chave[termo] = 1;
                else
                  temp_termos_chave[termo]++;
              }
            }
          }		
        }    
    }
  });
  // encontra os N maiores das palavras
  palavras_chave = new Object();
  var maior = 1;
  todas_palavras = [];
  for (var i = 0; i < MIN_PALAVRAS && maior != 0 ; i++)
  {
  	var palavra_recorrente = "";
  	maior = 0;
  	for (var prop_cmp in temp_palavras_chave)
  		if (temp_palavras_chave[prop_cmp] > maior)
  		{
  			maior = temp_palavras_chave[prop_cmp];
  			palavra_recorrente = prop_cmp;
  		}
  	if (maior != 0)
  	{
  		palavras_chave[palavra_recorrente] = maior;
  		todas_palavras.push(palavra_recorrente);
  		delete temp_palavras_chave[palavra_recorrente];
  	}

  }
  todas_palavras.sort();

  // encontra os N maiores dos termos
  termos_chave = new Object();
  maior = 1;
  todos_termos = [];
  for (var i = 0; i < MIN_TERMOS && maior != 0 ; i++)
  {
    var termo_recorrente = "";
    maior = 0;
    for (var prop_cmp in temp_termos_chave)
      if (temp_termos_chave[prop_cmp] > maior)
      {
        maior = temp_termos_chave[prop_cmp];
        termo_recorrente = prop_cmp;
      }
    if (maior != 0)
    {
      // verifica se termo não está contido em outro ou se contém outro
      var encontrou_igual = false;
      for (j in todos_termos)
      {
        if (todos_termos[j].match(termo_recorrente) != null  && termos_chave[termo_recorrente] != maior)
        {
          encontrou_igual = true
          break;
        }
        if (termo_recorrente.match(todos_termos[j]) != null && termos_chave[termo_recorrente] != maior)
        {
          todos_termos.splice(j, 1);
          i--;
        }
      }
      if (encontrou_igual)
      {
        i--;
        continue;
      }
      termos_chave[termo_recorrente] = maior;
      todos_termos.push(termo_recorrente);
      delete temp_termos_chave[termo_recorrente];
      

    }
  }
  todos_termos.sort();

  // escreve as tags das palavras
  for (i in todas_palavras)
  {
  	var a = document.createElement("a");
  	a.setAttribute("href","#");
  	a.setAttribute("rel", palavras_chave[todas_palavras[i]]);
  	a.appendChild(document.createTextNode(todas_palavras[i]));
  	$('#palavras_chave').append(a);
  	$('#palavras_chave').append(" ");
  }

   // escreve as tags dos termos
  for (i in todos_termos)
  {
    var a = document.createElement("a");
    a.setAttribute("href","#");
    a.setAttribute("rel", termos_chave[todos_termos[i]]);
    a.appendChild(document.createTextNode(todos_termos[i]));
    $('#palavras_agrupadas_chave').append(a);
    $('#palavras_agrupadas_chave').append(" ");
  }

  for (var i = 0; i < desconsiderados.length; i++)
  {
  	$("#desconsiderados").append(desconsiderados[i] + " ");
  }

  $("#carregando").toggleClass();
  $("#main-content").toggleClass();
  // desenha a tag_cloud
  $('#palavras_chave a').tagcloud();
  $('#palavras_agrupadas_chave a').tagcloud();
}

