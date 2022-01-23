/**
 *  Author:             Marc Rocca
 *  Course:             COMP6080 Assignment 2
 *  Date:               25/10/2021
 *  Description:        This file contains functions relating to multi-user functions such as
 *                          Inviting users to channels, 
 *                          Editing channel information, 
 *                          Polling the server
 *                          Infinite Scrolling
 */

import * as config from './config.js';
import * as mes from './messages.js';

/**
 * Populates the INVITE Modal form that is used 
 * when a user adds another user to a channel
 */
export const fillInviteModal = () => {

    const this_userId = localStorage.getItem("userId").toString()
    const token = localStorage.getItem("token");
    const channelId = localStorage.getItem("channelId");

    const channelList = document.getElementById("invite-channel-list");
    const userList = document.getElementById("invite-user-list");

    // Remove all elements that are currently in the lists
    while (channelList.firstChild) {channelList.removeChild(channelList.lastChild);}
    while (userList.firstChild) {userList.removeChild(userList.lastChild);}

    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };

    // Update the channels list
    const channelPromise = fetch(config.serverIP+':5005/channel', requestOptions)
    channelPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                const channels = data['channels'];
                for (let i = 0; i < channels.length; i++) {
                    if (channels[i]['members'].includes(parseInt(this_userId))) {
                        var new_entry = document.createElement("option");
                        new_entry.value = channels[i]['id'];
                        new_entry.innerText = channels[i]['name'];
                        channelList.append(new_entry);
                    }
                }
            });
        }
    });

    // Update the users list
    const userPromise = fetch(config.serverIP+':5005/user', requestOptions)
    userPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                const users = data['users'];
                for (let i = 0; i < users.length; i++) {
                    // Get users name
                    var check_userId = users[i]['id'];
                    window.localStorage.setItem(users[i]['email'], users[i]['id']);
                    if (check_userId.toString() != this_userId.toString()) {
                        const namePromise = fetch(config.serverIP+':5005/user/' + check_userId, requestOptions)
                        namePromise.then((user_response) => {
                            if (user_response.status === 200) {
                                user_response.json().then((userData) => {
                                    var new_entry = document.createElement("option");
                                    new_entry.value = localStorage.getItem(userData['email']);;
                                    new_entry.innerText = userData['name'];
                                    const parent = document.getElementById("invite-user-list");
                                    var children = parent.childNodes;
                                    if (children.length == 0) parent.append(new_entry);
                                    else {
                                        for (var i = 0; i < children.length; i++) {  
                                            if(userData['name'].localeCompare(children[i].innerText) == -1) {
                                                parent.insertBefore(new_entry, children[i]);
                                                break;
                                            } else if (i == children.length-1) {
                                                parent.append(new_entry);
                                            }
                                        }
                                    }
                                });
                            } else {
                                response.json().then((data) => { console.log(data['error']) });
                            }
                        });
                    }
                }
            });
        }
    });
    userPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}

/**
 * Extract information from the INVITE modal to 
 * then handle HTTP requests to invite those users
 */
