var io = require('socket.io-client');
var jQuery = require('jquery');
const translate = require('google-translate-api');

// Main setup of the socket
var socket = io('http://localhost:3000');

socket.on('connect_error', (error) => {
    console.log(error);
});
socket.on('connect_failed', (error) => {
    console.log(error);
});
socket.on('connect', () => {
    console.log("connected");
});
socket.on('connect_error', (error) => {
    console.log(error);
});
socket.on('chat channel', (data) => {
    var messageObj = JSON.parse(data);
    var translation = translateRequest(messageObj);
});

jQuery('form').submit(function(){
    var chatInfo = {
        "message": jQuery('#m').val(),
        "origin_lang": jQuery('#language').val(),
        "fromName": jQuery('#name').val()
    };

    socket.emit('chat message', JSON.stringify(chatInfo));
    jQuery('#m').val('');
    return false;
});

function appendMessage(message) {
    jQuery('#messages').append(jQuery('<li>').html("<strong>" + message.fromName + "</strong> " + message.translated));
}

function translateRequest(message) {
    var from = message.origin_lang;
    var to = jQuery('#language').val();
    if(from != to) {
        console.log("Needs translation from [" + from + "] to [" + to + "]");
        translate(message.message, {from: from, to: to}).then(res => {
            var msgPackage = {
                "fromName": message.fromName,
                "orig_text": message.message,
                "orig_lang": from,
                "translated": res.text,
                "target_lang": to
            };
            appendMessage(msgPackage);
        });
    }
    else {
        var msgPackage = {
            "fromName": message.fromName,
            "orig_text": message.message,
            "orig_lang": from,
            "translated": message.message,
            "target_lang": to
        };
        appendMessage(msgPackage);
    }
}