import { useState } from "react";

export function ProductivityClock() {
  const INCREMENT = "Increment";
  const DECREMENT = "Decrement";
  const SESSION = "Session";
  const BREAK = "Break";

  const defaultTimerState = { sessionLength: 25, breakLength: 5 };
  const defaultPlayState = {
    countdown: false,
    activeTimer: SESSION,
    timerID: 0,
  };

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

  //TODO: Refactor clockCountdown to return minutesRemaining and secondsRemaining, and pass in break/sessionTimeInSeconds as arguments
  let sessionTimeInSeconds = display.sessionLength * 60;
  let breakTimeInSeconds = display.breakLength * 60;
  let minutesRemaining = 0;
  let secondsRemaining = 0;

  function clockCountdown() {
    if (playState.activeTimer === SESSION) {
      if (sessionTimeInSeconds > 0) {
        sessionTimeInSeconds--;
        minutesRemaining = Math.floor(sessionTimeInSeconds / 60);
        secondsRemaining = sessionTimeInSeconds % 60;
        console.log(minutesRemaining + ":" + secondsRemaining);
        this.forceUpdate();
      }
      if (sessionTimeInSeconds === 0) {
        setPlayState(Object.assign({}, playState, { activeTimer: BREAK }));
        sessionTimeInSeconds = display.sessionLength * 60;
      }
    }
    if (playState.activeTimer === BREAK) {
      if (breakTimeInSeconds > 0) {
        breakTimeInSeconds--;
        minutesRemaining = Math.floor(breakTimeInSeconds / 60);
        secondsRemaining = breakTimeInSeconds % 60;
        console.log(minutesRemaining + ":" + secondsRemaining);
        this.forceUpdate();
      }
      if (breakTimeInSeconds === 0) {
        setPlayState(Object.assign({}, playState, { activeTimer: SESSION }));
        breakTimeInSeconds = display.sessionLength * 60;
      }
    }
  }

  // function activateTimer(){
  //    return setInterval(() => clockCountdown(), 1000);
  // }
  // function stopTimer() {
  //   clearInterval();
  // }

  let id = [];
  function startStopClickHandler() {
    if (playState.countdown === false) {
      id = setInterval(() => clockCountdown(), 1000);
      setPlayState(
        Object.assign({}, playState, { countdown: true, timerID: id })
      );
    } else {
      setPlayState(Object.assign({}, playState, { countdown: false }));
      clearInterval(playState.timerID);
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
        <button id="start-stop" onClick={startStopClickHandler}>
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
