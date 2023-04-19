import { useEffect, useState } from "react";

export function ProductivityClock() {
  const INCREMENT = "Increment";
  const DECREMENT = "Decrement";
  const SESSION = "Session";
  const BREAK = "Break";

  const defaultTimerState = { sessionLength: 1, breakLength: 5 };
  let [timer, setTimer] = useState(defaultTimerState);

  const defaultDisplayState = {
    minutesRemaining: timer.sessionLength,
    secondsRemaining: "00",
  };
  let [displayState, setDisplayState] = useState(defaultDisplayState);

  const defaultPlayState = {
    countdown: false,
    activeTimer: SESSION,
    timerID: 0,
  };
  let [playState, setPlayState] = useState(defaultPlayState);

  function adjustTimeClickHandler(component, element, state) {
    if (element.innerHTML === INCREMENT) {
      if (component === "SessionTimer" && timer.sessionLength < 60) {
        setTimer(Object.assign({}, timer, { sessionLength: (state += 1) }));
      } else if (component === "BreakTimer" && timer.breakLength < 60) {
        setTimer(Object.assign({}, timer, { breakLength: (state += 1) }));
      }
    } else if (element.innerHTML === DECREMENT)
      if (component === "SessionTimer" && timer.sessionLength > 1) {
        setTimer(Object.assign({}, timer, { sessionLength: (state -= 1) }));
      } else if (component === "BreakTimer" && timer.breakLength > 1) {
        setTimer(Object.assign({}, timer, { breakLength: (state -= 1) }))
        setPlayState(Object.assign({}, playState, {activeTimer: BREAK }));
        console.log(playState)
      }
  }

  //TODO: Refactor clockCountdown to return minutesRemaining and secondsRemaining, and pass in break/sessionTimeInSeconds as arguments
  let sessionTimeInSeconds = timer.sessionLength * 60;
  let breakTimeInSeconds = timer.breakLength * 60;
  let minutes_Remaining = 0;
  let seconds_Remaining = 0;

  function clockCountdown() {
    if (playState.activeTimer === SESSION) {
      if (sessionTimeInSeconds > 0) {
        sessionTimeInSeconds--;
        minutes_Remaining = Math.floor(sessionTimeInSeconds / 60);
        seconds_Remaining = sessionTimeInSeconds % 60;
        console.log(minutes_Remaining + ":" + seconds_Remaining, playState);
        setDisplayState({
          minutesRemaining: minutes_Remaining,
          secondsRemaining: seconds_Remaining,
        });
      }
    if (sessionTimeInSeconds === 0) {
      setPlayState(Object.assign({}, playState, {activeTimer: BREAK }));
      return
    }
  }

    if (playState.activeTimer === BREAK) {
      if (breakTimeInSeconds > 0) {
        breakTimeInSeconds--;
        minutes_Remaining = Math.floor(breakTimeInSeconds / 60);
        seconds_Remaining = breakTimeInSeconds % 60;
        console.log(minutes_Remaining + ":" + seconds_Remaining);
        setDisplayState({
          minutesRemaining: minutes_Remaining,
          secondsRemaining: seconds_Remaining
        });
      }
      if (breakTimeInSeconds === 0) {
        setPlayState(Object.assign({}, playState, {activeTimer: SESSION }));
        breakTimeInSeconds = timer.sessionLength * 60;
        
      }
    }
  }

  let id = [];
  function startStopClickHandler() {
    if (playState.countdown === false) {
      
      id = setInterval(() => {clockCountdown()}, 100);
      setPlayState(
        Object.assign({}, playState, { countdown: true, timerID: id })
      );
      console.log(playState)
      id = setInterval(() => clockCountdown(), 100)
      
    } else {
      setPlayState(Object.assign({}, playState, { countdown: false }));
      clearInterval(playState.timerID);
    }
  }

  return (
    <>
      <h1>Productivity Clock</h1>
      <SessionTimer timer={timer} adjustTime={adjustTimeClickHandler} />
      <BreakLength timer={timer} adjustTime={adjustTimeClickHandler} />
      <Display
        playState={playState}
        timer={timer}
        minutesRemaining={displayState.minutesRemaining}
        secondsRemaining={displayState.secondsRemaining}
        startStopClickHandler={startStopClickHandler}
      />
    </>
  );
}

export function Display(props) {
  function resetClickHandler() {
    clearInterval(props.playState.timerID);
    props.timer.setTimer(props.defaultTimerState);
  }

  return (
    <section>
      <div id="timer-label">session:</div>
      <div id="time=left">
        {`${props.minutesRemaining} : ${props.secondsRemaining}`}
      </div>
      <button id="start-stop" onClick={props.startStopClickHandler}>
        Start/Stop
      </button>
      <button id="reset" onClick={() => resetClickHandler}>
        reset
      </button>
    </section>
  );
}

export function SessionTimer(props) {
  const SESSION_COMPONENT = "SessionTimer";

  return (
    <div id="session-label">
      <p>Session Length</p>
      <section id="session-length"> {props.timer.sessionLength}:00 </section>
      <button
        id="session-increment"
        onClick={() =>
          props.adjustTime(
            SESSION_COMPONENT,
            document.getElementById("session-increment"),
            props.timer.sessionLength
          )
        }
      >
        Increment
      </button>
      <button
        id="session-decrement"
        onClick={() =>
          props.adjustTime(
            SESSION_COMPONENT,
            document.getElementById("session-decrement"),
            props.timer.sessionLength
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
      <section id="break-length"> {props.timer.breakLength}:00 </section>
      <button
        id="break-increment"
        onClick={() =>
          props.adjustTime(
            BREAK_COMPONENT,
            document.getElementById("break-increment"),
            props.timer.breakLength
          )
        }
      >
        Increment
      </button>
      <button
        id="break-decrement"
        onClick={() =>
          props.adjustTime(
            BREAK_COMPONENT,
            document.getElementById("break-decrement"),
            props.timer.breakLength
          )
        }
      >
        Decrement
      </button>
    </div>
  );
}
