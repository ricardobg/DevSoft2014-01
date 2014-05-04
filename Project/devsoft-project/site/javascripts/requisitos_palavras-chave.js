/*
 * Scripts for the resumo page.
 */


$.fn.tagcloud.defaults = {
  size: {start: 14, end: 18, unit: 'pt'},
  color: {start: '#cde', end: '#f52'}
};

$(function () {
  $('#palavras_chave a').tagcloud();
   $('#palavras_agrupadas_chave a').tagcloud();
});