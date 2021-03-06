
var ws;
var url;

function connect() {
    url = document.getElementById("server_url").value;
    
    if ("WebSocket" in window) {
        ws = new WebSocket(url);
    } else if ("MozWebSocket" in window) {
        ws = new MozWebSocket(url);
    } else {
        document.getElementById("messages").innerHTML += "This Browser does not support WebSockets<br />";
        return;
    }
    ws.onopen = function(e) {
        document.getElementById("messages").innerHTML += "Client: A connection to "+ws.url+" has been opened.<br />";
        
        document.getElementById("server_url").disabled = true;
        document.getElementById("toggle_connect").innerHTML = "Disconnect";
    };
    
    ws.onerror = function(e) {
        document.getElementById("messages").innerHTML += "Client: An error occured, see console log for more details.<br />";
        console.log(e);
    };
    
    ws.onclose = function(e) {
        document.getElementById("messages").innerHTML += "Client: The connection to "+url+" was closed. ["+e.code+(e.reason != "" ? ","+e.reason : "")+"]<br />";
        cleanup_disconnect();
    };
    
    ws.onmessage = function(e) {
        document.getElementById("messages").innerHTML += "Server: "+e.data+"<br />";
    };
}

function disconnect() {
    ws.close();
    cleanup_disconnect();
}

function cleanup_disconnect() {
    document.getElementById("server_url").disabled = false;
    document.getElementById("toggle_connect").innerHTML = "Connect";
}

function toggle_connect() {
    if (document.getElementById("server_url").disabled === false) {
        connect();
    } else {
        disconnect();
    }
}