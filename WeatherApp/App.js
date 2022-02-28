import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
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

const daysFormat = ["일", "월", "화", "수", "목", "금", "토", "일"];

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      setCity("Oops!");
    }
    const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json);
    setDays(json.daily);
  }

  const formatDate = (date) => {
    return date.getFullYear() + "년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일 " + daysFormat[date.getDay()] + "요일";
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={ok ? styles.container : {...styles.container, backgroundColor: "white"}}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={ok ? styles.cityName : {...styles.cityName, color: "red"}}>{city}</Text>
      </View>
      {ok ?
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
              <Text style={styles.tinyText}>{formatDate(new Date(day.dt*1000))}</Text>
              <Text style={styles.temp}>{parseFloat(day.temp.min).toFixed(1)}~{parseFloat(day.temp.max).toFixed(1)}℃</Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center"}}>
                <MaterialCommunityIcons name={icons[day.weather[0].main]} size={75} color="white" />
                <Text style={styles.desc}>{day.weather[0].main}</Text>
              </View>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
            )
          )}
      </ScrollView>
      :
      null
      }
      <View style={styles.help}>
        <Text style={ok ? styles.helpText : {...styles.helpText, color: "red"}}>
          {!ok && "Please allow the use of your Location Information to use this app :("}
          {ok && days.length === 0 && "Please Wait a Moment :)"}
          {ok && days.length !== 0 && "Scroll Right to Check Daily Forecast for Upcoming 7 Days"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink"
  },

  city: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center"
  },

  cityName: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold"
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },

  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 50,
    fontWeight: "bold"
  },

  desc: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold"
  },

  tinyText: {
    color: "white",
    fontSize: 25,
  },

  help: {
    flex: 1,
    alignItems: "center",
  },

  helpText: {
    color: "white",
    textAlign: "center",
    marginLeft: 25,
    marginRight: 25
  }
});