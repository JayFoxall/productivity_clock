import { useState } from "react";
import { accurateInterval } from "./AccurateInterval";

const INCREMENT = "Increment";
const DECREMENT = "Decrement";
const SESSION = "Session";
const BREAK = "Break";

export function ProductivityClock() {
  const defaultTimerState = {
    sessionLength: 25,
    breakLength: 5,
    timeRemaining: "",
    countdownActive: false,
    activeTimer: SESSION,
    ID: "",
  };
  let [timer, setTimer] = useState(defaultTimerState);

  const defaultDisplayState = "25:00";
  let [display, setDisplay] = useState(defaultDisplayState);

  function adjustTimeClickHandler(component, element, state) {
    if (timer.countdownActive === true) {
      return;
    } else {
      if (element.innerHTML === INCREMENT) {
        if (component === "SessionTimer" && timer.sessionLength < 60) {
          setTimer(Object.assign(timer, { sessionLength: (state += 1) }));
          timer.sessionLength < 10
            ? setDisplay(`0${timer.sessionLength}:00`)
            : setDisplay(`${timer.sessionLength}:00`);
        } else if (component === "BreakTimer" && timer.breakLength < 60) {
          setTimer(Object.assign({}, timer, { breakLength: (state += 1) }));
        }
      } else if (element.innerHTML === DECREMENT)
        if (component === "SessionTimer" && timer.sessionLength > 1) {
          setTimer(Object.assign(timer, { sessionLength: (state -= 1) }));
          timer.sessionLength < 10
            ? setDisplay(`0${timer.sessionLength}:00`)
            : setDisplay(`${timer.sessionLength}:00`);
        } else if (component === "BreakTimer" && timer.breakLength > 1) {
          setTimer(Object.assign({}, timer, { breakLength: (state -= 1) }));
        }
    }
  }

  function startStopClickHandler() {
    if (timer.countdownActive === true) {
      timer.ID.cancel();
      setTimer(
        Object.assign(timer, {
          countdownActive: false,
          ID: "",
        })
      );
    } else if (timer.countdownActive === false && timer.ID === "") {
      setTimer(
        Object.assign(
          timer,
          { countdownActive: true },
          { ID: accurateInterval(() => clockCountdown(), 999) }
        )
      );
    } else return;
  }

  let timeToSwitchClocks = -5;
  function clockCountdown() {
    if (timer.timeRemaining === "") {
      assignTimerLength(timer.activeTimer);
    }

    setTimer(Object.assign(timer, { timeRemaining: timer.timeRemaining - 1 }));
    let minutes = Math.floor(timer.timeRemaining / 60);
    let seconds = timer.timeRemaining % 60;
    console.log(minutes, " : ", seconds);
    let display = `${clockFormat(minutes)}:${clockFormat(seconds)}`;
    setDisplay(display);

    if (timer.timeRemaining === 0) {
      playAudio();
    }
    if (timer.timeRemaining < 0) {
      setDisplay("00:00");
    }
    if (timer.timeRemaining === timeToSwitchClocks) {
      switchTimer(timer.activeTimer);
      assignTimerLength(timer.activeTimer);
    }
  }

  function assignTimerLength(activeTimer) {
    if (
      timer.timeRemaining !== "" &&
      timer.timeRemaining !== timeToSwitchClocks
    ) {
      switch (activeTimer) {
        case SESSION:
          if (timer.timeRemaining < timer.sessionLength * 60) {
            return;
          }
          break;
        case BREAK:
          if (timer.timeRemaining < timer.breakLength * 60) {
            return;
          }
          break;
        default:
          break;
      }
    } else if (timer.ID || timer.timeRemaining === timeToSwitchClocks) {
      switch (activeTimer) {
        case SESSION:
          timer.timeRemaining === timeToSwitchClocks
            ? setTimer(
                Object.assign(timer, {
                  timeRemaining: timer.sessionLength * 60 + 1,
                })
              )
            : setTimer(
                Object.assign(timer, {
                  timeRemaining: timer.sessionLength * 60,
                })
              );
          break;
        case BREAK:
          timer.timeRemaining === timeToSwitchClocks
            ? setTimer(
                Object.assign(timer, {
                  timeRemaining: timer.breakLength * 60 + 1,
                })
              )
            : setTimer(
                Object.assign(timer, {
                  timeRemaining: timer.breakLength * 60,
                })
              );
          break;
        default:
          break;
      }
    }
  }

  let audio = "";
  window.addEventListener(
    "load",
    () => (audio = document.getElementById("beep"))
  );
  audio = document.getElementById("beep");
  function playAudio() {
    audio.play();
  }

  function switchTimer(activeTimer) {
    activeTimer === SESSION
      ? setTimer(Object.assign(timer, { activeTimer: BREAK }))
      : setTimer(Object.assign(timer, { activeTimer: SESSION }));
  }

  function clockFormat(number) {
    return number < 10 ? `0${number}` : number;
  }

  function resetClickHandler() {
    setTimer(defaultTimerState);
    setDisplay(defaultDisplayState);
    if (timer.ID) {
      timer.ID.cancel();
    }
    audio.pause();
    audio.currentTime = 0;
  }

  return (
    <>
      <h1>Productivity Clock</h1>

      <section>
        <Display timer={timer} clock={display} />

        <section>
          <button id="start_stop" onClick={startStopClickHandler}>
            Start/Stop
          </button>
          <button id="reset" onClick={resetClickHandler}>
            Reset
          </button>
        </section>

        <SessionTimer timer={timer} adjustTime={adjustTimeClickHandler} />
        <BreakLength timer={timer} adjustTime={adjustTimeClickHandler} />
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
      <div id="time-left">{`${props.clock}`}</div>{" "}
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
    <p>
      <div id="session-label">
        Session Length
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
      </div>{" "}
    </p>
  );
}

export function BreakLength(props) {
  const BREAK_COMPONENT = "BreakTimer";
  return (
    <p>
      <div id="break-label">
        Break Length
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
    </p>
  );
}
