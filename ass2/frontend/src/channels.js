/**
 *  Author:             Marc Rocca
 *  Course:             COMP6080 Assignment 2
 *  Date:               25/10/2021
 *  Description:        This file handles the functions relating
 *                      to channels such as:
 *                          Displaying channels
 *                          Showing Pinned Messages
 *                          Displaying Edit Channel Forms
 */

import * as reg from './register.js';
import * as mes from './messages.js';
import * as user from './multiuser.js';
import * as config from './config.js';


/**
 * Given a list of channels displays those channels
 * in the sidebar
 * @param {List} channels 
 */
export const displayChannels = (channels) => {
    // Sets current users name text in the sidebar
    const name = localStorage.getItem("name");
    document.getElementById('avatar-name').textContent = name;
    
    // Grab channels lists
    var private_channels = document.getElementById("private-channel-menu");
    var public_channels = document.getElementById("public-channel-menu");

    // Remove all elements that are currently in the channels list
    while (private_channels.firstChild) {private_channels.removeChild(private_channels.lastChild);}
    while (public_channels.firstChild) {public_channels.removeChild(public_channels.lastChild);}

    // Add curent channels to that channel list
    for (let i = 0; i < channels.length; i++) {
        var c = channels[i];
        var new_entry = document.createElement("a");
        new_entry.classList.add("sub-sidebar-text");
        new_entry.setAttribute("href", "#");
        new_entry.textContent = c['name'];
        var dot_point = document.createElement("LI");
        dot_point.appendChild(new_entry); 
        dot_point.channel_ID = c['id'];
        dot_point.channel_Name = c['name'];
        dot_point.addEventListener('click', openChannel, false);
        if (c['private']) {  
            private_channels.appendChild(dot_point);
        } else if (!(c['private'])){
            public_channels.appendChild(dot_point);
        } else {
            console.log('Error ')
        }
    }
}

/**
 * Displays all pinned messages in the channel chat
 */
export const showPinned = () => {

    document.getElementById('scroll-loading').style.display = "none";
    document.getElementById('chat-wrapper').style.display = 'block';
    document.getElementById('chat-send-section').style.display = 'block';
    document.getElementById('edit-channel-form').style.display = 'none';

    // Remove all elements that are currently in the chat history
    var chat_history = document.getElementById("chat-history").getElementsByTagName("UL")[0];
    while (chat_history.firstChild) {chat_history.removeChild(chat_history.lastChild);}
    
    // Get Channel Information 
    var channel_heading = document.getElementById("channel-heading");
    var channelId = localStorage.getItem("channelId");
    var channelName = localStorage.getItem("channelName");
    channel_heading.textContent = channelName;

    const token = localStorage.getItem("token");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };

    let mes_index = 0;
    var sent_messageIds = [];
    const userId = localStorage.getItem("userId");
    const pinPromises = () => new Promise((resolve, reject) => {
        return fetch(config.serverIP+':5005/message/'+channelId+'?start='+mes_index, requestOptions).then(response => {
            response.json().then((data) => {
                if (data['messages'].length == 0) {
                    resolve(mes_index);
                } else {
                    mes_index += 25;
                    for (var i = data['messages'].length-1; i >= 0; i--) {
                        var message = data['messages'];
                        if (message[i]['pinned']) {                            
                            if (!(sent_messageIds.includes(message[i]['id']))) {
                                sent_messageIds.push(message[i]['id']);
                                var userReacts = {};
                                var reacts = message[i]['reacts'];
                                for(var j=0 ; j< reacts.length; j++) {
                                    const react_type = reacts[j]['react'];
                                    if (userReacts.hasOwnProperty(react_type)) {
                                        userReacts[react_type].push(reacts[j]['user'].toString());
                                    } else userReacts[react_type] = [reacts[j]['user'].toString()];
                                }
                                var imageData = false;
                                if (message[i]['image']) imageData = message[i]['image'];

                                if (message[i]['sender'].toString() === userId) {
                                    mes.addSelfMessage(message[i]['message'], message[i]['sentAt'], message[i]['id'], userReacts, message[i]['pinned'], imageData);
                                } else {
                                    mes.addOtherMessage(message[i]['message'], message[i]['sentAt'], message[i]['id'], message[i]['sender'].toString(), userReacts, message[i]['pinned'], imageData);
                                }
                            }
                        }
                    }
                    resolve(pinPromises());
                }
            });
        })
        .catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    });
    pinPromises().then(() => {});
    pinPromises().catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });

    document.getElementById("channel-subheading").innerText = "All pinned messages";
    const pinButton = document.getElementById("pinned-channel-button");
    pinButton.innerText = "All Messages";
    pinButton.removeEventListener("click", showPinned);
    pinButton.addEventListener("click", openChannel);
}

