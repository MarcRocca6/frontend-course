/**
 *  Author:             Marc Rocca
 *  Course:             COMP6080 Assignment 2
 *  Date:               25/10/2021
 *  Description:        This file contains functions relating to 
 *                          Logins, 
 *                          Logouts, 
 *                          Registration 
 *                          Hash Changes
 */

import * as chan from './channels.js';
import * as config from './config.js';
import * as user from './multiuser.js';

/**
 * Login Backend Request
 * Handles the HTTP requests to perform the login 
 * process with the backend
 */
export function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const jsonString = JSON.stringify({ 
        email: email,
        password: password,
    });
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString
    };
    const returnPromise = fetch(config.serverIP+':5005/auth/login', requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            signup_alert("Invalid email or password.");
        } else if (response.status === 200) {
            // response is the returned Promise
            response.json().then((data) => {
                window.localStorage.setItem('userId', data['userId']);
                window.localStorage.setItem('token', data['token']);
                getMyName(data['userId']);
                home_page_display()

                // Get image of user and add to the sidebar image display
                const userId = data['userId'];
                const token = data['token'];
                const requestHeaders = { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                };
                const requestOptions = {
                    method: 'GET',
                    headers: requestHeaders,
                };
                const img_returnPromise = fetch(config.serverIP+':5005/user/'+userId, requestOptions)
                img_returnPromise.then((img_response) => {
                    if (img_response.status === 400) {
                        img_response.json().then((img_data) => console.log(img_data['error']));
                    } else if (img_response.status === 200) {
                        img_response.json().then((img_data) => {
                            if (img_data['image'] === null) document.getElementById('sidebar-img').src = "assets/avatars/avatar_0.png";
                            else document.getElementById('sidebar-img').src = img_data['image'];
                            window.setTimeout(user.polling,2000);
                        });
                    }
                });
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}


/**
 * Login Frontend DOM
 * Handles the DOM changes to open up the logged in page
 */
export function login_page_display() {
    document.getElementById('initial-landing-page').style.display = 'block';
    document.getElementById('landing-page').style.display = 'none'; 
    document.getElementById('add-channel-form').style.display = 'none';
    document.getElementById('channel-page').style.display = 'none'; 
    document.getElementById('form-name-input').style.display = 'none'; 
    document.getElementById('login-heading').innerText  = 'Login';
    document.getElementById('login_button').innerText  = 'Login';
    document.getElementById('alert-info').style.display = 'none';
    document.getElementById("profile-page").style.display = "none";
    document.getElementById('bubble-container').style.display = 'none';
    document.getElementById('form-password-repeat').style.display = 'none';
    document.getElementById('form-terms-of-service').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-heading').style.display = 'block';
    document.getElementById('register_imgs').style.display = 'none';
    document.getElementById('login_imgs').style.display = 'block';
    document.getElementById('prelogin_assets').style.display = 'flex';

    // Restart the login-image animation 
    var login_imgs = document.getElementById('login_imgs').getElementsByTagName("img");
    for(var i=0; i<login_imgs.length; i++) {
        login_imgs[i].style.animationPlayState = "running";
        login_imgs[i].style.display = "block";
        var assetName = `assets/imgs/login_${Math.floor(Math.random()*8)}.jpg`;
        login_imgs[i].src = assetName;
    }
    document.getElementById('login_button').removeEventListener("click", register);
    document.getElementById('login_button').addEventListener("click", login);
}


/**
 * Registratrion Backend Requests
 * Handles the backend HTTP request to log a user in 
 */
export function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password-repeat').value;
    const name = document.getElementById('name').value;
    const ticked = document.getElementById('ticked-terms-of-service').checked;

    if (!(ticked)) {
        signup_alert("Please accept the Terms of Service.");
    } else if (!(password2 === password)) {
        signup_alert("Passwords do not match.");
    } else {
        const jsonString = JSON.stringify({ 
            email: email,
            password: password,
            name: name,
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonString
        };

        const returnPromise = fetch(config.serverIP+':5005/auth/register', requestOptions)
        returnPromise.then((response) => {
            if (response.status === 400) {
                signup_alert("User has already registered. Please log in instead.");
            } else if (response.status === 200) {
                // response is the returned Promise
                response.json().then((data) => {
                    window.localStorage.setItem('token', data['token']);
                    window.localStorage.setItem('userId', data['userId']);
                    window.localStorage.setItem('token', data['token']);
                    getMyName(data['userId']);
                    home_page_display(data['token'])
                });
            }
        });
        returnPromise.catch(() => {
            alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
        });
    }
}


/**
 * Registratrion Frontend DOM
 * Handles the DOM changes to open up the regristration page
 */
export function register_page_display() {
    document.getElementById('prelogin_assets').style.display = 'flex';
    document.getElementById('initial-landing-page').style.display = 'block';
    document.getElementById('landing-page').style.display = 'none'; 
    document.getElementById('add-channel-form').style.display = 'none';
    document.getElementById('channel-page').style.display = 'none'; 
    document.getElementById('form-name-input').style.display = 'block';
    document.getElementById('login-heading').innerText  = 'Sign Up';
    document.getElementById('login_button').innerText  = 'Register';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-heading').style.display = 'block';
    document.getElementById('form-password-repeat').style.display = 'block';
    document.getElementById('form-terms-of-service').style.display = 'block';
    document.getElementById('alert-info').style.display = 'none';
    document.getElementById('register_imgs').style.display = 'block';
    document.getElementById('login_imgs').style.display = 'none';
    document.getElementById('bubble-container').style.display = 'none';

    // Pause the login-image animation 
    var login_imgs = document.getElementById('login_imgs').getElementsByTagName("img");
    for(var i=0; i<login_imgs.length; i++) {
        login_imgs[i].style.animationPlayState = "paused";
        login_imgs[i].style.display = "none";
    }
    document.getElementById('login_button').removeEventListener("click", login);
    document.getElementById('login_button').addEventListener("click", register);
}

/**
 * Reuseable Helper Function: 
 * Load home page after succestful login/register
 */
export const home_page_display = () => {
    document.getElementById('sidebarCollapse').style.display = 'block';
    document.getElementById('initial-landing-page').style.display = 'none';
    document.getElementById('channel-page').style.display = 'none';  
    document.getElementById('landing-page').style.display = 'block';  
    document.getElementById('left-link-nav').textContent = "Profile";
    document.getElementById('right-link-nav').textContent = "Logout";
    document.getElementById('page-toggle-left-link').addEventListener("click", profile_page_display);
    document.getElementById('page-toggle-left-link').removeEventListener("click", register_page_display);
    document.getElementById('page-toggle-right-link').addEventListener("click", logout);  
    document.getElementById('new-channel-button').addEventListener("click", chan.display_createChannel_form);  
    getChannels(); 
}


/**
 * Handles HTTP Requests to log the current user out of the website 
 **/ 
export const logout = () => {

    document.getElementById('sidebar-img').src = "assets/avatars/avatar_0.png";
    const token = localStorage.getItem("token");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
    };
    const returnPromise = fetch(config.serverIP+':5005/auth/logout', requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                // Close side navigation bar if it is open
                document.getElementById("sidebar").style.width = "0";
                document.getElementById("content").style.marginLeft= "0";
                document.getElementById("profile-page").style.display = "none";
                document.getElementById("navbarSupportedContent").style.paddingRight = "0";

                document.getElementById('page-toggle-left-link').removeEventListener("click", profile_page_display);

                document.getElementById('sidebarCollapse').style.display = 'none';
                document.getElementById('left-link-nav').textContent = "Register";
                document.getElementById('right-link-nav').textContent = "Login";
                document.getElementById('page-toggle-left-link').addEventListener("click", register_page_display);
                // localStorage.clear();
                location.reload();
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}


/**
 * Handles the Navigation Profile Button Presses
 * When the profile button is pressed calls this function to
 * open up the profile page
 */
export function profile_page_display() {
    const userId = localStorage.getItem("userId");
    const profile_page = document.getElementById('profile-page');
    if (profile_page.style.display == 'block') { // Close Profile Page
        profile_page.style.display = 'none';
        document.getElementById('left-link-nav').innerText = 'Profile';
        document.getElementById('chat-history').style.display = 'none';
        document.getElementById('landing-page').style.display = 'block';
        document.getElementById('add-channel-form').style.display = 'none';
    } else { // Display Profile Page
        profile_page.style.display = 'block';
        document.getElementById('channel-page').style.display = 'none';
        document.getElementById('chat-history').style.display = 'none';
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('add-channel-form').style.display = 'none';
    }
    // Populate the Profile Page Field
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
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                window.localStorage.setItem('name', data['name']);
                document.getElementById('profile-name').value = data['name'];
                document.getElementById('profile-email').value = data['email'];
                document.getElementById('profile-bio').value = data['bio'];
                if (data['image'] === null) {
                    document.getElementById('profile-img').src = "assets/avatars/avatar_0.png";
                } else {
                    document.getElementById('profile-img').src = data['image'];
                }
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}


/**
 * Given an input text string, displays an alert on the login/register form
 * @param {String} text 
 */
export function signup_alert(text) {
    document.getElementById('alert-info').style.display = 'flex';
    document.getElementById('alert-text').innerText = text;
}


/**
 * Populates the logged-in sidebar to display all of the
 * channels
 */
export const getChannels = () => {
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
                chan.displayChannels(data['channels']);
            });
        }
    });
}

