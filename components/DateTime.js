import React, {useEffect, useState} from 'react'
import {View, Text, Image, StyleSheet} from 'react-native';
import moment from 'moment-timezone'
import * as Notification from 'expo-notifications';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const WeatherItem = ({title, value, unit}) => {
    return(
        <View style={styles.weatherItem}>
            <Text style={styles.weatherItemTitle}>{title}</Text>
            <Text style={styles.weatherItemTitle}>{value}&nbsp;{unit}</Text>
        </View>
    )
}

const CurrentTempEl = ({now, data}) => {

    if(data && data.weather){
        const img = {uri: 'http://openweathermap.org/img/wn/'+ data.weather[0].icon +'@4x.png'}
        return(
            <View style={styles.currentTempContainer}>
                <Image source={img} style={styles.image} />
                <View  style={styles.otherContainer}>
                    <Text  style={styles.currTemp}>{Math.round(now.temp)}&#176;C</Text>
                    <Text  style={styles.main}>{data.weather[0].main}</Text>
                    <Text  style={styles.feels}>Feels {Math.round(now.feels_like)}&#176;C</Text>
                </View>
                <View  style={styles.otherContainer}>
                    <Text  style={styles.temp}>Min - {Math.round(data.temp.min)}&#176;C</Text>
                    <Text  style={styles.temp}>Max - {Math.round(data.temp.max)}&#176;C</Text>
                </View>
            </View>
        )
    }else{
        return( 
            <View>

            </View>

        )
        
    }
   
}

const DateTime = ({weatherData, current, location, timezone}) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    (async () => {
        if (current && location && weatherData[0]) {
            await Notification.scheduleNotificationAsync({
                content: {
                    title: 'Weather Update',
                    body: 'Current Weather is '+current.temp+' C - '+weatherData[0].weather[0].main,
                },
                trigger: {
                    seconds: 60,
                }
            })
        }
      })();

    useEffect (() => {
        setInterval(() => {
            const time = new Date();
            const month = time.getMonth();
            const date = time.getDate();
            const day = time.getDay();
            const hour = time.getHours();
            const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
            const minutes = time.getMinutes();
            const ampm = hour >=12 ? 'pm' : 'am'
        
            setTime((hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes) +ampm) 
        
            setDate(days[day] + ', ' + date+ ' ' + months[month]) 
        
        }, 1000);
    }, [])
    return (
        <View style={styles.container}>  
           <View>
               <View>
                   <Text style={styles.heading}>{location.address? location.address.county : ""}</Text>
               </View>
               <View>
                   <Text style={styles.subheading}>{date}</Text>
               </View>
               <View>
                   <Text style={styles.subheading}>{timezone}</Text>
               </View>
           </View>
           <View>
                <View style={styles.currWeatherItemContainer}>
                    <CurrentTempEl now={current} data={weatherData && weatherData.length > 0 ? weatherData[0] : {}}/>
               </View>
           </View>
           <View style={styles.rightAlign}>
                <View style={styles.weatherItemContainer}>
                    <WeatherItem title="Humidity" value={current? current.humidity : ""} unit="%"/>
                    <WeatherItem title="Pressure" value={current? current.pressure : ""} unit="hPA"/>
                    <WeatherItem title="Windy" value={current? current.wind_speed : ""} unit="knots"/>
                    <WeatherItem title="Sunrise" value={current? moment.tz(current.sunrise * 1000, timezone ).format('HH:mm'): ""} unit="am"/>
                    <WeatherItem title="Sunset" value={current? moment.tz(current.sunset * 1000, timezone ).format('HH:mm') : ""} unit="pm"/>
               </View>
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent:'space-between',
        padding: 15
    },
    heading: {
        fontSize: 45,
        color:'white',
        fontWeight: '100'
    },
    subheading: {
        fontSize: 25,
        color: '#eee',
        fontWeight: '300'
    },
    currTemp: {
        fontSize: 25,
        color: '#eee',
        fontWeight: '300',
        marginBottom: 5,
    },
    main: {
        fontSize: 16,
        color: '#eee',
        fontWeight: '300',
        marginBottom: 5,
    },
    rightAlign: {
        textAlign:'right',
        marginTop: 10
    },
    timezone: {
        fontSize: 20,
        color:'white',
        marginBottom: 10,
    },
    latlong:{
        fontSize:16,
        color:'white',
        fontWeight: '700'
    },
    weatherItemContainer: {
        backgroundColor: "#18181b99",
        borderRadius: 10,
        padding: 10,
    }, 
    currWeatherItemContainer: {
        backgroundColor: "#18181b99",
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    }, 
    weatherItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    weatherItemTitle: {
        color:'#eee',
        fontSize: 14,
        fontWeight: '100'
    },
    currentTempContainer: {
        flexDirection: 'row',
        justifyContent:"space-between",
        alignItems:'center',
        borderRadius: 10,
    },
    day: {
        fontSize: 20,
        color:"white",
        backgroundColor: "#3c3c44",
        padding: 10,
        textAlign:"center",
        borderRadius: 50,
        fontWeight: "200",
        marginBottom: 15
    },
    temp: {
        fontSize: 16,
        color:"white",
        fontWeight:"100",
        textAlign:"right"
    },
    feels: {
        fontSize: 14,
        color:"white",
        fontWeight:"100",
        textAlign:"center"
    },
    image: {
        width: 85,
        height: 85
    },
})

export default DateTime
