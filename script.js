/** @format */

const apiKey = '2da611870b9d417984455745251902'; // API 키 설정

document.getElementById('get-weather').addEventListener('click', () => {
	const city = document.getElementById('city-input').value;
	if (city) {
		getWeather(city);
	} else {
		alert('도시 이름을 입력하세요.');
	}
});

function getWeather(city) {
	const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=28&lang=ko`;

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('날씨 정보를 가져오는 데 실패했습니다.');
			}
			return response.json();
		})
		.then(data => {
			displayWeather(data);
			displayWeatherTable(data);
		})
		.catch(error => {
			alert(error.message);
		});
}

function displayWeather(data) {
	const weatherInfo = document.getElementById('weather-info');
	const iconUrl = `https:${data.current.condition.icon}`; // HTTPS URL로 변경
	weatherInfo.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p class="weather-detail">현재 온도: ${data.current.temp_c} °C</p>
        <p class="weather-detail">상태: ${data.current.condition.text}</p>
        <p class="weather-detail">습도: ${data.current.humidity}%</p>
        <p class="weather-detail">바람 속도: ${data.current.wind_kph} km/h</p>
        <img src="${iconUrl}" alt="${data.current.condition.text}">
    `;
}

function getWeatherIcon(conditionText) {
	// 날씨 상태에 따른 이모티콘 매핑
	if (conditionText.includes('맑음')) return '☀️'; // 맑음
	if (conditionText.includes('구름')) return '☁️'; // 구름 많음
	if (conditionText.includes('비')) return '🌧️'; // 비
	if (conditionText.includes('눈')) return '❄️'; // 눈
	if (conditionText.includes('안개')) return '🌫️'; // 안개
	if (conditionText.includes('천둥')) return '⛈️'; // 천둥
	return '🌈'; // 기본 이모티콘
}

function displayWeatherTable(data) {
	const table = document.getElementById('weather-table');
	const weatherIcons = [];
	const temperatures = [];
	const precipitations = [];
	const windSpeeds = [];

	// 날짜별 날씨 정보
	data.forecast.forecastday.forEach(day => {
		const date = day.date.split('-')[2]; // 날짜 추출 (일)
		const conditionText = day.day.condition.text; // 날씨 상태 텍스트

		weatherIcons.push(getWeatherIcon(conditionText));
		temperatures.push(day.day.avgtemp_c);
		precipitations.push(day.day.totalprecip_mm);
		windSpeeds.push(day.day.maxwind_kph);

		// 테이블 업데이트
		table.innerHTML += `
            <tr>
                <td>${date}일</td>
                <td>${weatherIcons[weatherIcons.length - 1]}</td>
                <td>${temperatures[temperatures.length - 1]}</td>
                <td>${precipitations[precipitations.length - 1]}</td>
                <td>${windSpeeds[windSpeeds.length - 1]}</td>
            </tr>
        `;
	});

	// 테이블 헤더 추가
	table.innerHTML = `
        <tr>
            <th>날짜</th>
            <th>날씨 이모티콘</th>
            <th>온도 (°C)</th>
            <th>강수량 (mm)</th>
            <th>바람 속도 (km/h)</th>
        </tr>
        ${table.innerHTML}
    `;
}
