import React, { useEffect, useState } from 'react';
import s from './Timer.module.css';

const Timer = (props) => {
  const [seconds, setSeconds] = useState(props.time);
  const [isActive, setIsActive] = useState(props.active);

  function toggle() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    updateTime(seconds);
    updateLeavingTime();
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    props.setPause(props.uniq_key, isActive);
  }, [isActive]);

  useEffect(() => {
    if (props.active) {
      let leaving_time = Math.ceil(Number(seconds + (Date.now() - props.leaving_time) / 1000));
      setSeconds(leaving_time);
    }
  }, [])

  const updateTime = (seconds) => {
    props.updateTime(props.uniq_key, seconds);
  }

  const deleteTimer = () => {
    props.deleteTimer(props.uniq_key);
  }

  const updateLeavingTime = () => {

    props.updateLeavingTime(props.uniq_key, Date.now());
  }

  return (
    <li>
      <p>{props.name}</p>
      <div className={s.track_info_box}>
        <time>{seconds}</time>
        <button onClick={toggle} className={[s.list_btn, isActive ? s.pause : s.play].join(' ')}></button>
        <button onClick={deleteTimer} className={[s.list_btn, s.delete].join(' ')}></button>
      </div>
    </li>
  )
}

export default Timer;