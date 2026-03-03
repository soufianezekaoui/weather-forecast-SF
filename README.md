# Weather Application ☀️🌧️

A modern, responsive web application that displays current weather conditions and 5-day forecasts for any city worldwide. Built with Java Servlets, HTML5, CSS3, and JavaScript.

![Weather App Screenshot](screenshots/app-preview.png)

## 🌟 Features

- **Current Weather Display**: Real-time weather information including temperature, humidity, wind speed, and more
- **5-Day Forecast**: Detailed weather predictions for the upcoming week
- **Interactive UI**: Clean, user-friendly interface with smooth transitions
- **Temperature Charts**: Visual representation of temperature trends using Chart.js
- **Comprehensive Weather Data**:
  - Temperature (current and feels-like)
  - Humidity percentage
  - Precipitation levels
  - Wind speed
  - UV Index
- **Error Handling**: Robust error management for invalid cities and API failures
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

### Backend
- **Java 17** (JDK 17)
- **Apache Tomcat 10.1** for deployment
- **Jakarta Servlet API 6.0** for request handling
- **OpenWeatherMap API** for weather data
- **JSON** library for data processing

### Frontend
- **HTML5** for structure
- **CSS3** for styling
- **JavaScript (ES6+)** for interactivity
- **Chart.js** for data visualization
- **Font Awesome** for icons

### Build Tools
- **Apache Maven** for dependency management and building

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or later
- [Apache Maven](https://maven.apache.org/download.cgi) 3.6 or later
- [Apache Tomcat 10.1](https://tomcat.apache.org/download-10.cgi)
- An [OpenWeatherMap API Key](https://openweathermap.org/api) (free tier available)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/soufianezekaoui/weather-Forecast-SF.git
cd weather-Forecast-SF
```

### 2. Configure API Key

Open `src/main/java/com/weatherapp/servlet/WeatherServlet.java` and replace `YOUR_API_KEY` with your actual OpenWeatherMap API key:

```java
private static final String API_KEY = "your_actual_api_key_here";
```

### 3. Add Background Image

Place a background image named `weather-bg.jpg` in the `src/main/webapp/images/` directory.

### 4. Build the Project

```bash
mvn clean package
```

This will create a WAR file at `target/weather-app.war`.

### 5. Deploy to Tomcat

**Option A: Manual Deployment**
```bash
cp target/weather-app.war $CATALINA_HOME/webapps/
$CATALINA_HOME/bin/startup.sh  # Linux/Mac
# OR
%CATALINA_HOME%\bin\startup.bat  # Windows
```

**Option B: Using Maven Tomcat Plugin**

Add your Tomcat credentials to Maven's `settings.xml`, then run:
```bash
mvn tomcat7:deploy
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:8080/weather-app/
```

## 📱 Usage

1. **Enter a City Name**: Type any city name in the search box
2. **Search**: Click the search button or press Enter
3. **View Current Weather**: See detailed current weather conditions
4. **Switch to Forecast**: Click the "7-Day Forecast" button to view predictions
5. **Explore Data**: Hover over cards for interactive effects and view the temperature chart

## 📂 Project Structure

```
weather-application/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── weatherapp/
│       │           └── servlet/
│       │               └── WeatherServlet.java
│       └── webapp/
│           ├── WEB-INF/
│           │   └── web.xml
│           ├── css/
│           │   └── styles.css
│           ├── images/
│           │   └── weather-bg.jpg
│           ├── js/
│           │   └── app.js
│           └── index.html
└── pom.xml
```

## 🔧 Configuration

### Environment Variables (Optional)

For production deployment, consider externalizing the API key:

```java
private static final String API_KEY = System.getenv("OPENWEATHER_API_KEY");
```

Then set the environment variable:
```bash
export OPENWEATHER_API_KEY=your_api_key_here
```

## 🌐 API Endpoints

The application uses the following OpenWeatherMap endpoints:

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **Geocoding**: `http://api.openweathermap.org/geo/1.0/direct`
- **One Call API**: `https://api.openweathermap.org/data/3.0/onecall`

## 🐛 Troubleshooting

### Common Issues

**1. API Key Errors**
- Ensure you've replaced `YOUR_API_KEY` with a valid key
- Verify your API key is activated (may take a few hours after signup)
- Check if your API plan includes the required endpoints

**2. Tomcat Version Issues**
- This app requires Tomcat 10.1 (uses Jakarta EE, not Java EE)
- Tomcat 9.x uses `javax.servlet` which is incompatible

**3. Build Failures**
- Verify JDK 17 is installed: `java -version`
- Check Maven is installed: `mvn -version`
- Clear Maven cache: `mvn clean`

**4. 404 Errors**
- Ensure the WAR file is deployed to Tomcat's webapps directory
- Check the application context path in the URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@soufianezekaoui](https://github.com/soufianezekaoui)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/soufianezekaoui)

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Font Awesome](https://fontawesome.com/) for icons
- The Java and web development community

## 📸 Screenshots

### Current Weather View
![Current Weather](screenshots/current-weather.png)

### 7-Day Forecast View
![Forecast](screenshots/forecast.png)

### Mobile Responsive
![Mobile View](screenshots/mobile-view.png)

## 🔮 Future Enhancements

- [ ] Geolocation support for automatic city detection
- [ ] Temperature unit switching (Celsius/Fahrenheit)
- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Multiple city comparison
- [ ] Dark mode theme
- [ ] Offline support with caching
- [ ] Search history

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## ⚙️ System Requirements

- **Minimum**: 
  - 512MB RAM
  - JDK 17
  - Tomcat 10.1
  
- **Recommended**:
  - 1GB RAM
  - JDK 17 or later
  - Tomcat 10.1 or later

---

**Note**: This application requires an active internet connection to fetch weather data from the OpenWeatherMap API.

If you find this project useful, please consider giving it a ⭐ on GitHub!
