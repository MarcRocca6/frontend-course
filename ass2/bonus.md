# 4 Mini-Projects were implemented for this BONUS section

    * OpenAI Chatbot
    * Login-Page Fading Images
    * Port Forwarding
    * Usability Review

<br /><br />

# OpenAI Chatbot

After being locked-away in lock-down stuck working for many many hours in my room I felt like having someone to both chat too and someone to test out my website on. Luckily, like most other problems in my life, the answer to this could be solved with programming by creating a chat-bot. I felt that especially during lock-down, a lot more people were feeling like having someone to chat too and so a website with an AI chatbot seemed to like a good fit. I had heard many exciting things in the world of AI coming from OpenAI and so I was excited to see if I could utilise their GPT-3 engine to create a chatbot.

The initial concept for this idea was to have a chat-bot that you could interact with in the website and that would react to messages and respond in real time. The code I used to interact with the GPT-3 engine is based off code from [Twilio](https://www.twilio.com/blog/openai-gpt-3-chatbot-python-twilio-sms). The code for this chatbot can be found in the file bonus/chatbot.py. To run this chat bot, simply execute the file using python3 and enter in a query followed by the enter key. The chatbot will elicit a response and then the user is able to write another query.

```
python3 chatbot.py
Hey. Do you have any favourite food places in Sydney? I'm in city and need something to eat.
```

Unfortunetly a project like this is much better suited to be set up in the backend of a website, as opposed to the front end. I faced much difficulty running this on the frontend only. At first I tried converting the python file to an executable and then having the file called by Javascript and the response captured however this did not work. I also tried rewriting the code in Javascript, however I was only able to rewrite this code in nodeJS and was able to get this working on the client-side. Other methods were also experimented with such as converting the python code directly into Javascript using JavaScripthon and Brython however they were not successtful. 

Ultimately I was unable to implement this chatbot on the client-side however if I was allowed to modifiy the backend I could have the backend return a response from a HTTP request that would be received by the frontend and displayed on the website.

<br /><br />

# Login-Page Fading Images

CSS animations were experimented with to create a fading in and fading out of a variety of images in the login page of the website. This was done as it was thought that this was a page that reoccuring users would regularly see and so having some variety in this page such as a random change fading image would help to keep the experience feeling new and different.

<br /><br />

# Port Forwarding

Port Forwarding was incorporated into this project as to allow this website to be hosted publically.

To achieve this requests that were made by the frontend were changed from: http://localhost to http://PublicIP where PublicIP was the public IP address of the network. 

Then port forwards were established on the Google Wifi Network and the Telstra Router to redirect requests to both the backend at port 5005 and the frontend at port 3000.

<br /><br />

# Usability Review 

This section details the usability test that was taken a few users to determine how best to optimise and improve the functionality and usability of the website.  

* #### Log into the website. If you have not created an account, create an account first and then log in. 
User initially found it hard to locate the Registration button. It was expected that after registering, the user would then be automatically logged into their account instead of having to register, and then navigate to the login page to gain access to the site. 
To resolve these issues, the Registration button and Login buttons were enlarged, given a contrasting colour to the background, and given an icon.

* #### Open the “Picnic” channel and send a message.
The user easily found the channel section, however when completing this task on smaller sized screens the channel section took up too much of the page making the overall experience feel cluttered. Therefore, a dynamic sidebar was added that was able to appear and then disappear when needed as to provide more space to show content. 
After receiving an Error that the user was not part of the channel, they were unsure of how to join the channel. To resolve this issue, the channel buttons were moved to appear at the top of the page with contrasting colours. 

* #### React to Nate’s message. Then pin James’ message and view all the pinned messages.
The user was able to easily react to a message. It was less unclear about what the pin buttons did and how to determine if one was selected or not. Therefore, to resolve this issue, the pin buttons were changed to an icon of a pin and made so that if a message was already pinned the pin button appeared red. The “Pinned” button to view all pinned messages was initially hard to find as it was located at the top of the page.

* #### Invite John to the “Picnic” channel. 
Initially the user went to the” Edit Channel” page of the site and when she was unable to find the “Invite” button then looked at the sidebar where she found it. In the future one could add an invite button to the “Edit Channel” page to make this experience more seamless. 

* #### Upon the Push Notification being activated, the user was asked if she noticed any changes in the page and what she thought those changes meant.
The user did not notice that a Bell icon had been added to the page. She understood that that icon referred to a notification, but she did not know of what. To resolve this issue the Bell icon was enlarged and, in the future, push notifications should be able to update the chat messages directly and offer a click option where the user can click the notification icon and review what caused that notification. 

* #### Create a new channel for your friend birthday party planning.
The create channel button was easily found when the sidebar was open, however when the sidebar was closed, users found it difficult to find. In the future, more buttons could be moved to the top navigation bar and away from the sidebar to resolve this issue.
