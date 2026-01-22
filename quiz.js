const timerElement = document.getElementById('timer');
  const totalTime = 30 * 60; // 30 minutes in seconds
  let timeLeft = totalTime;
  let timerInterval;

  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerElement.innerText = "00:00";
        submitQuiz(); // Auto-submit when time is up
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Formatting with leading zeros
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.innerText = formattedTime;

    // Visual feedback for low time
    if (timeLeft < 60) {
      timerElement.classList.add('danger'); // Red pulsing
    } else if (timeLeft < 300) { // Less than 5 mins
      timerElement.classList.add('warning'); // Yellow/Orange
    }
  }

  // --- Quiz Logic ---
  function submitQuiz() {
    // Stop timer if manually submitted
    clearInterval(timerInterval);

    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');
    const scoreText = document.getElementById('scoreText');
    const scoreMessage = document.getElementById('scoreMessage');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Find all questions
    const questions = form.querySelectorAll('.question');
    let score = 0;


    questions.forEach((questionDiv) => {

      const selectedOption = questionDiv.querySelector('input[type="radio"]:checked');
      const correctInput = questionDiv.querySelector('input[data-correct="true"]');

    
      const allInputs = questionDiv.querySelectorAll('input[type="radio"]');
      allInputs.forEach(input => input.disabled = true);

      if (selectedOption) {
        // Check if the selected one is correct
        if (selectedOption.hasAttribute('data-correct')) {
          score++;
          // Highlight the selected label green
          selectedOption.parentElement.classList.add('correct-answer');
        } else {
          // Highlight the selected label red
          selectedOption.parentElement.classList.add('wrong-answer');
          // Highlight the correct label green
          if (correctInput) {
            correctInput.parentElement.classList.add('correct-answer');
          }
        }
      } else {
        // User didn't answer, show correct answer
        if (correctInput) {
          correctInput.parentElement.classList.add('correct-answer');
        }
      }
    });

    // Update Result Text
    scoreText.innerText = `${score} / 30`;
    
    // Personalized Message based on percentage
    const percentage = (score / 30) * 100;
    if (percentage === 100) {
      scoreMessage.innerText = "Perfect! You are a master of programming.";
    } else if (percentage >= 80) {
      scoreMessage.innerText = "Excellent work! You know your stuff.";
    } else if (percentage >= 50) {
      scoreMessage.innerText = "Good job! Keep practicing.";
    } else {
      scoreMessage.innerText = "Don't give up! Review the topics and try again.";
    }

    // Hide Submit Button and Show Result
    submitBtn.style.display = 'none';
    resultDiv.style.display = 'block';

    // Scroll to bottom of results
    resultDiv.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Add simple interactivity: Highlight label on check
  const allRadios = document.querySelectorAll('input[type="radio"]');
  allRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Remove 'selected' class from siblings (same name)
      const name = this.name;
      const siblings = document.querySelectorAll(`input[name="${name}"]`);
      siblings.forEach(sib => {
        if(sib.parentElement) sib.parentElement.classList.remove('selected');
      });
      // Add 'selected' class to current parent
      this.parentElement.classList.add('selected');
    });
  });

  // Start the timer when page loads
  startTimer();