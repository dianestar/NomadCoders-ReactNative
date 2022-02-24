import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width:SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = "0b1d65980a927e4e21321739f245a7dd";

const icons = {
  "Thunderstorm": "weather-lightning",
  "Drizzle": "weather-rainy",
  "Rain": "weather-pouring",
  "Snow": "weather-snowy-heavy",
  "Atmosphere": "weather-fog",
  "Clear": "weather-sunny",
  "Clouds": "weather-cloudy"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}>
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large"/>
            </View> 
          ) : (
            days.map((day, index) => 
            <View key={index} style={styles.day}>
              <View style={{
                flexDirection: "row",
                alignItems: "center"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <MaterialCommunityIcons name={icons[day.weather[0].main]} size={75} color="white" />
              </View>
              <Text style={styles.desc}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink"
  },

  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  cityName: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold"
  },

  weather: {
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },

  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 125,
  },

  desc: {
    color: "white",
    marginTop: -30,
    fontSize: 50
  },

  tinyText: {
    color: "white",
    fontSize: 25
  }
});