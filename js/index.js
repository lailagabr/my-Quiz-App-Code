// https://opentdb.com/api.php?amount=5&category=27&difficulty=easy

let form = document.querySelector("#quizOptions");
let categoryMenu = document.querySelector("#categoryMenu");
let difficultyOptions = document.querySelector("#difficultyOptions");
let questionsNumber = document.querySelector("#questionsNumber");
let mainBtn = document.querySelector("#startQuiz");

let myRow = document.querySelector(".questions .container .row")

let questions ;
let myQuiz ;

mainBtn.addEventListener("click" ,async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;

  myQuiz = new Quiz(category , difficulty , number)
  questions = await myQuiz.getAllQuestions();
  console.log(questions);

  let myQuestion = new Question(0)
  console.log(myQuestion);

  form.classList.replace("d-flex" , "d-none")

  myQuestion.display()


})

class Quiz {
  constructor(category , difficulty , number){
    this.category = category
    this.difficulty = difficulty
    this.number = number
    this.score = 0;
  }

  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`
  }

  async getAllQuestions(){
    let res = await fetch(   this.getApi()      )
    let data = await res.json();

    return data.results;
  }

  showResult() {
    return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">
        ${
          this.score == this.number
            ? `Congratulations 🎉`            //true
            : `Your score is ${this.score}`   //false
        }
        </h2>
        <button class="again btn btn-warning rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }                        //gwa el quiz

}

class Question {
  constructor (index) {
    this.index = index;
    this.question = questions[index].question;
    this.difficulty = questions[index].difficulty;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.category = questions[index].category;
    this.myAllAnswers = this.getAllQuestions();
    this.isAnswered = false
  }

  getAllQuestions(){
    let allAnswers = [ ...this.incorrect_answers , this.correct_answer]
    allAnswers.sort();

    return allAnswers
  }

  display() {
    const questionMarkUp = `
      <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
      >
      <div>
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category"> ${this.category} </span>
          <span class="fs-6 btn btn-questions">${this.index + 1} of ${questions.length} </span>
        </div>
        </div>
        <h2 class="text-capitalize h4 text-center"> ${ this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.myAllAnswers
              .map( (answer) => `<li> ${answer} </li>`)
              .toString()                                     
                                      // 3shan hia array f mafsool mabeen kol wahda b comma 
              .replaceAll("," , "")
            }
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: 
        ${myQuiz.score}
        </h2>        
      </div>
    `;

    myRow.innerHTML = questionMarkUp;

    let allChoices = document.querySelectorAll(".choices li");

    allChoices.forEach((li) => {
      li.addEventListener("click" , () => {
        this.checkAnswer(li);

        this.nextQuestion()
      })
    })

  }

  checkAnswer(choice){
                                        //mt3arafa fo' b false
    if(!this.isAnswered){
      this.isAnswered = true          //   awl maratrue tany mara haila'ha false msh hatshta8al m3a 

                                       // trim 3shan fi space ablo w b3do f kan mtala3 kolo false 
      if (choice.innerHTML.trim() == this.correct_answer) {
        choice.classList.add("correct" , "animate__animated" , "animate__pulse")
        myQuiz.score++;
      }else {
        choice.classList.add("wrong" , "animate__animated" , "animate__shakeX")
        
      }
    }
  }

  nextQuestion(){
    this.index++

    setTimeout(() => {                                        //3shan allha' ashof sah wla 8lt 
      if(this.index < questions.length){
        let myNewQuestion = new Question(this.index)

        myNewQuestion.display()
      }else{
        let result = myQuiz.showResult();
        myRow.innerHTML = result;

        document.querySelector(".question .again").addEventListener("click" , function () {
          window.location.reload()                        //3shan ybda' mn elawl
        })
      }
    }, 2000);
  }
}