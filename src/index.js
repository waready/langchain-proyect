import { RemoteRunnable } from '@langchain/core/runnables/remote';

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('sendRequest');
    const responseElement = document.getElementById('response');
    const inputMessage = document.getElementById('inputMessage');
    const loader = document.getElementById('loader');

     // Inicializar el historial de chat vacío
     let chatHistory = [];

    button.addEventListener('click', async () => {
        
        const url = 'https://asistentes.greenocean-0987f6e5.eastus2.azurecontainerapps.io:443/API';
        const message = inputMessage.value.trim(); 

        if (!message) return;

        // Añadir el mensaje del usuario al historial de chat
        chatHistory.push({ role: "user", content: message });


        const data = {
            input: message,
            chat_history: chatHistory
        };

        const remoteChain = new RemoteRunnable({
            url: url
        });

        showLoader();

        try {
            const result = await remoteChain.invoke(data);
            console.log(result)
            //responseElement.textContent = JSON.stringify(result, null, 2);
            //renderResponse(result);
            if (result && result.output) {
                // Añadir la respuesta de la IA al historial de chat
                chatHistory.push({ role: "assistant", content: result.output });
                renderResponse(result.output);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Ocultar el loader cuando se completa la solicitud (con éxito o error)
            hideLoader();
            inputMessage.value = '';
        }
    });

    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    function renderResponse(message) {
        // Limpia el contenido anterior del contenedor de respuesta
        responseElement.innerHTML = '';

        // Mostrar solo el valor de output
        if (message) {
            console.log("message -> ", message)
            const outputValue = message;
            const outputElement = document.createElement('div');
            //outputElement.classList.add('message'); // Agrega una clase si deseas estilizar el mensaje
            outputElement.textContent = outputValue;
            responseElement.appendChild(outputElement);
        } else {
            responseElement.textContent = 'No se encontró ningún resultado válido.';
        }
    }
});

