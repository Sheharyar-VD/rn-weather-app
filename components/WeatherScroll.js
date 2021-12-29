import React from 'react'
import {View, ScrollView, Image, Text, StyleSheet} from 'react-native'
import moment from 'moment-timezone'
import FutureForecast from './FutureForecast'

const WeatherScroll = ({weatherData}) => {
    return (
        <ScrollView horizontal={true} style={styles.scrollView}>
            <FutureForecast data={weatherData}/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex:0.4,
        backgroundColor: '#18181bcc',
        padding:10
    },
    otherContainer: {
        paddingRight: 40
    }
})

export default WeatherScroll
