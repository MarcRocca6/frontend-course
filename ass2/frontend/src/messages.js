/**
 *  Author:             Marc Rocca
 *  Course:             COMP6080 Assignment 2
 *  Date:               25/10/2021
 *  Description:        This file contains functions message
 *                          Creating and displaying messages, 
 *                          Editing messages, 
 *                          Deleting messages
 *                          Pinning messages
 */

import * as chan from './channels.js';
import * as mul from './multiuser.js';
import * as img from './images.js';
import * as config from './config.js';

/**
 * Pins a message.
 * Handles frontend DOM changes
 * and HTTP requests
 * @param {Event} evt 
 */
export const pinMessage = (evt) => {
    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");
    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);
    const glyf_children = message_text.parentElement.parentElement.childNodes;
    for (var i = 0; i < glyf_children.length ; i++) {
        if (glyf_children[i].classList.contains('glyphicon-pushpin')) {
            const glyfs_pin = glyf_children[i];
            const requestHeaders = { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            };
            const requestOptions = {
                method: 'POST',
                headers: requestHeaders,
            };
            if (glyfs_pin.classList.contains('red')) {
                glyfs_pin.classList.remove('red');
                const returnPromise = fetch(config.serverIP+':5005/message/unpin/'+channelId+'/'+message_id, requestOptions)
                returnPromise.then((response) => {
                    if (response.status === 400) {
                        response.json().then((data) => { console.log(data['error']) });
                    } else if (response.status === 200) {
                        response.json().then((data) => {
                        });
                    }
                });
                returnPromise.catch(() => {
                    alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
                });
            } else {
                glyfs_pin.classList.add('red');
                const returnPromise = fetch(config.serverIP+':5005/message/pin/'+channelId+'/'+message_id, requestOptions)
                returnPromise.then((response) => {
                    if (response.status === 400) {
                        response.json().then((data) => { console.log(data['error']) });
                    } else if (response.status === 200) {
                        response.json().then((data) => {
                        });
                    }
                });
                returnPromise.catch(() => {
                    alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
                });
            }
            break;
        }
    }
}

/**
 * Frontend DOM changes to allow
 * a user to edit a message
 * @param {Event} evt 
 */
export const editMessageForm = (evt) => {

    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);
    const message_message = message_text.parentElement.parentElement;
    const message_container = message_message.parentElement;

    var edit_input = document.createElement("input");
    edit_input.classList.add("message", "my-message");
    edit_input.setAttribute("id", `form-message-edit-${message_id}`);
    edit_input.value = message_text.innerText;
    message_message.prepend(edit_input); 

    message_container.removeEventListener("mouseover", displayMessageGlyfs, false);
    message_container.removeEventListener("mouseout", end_displayMessageGlyfs, false);
    const children = message_message.childNodes;
    for (var i = 1; i < children.length; i++) {
        if (children[i].classList.contains('glyphicon-ok')) {
            children[i].style.display = "inline-block";
        } else if (children[i].classList.contains('glyphicon-remove')) {
            children[i].style.display = "inline-block";
            children[i].removeEventListener('click', deleteMessage, false);
            children[i].addEventListener('click', exitMessageEdit, false);
        } else {
            children[i].style.display = "none";
        }
    }
}


/**
 * Frontend DOM changes to close
 * the edit options on a message
 * @param {Event} evt 
 */
 export const exitMessageEdit = (evt) => {

    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);
    const message_message = message_text.parentElement.parentElement;
    const message_container = message_message.parentElement;
    message_container.addEventListener("mouseover", displayMessageGlyfs, false);
    message_container.addEventListener("mouseout", end_displayMessageGlyfs, false);
    message_message.firstChild.remove();
    const children = message_message.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].classList.contains('glyphicon-ok')) {
            children[i].style.display = "none";
        } else if (children[i].classList.contains('glyphicon-remove')) {
            children[i].style.display = "inline-block";
            children[i].addEventListener('click', deleteMessage, false);
            children[i].removeEventListener('click', exitMessageEdit, false);
        } else {
            children[i].style.display = "inline-block";
        }
    }
}

