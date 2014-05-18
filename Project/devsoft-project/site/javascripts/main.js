function navega_item(e) {
 window.location = e.getElementsByTagName("a")[0].href;
}

function campo_focus(e, texto) {
  e.className = e.className.replace(/campo_vazio/g, '');
  if (e.value == texto)
    e.value = "";

}

function campo_blur(e, texto) {
  if (e.value == "")
  {
    e.value = texto;
    e.className = e.className + ' campo_vazio';
  }
}

// Function to load JSON (my_json.json)
function load_json(function_to_receive_data)
{
	//$.getJSON("my_json.json",function_to_receive_data);
	$.ajax({
    type: 'GET',
    url: "my_json.json",
    dataType: 'json',
    success: function_to_receive_data,
    data: {},
    async: true
});
}

