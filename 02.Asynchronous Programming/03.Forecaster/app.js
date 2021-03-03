function attachEvents() {
    document.getElementById('submit').addEventListener('click', getWeather);
}

attachEvents();

async function getWeather(){
    const input = document.getElementById('location');
    const cityName = input.value;

    try{
        const code = await getCode(cityName);

        const [current, upcoming] = await Promise.all([
            getCurrent(code),
            getUpcoming(code)
        ]);
    
        
        document.getElementById('forecast').style.display = 'block';
        document.getElementById('upcoming').style.display = 'block';
        document.getElementById('current').innerHTML = `<div class="label">Current conditions</div>`;
        document.getElementById('upcoming').innerHTML = `<div class="label">Three-day forecast</div>`;
    
        createCurrent(current);
        createUpcoming(upcoming);
    }catch(error){
        document.getElementById('forecast').style.display = 'block';
        document.getElementById('current').textContent = 'Error';
        document.getElementById('upcoming').style.display = 'none';
    }
}

async function getCode(cityName){
    const url = 'http://localhost:3030/jsonstore/forecaster/locations';

    const response = await fetch(url);
    const data = await response.json();

    return data.find(x => x.name.toLowerCase() == cityName.toLowerCase()).code;
}

async function getCurrent(code){
    const url = 'http://localhost:3030/jsonstore/forecaster/today/' + code;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function getUpcoming(code){
    const url = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + code;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

function createCurrent(current){
    const divCurrent = document.getElementById('current');

    const divForecast = createDom('div', 'forecasts');
    const spanSymbol = createDom('span', 'condition symbol', getConditionSymbol(current.forecast.condition));
    const spanBody = createDom('span', 'condition');
    const spanName = createDom('span', 'forecast-data', current.name);
    const degreeMsg = `${current.forecast.low}${`&#176`}/${current.forecast.high}${`&#176`}`;
    const spanDegree = createDom('span', 'forecast-data', degreeMsg);
    const spanCondition = createDom('span', 'forecast-data', current.forecast.condition);

    spanBody.appendChild(spanName);
    spanBody.appendChild(spanDegree);
    spanBody.appendChild(spanCondition);

    divForecast.appendChild(spanSymbol);
    divForecast.appendChild(spanBody);

    divCurrent.appendChild(divForecast);

}

function createUpcoming(upcoming){
    const divUpcoming = document.getElementById('upcoming');
    const divBody = createDom('div', 'forecast-info');

    upcoming.forecast.forEach(a => {
        const spanBody = createDom('span', 'upcoming');

        const spanSymbol = createDom('span', 'symbol', getConditionSymbol(a.condition));
        const spanMsg = `${a.low}${`&#176`}/${a.high}${`&#176`}`;
        const spanDegree = createDom('span', 'forecast-data', spanMsg);
        const spanCondition = createDom('span', 'forecast-data', a.condition);

        spanBody.appendChild(spanSymbol);
        spanBody.appendChild(spanDegree);
        spanBody.appendChild(spanCondition);

        divBody.appendChild(spanBody);
    });

    divUpcoming.appendChild(divBody);
}

function getConditionSymbol(input){
    if(input == 'Sunny'){
        return '&#x2600'
    }else if(input == 'Partly sunny'){
        return '&#x26C5'
    }else if(input == 'Overcast'){
        return '&#x2601'
    }else if(input == 'Rain'){
        return '&#x2614'
    };
}

function createDom(type, attribute, content){
    const result = document.createElement(type);
    result.className = attribute;
    if(content){
        result.innerHTML = content;
    }
    
    return result;
}

