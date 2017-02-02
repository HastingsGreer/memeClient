var sortby = function(a, b) {return b[3] - a[3]};
var base_url =  location.hostname == "hgreer.com" ? ".." : "http://hgreer.com"

function tableCreate(el, data)
{
    var tbl  = document.createElement("table");
    

    for (var i = 0; i < data.length; ++i)
    {
        var tr = tbl.insertRow();
        for(var j = data[i].length-2; j >= 0; j--)
        {
            var td = tr.insertCell();
            td.setAttribute("class", "economy")
            td.appendChild(document.createTextNode(data[i][j].toString()));
        }
    }
    el.appendChild(tbl);
}
var oldData;
var oldDeltas = {};
function updateMarket(){
    $.getJSON(base_url+'/meme/stocks', function(data) {
        
        var rows = Object.keys(data).map(function(key) {
            
            var change;
            if(oldDeltas[key]){
                change = oldDeltas[key];
            } else {
                change = "";
            }
            
            if(oldData && oldData[key]){
               
               if(oldData[key] > data[key]){
                   change = "\u2193";
               } 
               if(oldData[key] < data[key]){
                   change = "\u2191";
               }
            }
            oldDeltas[key] = change;
            return  [key, change, "$"+data[key], data[key]]
        });

        rows.sort(sortby);
        var market = document.getElementById("jsonM");
        market.removeChild(market.firstChild);
        tableCreate(market, rows);
    
        $('td').click(function() {
            document.getElementById("meme").value = this.innerText;
            graph(this.innerText);
        });
        oldData = data;
     });
}

function update() {
  $.getJSON(base_url+'/meme/', function(data) {
        
      document.getElementById("jsonP").innerHTML = JSON.stringify(data, undefined, 2)
      updateMarket();
   });


    
  
}

function sell() {
    var meme = document.getElementById("meme").value;
    $.get(base_url+"/meme/sell", {meme: meme}, update) 
}


function buy() {
    var meme = document.getElementById("meme").value;
    $.get(base_url+"/meme/buy", {meme: meme}, update) 
}





function init(){
    update();
    setInterval(updateMarket, 3000);
    graph("thebeemovie");

    function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
}

// Entry point

window.onload = init;
