package com.weatherapp.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.json.JSONArray;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/weather")
public class WeatherServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;
    
    // Replace with your actual OpenWeatherMap API key
    private static final String API_KEY = "313e4a49fa846c86404b04155f08b80a";
    private static final String CURRENT_WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
    private static final String FORECAST_API = "https://api.openweathermap.org/data/2.5/forecast";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        String city = request.getParameter("city");
        String type = request.getParameter("type");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (city == null || city.trim().isEmpty()) {
            sendErrorResponse(response, "City parameter is required");
            return;
        }

        if (type == null || type.trim().isEmpty()) {
            type = "current";
        }

        try {
            PrintWriter out = response.getWriter();

            if ("current".equals(type)) {
                String currentWeatherJson = fetchCurrentWeather(city);
                System.out.println("Raw current weather JSON: " + currentWeatherJson); // DEBUG
            
                JSONObject data = new JSONObject(currentWeatherJson);
            
                if (data.has("main") && data.has("weather")) {
                    JSONObject main = data.getJSONObject("main");
                    JSONArray weatherArray = data.getJSONArray("weather");
            
                    if (weatherArray.length() > 0) {
                        JSONObject weather = weatherArray.getJSONObject(0);
            
                        JSONObject customResponse = new JSONObject();
                        customResponse.put("city", data.optString("name", city));
                        customResponse.put("temperature", main.optDouble("temp", 0.0));
                        customResponse.put("description", weather.optString("description", "N/A"));
                        customResponse.put("icon", weather.optString("icon", "01d"));

                        // More details
                        customResponse.put("feelsLike", main.optDouble("feels_like", 0.0));
                        customResponse.put("humidity", main.optInt("humidity", -1));

                        if (data.has("wind")) {
                            JSONObject wind = data.getJSONObject("wind");
                            customResponse.put("wind", wind.optDouble("speed", 0.0));
                        } else {
                            customResponse.put("wind", JSONObject.NULL);
                        }

                        // Precipitation
                        double precipitation = 0.0;
                        if (data.has("rain")) {
                            JSONObject rain = data.getJSONObject("rain");
                            precipitation = rain.optDouble("1h", 0.0);
                        } else if (data.has("snow")) {
                            JSONObject snow = data.getJSONObject("snow");
                            precipitation = snow.optDouble("1h", 0.0);
                        }
                        customResponse.put("precipitation", precipitation);
                        customResponse.put("uvIndex", JSONObject.NULL);
            
                        response.setStatus(HttpServletResponse.SC_OK);
                        out.print(customResponse.toString());
                    } else {
                        sendErrorResponse(response, "No weather information found");
                    }
                } else {
                    sendErrorResponse(response, "Invalid data received from server");
                }
                
            } else {
                String forecastJson = fetchForecast(city);
                JSONObject forecastData = new JSONObject(forecastJson);
            
                JSONArray list = forecastData.getJSONArray("list");
                JSONArray simplifiedForecast = new JSONArray();
            
                for (int i = 0; i < list.length(); i += 8) { // toutes les 24h (8 x 3h)
                    JSONObject entry = list.getJSONObject(i);
                    JSONObject main = entry.getJSONObject("main");
                    JSONObject weather = entry.getJSONArray("weather").getJSONObject(0);
            
                    JSONObject dayData = new JSONObject();
                    dayData.put("date", entry.getLong("dt"));
                    dayData.put("min", main.getDouble("temp_min"));
                    dayData.put("max", main.getDouble("temp_max"));
                    dayData.put("description", weather.getString("description"));
                    dayData.put("icon", weather.getString("icon"));
            
                    simplifiedForecast.put(dayData);
                }
            
                JSONObject customResponse = new JSONObject();
                customResponse.put("city", forecastData.getJSONObject("city").getString("name"));
                customResponse.put("forecast", simplifiedForecast);
            
                out.print(customResponse.toString());
            }            

            out.flush();

        } catch (Exception e) {
            sendErrorResponse(response, "Error fetching weather data: " + e.getMessage());
        }
    }

    private String fetchCurrentWeather(String city) throws IOException {
        String encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8.toString());
        String apiUrl = CURRENT_WEATHER_API + "?q=" + encodedCity + "&units=metric&appid=" + API_KEY;

        return makeApiRequest(apiUrl);
    }
      
    private String fetchForecast(String city) throws IOException {
        String encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8.toString());
        String apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + encodedCity + "&units=metric&appid=" + API_KEY;
    
        return makeApiRequest(apiUrl);
    }    
    
    private String makeApiRequest(String apiUrl) throws IOException {
        URL url = new URL(apiUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        
        int responseCode = connection.getResponseCode();
        
        if (responseCode == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            
            return content.toString();
        } else {
            throw new IOException("API request failed with response code: " + responseCode);
        }
    }
    
    private void sendErrorResponse(HttpServletResponse response, String errorMessage) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        PrintWriter out = response.getWriter();
        out.print("{\"error\":\"" + errorMessage + "\"}");
        out.flush();
    }
}