/**
 * Edits a message in a chat
 * @param {Event} evt 
 */
export const submitMessageEdit = (evt) => {

    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");

    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);
    const message_form = document.getElementById(`form-message-edit-${message_id}`);
    const old_message = message_text.innerText;
    const new_message = message_form.value;
    if (old_message === new_message) {
        alert("Error. New Message same as old Message.");
    } else {
        const requestHeaders = { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        };
        const objectBody =  {
                            "message" : new_message,
                            }
        const requestBody = JSON.stringify(objectBody);

        const requestOptions = {
            method: 'PUT',
            headers: requestHeaders,
            body: requestBody,
        };
        const returnPromise = fetch(config.serverIP+':5005/message/'+channelId+'/'+message_id, requestOptions)
        returnPromise.then((response) => {
            if (response.status === 400) {
                response.json().then((data) => { console.log(data['error']) });
            } else if (response.status === 200) {
                response.json().then((data) => {
                    const message_message = message_text.parentElement.parentElement;
                    const message_container = message_message.parentElement;
                    message_container.addEventListener("mouseover", displayMessageGlyfs, false);
                    message_container.addEventListener("mouseout", end_displayMessageGlyfs, false);
                    message_container.event_state = 'standard';
                    message_message.message_id = message_id;
                    message_text.innerText = new_message;
                    message_form.remove();
                    const children = message_message.childNodes;
                    
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].classList.contains('glyphicon-ok')) {
                            children[i].style.display = "none";
                        } else if (children[i].classList.contains('glyphicon-remove')) {
                            children[i].style.display = "inline-block";
                            children[i].addEventListener('click', deleteMessage, false);
                            children[i].removeEventListener('click', exitMessageEdit, false);
                        } else {
                            children[i].style.display = "inline-block";
                        }
                    }

                    const d = new Date();
                    const time_str = `${d.toLocaleTimeString()} ${d.toLocaleDateString()}`;
                    message_message.parentElement.firstChild.firstChild.lastChild.innerText = time_str
                });
            }
        });
        returnPromise.catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    }
}

/**
 * Deletes a message from a chat
 * @param {Event} evt 
 */
