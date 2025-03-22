
import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ChevronRight, Clock } from 'lucide-react';

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["WA", "H2O", "W", "HO"],
      correctAnswer: 1
    }
  ];

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  return (
    <section className="section bg-sfu-lightgray">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-6 order-2 md:order-1">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-sfu-black text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs">Interactive Quiz</div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock size={14} />
                  <span>1:45</span>
                </div>
              </div>
              
              <div className="bg-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="pill bg-sfu-red/10 text-sfu-red">Question {currentQuestion + 1}/{questions.length}</div>
                  <div className="flex space-x-1">
                    {questions.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${
                          index === currentQuestion ? 'bg-sfu-red' : 
                          index < currentQuestion ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedOption === index 
                          ? selectedOption === questions[currentQuestion].correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-sfu-red/50'
                      }`}
                      onClick={() => handleOptionClick(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedOption === index && (
                          selectedOption === questions[currentQuestion].correctAnswer
                            ? <CheckCircle size={20} className="text-green-500" />
                            : <XCircle size={20} className="text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedOption !== null
                      ? 'bg-sfu-red text-white hover:bg-sfu-red/90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={selectedOption === null}
                  onClick={handleNextQuestion}
                >
                  Next Question
                </button>
                
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div>Score: 250 pts</div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Time left: 1:45</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-sfu-red/5 rounded-full -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-sfu-red/10 rounded-full -z-10"></div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-6 order-1 md:order-2">
            <div className="inline-block">
              <span className="pill bg-sfu-red/10 text-sfu-red flex items-center gap-2">
                <HelpCircle size={14} /> Interactive Quizzes
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Test Your Knowledge with Engaging Quizzes
            </h2>
            
            <p className="text-gray-600">
              Challenge yourself with our collection of interactive quizzes designed to 
              reinforce learning and make studying more engaging.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Adaptive Learning</h3>
                    <p className="text-gray-600 text-sm">
                      Our quizzes adapt to your performance, focusing more on areas where you need improvement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Timed Challenges</h3>
                    <p className="text-gray-600 text-sm">
                      Race against the clock with timed quizzes that simulate exam conditions and improve recall speed.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center flex-shrink-0">
                    <ChevronRight size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Progress Tracking</h3>
                    <p className="text-gray-600 text-sm">
                      Monitor your improvement over time with detailed analytics and performance tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="px-6 py-3 bg-sfu-red text-white rounded-lg font-medium hover:bg-sfu-red/90 transition-all duration-300">
              Explore All Quizzes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
