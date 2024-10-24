import requests

# Function to get the weather data from Open-Meteo API
def get_weather(location):
    geocode_url = f"https://nominatim.openstreetmap.org/search?q={location}&format=json&limit=1"
    geo_response = requests.get(geocode_url).json()
    
    if len(geo_response) == 0:
        print(f"Could not find the location: {location}. Please try again.")
        return None
    
    latitude = geo_response[0]['lat']
    longitude = geo_response[0]['lon']
    
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
    
    try:
        weather_response = requests.get(weather_url)
        data = weather_response.json()
        return data
    
    except Exception as e:
        print("Error fetching weather data:", e)
        return None

# Function to notify weather events
def notify_weather_events(data):
    weather = data['current_weather']
    
    temperature = weather['temperature']
    windspeed = weather['windspeed']
    description = weather['weathercode']

    print(f"Temperature: {temperature}°C")
    print(f"Wind Speed: {windspeed} m/s")

    # Notifications for specific weather conditions
    if temperature > 35:
        print("! Extreme heat alert! Stay hydrated and avoid outdoor activities.")
    elif temperature < 0:
        print("! Freezing temperatures! Bundle up and stay warm.")
    
    if windspeed > 15:
        print("! High wind speeds! Secure loose objects outside.")

# Main function to run the weather script
def main():
    location = input("Enter the location to check the weather: ")
    weather_data = get_weather(location)
    
    if weather_data:
        notify_weather_events(weather_data)

if __name__ == "__main__":
    main()