export const submitInviteUser = () => {

    const token = localStorage.getItem("token");
    const channelList = document.getElementById("invite-channel-list");
    const userList = document.getElementById("invite-user-list");

    var channelId = channelList.value;
    for (var option of userList.options)
    {
        if (option.selected) {
            const invite_userId = option.value
            const requestHeaders = { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            };
            const objectBody =  {
                "userId" : parseInt(invite_userId),
            }
            const requestBody = JSON.stringify(objectBody);
            const requestOptions = {
                method: 'POST',
                headers: requestHeaders,
                body: requestBody,
            };
            const returnPromise = fetch(`http://localhost:5005/channel/${channelId}/invite`, requestOptions)
            returnPromise.then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                    });
                } else {
                    response.json().then((data) => {
                        alert(data['error']);
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
 * Toggles the password to being visible and not-visible in the 
 * INVITE Modal
 */
export const showProfilePassword = () => {
    var password = document.getElementById("profile-password");
    if (password.type === "password") password.type = "text";
    else password.type = "password";
}


export const editProfileInfo = () => {

    // Populate the Profile Page Field
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };
    // Confirm old user details
    const oldInfoPromise = fetch(config.serverIP+':5005/user/'+userId, requestOptions)
    oldInfoPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => console.log(data['error']));
        } else if (response.status === 200) {
            response.json().then((old_data) => {
                // If changes have been made to the user details then add info to body
                const name = document.getElementById("profile-name").value;
                const password = document.getElementById("profile-password").value;
                const email = document.getElementById("profile-email").value;
                const bio = document.getElementById("profile-bio").value;
                const objectBody = {}
                if (password) objectBody["password"] = password
                if (name !== old_data['name']) {
                    objectBody["name"] = name;
                    window.localStorage.setItem('name', name);
                }
                if (email !== old_data['email']) objectBody["email"] = email;
                if (bio !== old_data['bio']) objectBody["bio"] = bio;
                const requestBody = JSON.stringify(objectBody);
                const change_requestOptions = {
                    method: 'PUT',
                    headers: requestHeaders,
                    body: requestBody,
                };
                const returnPromise = fetch(config.serverIP+':5005/user', change_requestOptions)
                returnPromise.then((response) => {
                    if (response.status === 400) {
                        response.json().then((data) => console.log(data['error']));
                    } else if (response.status === 200) {
                        response.json().then((data) => {
                            console.log("Succestful User Information Change", data);
                        });
                    }
                });
            });
        }
    });
    oldInfoPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}

/**
 * Displays a modal displaying basic profile information
 * @param {Event} evt 
 */
export const previewProfile = (evt) => {

    // Get User ID Information 
    var userId; 
    if (typeof evt === 'string' || evt instanceof String) userId = evt; 
    else userId = evt.currentTarget.userId.toString();

    const token = localStorage.getItem("token");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };
    const returnPromise = fetch(config.serverIP+':5005/user/'+userId, requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => console.log(data['error']));
        } else if (response.status === 200) {
            response.json().then((data) => {
                document.getElementById('preview-name').innerText = data['name'];
                document.getElementById('preview-email').innerText = data['email'];
                document.getElementById('preview-bio').innerText = data['bio'];
                if (data['image'] === null) document.getElementById('preview-profile-img').src = "assets/avatars/avatar_0.png"; 
                else document.getElementById('preview-profile-img').src = data['image'];
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}

/**
 * Handles the HTTP requests to upload and 
 * update the profile images of the user
 * @param {String} file 
 */
export var openFile = function(file) {
    var input = file.target;
    var reader = new FileReader();
    reader.onload = function(){
        var dataURL = reader.result;
        var output = document.getElementById('profile-image');
        output.src = dataURL;
        const token = localStorage.getItem("token");
        const requestHeaders = { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        };
        const objectBody = {
            "image": dataURL
        }
        const requestBody = JSON.stringify(objectBody);
        const change_requestOptions = {
            method: 'PUT',
            headers: requestHeaders,
            body: requestBody,
        };
        const returnPromise = fetch(config.serverIP+':5005/user', change_requestOptions)
        returnPromise.then((response) => {
            if (response.status === 400) {
                response.json().then((data) => console.log(data['error']));
            } else if (response.status === 200) {
                response.json().then((data) => {
                    console.log("Succestful Changed User Image", data);
                    document.getElementById("profile-img").src = dataURL;
                    document.getElementById("sidebar-img").src = dataURL;
                    // if (dataURL === null) document.getElementById('profile-img').src = "assets/avatars/avatar_0.png"; 
                    // else document.getElementById('profile-img').src = dataURL;
                });
            }
        });
        returnPromise.catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    };
    reader.readAsDataURL(input.files[0]);
  };


/**
 * Polls the server to see if a message
 * in a channel the current user is in has been 
 * sent or deleted
 */
export var polling = function() {

    const token = localStorage.getItem("token");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
    };

    const returnPromise = fetch(config.serverIP+':5005/channel', requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                var channels_member = [] // Channels that user is a part of
                const userId = localStorage.getItem("userId");
                for (var j = 0; j < data['channels'].length; j++) {
                    if (data['channels'][j]['members'].includes(parseInt(userId))) {
                        channels_member.push(data['channels'][j]['id'])
                    }
                }
                window.localStorage.setItem(`joined_channels`, channels_member.join(' '));
            });
        }
    });
    
    var channels = localStorage.getItem(`joined_channels`);
    if (!(channels)) channels = []
    else  channels = channels.split(" ");
    for(var i = 0; i < channels.length; i++) {
        const channelId = channels.shift();
        window.localStorage.setItem(`joined_channels`, channels.join(' '));
        var msgPromise = fetch(config.serverIP+':5005/message/'+channelId+'?start='+0, requestOptions);
        msgPromise.then(response => {
            response.json().then((msg_data) => {
                if (response.ok) {
                    const last_messageId = localStorage.getItem(`lastMsg_${channelId}`);
                    if (last_messageId) {
                        if (last_messageId.toString() != msg_data['messages'][0]['id'].toString()) {
                            document.getElementById("push-bell").style.display = "block";
                            window.localStorage.setItem(`lastMsg_${channelId}`, msg_data['messages'][0]['id']);
                        }
                    } else { // If the local storage data is not stored then set it
                        window.localStorage.setItem(`lastMsg_${channelId}`, msg_data['messages'][0]['id'].toString());
                    }     
                } else {
                    response.json().then((data) => { console.log(data['error']) });
                }
            });
        });
        msgPromise.catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    }
    window.setTimeout(polling,1000);
}


