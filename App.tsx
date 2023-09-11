import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';

const App = () => {
  const [state, setState] = useState({
    loading: false,
    image: null,
    textRecognition: null,
  });

  const onPress = type => {
    setState({...state, loading: true});
    type === 'capture'
      ? launchCamera({mediaType: 'image'}, onImageSelect)
      : launchImageLibrary({mediaType: 'image'}, onImageSelect);
  };

  const onImageSelect = async media => {
    if (!media) {
      setState({...state, loading: false});
      return;
    }
    if (!!media && media.assets) {
      const file = media.assets[0].uri;
      const textRecognition = await RNTextDetector.detectFromUri(file);
      setState({
        ...state,
        textRecognition,
        image: file,
        loading: false,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RN OCR SAMPLE</Text>
        <View style={getSpace(20)}>
          <TouchableOpacity
            style={[styles.button, styles.shadow]}
            onPress={() => onPress('capture')}>
            <Text>Take Photo</Text>
          </TouchableOpacity>
          <View style={getSpace(20)}>
            <TouchableOpacity
              style={[styles.button, styles.shadow]}
              onPress={() => onPress('library')}>
              <Text>Pick a Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={getSpace(50)}>
            {state.loading ? (
              // Display a loading indicator while processing
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              // Display the image and recognized text once loaded
              <>
                <View style={{alignItems: 'center'}}>
                  <Image
                    style={[styles.image, styles.shadow]}
                    source={{uri: state.image}}
                  />
                </View>
                {!!state.textRecognition &&
                  state.textRecognition.map((item, i) => (
                    <Text key={i} style={getSpace(10)}>
                      {item.text}
                    </Text>
                  ))}
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const getSpace = (size) => {
  return {height: size};
};

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
  },
};

export default App;
