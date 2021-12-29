import React from 'react'
import {View, Text, StyleSheet} from 'react-native';


const NoLocation = () => {
    
    return (
        <View style={styles.container}>  
           <View style={styles.subContainer}>
              <Text style={styles.title}>No Location Available</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 15,
        marginVertical: 100,
    },
    subContainer: {
        backgroundColor: "#18181b99",
        borderRadius: 10,
        padding: 100,
    }, 
    title: {
        color:'#eee',
        fontSize: 14,
        fontWeight: '100'
    },
})

export default NoLocation
