import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ImageBackground, Alert, Platform, Linking, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as IntentLauncher from 'expo-intent-launcher';
import * as TaskManager from 'expo-task-manager';
import * as MediaLibrary from 'expo-media-library';
import * as ViewShot from 'react-native-view-shot';

import DateTime from './components/DateTime'
import WeatherScroll from './components/WeatherScroll'
import WeatherScrollHourly from './components/WeatherScrollHourly'
import NoLocation from './components/NoLocation'

const API_KEY ='4b49bea74e98dad6a96f7c146603d13b';
const URL = 'https://us1.locationiq.com/v1/reverse.php?key=';
const LOCATION_API_KEY = 'pk.768ef5fb3f569573ffc9b5c5247acd30';
const img = require('./assets/bg.jpg');
const capture = require('./assets/capture.jpeg');
const BACKGROUND_FETCH_TASK = 'BACKGROUND_FETCH_TASK';

export default function App() {
  // 1 define the task passing its name and a callback that will be called whenever the location changes
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ data: { locations }, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    const [location] = locations;
    try {
      console.log('background location');
      const batteryLevel = await Battery.getBatteryLevelAsync();
      console.log(batteryLevel);
      stopLocationServices(batteryLevel);
      Battery.addBatteryLevelListener(({ batteryLevel }) => {
        stopLocationServices(batteryLevel);
      });
      if (batteryLevel > 0.20) fetchDataFromApi(location.coords.latitude, location.coords.longitude);
      else setNoLocation(true);
    } catch (err) {
      console.error(err);
    }
  });

  // 2 start the task
  Location.startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1, // minimum change (in meters) betweens updates
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
    // foregroundService is how you get the task to be updated as often as would be if the app was open
    foregroundService: {
      notificationTitle: 'Using your location',
      notificationBody: 'To turn off, open settings for location permissions.',
    },
  });

  const [data, setData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [noLocation, setNoLocation] = useState(false);

  useEffect(() => {
    (async () => {

      const serviceStatus = await Location.getProviderStatusAsync();
      console.log(serviceStatus);
      if (!serviceStatus.locationServicesEnabled) {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:')
        } else {
          IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
          );
        }
      }

      let foregroundStatus = (await Location.requestForegroundPermissionsAsync()).status;
      console.log(foregroundStatus);
      if (foregroundStatus !== 'granted') {
        console.log('foreground permissions denied');
        setNoLocation(true);
        return;
      }

      let backgroundStatus = (await Location.requestBackgroundPermissionsAsync()).status;
      console.log(backgroundStatus);
      if (backgroundStatus !== 'granted') {
        console.log('background permissions denied');
        setNoLocation(true);
        return;
      }

    })();
  }, [])

  const fetchDataFromApi = (latitude, longitude) => {
    if(latitude && longitude) {
      setNoLocation(false);
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        setData(data)
      });
      fetch(`${URL}${LOCATION_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`).then(res => res.json()).then(data => {
        setLocationData(data);
      });
    }
    
  }

  const stopLocationServices = (batteryLevel) => {
    if (batteryLevel < 0.20) {
      Alert.alert(
        "Battery Low ! ! !",
        "Stopping location services for this application",
      );
      Location.stopLocationUpdatesAsync(BACKGROUND_FETCH_TASK);
      setNoLocation(true);
    }
  }

  const onCaptureScreen = () => {
    (async () => {
        console.log('on screen capture');
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) return;
        // To capture Screenshot
        ViewShot.captureScreen({
          // Either png or jpg (or webm Android Only), Defaults: png
          format: 'jpg',
          // Quality 0.0 - 1.0 (only available for jpg)
          quality: 0.8, 
        }).then(
          //callback function to get the result URL of the screnshot
          (uri) => {
            (async () => {
              await MediaLibrary.createAssetAsync(uri);
              Alert.alert(
                "Screen Capture",
                "Screenshot has been saved to gallery.",
              );
            })();
          },
          (error) => console.error('Oops, Something Went Wrong', error),
        );
        //const assert = await MediaLibrary.createAssetAsync(image);
        //await MediaLibrary.createAlbumAsync('ForecastWare', assert);
        console.log('on screen capture end');
    })();
}

  return (
    <View style={styles.container}>
      <ImageBackground source={img} style={styles.image}>
        { noLocation && 
          <View style={styles.subContainer}>
            <NoLocation />
          </View>
        }
        { !noLocation && 
          <View style={styles.subContainer}>
            <View style={styles.right}>
              <TouchableOpacity onPress={onCaptureScreen}>
                <Image source={capture} style={styles.captureImage} />
              </TouchableOpacity>
            </View>
            <DateTime weatherData={data.daily} current={data.current} timezone={data.timezone} location={locationData}/>
            <WeatherScrollHourly weatherData={data.hourly}/>
            <WeatherScroll weatherData={data.daily}/>
          </View>
        }
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35
  },
  subContainer: {
    flex: 1,
  },
  image:{
    flex:1, 
    resizeMode:"cover", 
    justifyContent:"center"
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 60,
  },
  captureImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
},
});
