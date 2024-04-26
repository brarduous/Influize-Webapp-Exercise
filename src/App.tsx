import React, { DOMElement, useEffect, useState } from 'react';
import './App.css';
import {advanceStep, createSession, getActiveSessions, getAllSteps, getCurrentStep, getStep, sendStepResults} from './api/influizeAPI';
import { getCategories } from './data/categories';
import CategoryButton from './components/CategoryButton/CategoryButton';


function App() {
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState<any>(0);
  const [steps, setSteps] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const [stepData, setStepData] = useState<any>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = getCategories();
  
  //get session if one hasn't been set
  useEffect(()=>{
    createSession(1).then((data)=>{
      setSession(data.session.session_id);
      setUser(data.session.user_id);
    });
  }, []);

  useEffect(()=>{
      if(session !== null){
        getCurrentStep(session).then((data)=>{
          
          if(data.current_step_number === 0){
            advanceStep(session);
            setStep(1);
          }
        });
      }
    }, [session]);  

    useEffect(()=>{
      if(session !== null){
        getAllSteps(session).then((data)=>{
          let steps = data.session_info;
          steps.sort((a:any, b:any)=>{
            return a.step_num - b.step_num;
          });
          setSteps(steps);
          console.log(steps);
        });
      }
      
    }, [session]);

    useEffect(()=>{
      if(session !== null && step > 0){
        //get step data for current step
        getStep(session, step).then((data)=>{
          const stepData = data;
          setStepData(stepData);
          setLoading(false);
        });
      }
    }, [session, step]);
    
  //function to add selected categories to the session
  function processCategories(){
    window.scrollTo(0, 0);
    setLoading(true);
    let selectedCategories = document.querySelectorAll('.category.selected');
    let categoryIds: object[] = [];
    selectedCategories.forEach((category)=>{
      if(category instanceof HTMLElement){
        let categoryProps = {"suggestion_id": category.id, "text": category.getAttribute('data-text'), "subtext": category.getAttribute('data-subtext')};
        categoryIds.push(categoryProps);
      }
      category.classList.remove('selected');
    });

    //build dictionary file to pass to compatible api variable
    let categoryDict = {"selections": categoryIds};

    //add the selected categories to the session
    sendStepResults(session, step, categoryDict).then((data:any)=>{
      //advance to the next step
      advanceStep(session).then((data)=>{
        handleStepChange();
      }); 
    }); 
  }

  //function to handle step changes
  function handleStepChange(){
    
    if(step < steps.length){
      getStep(session, step+1).then((data)=>{
        const stepData = data;
        setLoading(false);
        setStep(step+1);
        setStepData(stepData);
      });
    }else{
      setOnboardingComplete(true);
      setLoading(false);
    }
  }

  //handle category selection and min/max selections
  window.addEventListener('categorySelected', (e:any)=>{
    let selectedCategories = document.querySelectorAll('.category.selected');
    let message = document.getElementById('message');
    if(stepData){
      if(selectedCategories.length >= stepData.step.min_selection){
        document.getElementById('next')?.classList.remove('disabled');
        if(message){
          message.innerHTML = "";
        }
        if(selectedCategories.length > stepData.step.max_selection){
          document.getElementById('next')?.classList.add('disabled');
          if(message){
            message.innerHTML = `Please make no more than ${stepData.step.max_selection} selections`;
          }
        }
      }else{
        document.getElementById('next')?.classList.add('disabled');
        
        if(message){
          message.innerHTML = `Please make at least ${stepData.step.min_selection} selection`;
        }
      }
    }
  });
  if(loading){
    
    let currentStep = step;
    if(stepData == null){
      currentStep = 0;
    }
    return(
      <div className="App container">
        <div className="row">
          <div className="col-12">
          <svg className="loading-animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="#3c3863" strokeWidth="15" strokeLinecap="round" strokeDasharray="300 385" strokeDashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"><animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg>
          </div>
          {step<steps.length &&
            <div className="col-12 mt-5">
              <h1>{steps && 'Next Step: ' + steps[currentStep].instruction_copy}</h1>
              <p>{steps && steps[currentStep].subtext_copy}</p>
            </div>
          }
          
        </div>
      </div>
    )
  }
  //return the correct page based on the current session step in the onboarding process
  if(onboardingComplete){
    return(
      <div className="App container">
        <div className="row">
          <div className="col-12">
            <h1>Onboarding Complete</h1>
            <p>Thank you for completing the onboarding process</p>
          </div>
        </div>
      </div>
    )
  }
  else if(step>0 && stepData !== null){
    
    return(
      <div className="App container">
        <div className="row">
          <div className="col-12">
            <h1 className="">{stepData.step.instruction_copy}</h1>
            <p className=' py-2'>{stepData.step.subtext_copy}</p>
          </div>
        </div>
        <div className="row">
          <div className="categories col-12 py-5">
            {stepData.interaction.suggestions && stepData.interaction.suggestions.map((category: any, index: any)=>{
              //return a category button for each category in the returned array
              return <CategoryButton step={stepData.interaction.step_num} key={index} category={category} />
            })}
          </div>
        </div>
        <div className="row">
          <div id="message" className="col-12 py-3">Please make at least {stepData.step.min_selection} selection</div>
          <div className="col-12">
            <button id="next" onClick={processCategories} className="btn btn-primary">Next</button>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="App">
      
    </div>
  );
}

export default App;
