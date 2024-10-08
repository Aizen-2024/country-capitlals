import React, { useState, useEffect, createContext, useContext } from 'react';

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const CountryContext = createContext();
const CountryProvider = ({ children }) => {
    const [countryName, setCountryName] = useState('USA');
    return (
        <CountryContext.Provider value={{ countryName, setCountryName }}>
            {children}
        </CountryContext.Provider>
    );
};

const User_input = () => {
    const [val, setVal] = useState('USA');
    const { setCountryName } = useContext(CountryContext);
    
    const ClickHandler = () => {
        setCountryName(val);
    };
    
    return (
        <div id='jail' style={{fontSize:'1.7rem',textAlign:'center'}}>
            <label>Enter the name of the country:</label>
            <input type='text' value={val} onChange={e => setVal(e.target.value)} style={{fontSize:'1.5rem',margin:'20px'}}/><br/>
            <button id='my_btn' onClick={ClickHandler}>Capital?</button>
        </div>
    );
};

const CountryInfo = () => {
    const { countryName } = useContext(CountryContext);
    const [data, setData] = useState(loadJSON(`name:${countryName}`));

    useEffect(() => {
        if (!data) return;
        if (data.name === countryName) return;
        const { name, capital } = data;
        saveJSON(`name:${countryName}`, {
            name,
            capital
        });
    }, [data, countryName]);

    useEffect(() => {
        if (!countryName) return;
        if (data && data.name === countryName) return;
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => response.json())
            .then(countrydata => {
                const Capital = countrydata[0]?.capital ? countrydata[0].capital[0] : null;
                const newData = {
                    'Name': countryName,
                    "Capital": Capital
                };
                setData(newData);
            })
            .catch(console.error);
    }, [countryName, data]);

    if (data) {
        return (
            <div style={{color:'red',fontSize:'1.5rem',textAlign:'center',margin:'20px'}}>
                <div style={{backgroundColor:'aqua',display:'inline-block'}}>Name: {data.Name}</div><br/>
                <div style={{backgroundColor:'aqua',display:'inline-block'}}>Capital: {data.Capital}</div>
            </div>
        );
    }
    return null;
};



export default function Api() {
    return (
        <CountryProvider>
            <div>
                <User_input />
                <CountryInfo />
            </div>
        </CountryProvider>
    );
}