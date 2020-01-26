import React, { useState, useEffect } from 'react';
import Timer from './Timer/Timer';
import s from './Main.module.css';

const Main = (props) => {

  const [name, setName] = useState('');
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    setTimers(getTimersArray());
  }, [])

  useEffect(() => {
  }, [timers])

  const onChangeHandler = (e) => {
    let text = e.currentTarget.value;
    setName(text);
  }

  const prepareJsonData = (timer_data) => {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('timers')) {
        timer_data = [ timer_data ];
      } else {
        let timers = JSON.parse(localStorage.getItem('timers'));
        timer_data = [ ...timers, timer_data];
      }
      let json_data = JSON.stringify(timer_data);
      if(json_data !== '')
        resolve(json_data);
      else 
        reject(Error('something wrong'));
    })
  }

  const createTimer = () => {
    let current_time = Date.now().toString();
    let new_timer = {
      "key": current_time,
      "leaving_time": current_time,
      "name": name === '' ? current_time : name,
      "time": 0,
      "active": true
    };
    prepareJsonData(new_timer).then(data => {
      localStorage.setItem("timers", data);
      setTimers(getTimersArray());
      setName('');
    }).catch(err => console.log(err))
  }

  const getTimersArray = () => {
    if(localStorage.hasOwnProperty("timers")) 
      return JSON.parse(localStorage.getItem("timers"));
    else 
      return [];
  }

  const setPause = (key, active) => {
    let new_timers = timers;
    new_timers.forEach(e => {
      if(key === e.key) {
        e.active = active;
        console.log(active);
      }
    });
    setTimers(new_timers);
    localStorage.setItem("timers", JSON.stringify(new_timers));
  }

  const deleteTimer = (key) => {
    let new_timers = timers.filter((e) => key !== e.key);
    localStorage.setItem("timers", JSON.stringify(new_timers));
    setTimers(new_timers);
  }

  const updateLeavingTime = (key, time) => {
    let new_timers = timers;
    new_timers.forEach(e => {
      if(key === e.key) {
        console.log(time);
        e.leaving_time = time;
      }
    });
    setTimers(new_timers);
    localStorage.setItem("timers", JSON.stringify(new_timers));
  }

  const updateTime = (key, time) => {
    let new_timers = timers;
    new_timers.forEach(e => {
      if(key === e.key) {
        e.time = time;
      }
    });
    setTimers(new_timers);
    localStorage.setItem("timers", JSON.stringify(new_timers));
  }

  return (
    <div className={s.container}>
      <h2>tracker</h2>
      <div className={s.input_box}>
        <input value={name} onChange={onChangeHandler} type='text' placeholder='Enter track name' />
        <button onClick={createTimer} className={s.add_track_btn}></button>
      </div>
      <ul className={s.track_list}>
        {
          timers.map( (e, i) => (
              <Timer 
                key={i}
                uniq_key={e.key}
                time={e.time} 
                name={e.name}
                isStart={true}
                active={e.active}
                setPause={setPause}
                updateTime={updateTime}
                leaving_time={e.leaving_time}
                updateLeavingTime={updateLeavingTime}
                deleteTimer={deleteTimer}
              />
            )
          )
        }
      </ul>
    </div>
  )
}

export default Main;