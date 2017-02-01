var sortby = function(a, b) {return b[1] - a[1]};
var base_url =  location.hostname == "hgreer.com" ? ".." : "http://hgreer.com"

function tableCreate(el, data)
{
    var tbl  = document.createElement("table");
    

    for (var i = 0; i < data.length; ++i)
    {
        var tr = tbl.insertRow();
        for(var j = data[i].length-1; j >= 0; j--)
        {
            var td = tr.insertCell();
            td.setAttribute("class", "economy")
            td.appendChild(document.createTextNode(data[i][j].toString()));
        }
    }
    el.appendChild(tbl);
}

function update() {
    $.getJSON(base_url+'/meme/', function(data) {
        
    document.getElementById("jsonP").innerHTML = JSON.stringify(data, undefined, 2)
    });


    $.getJSON(base_url+'/meme/stocks', function(data) {
        var rows = Object.keys(data).map(function(key) {return  [key, "$"+data[key]]});

    rows.sort(sortby);
    var market = document.getElementById("jsonM");
    market.removeChild(market.firstChild);
    tableCreate(market, rows);
    
    $('td').click(function() {document.getElementById("meme").value = this.innerText});
    });
}
update();

function sell() {
    var meme = document.getElementById("meme").value;
    $.get(base_url+"/meme/sell", {meme: meme}, update) 
}


function buy() {
    var meme = document.getElementById("meme").value;
    $.get(base_url+"/meme/buy", {meme: meme}, update) 
}