export const deleteMessage = (evt) => {

    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");

    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);

    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'DELETE',
        headers: requestHeaders,
    };

    const returnPromise = fetch(config.serverIP+':5005/message/'+channelId+'/'+message_id, requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => {
                console.log(data['error']);
                console.log("Reopening Channel Page to correct error.");
                chan.openChannel();
            });
        } else if (response.status === 200) {
            response.json().then((data) => {
                message_text.parentElement.parentElement.parentElement.remove();
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}

/**
 * Helper Function: Edits the reaction string of a messeage
 * @param {String} reactString: Current reactions of message
 * @param {Object} changes: Reaction changes to be made to the string
 *                          i.e. {laught: 1, love: -1, like: 3}
 * @returns {String}: Final reaction string
 */
function editReactionString(reactString, changes) {
    var new_reactString = reactString;
    for (const property in changes) {
        if (!(reactString.includes(property))) { // Case 1: If reaction not in string
            new_reactString += `  ${changes[property]}x${property}`;
        } else { // Case 2: If reaction already in string
            var splitReacts = reactString.split(" ");
            new_reactString = "";
            for (var i = 0; i < splitReacts.length; i++) {
                if (splitReacts[i].includes(property)) {
                    var numReacts = parseInt(splitReacts[i].slice(0));
                    const new_numReacts = parseInt(numReacts) + parseInt(changes[property]);
                    if (new_numReacts > 0) {
                        splitReacts[i] = new_numReacts.toString()+splitReacts[i].slice(1);
                        new_reactString += ("  " + splitReacts[i]);
                    }
                } else {
                    new_reactString += ("  " + splitReacts[i]);
                }
            }
        } 
    }
    return new_reactString;
}

/**
 * Reacts to a message
 * Handles the frontend to display the reaction
 * Handles the HTTP request to the backend to indicate
 * that the message has been reacted 
 * @param {Event} evt 
 */
export const reactMessage = (evt) => {
    const message_id = evt.currentTarget.message_id;
    const reaction_type = evt.currentTarget.reaction_type;

    // Change State of Website 
    var reactSymbol;
    if (reaction_type === "like") reactSymbol = '👍';
    else if (reaction_type === "laugh") reactSymbol = '😆';
    else if (reaction_type === "love") reactSymbol = '😍';
    else console.log("Invalid reaction: " + reaction_type);
    const reaction_icon = document.getElementById(`reaction-${reaction_type}-${message_id}`);
    var reactChanges = {};
    if (reaction_icon.classList.contains("selected_reaction")) { // Unreacting Message
        reaction_icon.classList.remove("selected_reaction");
        reactChanges[reactSymbol] = -1;
    } else { // Reacting to Message
        reaction_icon.classList.add("selected_reaction");
        reactChanges[reactSymbol] = 1;
    }
    const reaction_text = document.getElementById(`show-reacts-${message_id}`);
    const new_react_text = editReactionString(reaction_text.innerText, reactChanges);
    reaction_text.innerText = new_react_text;

    // Make request to backend
    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");
    const message_text = document.getElementById(`message-${message_id}`);
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    for (const property in reactChanges) {
        const objectBody =  {"react" : reaction_type}
        const requestBody = JSON.stringify(objectBody);
        const requestOptions = {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody,
        };
        if (reactChanges[property] > 0) {
            const returnPromise = fetch(config.serverIP+':5005/message/react/'+channelId+'/'+message_id, requestOptions)
            returnPromise.then((response) => {
                if (response.status === 400) {
                    response.json().then((data) => {
                        console.log(data['error']);
                        console.log("Reopening Channel Page to correct error.");
                        chan.openChannel();
                    });
                } else if (response.status === 200) {
                    response.json().then((data) => {
                    });
                }
            })
            returnPromise.catch(() => {
                alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
            });
        } else {
            const returnPromise = fetch(config.serverIP+':5005/message/unreact/'+channelId+'/'+message_id, requestOptions)
            returnPromise.then((response) => {
                if (response.status === 400) {
                    response.json().then((data) => { console.log(data['error']) });
                } else if (response.status === 200) {
                    response.json().then((data) => {
                    });
                }
            });
            returnPromise.catch(() => {
                alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
            });
        }
    }
}

/**
 * Hides the glyficons that are associated with a messasge
 * @param {Event} evt 
 */
export const end_displayMessageGlyfs = (evt) => {
    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);
    const message_message = message_text.parentElement.parentElement;
    const message_children_nodes = message_message.childNodes;
    var display_val = "none";
    for (var i = 1; i < message_children_nodes.length; i++) {
        if (!(message_children_nodes[i].classList.contains('glyphicon-ok'))) {
            message_children_nodes[i].style.display = display_val;
        }
    }
}

/**
 * Displays the glyficons that are associated with a messasge
 * @param {Event} evt 
 */
export const displayMessageGlyfs = (evt) => {

    const message_id = evt.currentTarget.message_id;
    const message_text = document.getElementById(`message-${message_id}`);
    const message_message = message_text.parentElement.parentElement;
    const message_children_nodes = message_message.childNodes;
    var display_val = "inline-block";
    for (var i = 1; i < message_children_nodes.length; i++) {
        if ((!(message_children_nodes[i].classList.contains('glyphicon-ok')))
            && (!(message_children_nodes[i].classList.contains('message')))) {
            message_children_nodes[i].style.display = display_val;
        }
    }
}


/**
 * Sends a message and displays it in the channel chat
 */
export const sendMessage = () => {
    const message_text = document.getElementById('chat-input').value;
    if (message_text.replace(/\s/g, '')) {
        const token = localStorage.getItem("token");
        const channelId = localStorage.getItem("channelId");

        const requestHeaders = { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        };
        const objectBody =  {
            "message": message_text,
            };
        const requestBody = JSON.stringify(objectBody);
        
        const requestOptions = {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody,
        };
        var returnPromise = fetch(config.serverIP+':5005/message/'+channelId, requestOptions);
        returnPromise.then(response => {
            if (response.ok) {
                const d = new Date();
                const time_str = `${d.toLocaleTimeString()} ${d.toLocaleDateString()}`;
                var message_id = localStorage.getItem("lastest_messageId");
                message_id = parseInt(message_id) + 1;
                addSelfMessage(message_text, time_str, message_id, [], false, false);
                window.localStorage.setItem('lastest_messageId', message_id);
                document.getElementById('chat-input').value = "";
                document.getElementById('chat-input').ariaPlaceholder = "Enter text here...";
                document.getElementById("chat-wrapper").scrollTo(0,document.getElementById('chat-history').offsetHeight);
            } else {
                response.json().then((data) => { console.log(data['error']) });
            }
        });
        returnPromise.catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    } else {
        alert("Error. Enter in some text before you send a message.");
        document.getElementById('chat-input').value = "";
        document.getElementById('chat-input').ariaPlaceholder = "Enter text here...";
    }
}

/**
 *  Sends a message sent by someone not the current user
 *  @param {String} message: Text messsage to be sent
 *  @param {String} time: Time string when the message was sent
 *  @param {String} name: Name of person who sent it
 *  @param {String} message_id: Id of the message
 *  @param {String} user_id: Id of the sender
 *  @param {List} react_list: List of the reactions of the message
 *  @param {Boolean} pinned: Whether the message is pinned or not
 *  @param {String} imageData: Image data of the message photo if applicable, otherwise False
 */
 export const addOtherMessage = (message, time, message_id, user_id, react_list, pinned, imageData) => {
    addMessage(message, time, message_id, user_id, react_list, pinned, false, imageData, true);
}

/**
 *  Sends a message sent by someone not the current user
 *  @param {String} message: Text messsage to be sent
 *  @param {String} time: Time string when the message was sent
 *  @param {String} message_id: Id of the message
 *  @param {List} react_list: List of the reactions of the message
 *  @param {Boolean} pinned: Whether the message is pinned or not
 *  @param {String} imageData: Image data of the message photo if applicable, otherwise False
 */
export const addSelfMessage = (message, time, message_id, react_list, pinned, imageData) => {
    const userId = localStorage.getItem("userId"); 
    addMessage(message, time, message_id, userId, react_list, pinned, true, imageData, true);
}

/**
 *  Sends a message sent by someone not the current user
 *  @param {String} message: Text messsage to be sent
 *  @param {String} time: Time string when the message was sent
 *  @param {String} message_id: Id of the message
 *  @param {String} user_id: Id of the sender
 *  @param {List} react_list: List of the reactions of the message
 *  @param {Boolean} pinned: Whether the message is pinned or not
 *  @param {String} imageData: Image data of the message photo if applicable, otherwise False
 */
export function addMessage(message, time, message_id, user_id, react_list, pinned, left, imageData, append) {

    const last_id = parseInt(localStorage.getItem("lastest_messageId"));
    window.localStorage.setItem('lastest_messageId', last_id+1);

    var message_container = document.createElement("LI");
    message_container.classList.add("clearfix");

    // Add the name of the sender and the time
    var message_data = document.createElement("DIV");
    message_data.classList.add("message-data");
    if (!(left)) message_data.classList.add("text-right");

    var message_data_text = document.createElement("SPAN");
    message_data_text.classList.add("message-data-text");

    var message_data_time = document.createElement("SPAN");
    message_data_time.classList.add("message-data-time");
    message_data_time.textContent = `${time.substring(11,16)} ${time.substring(8,10)}/${time.substring(5,7)}`;

    var message_data_name = document.createElement("SPAN");
    message_data_name.classList.add("message-data-name");
    var name;
    if (!(left)) name = localStorage.getItem(user_id);
    else name = localStorage.getItem("name");
    message_data_name.textContent = name + ": "
    message_data_name.addEventListener('click', mul.previewProfile);
    message_data_name.setAttribute("data-toggle", "modal");
    message_data_name.setAttribute("data-target", "#preview-profile");
    message_data_name.userId = user_id;

    var message_data_image = document.createElement("img");
    if (!(left)) {
        const profileImg = localStorage.getItem(`${user_id}_photo`);
        if ((typeof profileImg === 'string' || profileImg instanceof String)
            && profileImg.toString() == 'null') {
            message_data_image.src = "assets/avatars/avatar_0.png";
        } else if (profileImg === null) {
            message_data_image.src = "assets/avatars/avatar_0.png";
        } else message_data_image.src = profileImg;
    } else {
        message_data_image.src = document.getElementById("sidebar-img").src;
    }
    message_data_image.alt = "avatar";

    message_data.appendChild(message_data_text);
    if (left) message_data_text.appendChild(message_data_image); 
    message_data_text.appendChild(message_data_name); 
    message_data_text.appendChild(message_data_time); 
    if (!(left)) message_data_text.appendChild(message_data_image); 
    
    // Add the actual message
    var message_message = document.createElement("DIV");
    message_message.classList.add('message_text_container');
    var message_text_emoji_container = document.createElement("DIV");
    message_text_emoji_container.style.display = 'inline-block';
    if (!(left)) {
        message_text_emoji_container.classList.add("float-right");
        message_message.classList.add("float-right");
    }
    var message_text = document.createElement("DIV");
    message_text.classList.add("message");
    if (!(left)) {
        message_text.classList.add("other-message", "float-right");
    }
    else message_text.classList.add("my-message");
    if (message) message_text.textContent = message;
    message_text.setAttribute("id", `message-${message_id}`);
    message_text_emoji_container.appendChild(message_text); 
    if (imageData) message_text_emoji_container.setAttribute("style", "width:70%;");
    message_message.appendChild(message_text_emoji_container); 

    //// Add the message image
    if (imageData) {
        var message_image = document.createElement("img");
        message_image.src = imageData;
        message_image.classList.add("chat-image");
        message_text.appendChild(message_image); 
        message_image.setAttribute("style", "width:100%;");
        message_text_emoji_container.message_id = message_id;
        message_text_emoji_container.addEventListener("click", img.showImages);
        message_text_emoji_container.style.cursor = "pointer";
        message_text_emoji_container.setAttribute("data-target", "#channel-images");
        message_text_emoji_container.setAttribute("data-toggle", "modal");
    }
    
    var emoji_like = document.createElement("DIV");
    var emoji_laugh = document.createElement("DIV");
    var emoji_love = document.createElement("DIV");

    emoji_like.classList.add("message_reaction", "glyphicon");
    emoji_laugh.classList.add("message_reaction", "glyphicon");
    emoji_love.classList.add("message_reaction", "glyphicon");

    emoji_like.message_id = message_id;
    emoji_laugh.message_id = message_id;
    emoji_love.message_id = message_id;

    emoji_like.reaction_type = 'like';
    emoji_laugh.reaction_type = 'laugh';
    emoji_love.reaction_type = 'love';

    emoji_like.style.display = 'none';
    emoji_laugh.style.display = 'none';
    emoji_love.style.display = 'none';

    emoji_like.setAttribute("id", `reaction-like-${message_id}`);
    emoji_laugh.setAttribute("id", `reaction-laugh-${message_id}`);
    emoji_love.setAttribute("id", `reaction-love-${message_id}`);

    emoji_like.innerText = '👍';
    emoji_laugh.innerText = '😆';
    emoji_love.innerText = '😍';

    const userId = localStorage.getItem("userId"); 
    for (const property in react_list) {
        if (react_list[property].includes(userId.toString())) {
            if (property === "like") emoji_like.classList.add('selected_reaction');
            else if (property === "laugh") emoji_laugh.classList.add('selected_reaction');
            else if (property === "love") emoji_love.classList.add('selected_reaction');
        }
    }

    emoji_like.addEventListener('click', reactMessage, false);
    emoji_laugh.addEventListener('click', reactMessage, false);
    emoji_love.addEventListener('click', reactMessage, false);

    message_message.appendChild(emoji_like); 
    message_message.appendChild(emoji_laugh); 
    message_message.appendChild(emoji_love); 

    // Add pin
    var glyfs_pin = document.createElement("DIV");
    glyfs_pin.classList.add("glyphicon","glyphicon-pushpin", "message-glyfs");
    glyfs_pin.message_id = message_id;
    glyfs_pin.style.display = 'none';
    glyfs_pin.addEventListener('click', pinMessage, false);
    message_message.appendChild(glyfs_pin); 

    if (pinned) glyfs_pin.classList.add('red');
    if (left) { // if message to the left

        var glyfs_settings = document.createElement("DIV");
        var glyfs_tick = document.createElement("DIV");
        var glyfs_remove = document.createElement("DIV");

        glyfs_settings.classList.add("glyphicon","glyphicon-cog", "message-glyfs");
        glyfs_tick.classList.add("glyphicon","glyphicon-ok", "message-glyfs");
        glyfs_remove.classList.add("glyphicon","glyphicon-remove", "message-glyfs");

        glyfs_settings.message_id = message_id;
        glyfs_tick.message_id = message_id;
        glyfs_remove.message_id = message_id;

        glyfs_settings.style.display = 'none';
        glyfs_tick.style.display = 'none';
        glyfs_remove.style.display = 'none';

        glyfs_settings.addEventListener('click', editMessageForm, false);
        glyfs_tick.addEventListener('click', submitMessageEdit, false);
        glyfs_remove.addEventListener('click', deleteMessage, false);

        glyfs_tick.setAttribute("id", `submit-message-edit-${message_id}`);
        glyfs_tick.style.display = 'none';

        message_message.appendChild(glyfs_settings); 
        message_message.appendChild(glyfs_tick); 
        message_message.appendChild(glyfs_remove); 
    } else { // If message to the right
        emoji_like.classList.add('reaction-right');
        emoji_laugh.classList.add('reaction-right');
        emoji_love.classList.add('reaction-right');
        glyfs_pin.classList.add('reaction-right');
    }

    // Create string showing current num of reactions
    var reactString = "";
    for (const property in react_list) {
        const numReacts = parseInt(react_list[property].length);
        if (numReacts > 0) {
            var reactSymbol;
            if (property === "like") reactSymbol = '👍';
            else if (property === "laugh") reactSymbol = '😆';
            else if (property === "love") reactSymbol = '😍';
            else console.log("Invalid reaction: " + property);
            reactString += `  ${numReacts}x${reactSymbol}`;
        }
    }
    var message_hover_react = document.createElement("div");
    if (message_message.classList.contains("float-right")) {
        message_hover_react.classList.add("hover-reaction-right");
    } else {
        message_hover_react.classList.add("hover-reaction-left");
    } 
    message_hover_react.textContent = reactString;
    message_hover_react.setAttribute("id", `show-reacts-${message_id}`);
    message_text_emoji_container.appendChild(message_hover_react); 

    // Add children to the message container
    message_container.appendChild(message_data);
    message_container.appendChild(message_message);
    message_container.addEventListener("mouseover", displayMessageGlyfs, false);
    message_container.addEventListener("mouseout", end_displayMessageGlyfs, false);
    message_container.event_state = 'standard';
    message_container.message_id = message_id;

    // Add message container to site
    var chat_history = document.getElementById("chat-history").getElementsByTagName("UL")[0];
    if (append) chat_history.appendChild(message_container);
    else chat_history.prepend(message_container);
}
