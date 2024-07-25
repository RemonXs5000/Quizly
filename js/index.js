// getting Dom Elements
const CategorySelector = document.querySelector('#categoryMenu'); 
const DifficultySelector = document.querySelector("#difficultyOptions");
const QuestionNumber = document.querySelector('#questionsNumber');
const StartQuizBtn  = document.querySelector("#startQuiz");
const Form = document.querySelector('#quizOptions'); 
const rowData = document.querySelector('#rowData');
let quizQuestions = [] ; 
let myQuiz = {} ;


StartQuizBtn.addEventListener("click" ,  async () => {
    let values = {
        category : CategorySelector.value,
        difficulty : DifficultySelector.value,
        questionsN : QuestionNumber.value
    }

    // getting Instences of class Quiz then fetching data from the API
    myQuiz =  new Quiz(values) ; 
    quizQuestions = await myQuiz.getQuestions();
    myQuiz.hideFrom();
    console.log(quizQuestions); 
    // getting instence of class Questions and setting the index to zero to get the 1st Question Returned from API
    let MyQuestions = new Questions(0);
    MyQuestions.displayQuestions();
    console.log(MyQuestions); 

})


class Quiz {
    constructor({category , difficulty , questionsN}){
        this.score = 0 ;
        this.category = category ,
        this.difficulty = difficulty,
        this.questionsN = questionsN
    }
    getQuestions = async ()=> {
        try{
            let payload = await fetch(`https://opentdb.com/api.php?amount=${this.questionsN}&category=${this.category}&difficulty=${this.difficulty}`);
            let data = await payload.json();
            return data.results ; 
        }
        catch(error){
            console.log(error) ;
        }
    }
    hideFrom = ()=> {
        Form.classList.replace("d-flex","d-none")
    }
    ShowResults =()=>{
       rowData.innerHTML =
       `
         <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0 text-center">
            ${this.score == quizQuestions.length ? `Congratulations! 🎉` : `Better luck next time, You answered ${this.score} out of ${quizQuestions.length} questions!`}
        </h2>
            <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        </div>
        `
        const AgainBtn = document.querySelector('.again');
        AgainBtn.addEventListener('click',()=>{
            window.location.reload();
        })

    }
}

class Questions {
    constructor(i){
        this.index = i ;  
        this.category = quizQuestions[i].category;
        this.difficulty= quizQuestions[i].difficulty;
        this.question = quizQuestions[i].question;
        this.correctAnswer = quizQuestions[i].correct_answer;
        this.incorrectAnswer  = quizQuestions[i].incorrect_answers;
        this.allAnswers = this.compineAnswer();
        this.isAnswered = false;  
    }

    compineAnswer =()=>{
        let allAnswers =[...this.incorrectAnswer , this.correctAnswer].sort();
        return allAnswers ;
    }


    displayQuestions = ()=> { 
        rowData.innerHTML =
    `
    <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        <div class="w-100 d-flex justify-content-between">
        <span class="btn btn-category">${this.category}</span>
        <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${quizQuestions.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.allAnswers.map((answer) => `<li>${answer}</li> `).toString().replaceAll(",","")}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${myQuiz.score}</h2>
    </div>
    ` ;
        let choices = document.querySelectorAll(".choices li") ;
        choices.forEach((choice)=> {
           choice.addEventListener("click" ,()=>{
            this.checkAnswer(choice)
           })
        })
    }
    checkAnswer = (answer)=> {
        if(this.isAnswered === false){
            this.isAnswered = true ; 
            if(answer.innerHTML == this.correctAnswer){
                myQuiz.score++ ;
                answer.classList.add("correct");
            }
            else{
                answer.classList.add("wrong")
            }
            this.showNextQuestion(); 
        }
    }
    showNextQuestion = () => {
        this.index++ ;
        if(this.index < quizQuestions.length){
              setTimeout(() => {
            let NextQuestion = new Questions(this.index); 
            NextQuestion.displayQuestions(); 

        }, 1000); 
        }else{
           myQuiz.ShowResults(); 
        }
    }
}