export const editChannel = () => {

    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };
    // Get Channel description
    var detailPromise = fetch(config.serverIP+':5005/channel/'+channelId, requestOptions)
    detailPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 403) {
            console.log("Forbidden.");
            document.getElementById("channel-subheading").textContent = "Please join this channel to view and edit it."
        } else if (response.status === 200) {
            response.json().then((data) => {
                
                // Edit Channel Field
                document.getElementById('edit-channel-name').value = data['name'];
                document.getElementById('edit-channel-description').value = data['description'];
                document.getElementById('edit-channel-private').checked = data['private'];
                const time = data['createdAt'].toString();
                const timeString = `${time.substring(11,16)} ${time.substring(8,10)}/${time.substring(5,7)}`;
                document.getElementById('edit-channel-time').textContent = timeString;
                document.getElementById('edit-channel-creator').textContent = data['creator'];

                 // Get users name
                const namePromise = fetch(config.serverIP+':5005/user/' + data['creator'], requestOptions)
                namePromise.then((user_response) => {
                    if (user_response.status === 200) {
                        user_response.json().then((userData) => {
                            document.getElementById('edit-channel-creator').textContent = userData['name'];
                        });
                    }
                });


                // Edit Page State Elements
                document.getElementById('chat-wrapper').style.display = 'none';
                document.getElementById('chat-send-section').style.display = 'none';
                document.getElementById('edit-channel-form').style.display = 'block';
                const edit_channel_button = document.getElementById('edit-channel-button');
                edit_channel_button.innerText = 'Channel Messages';
                edit_channel_button.removeEventListener('click', editChannel);
                edit_channel_button.addEventListener('click', returnChannelMessages);
            });
        }
    });
    detailPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}


/**
 * DOM edits for when a user returns to the channel page
 * from the edit profile page
 */
export const returnChannelMessages = () => {
    document.getElementById('chat-wrapper').style.display = 'block';
    document.getElementById('chat-send-section').style.display = 'block';
    document.getElementById('edit-channel-form').style.display = 'none';
    const edit_channel_button = document.getElementById('edit-channel-button');
    edit_channel_button.innerText = 'Edit';
    edit_channel_button.removeEventListener('click', returnChannelMessages);
    edit_channel_button.addEventListener('click', editChannel);
}

/**
 * Submits channel edits
 */
export const submitChannelEdits = () => {

    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");

    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };

    const name =document.getElementById('edit-channel-name').value;
    const description = document.getElementById('edit-channel-description').value;
    const is_private = document.getElementById('edit-channel-private').checked;
    const objectBody =  {
                        "name": name,
                        "private": is_private,
                        "description": description,
                        }
    const requestBody = JSON.stringify(objectBody);

    const requestOptions = {
        method: 'PUT',
        headers: requestHeaders,
        body: requestBody,
    };

    const returnPromise = fetch(config.serverIP+':5005/channel/'+channelId, requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                reg.getChannels(); 
                document.getElementById("channel-heading").textContent = name;
                document.getElementById("channel-subheading").textContent = description;

            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });

}


// Create a Channel: Executes HTTP Request 
export const display_createChannel_form = () => {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('channel-page').style.display = 'none';
    document.getElementById('add-channel-form').style.display = 'block';
    document.getElementById('profile-page').style.display = 'none';
    document.getElementById('create-channel-button').addEventListener("click", createChannel);
}

