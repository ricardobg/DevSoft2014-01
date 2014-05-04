/*
 * Scripts for the resumo page.
 */


$(function() {

  // Create the chart
  var data = [
  {
    value: 30,
    color:"#F38630"
  },
  {
    value : 50,
    color : "#E0E4CC"
  },
  {
    value : 100,
    color : "#69D2E7"
  }     
  ]

  var ctx = $("#chart_resumo").get(0).getContext("2d");

  new Chart(ctx).Pie(data);
});

