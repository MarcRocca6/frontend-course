# Author:           Marc Rocca
# Course:           COMP6080 Assignment 2
# Date:             25/10/2021
# Description:      This file utilises OpenAIs GPT-3 engine to create a chat bot that you 
#                   can interact with on the command line.
#                   This program is based off code from the website below.
#                   https://www.twilio.com/blog/openai-gpt-3-chatbot-python-twilio-sms

import os
from dotenv import load_dotenv
import openai

load_dotenv()
openai.api_key = os.environ.get('OPENAI_KEY')
completion = openai.Completion()

start_chat_log = '''
				Human: Hello, who are you?
				AI: I am doing great. How can I help you today?
				'''
def ask(question, chat_log=None):
    if chat_log is None:
        chat_log = start_chat_log
    prompt = f'{chat_log}Human: {question}\nAI:'
    response = completion.create(
        prompt=prompt, engine="davinci", stop=["Human", "\t"], temperature=0.9,
        top_p=1, frequency_penalty=0, presence_penalty=0.6, best_of=1,
        max_tokens=80)
    answer = response.choices[0].text.strip()
    return answer

def append_interaction_to_chat_log(question, answer, chat_log=None):
    if chat_log is None:
        chat_log = start_chat_log
    else:
    	if len(chat_log.split('\n')) > 12: 
    		chat_log = chat_log[-12:].join('\n')
    return f'{chat_log}Human: {question}\nAI: {answer}\n'

if __name__ == "__main__":
	chat_log = None
	while True:
		question = input("")
		answer = ask(question, chat_log)
		print(answer)
		chat_log = append_interaction_to_chat_log(question, answer, chat_log)