/**
 * Performs HTTP Request to allow the current logged in 
 * user to join a channel
 * Opens up the channel page if request succestful
 */
export const joinChannel = () => {

    const token = localStorage.getItem("token");
    const channelID = localStorage.getItem("channelId");

    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
    };
    const returnPromise = fetch(config.serverIP+':5005/channel/'+channelID+'/join', requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 403) {
            alert("Error. You do not have permission to join this channel as it is private.")
        } else if (response.status === 200) {
            response.json().then((data) => {
                // Add chat history and add Leave button 
                document.getElementById('landing-page').style.display = 'none';
                document.getElementById('channel-page').style.display = 'block';
                document.getElementById('add-channel-form').style.display = 'none';
                document.getElementById('edit-channel-button').style.display = 'inline-block';
                document.getElementById('pinned-channel-button').style.display = 'inline-block';
                document.getElementById('chat-history').style.display = 'block';
                document.getElementById('join-channel-button').style.display = 'none';
                document.getElementById('leave-channel-button').style.display = 'inline-block';
                document.getElementById('chat-history').style.display = 'block';
                chan.openChannel();  
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });

}

/**
 * Performs HTTP Request to make a user leave a channel.
 * If succestful removes all messages of that channel from current page
 */
export const leaveChannel = () => {

    const channelID = localStorage.getItem("channelId");
    const token = localStorage.getItem("token");
    const requestHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
    };
    const returnPromise = fetch(config.serverIP+':5005/channel/'+channelID+'/leave', requestOptions)
    returnPromise.then((response) => {
        if (response.status === 400) {
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                // Remove chat history and add Join button 
                document.getElementById('landing-page').style.display = 'none';
                document.getElementById('channel-page').style.display = 'block';
                document.getElementById('add-channel-form').style.display = 'none';
                document.getElementById('profile-page').style.display = 'none';
                document.getElementById('edit-channel-button').style.display = 'none';
                document.getElementById('pinned-channel-button').style.display = 'none';
                document.getElementById('chat-history').style.display = 'none';
                document.getElementById('join-channel-button').style.display ='inline-block';
                document.getElementById('leave-channel-button').style.display = 'none';
                document.getElementById("channel-subheading").textContent = "Please join this channel to view and edit it."
                document.getElementById('edit-channel-form').style.display = 'none';
                const edit_channel_button = document.getElementById('edit-channel-button');
                edit_channel_button.innerText = 'Edit';
                edit_channel_button.removeEventListener('click', chan.returnChannelMessages);
                edit_channel_button.addEventListener('click', chan.editChannel); 
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });

}

