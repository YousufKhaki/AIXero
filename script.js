document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const humanizeButton = document.getElementById('humanizeButton');
    const inputWordCount = document.getElementById('inputWordCount');
    const outputWordCount = document.getElementById('outputWordCount');
    
    const maxWords = 500;

    // --- Word Counter Logic ---
    inputText.addEventListener('input', () => {
        const text = inputText.value;
        const words = text.trim().split(/\s+/).filter(Boolean); // Split by whitespace
        
        let wordCount = words.length;
        
        if (text.trim() === "") {
            wordCount = 0;
        }

        inputWordCount.textContent = `${wordCount} / ${maxWords} words`;

        if (wordCount > maxWords) {
            inputWordCount.style.color = '#e74c3c'; // Red
            humanizeButton.disabled = true;
            // Trim the text
            const trimmedText = words.slice(0, maxWords).join(' ');
            inputText.value = trimmedText;
        } else {
            inputWordCount.style.color = '#7f8c8d'; // Default gray
            humanizeButton.disabled = false;
        }
    });

    // --- Humanize Button Logic ---
    humanizeButton.addEventListener('click', async () => {
        const textToHumanize = inputText.value;
        if (textToHumanize.trim() === "") {
            alert("Please enter some text to humanize.");
            return;
        }

        // Show loader and disable button
        const buttonText = humanizeButton.querySelector('.button-text');
        const loader = humanizeButton.querySelector('.loader');
        buttonText.style.display = 'none';
        loader.style.display = 'block';
        humanizeButton.disabled = true;
        outputText.value = "Humanizing... please wait.";

        try {
            // ==========================================================
            // THIS IS THE CRITICAL PART
            // You must replace this with a call to YOUR OWN backend.
            // Your backend will then call the AI API.
            // ==========================================================
            const response = await fetch('/api/humanize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textToHumanize }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Display the result
            outputText.value = data.humanizedText;
            
            // Update output word count
            const outputWords = data.humanizedText.trim().split(/\s+/).filter(Boolean).length;
            outputWordCount.textContent = `${outputWords} words`;

        } catch (error) {
            console.error('Error:', error);
            outputText.value = `An error occurred. Please try again. \n\n${error.message}`;
        } finally {
            // Hide loader and re-enable button
            buttonText.style.display = 'block';
            loader.style.display = 'none';
            // Re-check word count in case it was over limit before
            const words = inputText.value.trim().split(/\s+/).filter(Boolean);
            humanizeButton.disabled = words.length > maxWords;
        }
    });
});
