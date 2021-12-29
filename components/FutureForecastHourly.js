import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import moment from 'moment-timezone'
const FutureForecastHourly = ({data}) => {
    return (
        <View style={{flexDirection: 'row'}}>

            {
                data && data.length > 0 ? 

                data.map((data, idx) => (

                    idx < 24 && <FutureForecastItem key={idx} forecastItem={data}/>
                ))

                :

                <View/>
            }
          
            

        </View>
    )
}

const FutureForecastItem = ({forecastItem}) => {
    const img = {uri: "http://openweathermap.org/img/wn/"+forecastItem.weather[0].icon+"@2x.png"}
    return (
        <View  style={styles.futureForecastItemContainer}>
            <Text  style={styles.day}>{moment(forecastItem.dt * 1000).format('hh a')}</Text>
            <Text  style={styles.temp}>{Math.round(forecastItem.temp)}&#176;C</Text>
            <Image source={img} style={styles.image} />
            <Text  style={styles.feels}>{forecastItem.weather[0].main}</Text>
            <Text  style={styles.feels}>Feels  {Math.round(forecastItem.feels_like)}&#176;C</Text>

        </View>
    )
}

export default FutureForecastHourly


const styles = StyleSheet.create({
    image: {
        width: 70,
        height:70,
        marginLeft: 'auto',
        marginRight: 'auto',
    }, 
    futureForecastItemContainer: {
        flex:1,
        justifyContent: 'center',
        backgroundColor: '#00000033',
        borderRadius:10,
        borderColor:"#eee",
        borderWidth:1,
        padding: 10,
        marginLeft: 10
    }, 
    day: {
        fontSize: 16,
        color:"white",
        backgroundColor: "#3c3c44",
        padding: 10,
        textAlign:"center",
        borderRadius: 50,
        fontWeight: "200",
        marginBottom: 5
    },   
    temp: {
        fontSize: 14,
        color:"white",
        fontWeight:"100",
        textAlign:"center"
    },
    feels: {
        fontSize: 12,
        color:"white",
        fontWeight:"100",
        textAlign:"center"
    },
})