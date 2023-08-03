/* ---- particles.js config ---- */


  

document.addEventListener("DOMContentLoaded",function(e){
    let chatbotName="";
    let chatLog=document.getElementById("chat-log");
    let scrollPosition=0;
    let sendBtn=document.getElementById("send-btn");
    let userInput=document.querySelector(".user-input");

    let clearBtn=document.getElementById("clear-btn");
   // const maxInputLength=10;
    const readCurrentMessage=document.getElementById("message-reader-btn");
    const readAllMessages=document.getElementById("conversation-reader-btn");


    function showWelcomeMessage(chatName){
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = `Welcome to ${chatName}! How can I assist you today? This Bot is created by `;
        
        const link = document.createElement('a');
        link.href = 'https://karandeepsingh.tech'; // set the href attribute
        link.textContent = 'Karandeep Singh'; // set the link text
        link.target = '_blank'; // set the target attribute to open the link in a new tab
        
        welcomeMessage.appendChild(link); // append the link to the welcomeMessage element
    }
function generateChatbotName(){
    const adjectives=["Amazing DC ","Brilliant DC","Creative DC","Dynamic DC","Energetic DC"];
    const nouns=["Bot","Assistant","Companion","Guide","Helper"];

    const randomAdjective=adjectives[Math.floor(Math.random()*adjectives.length)];
    const randomNoun=nouns[Math.floor(Math.random()*nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
    
}



function setChatBotName(){
    chatbotName=generateChatbotName();
    document.querySelector(".chatbot-name").textContent=chatbotName;
    document.title=chatbotName;
    showWelcomeMessage(chatbotName);
}

setChatBotName();

clearBtn.addEventListener("click",function(){
    clearChatHistory();
    displayMessage("received",`Welcome to ${chatbotName}! How can I assist you today?`);
})

function clearChatHistory(){
    while(chatLog.firstChild){
        chatLog.firstChild.remove();
    }
}


sendBtn.addEventListener("click",async function(){
   let userMessage=userInput.value.trim();
   if(userMessage !==""){
      if(!checkInternetConnection()){
        displayMessage("error","Sorry,you are offline.Please check your internet connection");
        return;
      }else{
            try {
            displayMessage("sent",userMessage); 
            let response=await sendChatMessage(userMessage);
            if(response){
                displayMessage("received",response);
                scrollChatLog();
            }
        } catch (error) {
            console.error(error);
            displayMessage("error","Error:Failed to fetch response from the Server");
        }
    
      }     
   }
})

async function sendChatMessage(message){
    const csrfToken = document.querySelector('#csrf_token').value;
    const chatbotUrl = document.querySelector('#chatbot-url').value;
    if (message!==""){
    showLoadingIndicator();
    try {
        let response=await fetch(chatbotUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({'message': message}),
        });
        let responseData=await response.json();
        console.log(response.json()) 
        if(responseData.bot_response.length>0){
            let botResponse=responseData.bot_response;
            hideLoadingIndicator();
            displayMessage("received",botResponse);
            userInput.value='';

        }
    } catch (error) {
        displayMessage("error","Sorry an error occurred.Please try again!");
    }
}}


userInput.addEventListener("keypress",function(event){
    if(event.key==="Enter"){
        sendBtn.click();
        userInput.value="";
    }
})
userInput.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
        sendBtn.click();
        userInput.value="";
    }
})

  

  function readMessage(message){
    if(window.speechSynthesis && typeof SpeechSynthesisUtterance==="function"){
        const speechSynthesis=window.speechSynthesis;

        const utterance=new SpeechSynthesisUtterance(message);

        const result=speechSynthesis.speak(utterance);

        if(result===null){
            displayMessage("error","Speech synthesis failed");
        }

    }else{
        displayMessage("error","Invalid Message or unsupported browser")
    }
  }

  function handleReadCurrentMessage(){
    const currentMessage=document.querySelector(".message:last-child");
    if(currentMessage){
        const message=currentMessage.textContent;
        readMessage(message);
    }
  }

  readCurrentMessage.addEventListener("click",handleReadCurrentMessage);

  function handleReadAllMessages(){
    const chatMessages=document.getElementsByClassName("message");
    const messages=Array.from(chatMessages).map(message => message.textContent);
    messages.forEach(message => readMessage(message));
  }

  readAllMessages.addEventListener("click",handleReadAllMessages);

 window.addEventListener("beforeunload",()=>{
    if(window.speechSynthesis.speaking){
        window.speechSynthesis.cancel();
    }
 })

 function displayMessage(type,message){
    let messageContainer=document.createElement("div");
    messageContainer.classList.add("message",type);
    let messageText=document.createElement("p");
    messageText.textContent=message;
    messageContainer.appendChild(messageText);
    chatLog.appendChild(messageContainer);
    chatLog.scrollTop=chatLog.scrollHeight;
 }

 function checkInternetConnection(){
    return navigator.onLine;
 }
 
 function showLoadingIndicator(){
    document.getElementById("loading-indicator").style.display = "flex";
 }

 function hideLoadingIndicator(){
    document.getElementById("loading-indicator").style.display = "none";
 }

 function scrollChatLog(){
    let isScrolledToBottom=chatLog.scrollHeight - chatLog.clientHeight <= chatLog.scrollTop + 1;

    chatLog.scrollTop=chatLog.scrollHeight;
    if(isScrolledToBottom){
        restoreScrollPosition();
    }
 }

 function restoreScrollPosition(){
    chatLog.scrollTop=scrollPosition;
 }


 // Get references to voice input/output elements
 const voiceInputButton = document.getElementById('voice-btn');

// Add event listener for voice input button
 voiceInputButton.addEventListener('click', startVoiceInput);

 // Start voice input
 function startVoiceInput() {
 // const recognition = new webkitSpeechRecognition();
 const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
 recognition.lang = 'en-US';
   
 // Event listener for voice input
 recognition.onresult = function(event) {
     // const transcript = event.results[0][0].transcript;
     const transcript = event.results[event.results.length - 1][0].transcript;
     if (transcript.trim() !== "") {
       processVoiceInput(transcript);
       // provideUserFeedback("Your message has been received!");
     }
     
 };

 recognition.onerror = function(event) {
     console.error(event);
     fallbackToTextInput();
 };

 recognition.start();
 }

 // Fallback to text input
 function fallbackToTextInput() {
     userInput.focus();
 }
 // Process voice input
 function processVoiceInput(transcript) {
 userInput.value = transcript;
 handleUserInput();
 }

    // Handle user input
    function handleUserInput() {
     const message = userInput.value;
     if(message.length > 0) {
         sendBtn.click();
         userInput.value="";
     }
 }
})


// javascript for cookies 
setTimeout(function() {
    var banner = document.querySelector('.cookie-consent-banner');
    banner.parentNode.removeChild(banner);
  }, 5000);


  // particles 

  
  
