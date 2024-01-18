import axios from 'axios';

export const getTemp = async (request, response) => {
    let clima = request.body;
    console.log(clima);  
  
    const llave_clima = process.env.CLIMA_API;
    let temperatura_predicha; 
    let clima_general;
          
    try {

        let city = request.params.city;
        let year = request.params.year;
        let month = request.params.month;
        let day = request.params.day;

        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&dt=${year}-${month}-${day}&appid=${llave_clima}&units=metric`;
        let result = await axios.get(apiUrl);

        temperatura_predicha = result.data.main.temp;
        clima_general = result.data.weather[0].description;
        response.json({ temperatura_predicha, clima_general });
        console.log (result)

    } catch (e) {
        console.log(e);
        response.status(500).json({ error: e.message });
    }
};
  