import { useState } from "react";

const INCREMENT = "Increment";
const DECREMENT = "Decrement";
const SESSION = "Session";
const BREAK = "Break";

export function ProductivityClock() {
  const defaultTimerState = {
    sessionLength: 25,
    breakLength: 5,
    countdownActive: false,
    activeTimer: SESSION,
    ID: "",
  };
  let [timer, setTimer] = useState(defaultTimerState);

  let defaultDisplayState = { minutes: timer.sessionLength, seconds: "0" };
  let [display, setDisplay] = useState(defaultDisplayState);

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
        setTimer(Object.assign({}, timer, { breakLength: (state -= 1) }));
      }
  }

  let audio = document.getElementById("beep");
  let playAudio = () => {
    let count = 0;
    let audioID = setInterval(() => {
      audio.play();
      count++;
      if (count === 3) clearInterval(audioID);
    }, 1000);
  };

  //TODO: Refactor clockCountdown to return minutesRemaining and secondsRemaining, and pass in break/sessionTimeInSeconds as arguments
  let id = "";
  let minutes = "0";
  let seconds = "0";
  let sessionTimeInSeconds = timer.sessionLength * 60;
  let breakTimeInSeconds = timer.breakLength * 60;

  function startStopClickHandler() {
    if (timer.countdownActive === true) {
      clearInterval(timer.ID);
      setTimer(Object.assign(timer, { countdownActive: false, ID: "" }));
    } else if (timer.countdownActive === false) {
      setTimer(() => Object.assign(timer, { countdownActive: true }));
      if (display.minutes !== "0" && display.seconds !== "0") {
        if (timer.activeTimer === SESSION) {
          sessionTimeInSeconds = display.minutes * 60 + display.seconds;
        } else {
          breakTimeInSeconds = display.minutes * 60 + display.seconds;
        }
      }
      id = setInterval(() => clockCountdown(), 100);
    }

    function clockCountdown() {
      if (timer.ID === "") {
        setTimer(Object.assign(timer, { ID: id }));
      }

      if (timer.activeTimer === SESSION) {
        sessionTimeInSeconds--;
        if (sessionTimeInSeconds >= 0) {
          minutes = Math.floor(sessionTimeInSeconds / 60);
          seconds = sessionTimeInSeconds % 60;
          setDisplay({ minutes: minutes, seconds: seconds });
          console.log(`${minutes}:${seconds}`);
        } else if (sessionTimeInSeconds >= -3) {
          setDisplay({ minutes: 0, seconds: 0 });
          playAudio();
          if (sessionTimeInSeconds === -3) {
            sessionTimeInSeconds = timer.sessionLength * 60;
            setTimer(Object.assign(timer, { activeTimer: BREAK }));
          }
        }
      }

      if (timer.activeTimer === BREAK) {
        breakTimeInSeconds--;
        if (breakTimeInSeconds >= 0) {
          minutes = Math.floor(breakTimeInSeconds / 60);
          seconds = breakTimeInSeconds % 60;
          setDisplay({ minutes: minutes, seconds: seconds });
          console.log(`${minutes}:${seconds}`);
        } else if (breakTimeInSeconds >= -3) {
          setDisplay({ minutes: 0, seconds: 0 });
          playAudio();
          if (breakTimeInSeconds === -3) {
            breakTimeInSeconds = timer.breakLength * 60;
            setTimer(Object.assign(timer, { activeTimer: SESSION }));
          }
        }
      }
    }
  }

  function resetClickHandler() {
    clearInterval(timer.ID);
    setTimer(defaultTimerState);
    setDisplay(defaultDisplayState);
    try {
    audio.pause();
    audio.currentTime=0
    } catch {}
  }

  return (
    <>
      <h1>Productivity Clock</h1>

      <section>
        <Display
          minutes={display.minutes}
          seconds={display.seconds}
          timer={timer}
        />
        <SessionTimer timer={timer} adjustTime={adjustTimeClickHandler} />
        <BreakLength timer={timer} adjustTime={adjustTimeClickHandler} />
      </section>

      <section>
        <button id="start_stop" onClick={startStopClickHandler}>
          Start/Stop
        </button>
        <button id="reset" onClick={resetClickHandler}>
          reset
        </button>
      </section>
    </>
  );
}

export function Display(props) {
  return (
    <>
      <div id="timer-label">
        {props.timer.activeTimer === SESSION ? "Session" : "Break"}
      </div>
      {props.timer.countdownActive === false ? (
        <div id="time-left">
          {props.timer.sessionLength < 10
            ? `0${props.timer.sessionLength}:`
            : `${props.timer.sessionLength}:`}
          {props.seconds < 10 ? `0${props.seconds}` : `${props.seconds}`}
        </div>
      ) : (
        <>
          <div id="time-left">
            {props.minutes < 10 ? `0${props.minutes}:` : `${props.minutes}:`}
            {props.seconds < 10 ? `0${props.seconds}` : `${props.seconds}`}
          </div>
        </>
      )}
      <audio
        id="beep"
        src="https://www.soundjay.com/buttons/sounds/beep-11.mp3"
      ></audio>
    </>
  );
}

export function SessionTimer(props) {
  const SESSION_COMPONENT = "SessionTimer";

  return (
    <div id="session-label">
      <p>Session Length</p>
      <section id="session-length"> {props.timer.sessionLength} </section>
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
      <section id="break-length"> {props.timer.breakLength} </section>
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
