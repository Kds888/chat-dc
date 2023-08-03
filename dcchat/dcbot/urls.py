from django.urls import path

from . import views



app_name = 'dcbot'

urlpatterns=[
    path('chat/',views.chatbot,name='chatbot'),
    path('',views.home,name='home'),
]