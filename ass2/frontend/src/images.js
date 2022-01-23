/**
 *  Author:             Marc Rocca
 *  Course:             COMP6080 Assignment 2
 *  Date:               25/10/2021
 *  Description:        This file handles the displaying 
 *                      and saving of images
 */

import * as mes from './messages.js';
import * as config from './config.js';

/**
 * Given a file saves that file as the
 * users new profile image
 * @param {String} file 
 */
export var sendImage = function(file) {

    var input = file.target;
    var reader = new FileReader();
    reader.onload = function(){
        var dataURL = reader.result;
        const token = localStorage.getItem("token");
        const channelId = localStorage.getItem("channelId");
        const requestHeaders = { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        };
        const objectBody =  {
            "image": dataURL,
            };
        const requestBody = JSON.stringify(objectBody);
        const requestOptions = {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody,
        };
        var returnPromise = fetch(config.serverIP+':5005/message/'+channelId, requestOptions);
        returnPromise.then((response) => {
            if (response.status === 400) {
                response.json().then((data) => console.log(data['error']));
            } else if (response.status === 200) {
                response.json().then((data) => {
                    document.getElementById("chat-image-button").value = "";

                    const d = new Date();
                    const time_str = `${d.toLocaleTimeString()} ${d.toLocaleDateString()}`;
                    var message_id = localStorage.getItem("lastest_messageId");
                    var message_id = parseInt(message_id)+1;
                    mes.addSelfMessage(false, time_str, message_id, [], false, dataURL);
                    window.localStorage.setItem('lastest_messageId', message_id);
                    document.getElementById('chat-input').value = "";
                    document.getElementById('chat-input').ariaPlaceholder = "Enter text here...";
                    document.getElementById("chat-send-section").scrollIntoView({ behavior: 'smooth', block: 'end' });

                });
            }
        });
        returnPromise.catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    };
    reader.readAsDataURL(input.files[0]);
}



/**
 * Displays an image in the channel chat
 * and sends HTTP requests to log that 
 * images being sent
 * @param {Event} evt 
 */
export const showImages = (evt) => {

    const message_id = evt.currentTarget.message_id;

    const carousel = document.getElementById("carousel-images");
    // Delete images in carousel except the first
    while (carousel.getElementsByClassName("carousel-item").length > 1) {
        var imgChildren = carousel.getElementsByClassName("carousel-item");
        if (!(imgChildren.item(1).classList.contains("active"))) {
            carousel.removeChild(imgChildren.item(1));
        } else carousel.removeChild(imgChildren.item(0));
    }

    const token = localStorage.getItem("token");
    const channelId  = localStorage.getItem("channelId");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };
    let mes_index = 0;
    const imgPromise = () => new Promise((resolve, reject) => {
        return fetch(config.serverIP+':5005/message/'+channelId+'?start='+mes_index, requestOptions).then(response => {
            response.json().then((data) => {
                if (data['messages'].length == 0) {
                    resolve(mes_index);
                } else {
                    mes_index += 25;
                    for (var i = 0; i < data['messages'].length; i++) {
                        var message = data['messages'];                        
                        if (message[i]['image']) {
                            if (message[i]['id']===message_id) {
                                document.querySelector(".carousel-inner-imgs").src = message[i]['image'];
                            } else {
                                var image_block = document.createElement("DIV");
                                image_block.classList.add("carousel-item");
                                var image = document.createElement("img"); 
                                image.classList.add("d-block", "w-100", "carousel-inner-imgs");
                                image.src = message[i]['image'];
                                image.setAttribute("alt", "Image in channel")
                                image_block.prepend(image);
                                document.getElementById("carousel-images").append(image_block);;
                            }
                        }
                    }
                    resolve(imgPromise());
                }
            });
        })
        .catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    });
    imgPromise().then(() => {});
    imgPromise().catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}