import React from 'react';
import Results from './Results';
import FingerGuide from './FingerGuide';
export var userResults = {
  speed: 0,
  accuracy: 0,
  errors: 0,
  elapsedTime : 0,
  words: 0,
}




export class Controller extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        sampleIndex : 0,
        data : false,
        ready: false,
      };
      this.startTime = 0;
      
      
    }

    componentDidMount()
    {
      //console.log('entered mount function')
      //document.getElementById('results').style.display = 'none';
      this.setState({
        data: false,
        sampleIndex: 0,
      })

      this.div = document.getElementById('controller');
      //adding event listeners
      this.div.addEventListener('blur',this.controllerHandleBlur);
      this.div.addEventListener('click',this.controllerClickHandler);
      this.div.addEventListener('keypress',this.handleKey);
      this.div.addEventListener('keydown',this.handleKeydown);


    }

    componentWillUnmount()
    {
      this.render();
    }
  
    shiftCursor = pos =>
    {
      // shifts the cursor when text is typed
        let division = document.getElementById('sampBox');
        division.children[pos].classList.add('activeSpan');
        if (this.state.sampleIndex  !== 0)
        {
          division.children[pos - 1].classList.remove('activeSpan');
          division.children[pos - 1].classList.add('typedSpan');
        }
    }


    handleKeydown = event => {
     ///event.preventDeafault();
        if (event.keyCode === 9) {
          event.preventDefault();
          this.handleKey(event);
        }

      }
        
  


    handleKey = event =>
    {
      // handle key event on the controller component
      event.preventDefault();
      if((this.state.sampleIndex === this.props.sampleText.length - 1))
        {
          // end of sample computing time
          this.ready = false;
          this.computeSampleSpeed();

          //removing event listeners
          this.div.removeEventListener('blur',this.controllerHandleBlur);
          this.div.removeEventListener('click',this.controllerClickHandler);
          this.div.removeEventListener('keydown',this.handleKeydown);

          this.div.removeEventListener('keypress',this.handleKey);

          document.getElementById('sampBox').style.display = 'none';
          

          this.setState({
            data: true,
            sampleIndex: 0,
            ready: false,
          })

          return;
        }

        //auto-scroller
        if (event.keyCode === 13 && this.props.sampleText.charCodeAt(this.state.sampleIndex) === 9166)
        {
          let ele = document.getElementById('sampBox').children[this.state.sampleIndex];
          ele.scrollIntoView();
        }


        
        console.log(` typed - ${String.fromCharCode(event.keyCode)} code - ${event.keyCode} \nExpected - ${this.props.sampleText[this.state.sampleIndex]}  code -  ${this.props.sampleText.charCodeAt(this.state.sampleIndex)}` );
      
      
      
        if( (String.fromCharCode(event.keyCode) === this.props.sampleText[this.state.sampleIndex]) 
              || (event.keyCode === 13 && this.props.sampleText.charCodeAt(this.state.sampleIndex) === 9166)
              || (event.keyCode === 9 && this.props.sampleText.charCodeAt(this.state.sampleIndex) === 8633) )
      {

        
        if(this.state.sampleIndex === 0)
          this.startTimer();// starting timer
  
        this.setState({
          sampleIndex : this.state.sampleIndex + 1,
        });
  
        this.shiftCursor(this.state.sampleIndex);
        
        
      }
      else{
        //wrong key entered
        let pos = this.state.sampleIndex;
        document.getElementById('sampBox').children[pos].classList.add('error');
        setTimeout( () => {
          document.getElementById('sampBox').children[pos].classList.remove('error');
        }, 100);

        userResults.errors++;
      }
    }
  
    controllerClickHandler = () => {
      // handles click of controller
      // activates text
      this.setState({
        ready: true,
      })
      document.getElementById('sampBox').children[0].classList.add('activeSpan');
      document.getElementById('controller').children[0].innerHTML = '';
    }
  
     controllerHandleBlur = () => {
      // handles loosing focus
      let i;
      for(i = 0;i<this.state.sampleIndex;i++)
        document.getElementById('sampBox').children[i].classList.remove('typedSpan');
      document.getElementById('sampBox').children[i].classList.remove('activeSpan');
  
      this.setState({
        sampleIndex : 0,
        ready: false,
      });

      document.getElementById('controller').children[0].innerHTML = 'Click to start';
      userResults.errors = 0;

     }
  
     startTimer = () => {this.startTime = new Date()} //starts timer
  
     computeSampleSpeed = () => {
      
      userResults.elapsedTime = (new Date() - this.startTime) / 1000;
      userResults.words = (this.props.sampleText.length - 1)/5;
      userResults.speed = Math.round(userResults.words/(userResults.elapsedTime/60));
      userResults.accuracy = Math.round(this.props.sampleText.length / (this.props.sampleText.length + userResults.errors)*100);
    
      console.log(`${JSON.stringify(userResults)}`);
   
     }
  
     render()
      {
        
        return (
          <div key = 'res' id='result'>
        <div id = 'controller' tabIndex = '0' style = { {backgroundColor : '#28abb9', fontFamily: 'monospace', fontSize: 22} } >
          <center>Click to start</center>
        </div>
          <Results userResults = {userResults} data = {this.state.data}/> 
          <FingerGuide letter={this.state.ready ? this.props.sampleText[this.state.sampleIndex]: '⎈' } />
        </div>
        );
      }
  }
  