// Create a Channel: Executes HTTP Request 
const createChannel = () => {

    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('channel-page').style.display = 'none';
    document.getElementById('profile-page').style.display = 'none';
    document.getElementById('add-channel-form').style.display = 'block';

    const name = document.getElementById('new-channel-name').value;
    var description = document.getElementById('new-channel-description').value;
    // if (description) description = " ";
    const is_private = document.getElementById('new-channel-private').checked;
    const token = localStorage.getItem("token");

    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestBody = JSON.stringify({
        "name": name,
        "private": is_private,
        "description": description,
    });
    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody,
    };

    const returnPromise = fetch(config.serverIP+':5005/channel', requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                reg.getChannels(); 
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}

/**
 * Calls singleCall_openChannel()
 * twice with a delay
 * @param {Event} evt 
 */
 export const openChannel = (evt) => {
    singleCall_openChannel(evt);
    window.setTimeout(singleCall_openChannel,650);
}

/**
 * Opens a channel
 * @param {Event} evt 
 */
export const singleCall_openChannel = (evt) => {

    document.getElementById('scroll-loading').style.display = "none";
    window.localStorage.setItem('endOfChannel', 'false');
    window.localStorage.setItem('loadingMessages', "false");

    // Confirm the status of "Pinned Messages" button
    const pinButton = document.getElementById("pinned-channel-button");
    pinButton.innerText = "Pinned";
    pinButton.addEventListener("click", showPinned);
    pinButton.removeEventListener("click", openChannel);

    // Get Channel Information 
    var channelId; 
    if (typeof evt === 'string' || evt instanceof String) {
        channelId = evt; 
        window.localStorage.setItem('channelId', channelId);
    } else {
        try { // If called from pressing open-page button
            channelId = evt.currentTarget.channel_ID.toString();
            window.localStorage.setItem('channelId', channelId);
        } catch (error) { // If called from pressing join-page button 
            channelId = localStorage.getItem("channelId");
        }
    }

    const token = localStorage.getItem("token");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };

    // Get Channel description
    var detailPromise = fetch(config.serverIP+':5005/channel/'+channelId, requestOptions)
    detailPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { alert(data['error'])});
        } else if (response.status === 403) {
        } else if (response.status === 200) {
            response.json().then((data) => {

                document.getElementById("channel-subheading").textContent = data['description'];
                document.getElementById("channel-heading").textContent = data['name'];
                window.localStorage.setItem('channelName', data['name']);
                const members = data['members'];

                let i = 0;                
                // Save users ID and name in local storage
                
                const namePromises = () => new Promise((resolve, reject) => {
                    return fetch(config.serverIP+':5005/user/'+members[i], requestOptions).then(n_response => {
                        n_response.json().then((n_data) => {
                            if (i < members.length-1) {
                                window.localStorage.setItem(members[i], n_data['name']);
                                if (!(localStorage.getItem(`${members[i]}_photo`))) {
                                    window.localStorage.setItem(`${members[i]}_photo`,n_data['image']);
                                }
                                i++;
                                resolve(namePromises());
                            } else {
                                resolve(i);
                            }
                        });
                    })
                    .catch(() => {
                        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
                    });
                });
                namePromises().then(() => {});
                });
        }
    });
    detailPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });


    // Add Messages to Channel
    var init_message_pos = 0;
    var returnPromise = fetch(config.serverIP+':5005/message/'+channelId+'?start='+init_message_pos, requestOptions)
    returnPromise.then(response => {
        if (response.ok) {
            returnChannelMessages();
            document.getElementById("push-bell").style.display = "none";
            document.getElementById('chat-wrapper').style.display = 'block';
            document.getElementById('profile-page').style.display = 'none';
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('channel-page').style.display = 'block';
            document.getElementById('profile-page').style.display = 'none';
            document.getElementById('add-channel-form').style.display = 'none';
            document.getElementById('edit-channel-button').style.display = 'inline-block';
            document.getElementById('pinned-channel-button').style.display = 'inline-block';
            document.getElementById('join-channel-button').style.display = 'none';
            document.getElementById('chat-history').style.display = 'block';
            const leave_button = document.getElementById('leave-channel-button');
            leave_button.style.display = 'inline-block';
            
            // Add Messages to Channel
            response.json().then((data) => {

                // Remove all elements that are currently in the chat history
                var chat_history = document.getElementById("chat-history").getElementsByTagName("UL")[0];
                while (chat_history.firstChild) {chat_history.removeChild(chat_history.lastChild);}
                window.localStorage.setItem('lastLoaded_channelId', channelId);

                var last_id = 1;
                const message = data['messages'];
                const userId = localStorage.getItem("userId"); 
                for(var i=message.length-1; i>=0; i--) {
                    // Iterate through reactions and reorder information
                    var userReacts = {};
                    var reacts = message[i]['reacts'];
                    for(var j=0 ; j< reacts.length; j++) {
                        const react_type = reacts[j]['react'];
                        if (userReacts.hasOwnProperty(react_type)) {
                            userReacts[react_type].push(reacts[j]['user'].toString());
                        } else userReacts[react_type] = [reacts[j]['user'].toString()];
                    }
                    var imageData = false;
                    if (message[i]['image']) imageData = message[i]['image'];
                    if (message[i]['sender'].toString() === userId) {
                        mes.addSelfMessage(message[i]['message'], message[i]['sentAt'], message[i]['id'], userReacts, message[i]['pinned'], imageData);
                    } else {
                        mes.addOtherMessage(message[i]['message'], message[i]['sentAt'], message[i]['id'], message[i]['sender'].toString(), userReacts, message[i]['pinned'], imageData);
                    }
                    last_id = message[i]['id'];
                }
                window.localStorage.setItem('lastest_messageId', last_id);
                document.getElementById('chat-wrapper').removeEventListener("scroll", user.infScroll);
                document.getElementById("bottom-of-chat").scrollIntoView();
                document.getElementById('chat-wrapper').addEventListener("scroll", user.infScroll);

            });

        } else {
            if (response.status === 400)  response.json().then((data) => { console.log(data['error']) });
            else if (response.status === 403) {
                document.getElementById('profile-page').style.display = 'none';
                document.getElementById('landing-page').style.display = 'none';
                document.getElementById('chat-wrapper').style.display = 'none';
                document.getElementById('channel-page').style.display = 'block';
                document.getElementById('add-channel-form').style.display = 'none';
                document.getElementById('edit-channel-button').style.display = 'none';
                document.getElementById('pinned-channel-button').style.display = 'none';
                document.getElementById('leave-channel-button').style.display = 'none';
                const join_button =  document.getElementById('join-channel-button');
                document.getElementById("channel-heading").textContent = "You are not a member of this channel."
                document.getElementById("channel-subheading").textContent = "Please join this channel to view and edit it."
                join_button.style.display = 'inline-block'; 
                response.json().then((data) => alert(data['error']));
                document.getElementById('chat-wrapper').addEventListener("scroll", user.infScroll);
            }
        }
    });
    returnPromise.catch(() => {
        returnChannelMessages();
        document.getElementById('profile-page').style.display = 'none';
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('channel-page').style.display = 'block';
        document.getElementById('profile-page').style.display = 'none';
        document.getElementById('add-channel-form').style.display = 'none';
        document.getElementById('edit-channel-button').style.display = 'inline-block';
        document.getElementById('pinned-channel-button').style.display = 'inline-block';
        document.getElementById('join-channel-button').style.display = 'none';
        document.getElementById('chat-history').style.display = 'block';
        document.getElementById("channel-subheading").textContent = "Please reconnect with the internet to be able to interact with this page.";
        const leave_button = document.getElementById('leave-channel-button');
        leave_button.style.display = 'inline-block';
        
        var chat_messages = document.getElementById("chat-all-messages").childNodes;
        
        if (localStorage.getItem("lastLoaded_channelId").toString() === channelId.toString()) {
            document.getElementById("channel-heading").textContent = localStorage.getItem("channelName");
            for (var i = 0; i < chat_messages.length; i++) {
                chat_messages[i].style.display = 'block';
            }
        } else {
            document.getElementById("channel-heading").textContent = "ERROR: Connection Error";
            for (var i = 0; i < chat_messages.length; i++) {
                chat_messages[i].style.display = 'none';
            }
        }
    });
}
