console.log('connected');

var quote = document.querySelector('#quote');
var xhrBtn = document.querySelector('#xhr');
var fetchBtn = document.querySelector('#fetch');
var jqueryBtn = document.querySelector('#jquery');
var axiosBtn = document.querySelector('#axios');

axiosBtn.addEventListener('click', function () {
    axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
    .then(function(res){
        quote.textContent = res.data[0];
    })
});

xhrBtn.addEventListener('click', function () {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function () {        
        if (XHR.readyState === 4 && XHR.status === 200) {
            var str = JSON.parse(XHR.responseText);
            quote.textContent = str;
        }
    }
    XHR.open('GET', 'https://ron-swanson-quotes.herokuapp.com/v2/quotes');
    XHR.send();
});

fetchBtn.addEventListener('click', function () {
    fetch('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
    .then(function(req){
    req.json().then(function(data){
      quote.textContent = data[0];
    })
  })
});

$(jqueryBtn).click(function(){
    $.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
    .done(function(data){
        quote.textContent = data;
    })
})