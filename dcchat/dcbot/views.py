from django.shortcuts import render
from django.http import JsonResponse
from . import process
import json

import logging 
logger = logging.getLogger(__name__)

# Create your views here.

def home(request):
    return render(request,'index.html')

def chatbot(request):
    if request.method == "POST":
        logger.info('started service')
        body_bytes = request.body
        body_str = body_bytes.decode('utf-8')
        body_dict = json.loads(body_str)
        message = body_dict.get('message')
        bot_response = process.process_input(message)
        response = JsonResponse({'bot_response': bot_response})
        response['Access-Control-Allow-Origin'] = '*'
        return response
    else:
        logger.info('in problem')
        response = JsonResponse({'bot_response': 'Get Requests Not Allowed.'})
        response['Access-Control-Allow-Origin'] = '*'
        return response

def handler404(request, exception):
    return render(request, '404.html', status=404)

