import { useState } from "react";

export function ProductivityClock() {
  const INCREMENT = "Increment";
  const DECREMENT = "Decrement";
  const SESSION = "session";
  const BREAK = "Break";
  const defaultTimerState = { sessionLength: 25, breakLength: 5 };
  const defaultPlayState = { countdown: false, activeTimer: SESSION };

  let [display, setDisplay] = useState(defaultTimerState);
  let [playState, setPlayState] = useState(defaultPlayState);

  function adjustTimeClickHandler(component, element, state) {
    if (element.innerHTML === INCREMENT) {
      if (component === "SessionTimer") {
        setDisplay(Object.assign({}, display, { sessionLength: (state += 1) }));
      } else {
        setDisplay(Object.assign({}, display, { breakLength: (state += 1) }));
      }
    } else if (element.innerHTML === DECREMENT)
      if (component === "SessionTimer") {
        setDisplay(Object.assign({}, display, { sessionLength: (state -= 1) }));
      } else {
        setDisplay(Object.assign({}, display, { breakLength: (state -= 1) }));
      }
  }

  let sessionTimeInSeconds = display.sessionLength * 60;
  let breakTimeInSeconds = display.breakLength * 60;
  let minutesRemaining = 1;
  let secondsRemaining = 1;

  function handleStartStop(){
    if (playState.countdown === true){
        setPlayState(Object.assign({}, playState, {countdown:false}))
    }else{
        setPlayState(Object.assign({}, playState, {countdown:true}))
    }
  }
    while (playState.countdown === true) {
      if (playState.activeTimer === SESSION) {
        sessionTimeInSeconds--;
        if (sessionTimeInSeconds > 0) {
          minutesRemaining = Math.floor(sessionTimeInSeconds / 60);
          secondsRemaining = sessionTimeInSeconds % 60;
          console.log(minutesRemaining + ":" + secondsRemaining);
        }

        if (playState.activeTimer === BREAK) {
          breakTimeInSeconds--;
          if (breakTimeInSeconds > 0) {
            minutesRemaining = Math.floor(sessionTimeInSeconds / 60);
            secondsRemaining = sessionTimeInSeconds % 60;
            console.log(minutesRemaining + ":" + secondsRemaining);
          }
        }
        setTimeout({}, 1000);
      }
    }
  

  return (
    <>
      <h1>Productivity Clock</h1>
      <SessionTimer display={display} TimeClick={adjustTimeClickHandler} />
      <BreakLength display={display} TimeClick={adjustTimeClickHandler} />
      <section>
        <div id="timer-label">session:</div>
        <div id="time=left">
          {playState.countdown === false
            ? `${display.sessionLength}:00`
            : `${minutesRemaining} : ${secondsRemaining}`}
        </div>
        <button
          id="start-stop"
          onClick={handleStartStop}
          
        >
          Start/Stop
        </button>
        <button id="reset" onClick={() => setDisplay(defaultTimerState)}>
          reset
        </button>
      </section>
    </>
  );
}

export function SessionTimer(props) {
  const SESSION_COMPONENT = "SessionTimer";

  return (
    <div id="session-label">
      <p>Session Length</p>
      <section id="session-length"> {props.display.sessionLength}:00 </section>
      <button
        id="session-increment"
        onClick={() =>
          props.TimeClick(
            SESSION_COMPONENT,
            document.getElementById("session-increment"),
            props.display.sessionLength
          )
        }
      >
        Increment
      </button>
      <button
        id="session-decrement"
        onClick={() =>
          props.TimeClick(
            SESSION_COMPONENT,
            document.getElementById("session-decrement"),
            props.display.sessionLength
          )
        }
      >
        Decrement
      </button>
    </div>
  );
}

export function BreakLength(props) {
  const BREAK_COMPONENT = "BreakTimer";
  return (
    <div id="break-label">
      <p>Break Length</p>
      <section id="break-length"> {props.display.breakLength}:00 </section>
      <button
        id="break-increment"
        onClick={() =>
          props.TimeClick(
            BREAK_COMPONENT,
            document.getElementById("break-increment"),
            props.display.breakLength
          )
        }
      >
        Increment
      </button>
      <button
        id="break-decrement"
        onClick={() =>
          props.TimeClick(
            BREAK_COMPONENT,
            document.getElementById("break-decrement"),
            props.display.breakLength
          )
        }
      >
        Decrement
      </button>
    </div>
  );
}
