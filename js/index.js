var sortby = function(a, b) {return b[1] - a[1]};

function tableCreate(el, data)
{
    var tbl  = document.createElement("table");
    

    for (var i = 0; i < data.length; ++i)
    {
        var tr = tbl.insertRow();
        for(var j = 0; j < data[i].length; ++j)
        {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(data[i][j].toString()));
        }
    }
    el.appendChild(tbl);
}

function update() {
    $.getJSON('../meme/', function(data) {
        
    document.getElementById("jsonP").innerHTML = JSON.stringify(data, undefined, 2)
    });


    $.getJSON('../meme/stocks', function(data) {
        var rows = Object.keys(data).map(function(key) {return  [key, data[key]]});

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
    $.get("../meme/sell", {meme: meme}, update) 
}


function buy() {
    var meme = document.getElementById("meme").value;
    $.get("../meme/buy", {meme: meme}, update) 
}
