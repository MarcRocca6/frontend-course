/**
 *  Author:             Marc Rocca
 *  Course:             COMP6080 Assignment 2
 *  Date:               25/10/2021
 *  Description:        This file contains initalisation of 
 *                      global event listeners
 */

import * as reg from './register.js';
import * as chan from './channels.js';
import * as mes from './messages.js';
import * as user from './multiuser.js';
import * as img from './images.js';

// Set the initial state of the prelogin form button to listener 'login'
document.getElementById('login_button').addEventListener("click", reg.login);

// Toggles the Top Right Navigation Link
document.getElementById('page-toggle-right-link').addEventListener('click', reg.login_page_display);

// Toggles Top Left Navigation Link
document.getElementById('page-toggle-left-link').addEventListener('click', reg.register_page_display)

// Set listeners for Join and leave channel Buttons
document.getElementById('leave-channel-button').addEventListener("click", reg.leaveChannel);
document.getElementById('join-channel-button').addEventListener("click", reg.joinChannel);

// Edit Channel Form popup
document.getElementById('edit-channel-button').addEventListener("click", chan.editChannel);
document.getElementById('pinned-channel-button').addEventListener("click", chan.showPinned);

// Edit channel Button 
document.getElementById('submit-channel-edit-button').addEventListener("click", chan.submitChannelEdits);
document.getElementById('avatar-name').addEventListener("click", reg.profile_page_display);

//Send a message in the chat
document.getElementById('chat-message-button').addEventListener("click", mes.sendMessage);
document.getElementById('chat-image-button').addEventListener("change", img.sendImage);
window.localStorage.setItem('endOfChannel', 'false');

// Add listeners to 'Invite User' Modal Form 
document.getElementById('submit-invite-users').addEventListener("click", user.submitInviteUser);
document.getElementById('invite-channel-button').addEventListener("click", user.fillInviteModal);

// Listener for profile edit
document.getElementById('edit-profile-button').addEventListener("click", user.editProfileInfo);
document.getElementById('profile-show-checkbox').addEventListener("click", user.showProfilePassword);
document.getElementById('profile-image').addEventListener("change", user.openFile);

// Listener for the hash change
window.addEventListener("hashchange", reg.hashChange)

/**
* Toggles the side navigation bar
*/
document.getElementById('sidebarCollapse').addEventListener('click', () => {
    const widthString = document.getElementById('sidebar').style.width;
    const widthInt = parseInt(widthString[0]);
    if (widthInt === 0 || isNaN(widthInt) ) {
        if (screen.width < 450) {
            document.getElementById("sidebar").style.width = "200px";
            document.getElementById("content").style.marginLeft = "200px";
            document.getElementById("navbarSupportedContent").style.paddingRight = "200px";

        } else {
            document.getElementById("sidebar").style.width = "250px";
            document.getElementById("content").style.marginLeft = "250px";
            document.getElementById("navbarSupportedContent").style.paddingRight = "250px";
        }    

    } else {
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("content").style.marginLeft= "0";
        document.getElementById("navbarSupportedContent").style.paddingRight = "0";
    }
})

/**
 * Closes alert when 'X' is pressed
 */
document.getElementById('alert-close').addEventListener('click', () => {
    document.getElementById('alert-info').style.display = 'none';
})

/**
 * Toggles the Terms of Service
 */
document.getElementById('page-toggle-service-terms').addEventListener('click', () => {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('prelogin_assets').style.display = 'none';
    document.getElementById('login-heading').style.display = 'none';
    document.getElementById('bubble-container').style.display = 'block';
})