/**
 * Saves current logged in users name to local storage: Executes HTTP Request 
 * @param {Int} userId 
 */
export const getMyName = (userId) => {
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
            response.json().then((data) => { console.log(data['error']) });
        } else if (response.status === 200) {
            response.json().then((data) => {
                window.localStorage.setItem('name', data['name']);
            });
        }
    });
    returnPromise.catch(() => {
        alert("Connection with server broken. Please make sure that you have an internet connection and try again.");
    });
}

/**
 * Allows Hash Changes to the URL to function to display
 * profile and channel information
 */
export const hashChange = () => {
    var hash = window.location.hash.substring(1);
    const hashHeading = hash.substring(0,8).toString();
    if (hashHeading === "channel=") {
        if (document.getElementById('page-toggle-left-link').innerText === "Register") {
            alert("Please login in before accessing a channel's information.");
        } else {
            const channelId = hash.substring(8).toString();
            chan.openChannel(channelId);
        }
    } else if (hashHeading === "profile") {
        if (document.getElementById('page-toggle-left-link').innerText === "Register") {
            alert("Please login in before accessing your profile information.");
        } else document.getElementById('page-toggle-left-link').click();
    } else if (hashHeading === "profile=") {
        if (document.getElementById('page-toggle-left-link').innerText === "Register") {
            alert("Please login in before accessing another users' profile information.");
        } else {
            const userId = hash.substring(8).toString();
            user.previewProfile(userId);
            document.querySelector(".message-data-name").click();
        }
    }
}
