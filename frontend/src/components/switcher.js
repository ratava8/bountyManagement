import React, { useState } from 'react';
import useDarkSide from '../utils/useDarkSide';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function Switcher(props) {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(colorTheme === 'light' ? true : false);

  const toggleDarkMode = checked => {
    setTheme(colorTheme);
    setDarkSide(checked);
    console.log('12', checked);
    
  };

  console.log('16', colorTheme);
  
  return (
    <>
      <div className=' m-auto flex justify-center items-center'>
        <DarkModeSwitch checked={darkSide} onChange={toggleDarkMode} size={props.size} sunColor='#256fc4' moonColor='white' />
      </div>
    </>
  );
}
