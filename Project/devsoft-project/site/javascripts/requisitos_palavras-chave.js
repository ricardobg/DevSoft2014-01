/*
 * Scripts for the resumo page.
 */

var MIN_PALAVRAS = 40;
var MIN_TERMOS = 20;
var MAX_TERMOS_PALAVRAS = 5;
var desconsiderados = ["de", "da", "em", "por", "ou", "a", "com", "e", "as", "do", "para", "o", "das", "estar", "and", "que", "será", "ter"];

var palavras_chave = new Object();
var termos_chave = new Object();


$.fn.tagcloud.defaults = {
  size: {start: 10, end: 32, unit: 'pt'},
  color: {start: '#cde', end: '#f52'}
};



$(document).ready(function(){
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
        	var palavras_sep = valores["Requisitos:"].toString().toLowerCase().replace(/[\.,:•]/g," ").replace(/\-(?=[^a-z]{0,})/g," ").replace(/\s{2,}/g," ").split(" ");
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
        	// cria os termos
        	for (var i = 2; i < MAX_TERMOS_PALAVRAS; i++)
        	{
        		var termos_sep = valores["Requisitos:"].toString().toLowerCase().match
        	}
           
        }
    }

  });
  // encontra os N maiores
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
  // escreve as tags
  for (i in todas_palavras)
  {
  	var a = document.createElement("a");
  	a.setAttribute("href","#");
  	a.setAttribute("rel", palavras_chave[todas_palavras[i]]);
  	a.appendChild(document.createTextNode(todas_palavras[i]));
  	$('#palavras_chave').append(a);
  	$('#palavras_chave').append(" ");
  }

  for (var i = 0; i < desconsiderados.length; i++)
  {
  	$("#desconsiderados").append(desconsiderados[i] + " ");
  }


  // desenha a tag_cloud
  $('#palavras_chave a').tagcloud();
  $('#palavras_agrupadas_chave a').tagcloud();
}