/**
 * This function allows for infinite scrolling to occur
 * when viewing a channel page
 */
export const infScroll = () => {
    const endOfChannel = localStorage.getItem("endOfChannel");
    const loadingMessages = localStorage.getItem("loadingMessages");
    if (endOfChannel === "false" && loadingMessages === "false") {
        const wrapper = document.getElementById('chat-wrapper');
        const chat = document.getElementById('chat-history');
        const loaderIcon = document.getElementById('scroll-loading');
        if (wrapper.scrollTop < 300 && chat.offsetHeight > 1200) {
            loaderIcon.style.display = "block";
            window.localStorage.setItem('loadingMessages', "true");
            const allMessages_container = document.getElementById('chat-all-messages');
            const index = allMessages_container.childNodes.length;
            var channelId = localStorage.getItem("channelId");

            const token = localStorage.getItem("token");
            const requestHeaders = { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            };
            const requestOptions = {
                method: 'GET',
                headers: requestHeaders,
            };

            var returnPromise = fetch(config.serverIP+':5005/message/'+channelId+'?start='+index, requestOptions)
            returnPromise.then(response => {
                if (response.ok) {
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
                        if (data['messages'].length === 0) {
                            window.localStorage.setItem('endOfChannel', 'true');
                            loaderIcon.style.display = "none";
                        } else {
                            var last_id = 1;
                            const message = data['messages'];
                            const userId = localStorage.getItem("userId"); 
                            for(var i=0; i<message.length; i++) {
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
                                    const userId = localStorage.getItem("userId"); 
                                    mes.addMessage(message[i]['message'], message[i]['sentAt'], message[i]['id'], userId, userReacts, message[i]['pinned'], true, imageData, false);
                                } else {
                                    mes.addMessage(message[i]['message'], message[i]['sentAt'], message[i]['id'], message[i]['sender'].toString(), userReacts, message[i]['pinned'], false, imageData, false);
                                }
                                last_id = message[i]['id'];
                            }
                            window.localStorage.setItem('lastest_messageId', last_id);
                            window.localStorage.setItem('loadingMessages', "false");
                        }
                    });

                } else {
                    if (response.status === 400) response.json().then((data) => { console.log(data['error']) });
                }
            });
            returnPromise.catch(() => {
                alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
            });
        } else {
            loaderIcon.style.display = "none";
        }
    }
}
